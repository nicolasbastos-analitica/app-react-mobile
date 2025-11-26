import { SensorData } from '@/app/decoder/bluechipDecoder.types';
import { getInstance as getDecoderInstance } from '@/app/decoder/decoderFactory';
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
  authStep: AuthStep;
}

const TelemetryContext = createContext<TelemetryContextType>({} as TelemetryContextType);

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
  const [sensorData, setSensorData] = useState<SensorData>({});
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>('disconnected');
  
  const authStepRef = useRef<AuthStep>('disconnected');
  const dataBuffer = useRef<string>('');
  const connectionRef = useRef<BluetoothDevice | null>(null);
  const dataSubscription = useRef<BluetoothEventSubscription | null>(null);
  
  // Trava de segurança
  const isConnectingRef = useRef<boolean>(false);

  const updateAuthStep = (step: AuthStep) => {
    authStepRef.current = step;
    setAuthStep(step);
    console.log("🔐 PASSO AUTH:", step);
  };

  // --- AUTO-CONNECT ---
  useEffect(() => {
    let mounted = true;

    const initBluetooth = async () => {
        if (Platform.OS === 'android') {
            await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ]);
        }

        try {
            const paired = await RNBluetoothClassic.getBondedDevices();
            if (!mounted) return;
            setDevices(paired);

            const targetDevice = paired.find(d => d.name && d.name.startsWith(DEVICE_NAME_PREFIX));

            if (targetDevice) {
                console.log(`🔍 [Auto] Encontrado: ${targetDevice.name}.`);
                if (!isConnectingRef.current && !connectionRef.current) {
                    ToastAndroid.show(`Conectando a ${targetDevice.name}...`, ToastAndroid.SHORT);
                    await connectDevice(targetDevice);
                }
            }
        } catch (err) { console.error("[Auto] Erro:", err); }
    };

    const timer = setTimeout(() => { initBluetooth(); }, 1000);
    return () => { mounted = false; clearTimeout(timer); disconnectDevice(); };
  }, []);

  const processMessage = (message: string) => {
      // CORREÇÃO: Limpa a mensagem e garante o sufixo \r\n
      // Isso evita o erro "Dados inválidos"
      const msg = message.trim();
      const cleanMessage = msg + '\r\n'; 
      
      const currentStep = authStepRef.current;

      // --- 1. PROCESSAMENTO DE DADOS (PRIORIDADE) ---
      if (msg.startsWith('AT+BT_PRM=')) {
          if (currentStep !== 'connected') {
              console.log("⚠️ Dados recebidos. Forçando CONNECTED.");
              updateAuthStep('connected');
              if (connectionRef.current) setConnectedDevice(connectionRef.current);
          }

          try {
              // Passamos a mensagem limpa com o sufixo correto
              const decoder = getDecoderInstance(cleanMessage);
              
              const speed = decoder.decodeSpeed();
              const rpm = decoder.decodeRPM();
              const bat = decoder.decodeBattery();

              console.log(`✅ Speed: ${speed} | RPM: ${rpm} | Bat: ${bat}`);

              setSensorData(prev => ({
                  ...prev, 
                  speed: speed, 
                  rpm: rpm, 
                  battery: bat,
                  latitude: decoder.decodeLatitude(),
                  longitude: decoder.decodeLongitude(),
                  engineWaterTemperature: decoder.decodeEngineWaterTemperature(),
                  // Adicione outros campos conforme necessário
              }));
          } catch (error) { 
              console.log("❌ Erro Decode:", error); 
          }
          return;
      }

      // --- 2. PROCESSAMENTO DE HANDSHAKE ---
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

  const connectDevice = async (device: BluetoothDevice) => {
     if (isConnectingRef.current) return;
     if (connectionRef.current?.id === device.id && await device.isConnected()) return;

     try {
        isConnectingRef.current = true;
        updateAuthStep('connecting');
        console.log(`🔌 Conectando a ${device.name}...`);
        
        const connection = await RNBluetoothClassic.connectToDevice(device.id);
        connectionRef.current = connection;
        
        if (dataSubscription.current) dataSubscription.current.remove();
        dataSubscription.current = connection.onDataReceived(onDataReceived);
        dataBuffer.current = '';

        updateAuthStep('waiting_for_seed');
        console.log("⏳ Aguardando Seed...");

     } catch (error: any) {
         console.error("❌ Erro conexão:", error);
         updateAuthStep('failed');
         setConnectedDevice(null);
         connectionRef.current = null;
     } finally {
         isConnectingRef.current = false;
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
     }
  };

  return (
    <TelemetryContext.Provider value={{ sensorData, connectedDevice, connectDevice, disconnectDevice, devices, listPairedDevices, isScanning, authStep }}>
      {children}
    </TelemetryContext.Provider>
  );
}

export const useTelemetry = () => useContext(TelemetryContext);