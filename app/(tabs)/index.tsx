import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  PermissionsAndroid,
  Platform,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Buffer } from 'buffer';
import RNBluetoothClassic, {
  BluetoothDevice,
  BluetoothEventSubscription,
} from 'react-native-bluetooth-classic';

// --- Lógica de Autenticação ---
const COMPANY_KEY = Buffer.from("8E12B960", 'hex');
const COMMAND_SUFFIX = '\r\n'; // Símbolo de fim de comando

const calculateAuthKey = (seedData: string): string => {
  // 1. Limpa a seed (procurando por \r\n agora)
  const seedHex = seedData.replace('AT+BT_SEED=', '').replace(COMMAND_SUFFIX, '').trim();
  const seeds = Buffer.from(seedHex, 'hex');
  const key = Buffer.alloc(8);

  // ... (lógica de criptografia, que está correta) ...
  key[0] = seeds[4] ^ COMPANY_KEY[3];
  key[1] = COMPANY_KEY[1];
  key[2] = (key[0] + COMPANY_KEY[2]) & 0xFF;
  key[3] = (key[1] + seeds[0]) & 0xFF;
  key[4] = key[2] ^ COMPANY_KEY[0];
  key[5] = seeds[5] ^ key[3];
  key[6] = seeds[7] & key[2];
  key[7] = seeds[3] ^ key[6];

  const authKeyHex = key.toString('hex').toUpperCase().padStart(16, '0');
  
  // 2. CORREÇÃO:
  // Adicionamos o sufixo \r\n, exatamente como o BluetoothClient.java faz
  return 'AT+BT_AUTH=' + authKeyHex + COMMAND_SUFFIX;
};

type AuthStep =
  | 'disconnected'
  | 'connecting'
  | 'waiting_for_seed'
  | 'sending_auth'
  | 'waiting_for_auth_ok'
  | 'sending_user_code'         // <-- Adicionado de volta
  | 'waiting_for_user_ok'     // <-- Adicionado de volta
  | 'starting_telemetry'      // <-- Adicionado de volta
  | 'connected'                 // <-- Adicionado de volta
  | 'failed';

export default function App() {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [data, setData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>('disconnected');

  const dataBuffer = useRef<string>('');
  const connectionRef = useRef<BluetoothDevice | null>(null);
  const authStepRef = useRef<AuthStep>('disconnected');
  const dataSubscription = useRef<BluetoothEventSubscription | null>(null);
  const authTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateAuthStep = (step: AuthStep) => {
    authStepRef.current = step;
    setAuthStep(step);
    console.log("PASSO_AUTH:", step);
  };

  const startAuthTimeout = () => {
    if (authTimeout.current) clearTimeout(authTimeout.current);
    authTimeout.current = setTimeout(() => {
      console.error('Timeout de autenticação. Nenhum AT+BT_AUTH_OK recebido.');
      Alert.alert('Erro', 'Timeout de autenticação.');
      disconnectDevice();
      updateAuthStep('failed');
    }, 100000); // 10 segundos para receber o OK
  };

  const clearAuthTimeout = () => {
    if (authTimeout.current) clearTimeout(authTimeout.current);
  };

  useEffect(() => {
    async function requestPermissions() {
      if (Platform.OS !== 'android') return;
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        const allGranted = Object.values(granted).every(
          (status) => status === PermissionsAndroid.RESULTS.GRANTED
        );
        if (!allGranted) {
          Alert.alert(
            'Permissões Necessárias',
            'É preciso permitir acesso ao Bluetooth e Localização para o app funcionar.'
          );
        }
      } catch (err) {
        console.error('Erro ao pedir permissões:', err);
      }
    }
    requestPermissions();
  }, []);

  const listPairedDevices = async () => {
    try {
      setIsLoading(true);
      const paired = await RNBluetoothClassic.getBondedDevices();
      setDevices(paired);
    } catch (err) {
      console.error('Erro ao listar dispositivos:', err);
      Alert.alert('Erro', 'Não foi possível listar dispositivos pareados.');
    } finally {
      setIsLoading(false);
    }
  };

const processMessage = (message: string) => {
    console.log('PROCESSANDO:', JSON.stringify(message));
    const currentStep = authStepRef.current;
    
    // Se já estamos conectados, apenas adicione os dados
    if (currentStep === 'connected') {
      setData((prevData) => prevData + message);
      return;
    }

    // Lógica do Handshake (processo de autenticação)
    switch (currentStep) {
      case 'waiting_for_seed':
        if (message.startsWith('AT+BT_SEED=')) {
          updateAuthStep('sending_auth');
          const authCommand = calculateAuthKey(message);
          console.log('Enviando AUTH:', authCommand);
          // O authCommand já vem com o sufixo \r\n
          connectionRef.current?.write(authCommand); 
          updateAuthStep('waiting_for_auth_ok');
        }
        break;

      case 'waiting_for_auth_ok':
        if (message.includes('AT+BT_AUTH_OK')) {
          // CORRETO: Prossiga para o próximo passo
          updateAuthStep('sending_user_code'); 
          console.log('Enviando CÓDIGO DE USUÁRIO...');
          connectionRef.current?.write('AT+BT_COD_USER=0000000000000001' + COMMAND_SUFFIX);
          updateAuthStep('waiting_for_user_ok');
        } else if (message.includes('FAIL') || message.includes('BUSY') || message.includes('TIMEOUT')) {
          console.error('Autenticação falhou:', message);
          Alert.alert('Erro de Autenticação', `Falha: ${message}`);
          disconnectDevice();
          updateAuthStep('failed');
        }
        break;

      case 'waiting_for_user_ok':
        if (message.includes('AT+BT_COD_USER_OK')) {
          updateAuthStep('starting_telemetry');
          console.log('Enviando START TELEMETRIA...');
          connectionRef.current?.write('AT_BT_PRM_START' + COMMAND_SUFFIX);
          
          console.log('Enviando SIMULATED FRAME OFF...');
          connectionRef.current?.write('AT+BT_SIMULATED_FRAME_OFF' + COMMAND_SUFFIX);
          
          updateAuthStep('connected');
          // AGORA SIM: Mude a UI para "Conectado"
          setConnectedDevice(connectionRef.current); 
          console.log('HANDSHAKE COMPLETO. Ouvindo telemetria.');
        } else if (message.includes('FAIL') || message.includes('BUSY') || message.includes('TIMEOUT')) {
          console.error('Falha no login de usuário:', message);
          Alert.alert('Erro de Usuário', `Falha: ${message}`);
          disconnectDevice();
          updateAuthStep('failed');
        }
        break;
    }
  };

  const onDataReceived = (event: { data: string }) => {
    console.log('CHUNK RECEBIDO:', JSON.stringify(event.data));
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

  const connectDevice = async (device: BluetoothDevice) => {
    try {
      updateAuthStep('connecting');
      console.log(`Tentando conexão com ${device.name}...`);
      const connection = await RNBluetoothClassic.connectToDevice(device.id);
      
      console.log('Conectado fisicamente, aguardando seed...');
      connectionRef.current = connection;
      
      // NÃO mude a UI para "conectado" ainda.
      // setConnectedDevice(connection); // <-- REMOVIDO DAQUI

      dataBuffer.current = '';
      if (dataSubscription.current) {
        dataSubscription.current.remove();
      }
      dataSubscription.current = connection.onDataReceived(onDataReceived);
      
      // Apenas mude o passo e espere. O dispositivo enviará a seed.
      updateAuthStep('waiting_for_seed');
      
      // connection.write('AT+BT_SEED_REQ' + COMMAND_SUFFIX); // <-- REMOVIDO

    } catch (err: any) {
      console.error('Conexão falhou:', err);
      Alert.alert('Erro', `Falha na conexão: ${err.message}`);
      updateAuthStep('failed');
    }
  };
  const disconnectDevice = async () => {
    clearAuthTimeout();
    try {
      if (dataSubscription.current) {
        dataSubscription.current.remove();
        dataSubscription.current = null;
      }
      if (connectionRef.current) {
        await connectionRef.current.disconnect();
      }
    } catch (err) {
      console.error('Erro ao desconectar:', err);
    } finally {
      connectionRef.current = null;
      setConnectedDevice(null);
      setData('');
      updateAuthStep('disconnected');
    }
  };

  const renderDeviceItem = ({ item }: { item: BluetoothDevice }) => (
    <View style={styles.deviceItem}>
      <Text style={styles.deviceName}>{item.name}</Text>
      <Button title="Conectar" onPress={() => connectDevice(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Bluetooth Classic</Text>

      {connectedDevice ? (
        <View style={styles.connectedContainer}>
          <Text style={styles.infoText}>
            Conectado a: <Text style={{ fontWeight: 'bold' }}>{connectedDevice.name}</Text>
          </Text>
          <Text style={styles.infoText}>Dados Recebidos:</Text>
          <ScrollView style={styles.dataBox}>
            <Text>{data}</Text>
          </ScrollView>
          <Button title="Desconectar" onPress={disconnectDevice} color="#c0392b" />
        </View>
      ) : (
        <>
          <Button title="Listar Dispositivos Pareados" onPress={listPairedDevices} />

          {authStep !== 'disconnected' && authStep !== 'failed' && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3498db" />
              <Text style={styles.loadingText}>
                {authStep === 'connecting' && 'Conectando...'}
                {authStep === 'waiting_for_seed' && 'Aguardando seed...'}
                {authStep === 'sending_auth' && 'Enviando autenticação...'}
                {authStep === 'waiting_for_auth_ok' && 'Aguardando OK da autenticação...'}
              </Text>
            </View>
          )}

          {(authStep === 'disconnected' || authStep === 'failed') && (
            <>
              {isLoading ? (
                <ActivityIndicator size="large" color="#3498db" style={{ marginTop: 20 }} />
              ) : (
                <FlatList
                  data={devices}
                  keyExtractor={(item) => item.id}
                  renderItem={renderDeviceItem}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>Nenhum dispositivo pareado encontrado.</Text>
                  }
                  style={{ marginTop: 10 }}
                />
              )}
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  deviceName: { fontSize: 16, fontWeight: '500' },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#7f8c8d' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 15, fontSize: 16, color: '#3498db' },
  connectedContainer: { flex: 1 },
  infoText: { fontSize: 18, marginBottom: 10 },
  dataBox: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
});
