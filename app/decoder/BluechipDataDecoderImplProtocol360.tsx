// decoders/Protocol360.ts

import {
    // A Interface (o "contrato")
    IBluechipDataDecoder,
    // Tipos de Status
    SprayApplicationMode,
    PlatformStatus,
    // Constantes de Status
    ON,
    OFF,
    SPRAY_APPLICATION_MODE_MANUAL,
    SPRAY_APPLICATION_MODE_TAXA1,
    SPRAY_APPLICATION_MODE_TAXA2,
    PLATFORM_STATUS_OFF,
    PLATFORM_STATUS_GOING_DOWN,
    PLATFORM_STATUS_GOING_UP,
    // Constantes de Decodificação
    RADIX,
    LAT_LONG_CONSTANT, // Embora não recomendado para uso direto na fórmula JS/TS
    LAT_LONG_BASE,
    // Funções de Ajuda
    isNotAvailable
} from './bluechipDecoder.types'; // Ajuste o caminho se necessário

// Importa as constantes de comprimento da classe "pai" (ou defina-as aqui se não usar herança real)
// Para simplificar, vamos redefinir as constantes LEN aqui, incluindo as "herdadas".
// --- Constantes de Comprimento ---
const ENGINE_LEN = 2;
const LATITUDE_LEN = 8;
const LONGITUDE_LEN = 8;
const COMPASS_LEN = 4;
const BATTERY_LEN = 4;
const TOTAL_HOUR_METER_LEN = 8;
const TOTAL_FUEL_LEN = 8;
const ODOMETER_LEN = 8;
const SPEED_LEN = 4;
const RPM_LEN = 4;
const ACCELERATOR_PEDAL_LEN = 2;
const ENGINE_TORQUE_LEN = 2;
const ENGINE_LOAD_LEN = 2;
const TURBO_PRESSURE_LEN = 2;
const ADMISSION_VALVE_AIR_PRESSURE_LEN = 2;
const ENGINE_OIL_PRESSURE_LEN = 2;
const TRANSMISSION_OIL_PRESSURE_LEN = 2;
const FUEL_PRESSURE_LEN = 2;
const ENGINE_OIL_TEMPERATURE_LEN = 4;
const ENGINE_WATER_TEMPERATURE_LEN = 2;
const ENGINE_ADMISSION_AIR_TEMPERATURE_LEN = 2;
const ENVIRONMENT_AIR_TEMPERATURE_LEN = 2;
const TRANSMISSION_OIL_TEMPERATURE_LEN = 4;
const HYDRAULIC_FLUID_TEMPERATURE_LEN = 2;
const FUEL_TEMPERATURE_LEN = 2;
const FUEL_FLOW_LEN = 4;
const FUEL_LEVEL_LEN = 2;
const TRANSMISSION_OIL_LEVEL_LEN = 2;
const HYDRAULIC_FLUID_LEVEL_LEN = 2;
const STATUS_GROUP0_LEN = 2;
const AGRICULTURAL_IMPLEMENT_HEIGHT_LEN = 2;
const HARVEST_UNIT_SPEED_LEN = 2;
const STATUS_GROUP1_LEN = 2;
const STATUS_GROUP2_LEN = 2;
const STATUS_GROUP3_LEN = 2;
const LEFT_SPRAY_NOZZLE_LEN = 2;
const RIGHT_SPRAY_NOZZLE_LEN = 2;
// Novas constantes para 3.6.0
const VERSION_BYTE_LEN = 2; // Tamanho do byte combinado de FW e Protocolo
const ELEVATOR_CONVEYOR_BELT_HOUR_METER_LEN = 8;
const AUTO_PILOT_HOUR_METER_LEN = 8;
const CANE_BASE_CUT_PRESSURE_LEN = 4; // Java usa 4 aqui
const CANE_CHIPPER_PRESSURE_LEN = 4; // Java usa 4 aqui
const CANE_BASE_CUT_HEIGHT_LEN = 4; // Java usa 4 aqui
const PRIMARY_EXTRACTOR_SPEED_LEN = 4; // Java usa 4 aqui
const RESERVED_LEN = 16;


export class BluechipDataDecoderImplProtocol360 implements IBluechipDataDecoder {

    // --- Constantes Estáticas da Classe ---
    private static readonly PROTOCOL_VERSION: number = 2;
    // Comprimento esperado da string hex limpa para este protocolo
    public static readonly ENCODED_DATA_LENGTH: number = 170;


    // --- Propriedades da Instância ---
    public readonly encodedData: string; // String hexadecimal limpa

    // Índices calculados no construtor
    // Novos índices para Versão (byte único combinado)
    private mVersionByteBeginIndex!: number; // Índice inicial do byte de versão
    private mVersionByteEndIndex!: number;   // Índice final do byte de versão

    // Índices "herdados" (calculados após o byte de versão)
    private mEngineBeginIndex!: number;
    private mEngineEndIndex!: number;
    private mLatitudeBeginIndex!: number;
    private mLatitudeEndIndex!: number;
    private mLongitudeBeginIndex!: number;
    private mLongitudeEndIndex!: number;
    private mCompassBeginIndex!: number;
    private mCompassEndIndex!: number;
    private mBatteryBeginIndex!: number;
    private mBatteryEndIndex!: number;
    private mHourMeterBeginIndex!: number;
    private mHourMeterEndIndex!: number;
    private mTotalFuelBeginIndex!: number;
    private mTotalFuelEndIndex!: number;
    private mOdometerBeginIndex!: number;
    private mOdometerEndIndex!: number;
    private mSpeedBeginIndex!: number;
    private mSpeedEndIndex!: number;
    private mRPMBeginIndex!: number;
    private mRPMEndIndex!: number;
    private mAcceleratorPedalBeginIndex!: number;
    private mAcceleratorPedalEndIndex!: number;
    private mEngineTorqueBeginIndex!: number;
    private mEngineTorqueEndIndex!: number;
    private mEngineLoadBeginIndex!: number;
    private mEngineLoadEndIndex!: number;
    private mTurboPressureBeginIndex!: number;
    private mTurboPressureEndIndex!: number;
    private mAdmissionValveAirPressureBeginIndex!: number;
    private mAdmissionValveAirPressureEndIndex!: number;
    private mEngineOilPressureBeginIndex!: number;
    private mEngineOilPressureEndIndex!: number;
    private mTransmissionOilPressureBeginIndex!: number;
    private mTransmissionOilPressureEndIndex!: number;
    private mFuelPressureBeginIndex!: number;
    private mFuelPressureEndIndex!: number;
    private mEngineOilTemperatureBeginIndex!: number;
    private mEngineOilTemperatureEndIndex!: number;
    private mEngineWaterTemperatureBeginIndex!: number;
    private mEngineWaterTemperatureEndIndex!: number;
    private mEngineAdmissionAirTemperatureBeginIndex!: number;
    private mEngineAdmissionAirTemperatureEndIndex!: number;
    private mEnvironmentAirTemperatureBeginIndex!: number;
    private mEnvironmentAirTemperatureEndIndex!: number;
    private mTransmissionOilTemperatureBeginIndex!: number;
    private mTransmissionOilTemperatureEndIndex!: number;
    private mHydraulicFluidTemperatureBeginIndex!: number;
    private mHydraulicFluidTemperatureEndIndex!: number;
    private mFuelTemperatureBeginIndex!: number;
    private mFuelTemperatureEndIndex!: number;
    private mFuelFlowBeginIndex!: number;
    private mFuelFlowEndIndex!: number;
    private mFuelLevelBeginIndex!: number;
    private mFuelLevelEndIndex!: number;
    private mTransmissionOilLevelBeginIndex!: number;
    private mTransmissionOilLevelEndIndex!: number;
    private mHydraulicFluidLevelBeginIndex!: number;
    private mHydraulicFluidLevelEndIndex!: number;
    private mStatusGroup0BeginIndex!: number;
    private mStatusGroup0EndIndex!: number;
    private mAgriculturalImplementHeightPercentageBeginIndex!: number;
    private mAgriculturalImplementHeightPercentageEndIndex!: number;
    private mHarvestUnitSpeedBeginIndex!: number;
    private mHarvestUnitSpeedEndIndex!: number;
    private mStatusGroup1BeginIndex!: number;
    private mStatusGroup1EndIndex!: number;
    private mStatusGroup2BeginIndex!: number;
    private mStatusGroup2EndIndex!: number;
    private mStatusGroup3BeginIndex!: number;
    private mStatusGroup3EndIndex!: number;
    private mLeftSprayNozzleBeginIndex!: number;
    private mLeftSprayNozzleEndIndex!: number;
    private mRightSprayNozzleBeginIndex!: number;
    private mRightSprayNozzleEndIndex!: number;

    // Novos índices para Protocolo 3.6.0
    private mElevatorConveyorBeltHourMeterBeginIndex!: number;
    private mElevatorConveyorBeltHourMeterEndIndex!: number;
    private mAutoPilotHourMeterBeginIndex!: number;
    private mAutoPilotHourMeterEndIndex!: number;
    private mCaneBaseCutPressureBeginIndex!: number;
    private mCaneBaseCutPressureEndIndex!: number;
    private mCaneChipperPressureBeginIndex!: number;
    private mCaneChipperPressureEndIndex!: number;
    private mCaneBaseCutHeightBeginIndex!: number;
    private mCaneBaseCutHeightEndIndex!: number;
    private mPrimaryExtractorSpeedBeginIndex!: number;
    private mPrimaryExtractorSpeedEndIndex!: number;

    // Índice do Checksum ajustado
    private mCheckSumIndex!: number;


    constructor(encodedData: string) {
        this.encodedData = encodedData;
        this.onInitIndices(); // Calcula os índices ao criar a instância
    }

    // --- Cálculo dos Índices ---
    private onInitIndices(offset: number = 0): void {
        // Protocolo 3.6.0 introduz o byte de versão no início
        this.mVersionByteBeginIndex = offset;
        this.mVersionByteEndIndex = offset += VERSION_BYTE_LEN; // Avança o offset após ler a versão

        // Calcula os índices dos campos "herdados", começando APÓS o byte de versão
        this.mEngineBeginIndex = offset; // Começa do novo offset
        this.mEngineEndIndex = this.mLatitudeBeginIndex = offset += ENGINE_LEN;
        this.mLatitudeEndIndex = this.mLongitudeBeginIndex = offset += LATITUDE_LEN;
        this.mLongitudeEndIndex = this.mCompassBeginIndex = offset += LONGITUDE_LEN;
        this.mCompassEndIndex = this.mBatteryBeginIndex = offset += COMPASS_LEN;
        this.mBatteryEndIndex = this.mHourMeterBeginIndex = offset += BATTERY_LEN;
        this.mHourMeterEndIndex = this.mTotalFuelBeginIndex = offset += TOTAL_HOUR_METER_LEN;
        this.mTotalFuelEndIndex = this.mOdometerBeginIndex = offset += TOTAL_FUEL_LEN;
        this.mOdometerEndIndex = this.mSpeedBeginIndex = offset += ODOMETER_LEN;
        this.mSpeedEndIndex = this.mRPMBeginIndex = offset += SPEED_LEN;
        this.mRPMEndIndex = this.mAcceleratorPedalBeginIndex = offset += RPM_LEN;
        this.mAcceleratorPedalEndIndex = this.mEngineTorqueBeginIndex = offset += ACCELERATOR_PEDAL_LEN;
        this.mEngineTorqueEndIndex = this.mEngineLoadBeginIndex = offset += ENGINE_TORQUE_LEN;
        this.mEngineLoadEndIndex = this.mTurboPressureBeginIndex = offset += ENGINE_LOAD_LEN;
        this.mTurboPressureEndIndex = this.mAdmissionValveAirPressureBeginIndex = offset += TURBO_PRESSURE_LEN;
        this.mAdmissionValveAirPressureEndIndex = this.mEngineOilPressureBeginIndex = offset += ADMISSION_VALVE_AIR_PRESSURE_LEN;
        this.mEngineOilPressureEndIndex = this.mTransmissionOilPressureBeginIndex = offset += ENGINE_OIL_PRESSURE_LEN;
        this.mTransmissionOilPressureEndIndex = this.mFuelPressureBeginIndex = offset += TRANSMISSION_OIL_PRESSURE_LEN;
        this.mFuelPressureEndIndex = this.mEngineOilTemperatureBeginIndex = offset += FUEL_PRESSURE_LEN;
        this.mEngineOilTemperatureEndIndex = this.mEngineWaterTemperatureBeginIndex = offset += ENGINE_OIL_TEMPERATURE_LEN;
        this.mEngineWaterTemperatureEndIndex = this.mEngineAdmissionAirTemperatureBeginIndex = offset += ENGINE_WATER_TEMPERATURE_LEN;
        this.mEngineAdmissionAirTemperatureEndIndex = this.mEnvironmentAirTemperatureBeginIndex = offset += ENGINE_ADMISSION_AIR_TEMPERATURE_LEN;
        this.mEnvironmentAirTemperatureEndIndex = this.mTransmissionOilTemperatureBeginIndex = offset += ENVIRONMENT_AIR_TEMPERATURE_LEN;
        this.mTransmissionOilTemperatureEndIndex = this.mHydraulicFluidTemperatureBeginIndex = offset += TRANSMISSION_OIL_TEMPERATURE_LEN;
        this.mHydraulicFluidTemperatureEndIndex = this.mFuelTemperatureBeginIndex = offset += HYDRAULIC_FLUID_TEMPERATURE_LEN;
        this.mFuelTemperatureEndIndex = this.mFuelFlowBeginIndex = offset += FUEL_TEMPERATURE_LEN;
        this.mFuelFlowEndIndex = this.mFuelLevelBeginIndex = offset += FUEL_FLOW_LEN;
        this.mFuelLevelEndIndex = this.mTransmissionOilLevelBeginIndex = offset += FUEL_LEVEL_LEN;
        this.mTransmissionOilLevelEndIndex = this.mHydraulicFluidLevelBeginIndex = offset += TRANSMISSION_OIL_LEVEL_LEN;
        this.mHydraulicFluidLevelEndIndex = this.mStatusGroup0BeginIndex = offset += HYDRAULIC_FLUID_LEVEL_LEN;
        this.mStatusGroup0EndIndex = this.mAgriculturalImplementHeightPercentageBeginIndex = offset += STATUS_GROUP0_LEN;
        this.mAgriculturalImplementHeightPercentageEndIndex = this.mHarvestUnitSpeedBeginIndex = offset += AGRICULTURAL_IMPLEMENT_HEIGHT_LEN;
        this.mHarvestUnitSpeedEndIndex = this.mStatusGroup1BeginIndex = offset += HARVEST_UNIT_SPEED_LEN;
        this.mStatusGroup1EndIndex = this.mStatusGroup2BeginIndex = offset += STATUS_GROUP1_LEN;
        this.mStatusGroup2EndIndex = this.mStatusGroup3BeginIndex = offset += STATUS_GROUP2_LEN;
        this.mStatusGroup3EndIndex = this.mLeftSprayNozzleBeginIndex = offset += STATUS_GROUP3_LEN;
        this.mLeftSprayNozzleEndIndex = this.mRightSprayNozzleBeginIndex = offset += LEFT_SPRAY_NOZZLE_LEN;
        this.mRightSprayNozzleEndIndex = offset += RIGHT_SPRAY_NOZZLE_LEN; // Fim da parte do 3.5.0

        // Lógica específica do Protocol360 (continua de onde o 3.5.0 parou)
        this.mElevatorConveyorBeltHourMeterBeginIndex = offset; // Inicia a partir de mRightSprayNozzleEndIndex
        this.mElevatorConveyorBeltHourMeterEndIndex = this.mAutoPilotHourMeterBeginIndex = offset += ELEVATOR_CONVEYOR_BELT_HOUR_METER_LEN;
        this.mAutoPilotHourMeterEndIndex = this.mCaneBaseCutPressureBeginIndex = offset += AUTO_PILOT_HOUR_METER_LEN;
        this.mCaneBaseCutPressureEndIndex = this.mCaneChipperPressureBeginIndex = offset += CANE_BASE_CUT_PRESSURE_LEN;
        this.mCaneChipperPressureEndIndex = this.mCaneBaseCutHeightBeginIndex = offset += CANE_CHIPPER_PRESSURE_LEN;
        this.mCaneBaseCutHeightEndIndex = this.mPrimaryExtractorSpeedBeginIndex = offset += CANE_BASE_CUT_HEIGHT_LEN;
        this.mPrimaryExtractorSpeedEndIndex = offset += PRIMARY_EXTRACTOR_SPEED_LEN;

        // O checksum vem depois dos dados reservados
        this.mCheckSumIndex = offset + RESERVED_LEN;
    }

    // --- Implementação dos Métodos da Interface ---

    // Sobrescreve para ler do byte de versão
    public decodeFirmwareVersion(): number {
        const result = this.encodedData.substring(this.mVersionByteBeginIndex, this.mVersionByteEndIndex);
        const versionByte = parseInt(result, RADIX);
        // FW está nos 4 bits superiores (0b11110000)
        return (versionByte >> 4) & 0x0F;
    }

    // Sobrescreve para ler do byte de versão
    public decodeProtocolVersion(): number {
        const result = this.encodedData.substring(this.mVersionByteBeginIndex, this.mVersionByteEndIndex);
        const versionByte = parseInt(result, RADIX);
         // Protocolo está nos 4 bits inferiores (0b00001111)
        return versionByte & 0x0F;
    }

    // --- Métodos herdados (a lógica interna é a mesma, mas usam os índices recalculados) ---
    // (Copie as implementações de Protocol350.ts para todos os métodos decode... que ainda existem aqui)
    public decodeEngineStatus(): boolean {
        const result = this.encodedData.substring(this.mEngineBeginIndex, this.mEngineEndIndex);
        const byte1 = parseInt(result, RADIX);
        const tmp = (byte1 & 2) >> 1; // Bit 1
        return tmp === ON;
    }

    public decodeIgnitionStatus(): boolean {
        const result = this.encodedData.substring(this.mEngineBeginIndex, this.mEngineEndIndex);
        const byte1 = parseInt(result, RADIX);
        const tmp = (byte1 & 1); // Bit 0
        return tmp === ON;
    }

     public decodeGpsStatus(): boolean {
        const result = this.encodedData.substring(this.mEngineBeginIndex, this.mEngineEndIndex);
        const byte1 = parseInt(result, RADIX);
        const tmp = (byte1 & 4) >> 2; // Bit 2
        return tmp === ON;
    }

    public decodeLatitude(): number | null {
        const result = this.encodedData.substring(this.mLatitudeBeginIndex, this.mLatitudeEndIndex);
        if (isNotAvailable(result)) return null;
        const recLat = parseInt(result, RADIX);
        const signedLat = recLat > 0x7FFFFFFF ? recLat - 0xFFFFFFFF - 1 : recLat;
        return signedLat * LAT_LONG_BASE;
    }

     public decodeLongitude(): number | null {
        const result = this.encodedData.substring(this.mLongitudeBeginIndex, this.mLongitudeEndIndex);
        if (isNotAvailable(result)) return null;
        const recLon = parseInt(result, RADIX);
        const signedLon = recLon > 0x7FFFFFFF ? recLon - 0xFFFFFFFF - 1 : recLon;
        return signedLon * LAT_LONG_BASE;
    }

    public decodeCompass(): number | null {
        const result = this.encodedData.substring(this.mCompassBeginIndex, this.mCompassEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX);
    }

    public decodeBattery(): number | null {
        const result = this.encodedData.substring(this.mBatteryBeginIndex, this.mBatteryEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.05;
    }

    public decodeHourMeter(): number | null {
        const result = this.encodedData.substring(this.mHourMeterBeginIndex, this.mHourMeterEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.05;
    }

    public decodeTotalFuelUsage(): number | null {
        const result = this.encodedData.substring(this.mTotalFuelBeginIndex, this.mTotalFuelEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.05;
    }

    public decodeOdometer(): number | null {
        const result = this.encodedData.substring(this.mOdometerBeginIndex, this.mOdometerEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.125;
    }

     public decodeSpeed(): number | null {
        const result = this.encodedData.substring(this.mSpeedBeginIndex, this.mSpeedEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX);
    }

    public decodeRPM(): number | null {
        const result = this.encodedData.substring(this.mRPMBeginIndex, this.mRPMEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.125;
    }

     public decodeAcceleratorPedal(): number | null {
        const result = this.encodedData.substring(this.mAcceleratorPedalBeginIndex, this.mAcceleratorPedalEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.4;
    }

     public decodeEngineTorque(): number | null {
        const result = this.encodedData.substring(this.mEngineTorqueBeginIndex, this.mEngineTorqueEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) - 125;
    }

    public decodeEngineLoad(): number | null {
        const result = this.encodedData.substring(this.mEngineLoadBeginIndex, this.mEngineLoadEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.4;
    }

     public decodeTurboPressure(): number | null {
        const result = this.encodedData.substring(this.mTurboPressureBeginIndex, this.mTurboPressureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.05;
    }

    public decodeAdmissionValveAirPressure(): number | null {
        const result = this.encodedData.substring(this.mAdmissionValveAirPressureBeginIndex, this.mAdmissionValveAirPressureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.05;
    }

    public decodeEngineOilPressure(): number | null {
        const result = this.encodedData.substring(this.mEngineOilPressureBeginIndex, this.mEngineOilPressureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 4;
    }

    public decodeTransmissionOilPressure(): number | null {
        const result = this.encodedData.substring(this.mTransmissionOilPressureBeginIndex, this.mTransmissionOilPressureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 16;
    }

    public decodeFuelPressure(): number | null {
        const result = this.encodedData.substring(this.mFuelPressureBeginIndex, this.mFuelPressureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 4;
    }

    public decodeEngineOilTemperature(): number | null {
        const result = this.encodedData.substring(this.mEngineOilTemperatureBeginIndex, this.mEngineOilTemperatureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.03125;
    }

    public decodeEngineWaterTemperature(): number | null {
        const result = this.encodedData.substring(this.mEngineWaterTemperatureBeginIndex, this.mEngineWaterTemperatureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) - 40;
    }

    public decodeEngineAdmissionAirTemperature(): number | null {
        const result = this.encodedData.substring(this.mEngineAdmissionAirTemperatureBeginIndex, this.mEngineAdmissionAirTemperatureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) - 40;
    }

    public decodeEnvironmentAirTemperature(): number | null {
        const result = this.encodedData.substring(this.mEnvironmentAirTemperatureBeginIndex, this.mEnvironmentAirTemperatureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) - 40;
    }

    public decodeTransmissionOilTemperature(): number | null {
        const result = this.encodedData.substring(this.mTransmissionOilTemperatureBeginIndex, this.mTransmissionOilTemperatureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.03125 - 273;
    }

     public decodeHydraulicFluidTemperature(): number | null {
        const result = this.encodedData.substring(this.mHydraulicFluidTemperatureBeginIndex, this.mHydraulicFluidTemperatureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) - 40;
    }

    public decodeFuelTemperature(): number | null {
        const result = this.encodedData.substring(this.mFuelTemperatureBeginIndex, this.mFuelTemperatureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) - 40;
    }

    public decodeFuelFlow(): number | null {
        const result = this.encodedData.substring(this.mFuelFlowBeginIndex, this.mFuelFlowEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.05;
    }

    public decodeFuelLevel(): number | null {
        const result = this.encodedData.substring(this.mFuelLevelBeginIndex, this.mFuelLevelEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.4;
    }

    public decodeTransmissionOilLevel(): number | null {
        const result = this.encodedData.substring(this.mTransmissionOilLevelBeginIndex, this.mTransmissionOilLevelEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.4;
    }

    public decodeHydraulicFluidLevel(): number | null {
        const result = this.encodedData.substring(this.mHydraulicFluidLevelBeginIndex, this.mHydraulicFluidLevelEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.4;
    }

    // --- Métodos de Status (Grupo 0) ---
    private decodeStatusGroup0Byte(): number | null {
        const result = this.encodedData.substring(this.mStatusGroup0BeginIndex, this.mStatusGroup0EndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX);
    }
    public decodeFailureCodeStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup0Byte(); if (byte1 === null) return null;
        switch (byte1 & 3) { case OFF: return false; case ON: return true; default: return null; }
    }
    public decodeRadiatorPropellerStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup0Byte(); if (byte1 === null) return null;
        switch ((byte1 & 12) >> 2) { case OFF: return false; case ON: return true; default: return null; }
    }
    public decodeSugarCaneElevatorStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup0Byte(); if (byte1 === null) return null;
        switch ((byte1 & 48) >> 4) { case OFF: return false; case ON: return true; default: return null; }
    }
    public decodeSugarCaneBaseCutStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup0Byte(); if (byte1 === null) return null;
        switch ((byte1 & 192) >> 6) { case OFF: return false; case ON: return true; default: return null; }
    }

    // --- Continuação dos Analógicos ---
    public decodeAgriculturalImplementHeightPercentage(): number | null {
        const result = this.encodedData.substring(this.mAgriculturalImplementHeightPercentageBeginIndex, this.mAgriculturalImplementHeightPercentageEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.05;
    }
    public decodeHarvestUnitSpeed(): number | null {
        const result = this.encodedData.substring(this.mHarvestUnitSpeedBeginIndex, this.mHarvestUnitSpeedEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX);
    }

    // --- Métodos de Status (Grupo 1) ---
    private decodeStatusGroup1Byte(): number | null {
        const result = this.encodedData.substring(this.mStatusGroup1BeginIndex, this.mStatusGroup1EndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX);
    }
    public decodePowerTakeOffStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup1Byte(); if (byte1 === null) return null;
        switch (byte1 & 3) { case OFF: return false; case ON: return true; default: return null; }
    }
    public decodeRtkPilotStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup1Byte(); if (byte1 === null) return null;
        switch ((byte1 & 12) >> 2) { case OFF: return false; case ON: return true; default: return null; }
    }
    public decodeIndustryStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup1Byte(); if (byte1 === null) return null;
        switch ((byte1 & 48) >> 4) { case OFF: return false; case ON: return true; default: return null; }
    }
    public decodeGrainDischargeStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup1Byte(); if (byte1 === null) return null;
        switch ((byte1 & 192) >> 6) { case OFF: return false; case ON: return true; default: return null; }
    }

    // --- Métodos de Status (Grupo 2) ---
    private decodeStatusGroup2Byte(): number | null {
        const result = this.encodedData.substring(this.mStatusGroup2BeginIndex, this.mStatusGroup2EndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX);
    }
    public decodeHarvestUnitStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup2Byte(); if (byte1 === null) return null;
        switch (byte1 & 3) { case OFF: return false; case ON: return true; default: return null; }
    }
    public decodePlatformStatus(): PlatformStatus | null {
        const byte1 = this.decodeStatusGroup2Byte(); if (byte1 === null) return null;
        const tmp = (byte1 & 12) >> 2;
        if (tmp === PLATFORM_STATUS_OFF || tmp === PLATFORM_STATUS_GOING_DOWN || tmp === PLATFORM_STATUS_GOING_UP) return tmp;
        return null;
    }
    public decodePackingCottonProcessStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup2Byte(); if (byte1 === null) return null;
        switch ((byte1 & 48) >> 4) { case OFF: return false; case ON: return true; default: return null; }
    }
    public decodeWaterPumpStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup2Byte(); if (byte1 === null) return null;
        switch ((byte1 & 192) >> 6) { case OFF: return false; case ON: return true; default: return null; }
    }

    // --- Métodos de Status (Grupo 3) ---
    private decodeStatusGroup3Byte(): number | null {
        const result = this.encodedData.substring(this.mStatusGroup3BeginIndex, this.mStatusGroup3EndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX);
    }
    public decodeSprayApplicationMode(): SprayApplicationMode | null {
        const byte1 = this.decodeStatusGroup3Byte(); if (byte1 === null) return null;
        const tmp = byte1 & 3;
        if (tmp === SPRAY_APPLICATION_MODE_MANUAL || tmp === SPRAY_APPLICATION_MODE_TAXA1 || tmp === SPRAY_APPLICATION_MODE_TAXA2) return tmp;
        return null;
    }
    public decodeSprayLiquidReleaseStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup3Byte(); if (byte1 === null) return null;
        switch ((byte1 & 12) >> 2) { case OFF: return false; case ON: return true; default: return null; }
    }
    public decodeSugarCanePrimaryExtractorStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup3Byte(); if (byte1 === null) return null;
        switch ((byte1 & 48) >> 4) { case OFF: return false; case ON: return true; default: return null; }
    }
    public decodeSugarCaneSecondaryExtractorStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup3Byte(); if (byte1 === null) return null;
        switch ((byte1 & 192) >> 6) { case OFF: return false; case ON: return true; default: return null; }
    }

    // --- Métodos de Status (Bicos Pulverizadores - Esquerda) ---
    private decodeLeftSprayNozzleByte(): number | null {
        const result = this.encodedData.substring(this.mLeftSprayNozzleBeginIndex, this.mLeftSprayNozzleEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX);
    }
    public decodeCentralSprayNozzleStatus(): boolean | null {
        const byte1 = this.decodeLeftSprayNozzleByte(); if (byte1 === null) return null;
        switch (byte1 & 3) { case OFF: return false; case ON: return true; default: return null; }
    }
    public decodeLeftSprayNozzle1Status(): boolean | null {
        const byte1 = this.decodeLeftSprayNozzleByte(); if (byte1 === null) return null;
        switch ((byte1 & 12) >> 2) { case OFF: return false; case ON: return true; default: return null; }
    }
    public decodeLeftSprayNozzle2Status(): boolean | null {
        const byte1 = this.decodeLeftSprayNozzleByte(); if (byte1 === null) return null;
        switch ((byte1 & 48) >> 4) { case OFF: return false; case ON: return true; default: return null; }
    }
    public decodeLeftSprayNozzle3Status(): boolean | null {
        const byte1 = this.decodeLeftSprayNozzleByte(); if (byte1 === null) return null;
        switch ((byte1 & 192) >> 6) { case OFF: return false; case ON: return true; default: return null; }
    }

    // --- Métodos de Status (Bicos Pulverizadores - Direita) ---
    private decodeRightSprayNozzleByte(): number | null {
        const result = this.encodedData.substring(this.mRightSprayNozzleBeginIndex, this.mRightSprayNozzleEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX);
    }
     public decodeRightSprayNozzle1Status(): boolean | null {
        const byte1 = this.decodeRightSprayNozzleByte(); if (byte1 === null) return null;
        switch (byte1 & 3) { case OFF: return false; case ON: return true; default: return null; }
    }
    public decodeRightSprayNozzle2Status(): boolean | null {
        const byte1 = this.decodeRightSprayNozzleByte(); if (byte1 === null) return null;
        switch ((byte1 & 12) >> 2) { case OFF: return false; case ON: return true; default: return null; }
    }
    public decodeRightSprayNozzle3Status(): boolean | null {
        const byte1 = this.decodeRightSprayNozzleByte(); if (byte1 === null) return null;
        switch ((byte1 & 48) >> 4) { case OFF: return false; case ON: return true; default: return null; }
    }

    // --- NOVOS Métodos para Protocolo 3.6.0 ---

    public decodeElevatorConveyorBeltHourMeter(): number | null {
        const result = this.encodedData.substring(this.mElevatorConveyorBeltHourMeterBeginIndex, this.mElevatorConveyorBeltHourMeterEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            // Java: return Long.valueOf(result, RADIX) * 0.05D;
            return parseInt(result, RADIX) * 0.05;
        }
    }

    public decodeAutoPilotHourMeter(): number | null {
         const result = this.encodedData.substring(this.mAutoPilotHourMeterBeginIndex, this.mAutoPilotHourMeterEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            // Java: return Long.valueOf(result, RADIX) * 0.05D;
            return parseInt(result, RADIX) * 0.05;
        }
    }

    public decodeCaneBaseCutPressure(): number | null {
        const result = this.encodedData.substring(this.mCaneBaseCutPressureBeginIndex, this.mCaneBaseCutPressureEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            // Java: return Long.valueOf(result, RADIX) * 0.05D; (BAR)
            return parseInt(result, RADIX) * 0.05;
        }
    }

    public decodeCaneChipperPressure(): number | null {
         const result = this.encodedData.substring(this.mCaneChipperPressureBeginIndex, this.mCaneChipperPressureEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            // Java: return Long.valueOf(result, RADIX) * 0.05D; (BAR)
            return parseInt(result, RADIX) * 0.05;
        }
    }

    public decodeCaneBaseCutHeight(): number | null {
        const result = this.encodedData.substring(this.mCaneBaseCutHeightBeginIndex, this.mCaneBaseCutHeightEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
             // Java: return Integer.valueOf(result, RADIX); (Altura direta)
            return parseInt(result, RADIX);
        }
    }

    public decodePrimaryExtractorSpeed(): number | null {
        const result = this.encodedData.substring(this.mPrimaryExtractorSpeedBeginIndex, this.mPrimaryExtractorSpeedEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            // Java: return Long.valueOf(result, RADIX) * 0.125D; (RPM)
            return parseInt(result, RADIX) * 0.125;
        }
    }

     // --- Métodos NÃO DISPONÍVEIS no Protocolo 3.6.0 ---
    public decodeLeftSprayNozzle4Status(): boolean | null { return null; }
    public decodeRightSprayNozzle4Status(): boolean | null { return null; }
    public decodeConveyorPlanterStatus(): boolean | null { return null; }


    // --- Métodos de Validação e Informação ---

    public checkSum(): number {
        // A lógica do Java 3.6.0 ajusta o mCheckSumIndex para depois do RESERVED_LEN
        const result = this.encodedData.substring(this.mCheckSumIndex);
        try {
          // O checksum tem 2 caracteres hex (1 byte)
          return parseInt(result.substring(0, 2), RADIX);
        } catch(e) {
          console.error("Erro ao decodificar checksum (3.6.0):", e, "Substring completa:", result);
          return -1;
        }
    }

    public isTelematicsAvailable(): boolean {
        // Protocolo 3.6.0 tem telemetria
        return true;
    }

    public deviceVersion(): string {
       return "v3.6";
    }

    /**
     * Verifica se o comprimento da string de dados é compatível E se a versão do protocolo bate.
     * @param encodedDataLength Comprimento da string hexadecimal limpa.
     * @returns True se for compatível com Protocolo 3.6.0, false caso contrário.
     */
     public isValidProtocol(encodedDataLength: number): boolean {
        // Java: return encodedDataLength >= ENCODED_DATA_LENGTH && decodeProtocolVersion() == PROTOCOL_VERSION;
        // Precisamos garantir que temos o byte de versão para ler antes de chamar decodeProtocolVersion
        if (encodedDataLength < VERSION_BYTE_LEN) {
            return false;
        }
        // Tentamos ler a versão do protocolo diretamente da string
        const versionByteHex = this.encodedData.substring(this.mVersionByteBeginIndex, this.mVersionByteEndIndex);
        const versionByte = parseInt(versionByteHex, RADIX);
        const protocolVersionFromData = versionByte & 0x0F;

        // Verifica se o comprimento é o esperado E se a versão do protocolo lida é 2
        return encodedDataLength === BluechipDataDecoderImplProtocol360.ENCODED_DATA_LENGTH &&
               protocolVersionFromData === BluechipDataDecoderImplProtocol360.PROTOCOL_VERSION;

        // Alternativa (mais próxima do Java, mas chama decodeProtocolVersion que já lê o byte):
        // return encodedDataLength >= BluechipDataDecoderImplProtocol360.ENCODED_DATA_LENGTH &&
        //       this.decodeProtocolVersion() === BluechipDataDecoderImplProtocol360.PROTOCOL_VERSION;
     }
}