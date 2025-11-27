import { SensorData } from '@/src/decoder/bluechipDecoder.types';
import { getInstance as getDecoderInstance } from '@/src/decoder/decoderFactory';
import { Buffer } from 'buffer';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, Platform, ToastAndroid } from 'react-native';
import RNBluetoothClassic, { BluetoothDevice, BluetoothEventSubscription } from 'react-native-bluetooth-classic';

// --- CONFIGURAÇÃO ---
const DEVICE_NAME_PREFIX = "BLUE_"; 
const COMPANY_KEY = Buffer.from("8E12B960", 'hex');
const COMMAND_SUFFIX = '\r'; 

type AuthStep = 
  | 'disconnected' | 'connecting' | 'waiting_for_seed' 
  | 'sending_auth' | 'waiting_for_auth_ok' | 'sending_user_code' 
  | 'waiting_for_user_ok' | 'starting_telemetry' | 'connected' | 'failed';

interface TelemetryContextType {
  sensorData: SensorData;
  connectedDevice: BluetoothDevice | null;
  connectDevice: (device: BluetoothDevice) => Promise<void>;
  disconnectDevice: () => Promise<void>;
  devices: BluetoothDevice[];
  listPairedDevices: () => Promise<void>;
  isScanning: boolean;
  isConnecting: boolean; // Estado visual para loading
  authStep: AuthStep;
}

const TelemetryContext = createContext<TelemetryContextType>({} as TelemetryContextType);

// --- FUNÇÃO DE CRIPTOGRAFIA (Key Calculation) ---
const calculateAuthKey = (seedData: string): string => {
  const seedHex = seedData.replace('AT+BT_SEED=', '').replace(COMMAND_SUFFIX, '').trim();
  const seeds = Buffer.from(seedHex, 'hex');
  const key = Buffer.alloc(8);

  key[0] = seeds[4] ^ COMPANY_KEY[3];
  key[1] = COMPANY_KEY[1];
  key[2] = (key[0] + COMPANY_KEY[2]) & 0xFF;
  key[3] = (key[1] + seeds[0]) & 0xFF;
  key[4] = key[2] ^ COMPANY_KEY[0];
  key[5] = seeds[5] ^ key[3];
  key[6] = seeds[7] & key[2];
  key[7] = seeds[3] ^ key[6];

  let authKeyHex = key.toString('hex').toUpperCase();
  while (authKeyHex.length < 16) authKeyHex = '0' + authKeyHex;

  return 'AT+BT_AUTH=' + authKeyHex + COMMAND_SUFFIX + '\n';
};

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  // --- STATES (Para renderização da UI) ---
  const [sensorData, setSensorData] = useState<SensorData>({});
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>('disconnected');
  const [isConnecting, setIsConnecting] = useState(false); // Estado visual

  // --- REFS (Para lógica interna e evitar re-renders desnecessários/loops) ---
  const authStepRef = useRef<AuthStep>('disconnected');
  const dataBuffer = useRef<string>('');
  const connectionRef = useRef<BluetoothDevice | null>(null);
  const dataSubscription = useRef<BluetoothEventSubscription | null>(null);
  const isConnectingRef = useRef<boolean>(false); // Trava lógica

  const updateAuthStep = (step: AuthStep) => {
    authStepRef.current = step;
    setAuthStep(step);
    console.log("🔐 PASSO AUTH:", step);
  };

  // --- AUTO-CONNECT E PERMISSÕES ---
  useEffect(() => {
    let mounted = true;

    const initBluetooth = async () => {
        // Permissões para Android 12+ (SDK 31+) e anteriores
        if (Platform.OS === 'android') {
            const version = Platform.Version;
            if (typeof version === 'number' && version >= 31) {
                 await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                 ]);
            } else {
                 await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                 ]);
            }
        }

        try {
            const paired = await RNBluetoothClassic.getBondedDevices();
            if (!mounted) return;
            setDevices(paired);

            // Lógica de Auto-Conexão
            const targetDevice = paired.find(d => d.name && d.name.startsWith(DEVICE_NAME_PREFIX));

            if (targetDevice) {
                console.log(`🔍 [Auto] Encontrado: ${targetDevice.name}.`);
                // Só tenta conectar se não estiver conectando e não tiver conexão ativa
                if (!isConnectingRef.current && !connectionRef.current) {
                    ToastAndroid.show(`Conectando a ${targetDevice.name}...`, ToastAndroid.SHORT);
                    await connectDevice(targetDevice);
                }
            }
        } catch (err) { console.error("[Auto] Erro:", err); }
    };

    // Pequeno delay para garantir que o sistema carregou
    const timer = setTimeout(() => { initBluetooth(); }, 1000);
    return () => { mounted = false; clearTimeout(timer); disconnectDevice(); };
  }, []);

  // --- PROCESSAMENTO DE MENSAGENS (A Maquina de Estados) ---
  const processMessage = (message: string) => {
      const msg = message.trim();
      const cleanMessage = msg + '\r\n'; 
      
      const currentStep = authStepRef.current;

      // 1. DADOS DE TELEMETRIA (PRIORIDADE ALTA)
      if (msg.startsWith('AT+BT_PRM=')) {
          // Se começou a chegar dados mas o status ainda não atualizou, força conectado
          if (currentStep !== 'connected') {
              console.log("⚠️ Dados recebidos. Forçando status CONNECTED.");
              updateAuthStep('connected');
              if (connectionRef.current) setConnectedDevice(connectionRef.current);
          }

          try {
              const decoder = getDecoderInstance(cleanMessage);
              
              const speed = decoder.decodeSpeed();
              const rpm = decoder.decodeRPM();
              const bat = decoder.decodeBattery();
              
              // Log Opcional (pode comentar em produção)
              // console.log(`✅ Speed: ${speed} | RPM: ${rpm} | Bat: ${bat}`);

              setSensorData(prev => ({
                  ...prev, 
                  speed: speed, 
                  rpm: rpm, 
                  battery: bat,
                  latitude: decoder.decodeLatitude(),
                  longitude: decoder.decodeLongitude(),
                  engineWaterTemperature: decoder.decodeEngineWaterTemperature(),
              }));
          } catch (error) { 
              console.log("❌ Erro Decode:", error); 
          }
          return;
      }

      // 2. HANDSHAKE (AUTENTICAÇÃO)
      console.log(`📩 [Handshake] Msg: ${msg}`);

      switch (currentStep) {
        case 'waiting_for_seed':
            if (msg.startsWith('AT+BT_SEED=')) {
                updateAuthStep('sending_auth');
                const authCommand = calculateAuthKey(cleanMessage);
                console.log('📤 Enviando Chave...');
                connectionRef.current?.write(authCommand);
                updateAuthStep('waiting_for_auth_ok');
            }
            break;

        case 'waiting_for_auth_ok':
            if (msg.includes('AT+BT_AUTH_OK')) {
                updateAuthStep('sending_user_code');
                console.log('📤 Enviando User...');
                connectionRef.current?.write('AT+BT_COD_USER=0000000000000001' + COMMAND_SUFFIX + '\n');
                updateAuthStep('waiting_for_user_ok');
            }
            break;

        case 'waiting_for_user_ok':
            if (msg.includes('AT+BT_COD_USER_OK')) {
                updateAuthStep('starting_telemetry');
                console.log('📤 Start Telemetria...');
                connectionRef.current?.write('AT_BT_PRM_START' + COMMAND_SUFFIX + '\n');
                
                // Desativa simulação (opcional, dependendo do hardware)
                setTimeout(() => {
                    connectionRef.current?.write('AT+BT_SIMULATED_FRAME_OFF' + COMMAND_SUFFIX + '\n');
                }, 200);

                updateAuthStep('connected');
                if (connectionRef.current) setConnectedDevice(connectionRef.current);
                ToastAndroid.show("Conectado!", ToastAndroid.SHORT);
            }
            break;
      }
  };

  // --- LISTENER DE DADOS ---
  const onDataReceived = (event: { data: string }) => {
     dataBuffer.current += event.data;
     let lastIndex = dataBuffer.current.lastIndexOf(COMMAND_SUFFIX);
     if (lastIndex === -1) return; 

     const completeMessages = dataBuffer.current.substring(0, lastIndex + COMMAND_SUFFIX.length);
     dataBuffer.current = dataBuffer.current.substring(lastIndex + COMMAND_SUFFIX.length);

     const messages = completeMessages.split(COMMAND_SUFFIX).filter(msg => msg.length > 0);
     for (const msg of messages) {
       processMessage(msg + COMMAND_SUFFIX);
     }
  };

  const listPairedDevices = async () => {
    try {
      setIsScanning(true);
      const paired = await RNBluetoothClassic.getBondedDevices();
      setDevices(paired);
    } catch (err) { console.error(err); } finally { setIsScanning(false); }
  };

  // --- CONECTAR (COM CORREÇÃO DE ERRO) ---
  const connectDevice = async (device: BluetoothDevice) => {
     // 1. TRAVA LÓGICA
     if (isConnectingRef.current) {
         console.log("⚠️ Já existe uma conexão em andamento. Ignorando clique.");
         return;
     }

     // 2. Verifica se já está conectado no mesmo
     if (connectionRef.current?.id === device.id && await device.isConnected()) {
         console.log("✅ Já está conectado neste dispositivo.");
         return;
     }

     try {
        isConnectingRef.current = true; // Trava
        setIsConnecting(true);          // Visual
        updateAuthStep('connecting');
        console.log(`🔌 Conectando a ${device.name}...`);
        
        // 3. Tenta conectar
        const connection = await RNBluetoothClassic.connectToDevice(device.id);
        connectionRef.current = connection;
        
        // Limpa listener velho e adiciona novo
        if (dataSubscription.current) dataSubscription.current.remove();
        dataSubscription.current = connection.onDataReceived(onDataReceived);
        dataBuffer.current = '';

        updateAuthStep('waiting_for_seed');
        console.log("⏳ Aguardando Seed...");

     } catch (error: any) {
         // 1. PRIMEIRO verificamos se é o erro de "Já conectando"
         const errorMessage = error.message || error.toString();
         
         if (errorMessage.includes("Already attempting")) {
             // Se for esse erro, a gente avisa em amarelo (log comum) e para por aqui.
             console.log("ℹ️ Conexão já em andamento (Ignorando duplicidade).");
             return; 
         }

         // 2. Se NÃO for aquele erro, aí sim é um erro real. Mostramos o vermelho.
         console.error("❌ Erro conexão:", error);

         updateAuthStep('failed');
         setConnectedDevice(null);
         connectionRef.current = null;
         ToastAndroid.show("Falha ao conectar", ToastAndroid.SHORT);
     } finally {
         isConnectingRef.current = false;
         setIsConnecting(false);
     }
  };

  const disconnectDevice = async () => {
     try {
        console.log("🔌 Desconectando...");
        if (dataSubscription.current) dataSubscription.current.remove();
        if (connectionRef.current) await connectionRef.current.disconnect();
     } catch (e) { console.error(e); } 
     finally {
         setConnectedDevice(null);
         connectionRef.current = null;
         setSensorData({});
         updateAuthStep('disconnected');
         isConnectingRef.current = false;
         setIsConnecting(false);
     }
  };

  return (
    <TelemetryContext.Provider value={{ 
        sensorData, 
        connectedDevice, 
        connectDevice, 
        disconnectDevice, 
        devices, 
        listPairedDevices, 
        isScanning, 
        isConnecting, // Exposto para usar no botão de connect
        authStep 
    }}>
      {children}
    </TelemetryContext.Provider>
  );
}

// Hook personalizado
export const useTelemetry = () => useContext(TelemetryContext);