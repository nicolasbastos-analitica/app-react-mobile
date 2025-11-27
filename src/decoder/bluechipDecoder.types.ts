// bluechipDecoder.types.ts

// --- Funções de Ajuda (convertidas de 'protected final' e 'public static' no Java) ---

/**
 * Verifica se todos os caracteres em uma string satisfazem uma condição (predicado).
 * @param data A string a ser verificada.
 * @param predicate Função que recebe um caractere e retorna true/false.
 * @returns true se todos os caracteres satisfizerem o predicado, false caso contrário.
 * Retorna false para string vazia (comportamento do Java original).
 */
export function all(data: string | null | undefined, predicate: (char: string) => boolean): boolean {
  if (!data || data.length === 0) { // Verifica null, undefined ou vazio
    return false; // Comportamento do Java original para string vazia
  }
  for (let i = 0; i < data.length; i++) {
    if (!predicate(data.charAt(i))) {
      return false;
    }
  }
  return true;
}

/**
 * Verifica se um trecho de dados hexadecimais representa um valor "não disponível" (todos F's).
 * @param data O trecho da string hexadecimal.
 * @returns true se data for null/undefined ou contiver apenas 'F' ou 'f'.
 */
export function isNotAvailable(data: string | null | undefined): boolean {
  // A função `all` já trata o caso de `data` ser null/undefined implicitamente na primeira linha.
  // A conversão direta da lógica Java seria:
  return data == null || all(data, (char) => char === 'F' || char === 'f');
}

// --- Tipos de Status (baseado nas @IntDef do Java) ---
export type SprayApplicationMode = 0 | 1 | 2;
export type PlatformStatus = 0 | 1 | 2;

// --- Constantes (baseado nas 'public static final' e 'private static final' do Java) ---
export const SPACE_REGEX = /\s+/g; // Expressão regular para remover espaços em branco
export const LINE_BREAK_SUFFIX = "\r\n";
export const COMMAND_PREFIX = "AT+BT_PRM="; // Prefixo do comando de tempo real

export const SPRAY_APPLICATION_MODE_MANUAL: SprayApplicationMode = 0;
export const SPRAY_APPLICATION_MODE_TAXA1: SprayApplicationMode = 1;
export const SPRAY_APPLICATION_MODE_TAXA2: SprayApplicationMode = 2;

export const PLATFORM_STATUS_OFF: PlatformStatus = 0;
export const PLATFORM_STATUS_GOING_DOWN: PlatformStatus = 1;
export const PLATFORM_STATUS_GOING_UP: PlatformStatus = 2;

export const OFF: number = 0; // Constante para estado desligado/fechado/inválido
export const ON: number = 1;  // Constante para estado ligado/aberto/válido

// Constantes adicionais que estavam nas implementações (ex: Protocol340) e são usadas por várias
export const RADIX = 16; // Base hexadecimal para parseInt
export const LAT_LONG_CONSTANT = 4294967295; // 0xFFFFFFFF (usado na fórmula ORIGINAL do Java para lat/lon)
export const LAT_LONG_BASE = 1e-7; // 1 * 10^-7 (fator de multiplicação para lat/lon - fórmula do PDF)

// --- Função de Validação de Comando (convertida do 'public static' Java) ---
/**
 * Verifica se a string de dados brutos é um comando AT+BT_PRM válido (começa com prefixo e termina com sufixo).
 * @param rawData A string de dados recebida do dispositivo.
 * @returns true se for um comando válido, false caso contrário.
 */
export function isValidCommand(rawData: string | null | undefined): boolean {
    // Equivalente a Objects.requireNonNull(encodedData).startsWith(...) && ...endsWith(...)
    // Usamos !!rawData para garantir que rawData não seja null ou undefined antes de chamar os métodos de string.
    return !!rawData && rawData.startsWith(COMMAND_PREFIX) && rawData.endsWith(LINE_BREAK_SUFFIX);
}


// --- Interface IBluechipDataDecoder (baseado nos métodos 'public abstract' do Java) ---
// Define o "contrato" que todas as classes de decodificador (Protocol340, 350, etc.) devem seguir.
export interface IBluechipDataDecoder {
  // Propriedade que armazena a string hexadecimal já limpa (sem prefixo/sufixo)
  readonly encodedData: string; // 'readonly' pois não deve ser alterada após a criação

  // --- Métodos de Decodificação ---
  decodeFirmwareVersion(): number;
  decodeProtocolVersion(): number;
  decodeEngineStatus(): boolean;
  decodeIgnitionStatus(): boolean;
  decodeGpsStatus(): boolean;
  decodeLatitude(): number | null;
  decodeLongitude(): number | null;
  decodeCompass(): number | null;
  decodeBattery(): number | null;
  decodeHourMeter(): number | null;
  decodeTotalFuelUsage(): number | null;
  decodeOdometer(): number | null;
  decodeSpeed(): number | null;
  decodeRPM(): number | null;
  decodeAcceleratorPedal(): number | null;
  decodeEngineTorque(): number | null;
  decodeEngineLoad(): number | null;
  decodeTurboPressure(): number | null;
  decodeAdmissionValveAirPressure(): number | null;
  decodeEngineOilPressure(): number | null;
  decodeTransmissionOilPressure(): number | null;
  decodeFuelPressure(): number | null;
  decodeEngineOilTemperature(): number | null;
  decodeEngineWaterTemperature(): number | null;
  decodeEngineAdmissionAirTemperature(): number | null;
  decodeEnvironmentAirTemperature(): number | null;
  decodeTransmissionOilTemperature(): number | null;
  decodeHydraulicFluidTemperature(): number | null;
  decodeFuelTemperature(): number | null;
  decodeFuelFlow(): number | null;
  decodeFuelLevel(): number | null;
  decodeTransmissionOilLevel(): number | null;
  decodeHydraulicFluidLevel(): number | null;
  decodeFailureCodeStatus(): boolean | null;
  decodeRadiatorPropellerStatus(): boolean | null;
  decodeAgriculturalImplementHeightPercentage(): number | null;
  decodeHarvestUnitSpeed(): number | null;
  decodePowerTakeOffStatus(): boolean | null;
  decodeRtkPilotStatus(): boolean | null;
  decodeIndustryStatus(): boolean | null;
  decodeGrainDischargeStatus(): boolean | null;
  decodeHarvestUnitStatus(): boolean | null;
  decodePlatformStatus(): PlatformStatus | null;
  decodePackingCottonProcessStatus(): boolean | null;
  decodeWaterPumpStatus(): boolean | null;
  decodeSprayApplicationMode(): SprayApplicationMode | null;
  decodeSprayLiquidReleaseStatus(): boolean | null;
  decodeCentralSprayNozzleStatus(): boolean | null;
  decodeLeftSprayNozzle1Status(): boolean | null;
  decodeLeftSprayNozzle2Status(): boolean | null;
  decodeLeftSprayNozzle3Status(): boolean | null;
  decodeLeftSprayNozzle4Status(): boolean | null;
  decodeRightSprayNozzle1Status(): boolean | null;
  decodeRightSprayNozzle2Status(): boolean | null;
  decodeRightSprayNozzle3Status(): boolean | null;
  decodeRightSprayNozzle4Status(): boolean | null;
  decodeConveyorPlanterStatus(): boolean | null;
  decodeSugarCaneElevatorStatus(): boolean | null;
  decodeSugarCaneBaseCutStatus(): boolean | null;
  decodeSugarCanePrimaryExtractorStatus(): boolean | null;
  decodeSugarCaneSecondaryExtractorStatus(): boolean | null;
  decodeElevatorConveyorBeltHourMeter(): number | null;
  decodeAutoPilotHourMeter(): number | null;
  decodeCaneBaseCutPressure(): number | null;
  decodeCaneChipperPressure(): number | null;
  decodeCaneBaseCutHeight(): number | null;
  decodePrimaryExtractorSpeed(): number | null;

  // --- Métodos Adicionais ---
  checkSum(): number;
  isTelematicsAvailable(): boolean;
  deviceVersion(): string; // Retorna a string da versão, ex: "v3.5"

  // Método interno de validação (convertido de 'protected abstract' Java)
  // Cada implementação deve ter sua própria lógica para validar com base no comprimento
  isValidProtocol(encodedDataLength: number): boolean;
}

// --- Função Factory (Substitui getInstance e DataDecoderHandler) ---
// Esta função DEVE ser implementada em um ARQUIVO SEPARADO (ex: decoderFactory.ts)
// Ela importará as classes concretas (Protocol340, 350, etc.) e usará
// isValidCommand e isValidProtocol para retornar a instância correta.
//
// export function getInstance(rawData: string): IBluechipDataDecoder {
//     // ... (lógica mostrada na resposta anterior) ...
// }
// bluechipDecoder.types.ts

// ... (outras exportações: all, isNotAvailable, constantes, IBluechipDataDecoder, etc.) ...

// --- Interface para o Estado dos Sensores ---
// (Movida do App.tsx e expandida para incluir mais campos)
export interface SensorData {
  // Dados básicos (protocolo 3.4+)
  latitude?: number | null;
  longitude?: number | null;
  heading?: number | null; // Nome mais comum para 'compass'
  battery?: number | null;
  firmwareVersion?: number | null; // Disponível a partir do 3.6+
  protocolVersion?: number | null; // Disponível a partir do 3.6+ (ou podemos inferir)
  engineStatus?: boolean | null;
  ignitionStatus?: boolean | null;
  gpsStatus?: boolean | null;

  // Dados de Telemetria (protocolo 3.5+)
  hourMeter?: number | null;
  odometer?: number | null;
  speed?: number | null; // Mantenha apenas 'speed' minúsculo
  rpm?: number | null;
  acceleratorPedal?: number | null; // Renomeado de 'gasPedal'
  engineTorque?: number | null;
  engineLoad?: number | null;
  turboPressure?: number | null;
  engineAdmissionAirPressure?: number | null;
  fuelFlow?: number | null;
  harvestUnitSpeed?: number | null;
  totalFuelUsage?: number | null;
  engineOilPressure?: number | null;
  transmissionOilPressure?: number | null;
  fuelPressure?: number | null;
  engineOilTemperature?: number | null;
  engineWaterTemperature?: number | null;
  engineAdmissionAirTemperature?: number | null;
  environmentAirTemperature?: number | null;
  transmissionOilTemperature?: number | null;
  hydraulicFluidTemperature?: number | null;
  fuelTemperature?: number | null;
  fuelLevel?: number | null;
  transmissionOilLevel?: number | null;
  hydraulicFluidLevel?: number | null;
  agriculturalImplementHeightPercentage?: number | null;
  failureCodeStatus?: boolean | null;
  radiatorPropellerStatus?: boolean | null;
  sugarCaneElevatorStatus?: boolean | null;
  sugarCaneBaseCutStatus?: boolean | null;
  powerTakeoffStatus?: boolean | null;
  rtkPilotStatus?: boolean | null;
  industryStatus?: boolean | null;
  grainDischargeStatus?: boolean | null;
  harvestUnitStatus?: boolean | null;
  platformStatus?: PlatformStatus | null; // Usar o tipo PlatformStatus
  packingCottonProcessStatus?: boolean | null;
  waterPumpStatus?: boolean | null;
  sprayApplicationMode?: SprayApplicationMode | null; // Usar o tipo SprayApplicationMode
  sprayLiquidReleaseStatus?: boolean | null;
  centralSprayNozzleStatus?: boolean | null;
  leftSprayNozzle1Status?: boolean | null;
  leftSprayNozzle2Status?: boolean | null;
  leftSprayNozzle3Status?: boolean | null;
  rightSprayNozzle1Status?: boolean | null;
  rightSprayNozzle2Status?: boolean | null;
  rightSprayNozzle3Status?: boolean | null;
  sugarCanePrimaryExtractorStatus?: boolean | null;
  sugarCaneSecondaryExtractorStatus?: boolean | null;

  // Dados de Telemetria (protocolo 3.6+)
  elevatorConveyorBeltHourMeter?: number | null;
  autopilotHourMeter?: number | null; // Renomeado de 'autoPilotHourMeter'
  caneBaseCutPressure?: number | null;
  caneChipperPressure?: number | null;
  caneBaseCutHeight?: number | null;
  primaryExtractorSpeed?: number | null;

  // Dados de Telemetria (protocolo 3.7+)
  leftSprayNozzle4Status?: boolean | null;
  rightSprayNozzle4Status?: boolean | null;
  conveyorPlanterStatus?: boolean | null; // Pode ser a "Porta Digital 02" dependendo da versão

  // Campo para erros de decodificação
  error?: string | null;
  // Opcional: Para guardar o frame bruto original
  rawFrame?: string | null;
}