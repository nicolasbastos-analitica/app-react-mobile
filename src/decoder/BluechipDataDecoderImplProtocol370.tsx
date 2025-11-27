// decoders/Protocol370.ts

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

// --- Constantes de Comprimento (Redefinidas para clareza, incluindo "herdadas") ---
// Herdadas de 3.4.0
const ENGINE_LEN = 2;
const LATITUDE_LEN = 8;
const LONGITUDE_LEN = 8;
const COMPASS_LEN = 4;
const BATTERY_LEN = 4;
// Herdadas de 3.5.0
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
// Herdadas de 3.6.0
const VERSION_BYTE_LEN = 2;
const ELEVATOR_CONVEYOR_BELT_HOUR_METER_LEN = 8;
const AUTO_PILOT_HOUR_METER_LEN = 8;
const CANE_BASE_CUT_PRESSURE_LEN = 4;
const CANE_CHIPPER_PRESSURE_LEN = 4;
const CANE_BASE_CUT_HEIGHT_LEN = 4;
const PRIMARY_EXTRACTOR_SPEED_LEN = 4;
const RESERVED_LEN = 16; // Usado no cálculo do checksum index
// Novas constantes para 3.7.0
const SPRAY_NOZZLE_FOUR_LEN = 2;


export class BluechipDataDecoderImplProtocol370 implements IBluechipDataDecoder {

    // --- Constantes Estáticas da Classe ---
    private static readonly PROTOCOL_VERSION: number = 3;
    // O comprimento total não muda em relação ao 3.6.0 no Java (ENCODED_DATA_LENGTH = 170)
    // porque o novo campo SPRAY_NOZZLE_FOUR_LEN (2)
    // subtrai do RESERVED_LEN (16 -> 14 implícito) no cálculo do checksum.
    // Para validação na factory, podemos usar >= 170 ou verificar a versão exata.
    public static readonly MIN_ENCODED_DATA_LENGTH: number = 170; // Comprimento mínimo esperado


    // --- Propriedades da Instância ---
    public readonly encodedData: string; // String hexadecimal limpa

    // Índices calculados no construtor (inclui todos das versões anteriores + novos)
    private mVersionByteBeginIndex!: number;
    private mVersionByteEndIndex!: number;
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

    // Novos índices para 3.7.0
    private mSprayNozzle4BeginIndex!: number;
    private mSprayNozzle4EndIndex!: number;

    // Índice do Checksum ajustado
    private mCheckSumIndex!: number;


    constructor(encodedData: string) {
        this.encodedData = encodedData;
        this.onInitIndices(); // Calcula os índices ao criar a instância
    }

    // --- Cálculo dos Índices ---
    private onInitIndices(offset: number = 0): void {
        // Leitura do byte de versão (igual ao 3.6.0)
        this.mVersionByteBeginIndex = offset;
        this.mVersionByteEndIndex = offset += VERSION_BYTE_LEN;

        // Índices "herdados" (até 3.5.0) - Calculados após o byte de versão
        this.mEngineBeginIndex = offset;
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

        // Índices "herdados" de 3.6.0
        this.mElevatorConveyorBeltHourMeterBeginIndex = offset; // Inicia a partir de mRightSprayNozzleEndIndex
        this.mElevatorConveyorBeltHourMeterEndIndex = this.mAutoPilotHourMeterBeginIndex = offset += ELEVATOR_CONVEYOR_BELT_HOUR_METER_LEN;
        this.mAutoPilotHourMeterEndIndex = this.mCaneBaseCutPressureBeginIndex = offset += AUTO_PILOT_HOUR_METER_LEN;
        this.mCaneBaseCutPressureEndIndex = this.mCaneChipperPressureBeginIndex = offset += CANE_BASE_CUT_PRESSURE_LEN;
        this.mCaneChipperPressureEndIndex = this.mCaneBaseCutHeightBeginIndex = offset += CANE_CHIPPER_PRESSURE_LEN;
        this.mCaneBaseCutHeightEndIndex = this.mPrimaryExtractorSpeedBeginIndex = offset += CANE_BASE_CUT_HEIGHT_LEN;
        this.mPrimaryExtractorSpeedEndIndex = offset += PRIMARY_EXTRACTOR_SPEED_LEN; // Fim da parte do 3.6.0

        // Lógica específica do Protocol370 (continua de onde o 3.6.0 parou)
        this.mSprayNozzle4BeginIndex = offset; // Inicia a partir de mPrimaryExtractorSpeedEndIndex
        this.mSprayNozzle4EndIndex = offset += SPRAY_NOZZLE_FOUR_LEN;

        // O checksum vem depois do espaço reservado.
        // O RESERVED_LEN do 3.6.0 era 16. O 3.7.0 adicionou SPRAY_NOZZLE_FOUR_LEN (2).
        // A lógica do Java `mCheckSumIndex = offset + RESERVED_LEN` (onde offset já inclui SPRAY_NOZZLE_FOUR_LEN)
        // sugere que o RESERVED_LEN aqui deveria ser o espaço *restante* após o último campo (SprayNozzle4).
        // Se o tamanho total é 170 (340 chars), e o offset atual é mSprayNozzle4EndIndex, então o checksum
        // começa em (170*2) - 2 = 338.
        // Verifiquemos o cálculo do Java 370: offset (após nozzle 4) + RESERVED_LEN (16) = mCheckSumIndex.
        // Isso parece incorreto se RESERVED_LEN ainda for 16.
        // Vamos recalcular o espaço reservado implícito:
        // Tamanho total (170 chars = 340) - offset atual (mSprayNozzle4EndIndex) - checksum (2 chars)
        // const remainingReservedLen = BluechipDataDecoderImplProtocol370.ENCODED_DATA_LENGTH * 2 - offset - 2;
        // this.mCheckSumIndex = offset + remainingReservedLen;
        // Seguindo a lógica exata do Java 370:
        this.mCheckSumIndex = offset + RESERVED_LEN; // Pode precisar de ajuste se RESERVED_LEN for dinâmico

    }

    // --- Implementação dos Métodos da Interface ---

    // Sobrescreve para ler do byte de versão
    public decodeFirmwareVersion(): number {
        const result = this.encodedData.substring(this.mVersionByteBeginIndex, this.mVersionByteEndIndex);
        const versionByte = parseInt(result, RADIX);
        return (versionByte >> 4) & 0x0F;
    }

    // Sobrescreve para ler do byte de versão
    public decodeProtocolVersion(): number {
        const result = this.encodedData.substring(this.mVersionByteBeginIndex, this.mVersionByteEndIndex);
        const versionByte = parseInt(result, RADIX);
        return versionByte & 0x0F;
    }

    // --- Métodos herdados (Copie TODAS as implementações de Protocol360.ts aqui) ---
    // (A lógica interna é a mesma, apenas os índices são diferentes)
    public decodeEngineStatus(): boolean {
        const result = this.encodedData.substring(this.mEngineBeginIndex, this.mEngineEndIndex);
        const byte1 = parseInt(result, RADIX);
        const tmp = (byte1 & 2) >> 1; // Bit 1
        return tmp === ON;
    }
    public decodeIgnitionStatus(): boolean { /* ... */ return false; } // Copiar de 360
    public decodeGpsStatus(): boolean { /* ... */ return false; } // Copiar de 360

    public decodeLatitude(): number | null {
        const result = this.encodedData.substring(this.mLatitudeBeginIndex, this.mLatitudeEndIndex);
        if (isNotAvailable(result)) return null;
        const recLat = parseInt(result, RADIX);
        const signedLat = recLat > 0x7FFFFFFF ? recLat - 0xFFFFFFFF - 1 : recLat;
        return signedLat * LAT_LONG_BASE;
    } // Copiar de 360

    public decodeLongitude(): number | null { /* ... */ return null; } // Copiar de 360

    public decodeCompass(): number | null { /* ... */ return null; } // Copiar de 360

    public decodeBattery(): number | null {
        const result = this.encodedData.substring(this.mBatteryBeginIndex, this.mBatteryEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.05;
    } // Copiar de 360

    public decodeHourMeter(): number | null { /* ... */ return null; } // Copiar de 360

    public decodeTotalFuelUsage(): number | null { /* ... */ return null; } // Copiar de 360

    public decodeOdometer(): number | null {
        const result = this.encodedData.substring(this.mOdometerBeginIndex, this.mOdometerEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            const value = parseInt(result, RADIX);
            return value;
        }
    } // Copiar de 360

    public decodeSpeed(): number | null {
        const result = this.encodedData.substring(this.mSpeedBeginIndex, this.mSpeedEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            const value = parseInt(result, RADIX);
            return value;
        }
    }

    public decodeRPM(): number | null {
        const result = this.encodedData.substring(this.mRPMBeginIndex, this.mRPMEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.125;
    } // Copiar de 360

    public decodeAcceleratorPedal(): number | null {
        const result = this.encodedData.substring(this.mAcceleratorPedalBeginIndex, this.mAcceleratorPedalEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.4;
    } // Copiar de 360

    public decodeEngineTorque(): number | null {
        const result = this.encodedData.substring(this.mEngineTorqueBeginIndex, this.mEngineTorqueEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) - 125;
    } // Copiar de 360

    public decodeEngineLoad(): number | null {
        const result = this.encodedData.substring(this.mEngineLoadBeginIndex, this.mEngineLoadEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.4;
    } // Copiar de 360

    public decodeTurboPressure(): number | null {
        const result = this.encodedData.substring(this.mTurboPressureBeginIndex, this.mTurboPressureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.05;
    } // Copiar de 360

    public decodeAdmissionValveAirPressure(): number | null {
        const result = this.encodedData.substring(this.mAdmissionValveAirPressureBeginIndex, this.mAdmissionValveAirPressureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.05;
    } // Copiar de 360

    public decodeEngineOilPressure(): number | null {
        const result = this.encodedData.substring(this.mEngineOilPressureBeginIndex, this.mEngineOilPressureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 4;
    } // Copiar de 360

    public decodeTransmissionOilPressure(): number | null {
        const result = this.encodedData.substring(this.mTransmissionOilPressureBeginIndex, this.mTransmissionOilPressureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 16;
    } // Copiar de 360

    public decodeFuelPressure(): number | null {
        const result = this.encodedData.substring(this.mFuelPressureBeginIndex, this.mFuelPressureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 4;
    } // Copiar de 360

    public decodeEngineOilTemperature(): number | null {
        const result = this.encodedData.substring(this.mEngineOilTemperatureBeginIndex, this.mEngineOilTemperatureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.03125;
    } // Copiar de 360

    public decodeEngineWaterTemperature(): number | null {
        const result = this.encodedData.substring(this.mEngineWaterTemperatureBeginIndex, this.mEngineWaterTemperatureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) - 40;
    } // Copiar de 360

    public decodeEngineAdmissionAirTemperature(): number | null {
        const result = this.encodedData.substring(this.mEngineAdmissionAirTemperatureBeginIndex, this.mEngineAdmissionAirTemperatureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) - 40;
    } // Copiar de 360

    public decodeEnvironmentAirTemperature(): number | null {
        const result = this.encodedData.substring(this.mEnvironmentAirTemperatureBeginIndex, this.mEnvironmentAirTemperatureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) - 40;
    } // Copiar de 360

    public decodeTransmissionOilTemperature(): number | null {
        const result = this.encodedData.substring(this.mTransmissionOilTemperatureBeginIndex, this.mTransmissionOilTemperatureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.03125 - 273;
    } // Copiar de 360

    public decodeHydraulicFluidTemperature(): number | null { 
        const result = this.encodedData.substring(this.mHydraulicFluidTemperatureBeginIndex, this.mHydraulicFluidTemperatureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) - 40;
     } // Copiar de 360

    public decodeFuelTemperature(): number | null { 
        const result = this.encodedData.substring(this.mFuelTemperatureBeginIndex, this.mFuelTemperatureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) - 40;
     } // Copiar de 360

    public decodeFuelFlow(): number | null { 
        const result = this.encodedData.substring(this.mFuelFlowBeginIndex, this.mFuelFlowEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.05;
    } // Copiar de 360
    public decodeFuelLevel(): number | null { 
         const result = this.encodedData.substring(this.mFuelLevelBeginIndex, this.mFuelLevelEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.4;
     } // Copiar de 360

 public decodeTransmissionOilLevel(): number | null {
        const result = this.encodedData.substring(this.mTransmissionOilLevelBeginIndex, this.mTransmissionOilLevelEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.4;
    }

    public decodeHydraulicFluidLevel(): number | null {
        const result = this.encodedData.substring(this.mHydraulicFluidLevelBeginIndex, this.mHydraulicFluidLevelEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.4;
    }

    // Grupo 0 Helper (já deve existir ou copie também)
    private decodeStatusGroup0Byte(): number | null { const result = this.encodedData.substring(this.mStatusGroup0BeginIndex, this.mStatusGroup0EndIndex); return isNotAvailable(result) ? null : parseInt(result, RADIX); }
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

    public decodeAgriculturalImplementHeightPercentage(): number | null {
        const result = this.encodedData.substring(this.mAgriculturalImplementHeightPercentageBeginIndex, this.mAgriculturalImplementHeightPercentageEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.05;
    }

    public decodeHarvestUnitSpeed(): number | null {
        const result = this.encodedData.substring(this.mHarvestUnitSpeedBeginIndex, this.mHarvestUnitSpeedEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX);
    }

    // Grupo 1 Helper (já deve existir ou copie também)
    private decodeStatusGroup1Byte(): number | null { const result = this.encodedData.substring(this.mStatusGroup1BeginIndex, this.mStatusGroup1EndIndex); return isNotAvailable(result) ? null : parseInt(result, RADIX); }
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

    // Grupo 2 Helper (já deve existir ou copie também)
    private decodeStatusGroup2Byte(): number | null { const result = this.encodedData.substring(this.mStatusGroup2BeginIndex, this.mStatusGroup2EndIndex); return isNotAvailable(result) ? null : parseInt(result, RADIX); }
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

    // Grupo 3 Helper (já deve existir ou copie também)
    private decodeStatusGroup3Byte(): number | null { const result = this.encodedData.substring(this.mStatusGroup3BeginIndex, this.mStatusGroup3EndIndex); return isNotAvailable(result) ? null : parseInt(result, RADIX); }
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

    // Bicos Esquerda Helper (já deve existir ou copie também)
    private decodeLeftSprayNozzleByte(): number | null { const result = this.encodedData.substring(this.mLeftSprayNozzleBeginIndex, this.mLeftSprayNozzleEndIndex); return isNotAvailable(result) ? null : parseInt(result, RADIX); }
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

    // Bicos Direita Helper (já deve existir ou copie também)
    private decodeRightSprayNozzleByte(): number | null { const result = this.encodedData.substring(this.mRightSprayNozzleBeginIndex, this.mRightSprayNozzleEndIndex); return isNotAvailable(result) ? null : parseInt(result, RADIX); }
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

    // Métodos específicos do 3.6.0
    public decodeElevatorConveyorBeltHourMeter(): number | null {
        const result = this.encodedData.substring(this.mElevatorConveyorBeltHourMeterBeginIndex, this.mElevatorConveyorBeltHourMeterEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.05;
    }
    public decodeAutoPilotHourMeter(): number | null {
        const result = this.encodedData.substring(this.mAutoPilotHourMeterBeginIndex, this.mAutoPilotHourMeterEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.05;
    }
    public decodeCaneBaseCutPressure(): number | null {
        const result = this.encodedData.substring(this.mCaneBaseCutPressureBeginIndex, this.mCaneBaseCutPressureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.05;
    }
    public decodeCaneChipperPressure(): number | null {
        const result = this.encodedData.substring(this.mCaneChipperPressureBeginIndex, this.mCaneChipperPressureEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.05;
    }
    public decodeCaneBaseCutHeight(): number | null {
        const result = this.encodedData.substring(this.mCaneBaseCutHeightBeginIndex, this.mCaneBaseCutHeightEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX);
    }
    public decodePrimaryExtractorSpeed(): number | null {
        const result = this.encodedData.substring(this.mPrimaryExtractorSpeedBeginIndex, this.mPrimaryExtractorSpeedEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX) * 0.125;
    }
    // --- NOVOS/Sobrescritos Métodos para Protocolo 3.7.0 ---

    // Decodifica Bico Esquerdo 4 do novo campo '31'
    public decodeLeftSprayNozzle4Status(): boolean | null {
        const result = this.encodedData.substring(this.mSprayNozzle4BeginIndex, this.mSprayNozzle4EndIndex);
        // Não checa isNotAvailable aqui, assume que o byte existe se o protocolo for 3.7+
        const byte1 = parseInt(result, RADIX);
        switch (byte1 & 3) { // Bits 0, 1
            case OFF: return false;
            case ON: return true;
            default: return null;
        }
    }

    // Decodifica Bico Direito 4 do novo campo '31'
    public decodeRightSprayNozzle4Status(): boolean | null {
        const result = this.encodedData.substring(this.mSprayNozzle4BeginIndex, this.mSprayNozzle4EndIndex);
        const byte1 = parseInt(result, RADIX);
        switch ((byte1 & 12) >> 2) { // Bits 2, 3
            case OFF: return false;
            case ON: return true;
            default: return null;
        }
    }

    // Sobrescreve para decodificar "Porta Digital 02" do campo '24', byte 2 (índice mRightSprayNozzleBeginIndex)
    // A implementação Java parece usar o índice antigo, mas a lógica bate com a Porta Digital 02.
    public decodeConveyorPlanterStatus(): boolean | null {
        // ATENÇÃO: O Java usa mRightSprayNozzleBeginIndex.
        // Se a estrutura mudou MUITO no 3.7.2 (como sugere o PDF pág 19), este índice pode estar errado.
        // Seguindo o Java por enquanto.
        const result = this.encodedData.substring(this.mRightSprayNozzleBeginIndex, this.mRightSprayNozzleEndIndex);
        const byte1 = parseInt(result, RADIX);
        switch ((byte1 & 192) >> 6) { // Bits 6, 7 (corresponde a "PORTA DIGITAL 02" no PDF v3.7.2)
            case OFF: return false; // Desligado
            case ON: return true;  // Ligado
            default: return null; // Erro ou Não Avaliado
        }
    }


    // --- Métodos de Validação e Informação ---

    // A lógica do checksum parece ser a mesma do 3.6.0,
    // apenas o índice inicial `mCheckSumIndex` foi recalculado em `onInitIndices`
    public checkSum(): number {
        const result = this.encodedData.substring(this.mCheckSumIndex);
        try {
            // Assume checksum de 1 byte (2 chars hex)
            return parseInt(result.substring(0, 2), RADIX);
        } catch (e) {
            console.error("Erro ao decodificar checksum (3.7.0):", e, "Substring completa:", result);
            return -1;
        }
    }

    public isTelematicsAvailable(): boolean {
        // Protocolo 3.7.0 tem telemetria
        return true;
    }

    public deviceVersion(): string {
        return "v3.7"; // Baseado no nome da classe Java
    }

    /**
     * Verifica se o comprimento da string é compatível E se a versão do protocolo bate.
     * @param encodedDataLength Comprimento da string hexadecimal limpa.
     * @returns True se for compatível com Protocolo 3.7.0, false caso contrário.
     */
    public isValidProtocol(encodedDataLength: number): boolean {
        // Java: return encodedDataLength >= ENCODED_DATA_LENGTH && decodeProtocolVersion() == PROTOCOL_VERSION;
        // ENCODED_DATA_LENGTH (170) é herdado do 360 no Java.
        // Precisamos garantir que temos o byte de versão para ler
        if (encodedDataLength < VERSION_BYTE_LEN) {
            return false;
        }
        // Tentamos ler a versão do protocolo diretamente da string
        const versionByteHex = this.encodedData.substring(this.mVersionByteBeginIndex, this.mVersionByteEndIndex);
        if (isNotAvailable(versionByteHex)) return false; // Adiciona verificação
        const versionByte = parseInt(versionByteHex, RADIX);
        const protocolVersionFromData = versionByte & 0x0F;

        // Use the minimum length defined in this class (370)
        return encodedDataLength >= BluechipDataDecoderImplProtocol370.MIN_ENCODED_DATA_LENGTH &&
            protocolVersionFromData === BluechipDataDecoderImplProtocol370.PROTOCOL_VERSION;
    }
}