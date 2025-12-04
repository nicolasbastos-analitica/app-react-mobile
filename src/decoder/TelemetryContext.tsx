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
  isConnecting: boolean;
  authStep: AuthStep;

  // 🔵 Variáveis globais adicionadas
  isConnected: boolean;
  deviceName: string | null;
}

const TelemetryContext = createContext<TelemetryContextType>({} as TelemetryContextType);

// --- FUNÇÃO DE CRIPTOGRAFIA ---
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
  const [isConnecting, setIsConnecting] = useState(false);

  const authStepRef = useRef<AuthStep>('disconnected');
  const dataBuffer = useRef<string>('');
  const connectionRef = useRef<BluetoothDevice | null>(null);
  const dataSubscription = useRef<BluetoothEventSubscription | null>(null);
  const isConnectingRef = useRef<boolean>(false);

  const updateAuthStep = (step: AuthStep) => {
    authStepRef.current = step;
    setAuthStep(step);
    console.log("🔐 PASSO AUTH:", step);
  };

  // 🔵 Variáveis globais exportadas
  const isConnected = connectedDevice !== null;
  const deviceName = connectedDevice?.name ?? null;

  // --- AUTO-CONNECT ---
  useEffect(() => {
    let mounted = true;

    const initBluetooth = async () => {
      if (Platform.OS === 'android') {
        const version = Platform.Version;
        if (typeof version === 'number' && version >= 31) {
          await PermissionsAndroid.requestMultiple([
            // Localização
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,

            // Chamadas
            PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
            PermissionsAndroid.PERMISSIONS.CALL_PHONE,

            // Câmera e Gravação
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,

            // Atividade Física
            PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,

            // Bluetooth/Dispositivos Próximos
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          ]);
        } else {
          await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,

            // Chamadas
            PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
            PermissionsAndroid.PERMISSIONS.CALL_PHONE,

            // Câmera e Gravação
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,

            // Atividade Física
            PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,

            // Bluetooth/Dispositivos Próximos
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          ]);
        }
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
  // --- WATCHDOG: VERIFICAÇÃO DE CONEXÃO E NOME (1s) ---
  useEffect(() => {
    const watchdog = setInterval(async () => {
      if (connectionRef.current) {
        try {
          const isPhysicallyConnected = await connectionRef.current.isConnected();

          if (!isPhysicallyConnected) {
            console.log("⚠️ Watchdog: Detectou desconexão física.");
            disconnectDevice();
          } else {
            // Sincroniza o nome se estiver diferente
            if (connectedDevice?.name !== connectionRef.current.name) {
              setConnectedDevice(connectionRef.current);
            }
          }
        } catch (error) {
          disconnectDevice();
        }
      } else {
        // Se não tem conexão física, mas o estado diz que tem
        if (connectedDevice !== null) {
          disconnectDevice();
        }
      }
    }, 1000); // Roda a cada 1 segundo

    return () => clearInterval(watchdog);
  }, [connectedDevice]);

  // --- HANDSHAKE / TELEMETRIA ---
  const processMessage = (message: string) => {
    const msg = message.trim();
    const cleanMessage = msg + '\r\n';
    const currentStep = authStepRef.current;

    if (msg.startsWith('AT+BT_PRM=')) {
      if (currentStep !== 'connected') {
        updateAuthStep('connected');
        if (connectionRef.current) setConnectedDevice(connectionRef.current);
      }

      try {
        const decoder = getDecoderInstance(cleanMessage);
        setSensorData(prev => ({
          ...prev,
          speed: decoder.decodeSpeed(),
          rpm: decoder.decodeRPM(),
          battery: decoder.decodeBattery(),
          latitude: decoder.decodeLatitude(),
          longitude: decoder.decodeLongitude(),
          engineWaterTemperature: decoder.decodeEngineWaterTemperature(),
        }));
      } catch (error) { console.log("❌ Erro Decode:", error); }
      return;
    }

    console.log(`📩 [Handshake] Msg: ${msg}`);

    switch (currentStep) {
      case 'waiting_for_seed':
        if (msg.startsWith('AT+BT_SEED=')) {
          updateAuthStep('sending_auth');
          const authCommand = calculateAuthKey(cleanMessage);
          connectionRef.current?.write(authCommand);
          updateAuthStep('waiting_for_auth_ok');
        }
        break;

      case 'waiting_for_auth_ok':
        if (msg.includes('AT+BT_AUTH_OK')) {
          updateAuthStep('sending_user_code');
          connectionRef.current?.write('AT+BT_COD_USER=0000000000000001' + COMMAND_SUFFIX + '\n');
          updateAuthStep('waiting_for_user_ok');
        }
        break;

      case 'waiting_for_user_ok':
        if (msg.includes('AT+BT_COD_USER_OK')) {
          updateAuthStep('starting_telemetry');
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
    } catch (err) { console.error(err); }
    finally { setIsScanning(false); }
  };

  const connectDevice = async (device: BluetoothDevice) => {
    if (isConnectingRef.current) return;

    if (connectionRef.current?.id === device.id && await device.isConnected()) {
      console.log("✅ Já conectado.");
      return;
    }

    try {
      isConnectingRef.current = true;
      setIsConnecting(true);
      updateAuthStep('connecting');

      const connection = await RNBluetoothClassic.connectToDevice(device.id);
      connectionRef.current = connection;

      if (dataSubscription.current) dataSubscription.current.remove();
      dataSubscription.current = connection.onDataReceived(onDataReceived);
      dataBuffer.current = '';

      updateAuthStep('waiting_for_seed');

    } catch (error: any) {
      const errorMessage = error.message || error.toString();
      if (errorMessage.includes("Already attempting")) {
        console.log("ℹ️ Conexão já em andamento.");
        return;
      }

      console.error("❌ Erro conexão:", error);
      updateAuthStep('failed');
      setConnectedDevice(null);
      connectionRef.current = null;
      ToastAndroid.show("Falha ao conectar", ToastAndroid.SHORT);
    }
    finally {
      isConnectingRef.current = false;
      setIsConnecting(false);
    }
  };

  const disconnectDevice = async () => {
    try {
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
      isConnecting,
      authStep,

      // 🔵 Exposto globalmente
      isConnected,
      deviceName
    }}>
      {children}
    </TelemetryContext.Provider>
  );
}

// Hook personalizado
export const useTelemetry = () => useContext(TelemetryContext);
