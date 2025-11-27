import { styles } from '@/src/styles/app/style/_styles';
import { Buffer } from 'buffer';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  View
} from 'react-native';
import RNBluetoothClassic, {
  BluetoothDevice,
  BluetoothEventSubscription,
} from 'react-native-bluetooth-classic';
// No topo do App.tsx
import { IBluechipDataDecoder, SensorData } from '../../src/decoder/bluechipDecoder.types'; // Importe a interface SensorData também
import { getInstance as getDecoderInstance } from '../../src/decoder/decoderFactory'; // Ajuste o caminho


// --- Lógica de Autenticação ---
const COMPANY_KEY = Buffer.from("8E12B960", 'hex');
const COMMAND_SUFFIX = '\r'; // Símbolo de fim de comando

const calculateAuthKey = (seedData: string): string => {
  // 1. Limpa a seed (procurando por \r\n agora)
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

  while (authKeyHex.length < 16) {
    authKeyHex = '0' + authKeyHex;
  }

  // 2. CORREÇÃO:
  // Adicionamos o sufixo \r\n, exatamente como o BluetoothClient.java faz
  return 'AT+BT_AUTH=' + authKeyHex + COMMAND_SUFFIX + '\n'
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


// Fora do componente App, ou dentro se preferir

/**
 * Decodifica um frame de dados hexadecimal do Bluechip.
 * @param hexFrame A string hexadecimal pura (sem prefixo AT+BT_...).
 * @returns Um objeto SensorData com os valores decodificados.
 */


export default function App() {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [data, setData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>('disconnected');
  const [sensorData, setSensorData] = useState<SensorData>({});

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
const updateSensorStateFromDecoder = (decoder: IBluechipDataDecoder, rawFrame: string) => {
    try {
        // Cria um novo objeto SensorData com os valores decodificados
        const newData: SensorData = {
            // Copia todos os valores usando os métodos do decoder
            latitude: decoder.decodeLatitude(),
            longitude: decoder.decodeLongitude(),
            heading: decoder.decodeCompass(), // Ajuste os nomes das propriedades se necessário
            battery: decoder.decodeBattery(),
            firmwareVersion: decoder.decodeFirmwareVersion(),
            protocolVersion: decoder.decodeProtocolVersion(),
            engineStatus: decoder.decodeEngineStatus(),
            ignitionStatus: decoder.decodeIgnitionStatus(),
            gpsStatus: decoder.decodeGpsStatus(),
            // Adiciona telemetria apenas se disponível
            ...(decoder.isTelematicsAvailable() && {
                hourMeter: decoder.decodeHourMeter(),
                odometer: decoder.decodeOdometer(),
                speed: decoder.decodeSpeed(), // Garanta que 'speed' (minúsculo) esteja na sua interface SensorData
                rpm: decoder.decodeRPM(),
                acceleratorPedal: decoder.decodeAcceleratorPedal(),
                engineTorque: decoder.decodeEngineTorque(),
                engineLoad: decoder.decodeEngineLoad(),
                turboPressure: decoder.decodeTurboPressure(),
                engineAdmissionAirPressure: decoder.decodeAdmissionValveAirPressure(),
                fuelFlow: decoder.decodeFuelFlow(),
                harvestUnitSpeed: decoder.decodeHarvestUnitSpeed(),
                totalFuelUsage: decoder.decodeTotalFuelUsage(),
                engineOilPressure: decoder.decodeEngineOilPressure(),
                transmissionOilPressure: decoder.decodeTransmissionOilPressure(),
                fuelPressure: decoder.decodeFuelPressure(),
                engineOilTemperature: decoder.decodeEngineOilTemperature(),
                engineWaterTemperature: decoder.decodeEngineWaterTemperature(),
                engineAdmissionAirTemperature: decoder.decodeEngineAdmissionAirTemperature(),
                environmentAirTemperature: decoder.decodeEnvironmentAirTemperature(),
                transmissionOilTemperature: decoder.decodeTransmissionOilTemperature(),
                hydraulicFluidTemperature: decoder.decodeHydraulicFluidTemperature(),
                fuelTemperature: decoder.decodeFuelTemperature(),
                fuelLevel: decoder.decodeFuelLevel(),
                transmissionOilLevel: decoder.decodeTransmissionOilLevel(),
                hydraulicFluidLevel: decoder.decodeHydraulicFluidLevel(),
                agriculturalImplementHeightPercentage: decoder.decodeAgriculturalImplementHeightPercentage(),
                elevatorConveyorBeltHourMeter: decoder.decodeElevatorConveyorBeltHourMeter(),
                autopilotHourMeter: decoder.decodeAutoPilotHourMeter(),
                caneBaseCutPressure: decoder.decodeCaneBaseCutPressure(),
                caneChipperPressure: decoder.decodeCaneChipperPressure(),
                primaryExtractorSpeed: decoder.decodePrimaryExtractorSpeed(),
                // Digitais (Telemetria)
                sugarCaneElevatorStatus: decoder.decodeSugarCaneElevatorStatus(),
                sugarCaneBaseCutStatus: decoder.decodeSugarCaneBaseCutStatus(),
                sugarCanePrimaryExtractorStatus: decoder.decodeSugarCanePrimaryExtractorStatus(),
                sugarCaneSecondaryExtractorStatus: decoder.decodeSugarCaneSecondaryExtractorStatus(),
                failureCodeStatus: decoder.decodeFailureCodeStatus(),
                powerTakeoffStatus: decoder.decodePowerTakeOffStatus(),
                rtkPilotStatus: decoder.decodeRtkPilotStatus(),
                industryStatus: decoder.decodeIndustryStatus(),
                grainDischargeStatus: decoder.decodeGrainDischargeStatus(),
                harvestUnitStatus: decoder.decodeHarvestUnitStatus(),
                packingCottonProcessStatus: decoder.decodePackingCottonProcessStatus(),
                waterPumpStatus: decoder.decodeWaterPumpStatus(),
                radiatorPropellerStatus: decoder.decodeRadiatorPropellerStatus(),
                sprayLiquidReleaseStatus: decoder.decodeSprayLiquidReleaseStatus(),
                centralSprayNozzleStatus: decoder.decodeCentralSprayNozzleStatus(),
                leftSprayNozzleOneStatus: decoder.decodeLeftSprayNozzle1Status(),
                leftSprayNozzleTwoStatus: decoder.decodeLeftSprayNozzle2Status(),
                leftSprayNozzleThreeStatus: decoder.decodeLeftSprayNozzle3Status(),
                leftSprayNozzleFourStatus: decoder.decodeLeftSprayNozzle4Status(),
                rightSprayNozzleOneStatus: decoder.decodeRightSprayNozzle1Status(),
                rightSprayNozzleTwoStatus: decoder.decodeRightSprayNozzle2Status(),
                rightSprayNozzleThreeStatus: decoder.decodeRightSprayNozzle3Status(),
                rightSprayNozzleFourStatus: decoder.decodeRightSprayNozzle4Status(),
                conveyorPlanterStatus: decoder.decodeConveyorPlanterStatus(),
                // Múltiplos Estados (Telemetria)
                platformStatus: decoder.decodePlatformStatus(),
                sprayApplicationMode: decoder.decodeSprayApplicationMode(),
                caneBaseCutHeight: decoder.decodeCaneBaseCutHeight(),
            }),
            error: null, // Limpa qualquer erro de decodificação anterior
            // rawFrame: rawFrame, // Opcional: guardar o frame bruto
        };

        // Atualiza o estado do React com os novos dados
        setSensorData(newData);

    } catch (error: any) {
        console.error("Erro DENTRO da decodificação dos campos:", error);
        setSensorData(prev => ({ ...prev, error: `Erro nos campos: ${error.message}` }));
    }
};

  const processMessage = (message: string) => {
    console.log('PROCESSANDO:', JSON.stringify(message));
    const currentStep = authStepRef.current;

    // Se já estamos conectados, apenas adicione os dados
    if (currentStep === 'connected') {
      if (message.startsWith('AT+BT_PRM=')) {
        try {
          const decoder : IBluechipDataDecoder = getDecoderInstance(message + '\n'); // Adiciona o \n que a factory espera
          updateSensorStateFromDecoder(decoder, message + '\n');
        } catch (error: any) {
            console.error("Erro ao criar decodificador:", error);
            setSensorData(prev => ({ ...prev, error: `Erro ao criar decodificador: ${error.message}` }));
        }
      } else if (message.startsWith('AT+BT_DATA=')) {
        console.warn("Decodificação de AT+BT_DATA não implementada com a nova factory.");
      } else {
        setData((prevData) => prevData + message);
      }
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
          connectionRef.current?.write('AT+BT_COD_USER=0000000000000001' + COMMAND_SUFFIX + '\n');
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
          connectionRef.current?.write('AT_BT_PRM_START' + COMMAND_SUFFIX + '\n');

          console.log('Enviando SIMULATED FRAME OFF...');
          connectionRef.current?.write('AT+BT_SIMULATED_FRAME_OFF' + COMMAND_SUFFIX + '\n');
          connectionRef.current?.write('AT+BT_SIMULATED_FRAME_ON' + COMMAND_SUFFIX + '\n');

          updateAuthStep('connected');
          // AGORA SIM: Mude a UI para "Conectado"
          setConnectedDevice(connectionRef.current);
          console.log('HANDSHAKE COMPLETO. Ouvindo telemetria.');
        } else if (message.includes('FAIL') || message.includes('BUSY') || message.includes('TIMEOUT')) {
          console.error('Falha no login de usuário:', message);
          Alert.alert('Erro de Usuário', `Falha: ${message}`);
          disconnectDevice();
          updateAuthStep('failed');
          connectionRef.current?.write('AT+BT_REAL_RPM=<value>' + COMMAND_SUFFIX + '\n');

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

          {/* Seção para exibir os dados decodificados */}
          <View style={styles.sensorDisplay}>
            <Text style={styles.sensorTitle}>Dados da Máquina:</Text>
            {/* Verifica se há erro na decodificação */}
            {sensorData.error ? (
              <Text style={styles.errorText}>Erro na Decodificação: {sensorData.error}</Text>
            ) : (
              <>
                {/* Exibe cada sensor. Usa ?. e ?? 'N/A' para segurança */}
                <Text style={styles.sensorText}>Protocolo: {sensorData.protocolVersion ?? 'N/A'}</Text>
                <Text style={styles.sensorText}>Firmware: {sensorData.firmwareVersion ?? 'N/A'}</Text>
                <Text style={styles.sensorText}>Latitude: {sensorData.latitude?.toFixed(7) ?? 'N/A'}</Text>
                <Text style={styles.sensorText}>Longitude: {sensorData.longitude?.toFixed(7) ?? 'N/A'}</Text>
                <Text style={styles.sensorText}>RPM: {sensorData.rpm ?? 'N/A'}</Text>
                <Text style={styles.sensorText}>Velocidade: {sensorData.speed ?? 'N/A'} Km/h</Text>
                <Text style={styles.sensorText}>Bateria: {sensorData.battery?.toFixed(2) ?? 'N/A'} V</Text>
                <Text style={styles.sensorText}>Ignição: {sensorData.ignitionStatus === null ? 'N/A' : (sensorData.ignitionStatus ? 'Ligada' : 'Desligada')}</Text>
                <Text style={styles.sensorText}>Motor: {sensorData.engineStatus === null ? 'N/A' : (sensorData.engineStatus ? 'Ligado' : 'Desligado')}</Text>
                <Text style={styles.sensorText}>GPS: {sensorData.gpsStatus === null ? 'N/A' : (sensorData.gpsStatus ? 'Válido' : 'Inválido')}</Text>
                {/* Adicione mais <Text> para outros sensores que você decodificar */}
              </>
            )}
          </View>

          <Text style={styles.infoText}>Dados Brutos Recebidos:</Text>
          <ScrollView style={styles.dataBox}>
            {/* Mostra os dados brutos como antes */}
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
;


