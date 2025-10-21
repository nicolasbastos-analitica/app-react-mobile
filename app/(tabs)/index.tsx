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
import * as bluetooth from 'react-native-bluetooth-classic';

// --- Lógica de Autenticação ---
const COMPANY_KEY = Buffer.from("8E12B960", 'hex');
const COMMAND_SUFFIX = '\r';

const calculateAuthKey = (seedData: string): string => {
  const seedHex = seedData.replace('AT+BT_SEED=', '').replace(/\r?\n/g, '').trim();
  const seeds = Buffer.from(seedHex, 'hex');
  const companyKey = Buffer.from('8E12B960', 'hex');
  const key = Buffer.alloc(8);

  const toByte = (val: number) => (val & 0xFF); // simula cast (byte) do Java

  key[0] = toByte(seeds[4] ^ companyKey[3]);
  key[1] = toByte(companyKey[1]);
  key[2] = toByte(key[0] + companyKey[2]);
  key[3] = toByte(key[1] + seeds[0]);
  key[4] = toByte(key[2] ^ companyKey[0]);
  key[5] = toByte(seeds[5] ^ key[3]);
  key[6] = toByte(seeds[7] & key[2]);
  key[7] = toByte(seeds[3] ^ key[6]);

  const authKeyHex = key.toString('hex').toUpperCase().padStart(16, '0');
  console.log('SEED HEX:', seedHex);
  console.log('AUTH KEY:', authKeyHex);
  for (let i = 0; i < 8; i++) console.log(`key[${i}] = 0x${key[i].toString(16).padStart(2, '0')}`);
  return 'AT+BT_AUTH=' + authKeyHex;
};

type AuthStep =
  | 'disconnected'
  | 'connecting'
  | 'waiting_for_seed'
  | 'sending_auth'
  | 'waiting_for_auth_ok'
  | 'failed';

export default function App() {
  const [devices, setDevices] = useState<BoundedDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothConnection | null>(null);
  const [data, setData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>('disconnected');

  const dataBuffer = useRef<string>('');
  const connectionRef = useRef<BluetoothConnection | null>(null);
  const authStepRef = useRef<AuthStep>('disconnected');
  const dataSubscription = useRef<EmitterSubscription | null>(null);
  let authTimeout = useRef<NodeJS.Timeout | null>(null);

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

    if (message.includes('FAIL') || message.includes('BUSY') || message.includes('TIMEOUT')) {
      console.error('Falha detectada:', message);
      Alert.alert('Erro', `Falha detectada: ${message}`);
      disconnectDevice();
      updateAuthStep('failed');
      return;
    }
    const sendData = (data: string) => {
  console.log('SAT MESSAGE OUT:', data);
  connectionRef.current?.write(data);
};


    switch (currentStep) {
      case 'waiting_for_seed':
        if (message.startsWith('AT+BT_SEED=')) {
          updateAuthStep('sending_auth');
          const authCommand = calculateAuthKey(message);
          console.log('Enviando AUTH:', authCommand + COMMAND_SUFFIX);
          sendData(authCommand + COMMAND_SUFFIX);
          updateAuthStep('waiting_for_auth_ok');
          startAuthTimeout();
        }
        break;

      case 'waiting_for_auth_ok':
        if (message.includes('AT+BT_AUTH_OK')) {
          console.log('Autenticação OK recebida.');
          clearAuthTimeout();
          updateAuthStep('disconnected');
        }
        break;
    }

    // Atualiza o histórico de dados recebidos
    setData(prev => prev + message + '\n');
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

  const connectDevice = async (device: BoundedDevice) => {
    try {
      dataBuffer.current = '';
      setData('');
      updateAuthStep('connecting');

      console.log(`Tentando conexão com ${device.name}...`);
      const connection = await RNBluetoothClassic.connectToDevice(device.id);

      console.log('Conectado fisicamente, iniciando handshake...');
      connectionRef.current = connection;
      setConnectedDevice(connection);

      if (dataSubscription.current) dataSubscription.current.remove();
      dataSubscription.current = connection.onDataReceived(onDataReceived);

      updateAuthStep('waiting_for_seed');
      console.log('Solicitando SEED...');
      connection.write('AT+BT_SEED_REQ' + COMMAND_SUFFIX);

    } catch (err: any) {
      console.error('Conexão falhou:', err);
      Alert.alert('Erro', `Falha na conexão: ${err.message}`);
      updateAuthStep('failed');
      setConnectedDevice(null);
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

  const renderDeviceItem = ({ item }: { item: BoundedDevice }) => (
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
