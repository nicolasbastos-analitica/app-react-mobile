// decoders/Protocol350.ts

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
    // A função 'all' não precisa ser importada diretamente se só for usada por isNotAvailable
} from './bluechipDecoder.types'; // Ajuste o caminho se necessário

export class BluechipDataDecoderImplProtocol350 implements IBluechipDataDecoder {

    // --- Constantes Estáticas da Classe (Baseado no Java 350 e 340) ---
    private static readonly FIRMWARE_VERSION: number = 1;
    private static readonly PROTOCOL_VERSION: number = 1;
    // Comprimento esperado da string hex limpa para este protocolo
    public static readonly ENCODED_DATA_LENGTH: number = 120;

    // Constantes de Comprimento (Herdadas de 340)
    private static readonly ENGINE_LEN: number = 2;
    private static readonly LATITUDE_LEN: number = 8;
    private static readonly LONGITUDE_LEN: number = 8;
    private static readonly COMPASS_LEN: number = 4;
    private static readonly BATTERY_LEN: number = 4;

    // Constantes de Comprimento (Específicas de 350)
    private static readonly TOTAL_HOUR_METER_LEN = 8;
    private static readonly TOTAL_FUEL_LEN = 8;
    private static readonly ODOMETER_LEN = 8;
    private static readonly SPEED_LEN = 4;
    private static readonly RPM_LEN = 4;
    private static readonly ACCELERATOR_PEDAL_LEN = 2;
    private static readonly ENGINE_TORQUE_LEN = 2;
    private static readonly ENGINE_LOAD_LEN = 2;
    private static readonly TURBO_PRESSURE_LEN = 2; // Java 350 usa 2
    private static readonly ADMISSION_VALVE_AIR_PRESSURE_LEN = 2;
    private static readonly ENGINE_OIL_PRESSURE_LEN = 2;
    private static readonly TRANSMISSION_OIL_PRESSURE_LEN = 2;
    private static readonly FUEL_PRESSURE_LEN = 2;
    private static readonly ENGINE_OIL_TEMPERATURE_LEN = 4;
    private static readonly ENGINE_WATER_TEMPERATURE_LEN = 2;
    private static readonly ENGINE_ADMISSION_AIR_TEMPERATURE_LEN = 2;
    private static readonly ENVIRONMENT_AIR_TEMPERATURE_LEN = 2;
    private static readonly TRANSMISSION_OIL_TEMPERATURE_LEN = 4;
    private static readonly HYDRAULIC_FLUID_TEMPERATURE_LEN = 2;
    private static readonly FUEL_TEMPERATURE_LEN = 2;
    private static readonly FUEL_FLOW_LEN = 4;
    private static readonly FUEL_LEVEL_LEN = 2;
    private static readonly TRANSMISSION_OIL_LEVEL_LEN = 2;
    private static readonly HYDRAULIC_FLUID_LEVEL_LEN = 2;
    private static readonly STATUS_GROUP0_LEN = 2;
    private static readonly AGRICULTURAL_IMPLEMENT_HEIGHT_LEN = 2;
    private static readonly HARVEST_UNIT_SPEED_LEN = 2;
    private static readonly STATUS_GROUP1_LEN = 2;
    private static readonly STATUS_GROUP2_LEN = 2;
    private static readonly STATUS_GROUP3_LEN = 2;
    private static readonly LEFT_SPRAY_NOZZLE_LEN = 2;
    private static readonly RIGHT_SPRAY_NOZZLE_LEN = 2;

    // --- Propriedades da Instância ---
    public readonly encodedData: string; // String hexadecimal limpa

    // Índices calculados no construtor
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
    private mCheckSumIndex!: number;


    constructor(encodedData: string) {
        this.encodedData = encodedData;
        this.onInitIndices(); // Calcula os índices ao criar a instância
    }

    // --- Cálculo dos Índices ---
    private onInitIndices(offset: number = 0): void {
        // Lógica "herdada" do Protocol340
        this.mEngineBeginIndex = offset;
        this.mEngineEndIndex = this.mLatitudeBeginIndex = offset += BluechipDataDecoderImplProtocol350.ENGINE_LEN;
        this.mLatitudeEndIndex = this.mLongitudeBeginIndex = offset += BluechipDataDecoderImplProtocol350.LATITUDE_LEN;
        this.mLongitudeEndIndex = this.mCompassBeginIndex = offset += BluechipDataDecoderImplProtocol350.LONGITUDE_LEN;
        this.mCompassEndIndex = this.mBatteryBeginIndex = offset += BluechipDataDecoderImplProtocol350.COMPASS_LEN;
        this.mBatteryEndIndex = offset += BluechipDataDecoderImplProtocol350.BATTERY_LEN;

        // Lógica específica do Protocol350 (continua de onde o 340 parou)
        this.mHourMeterBeginIndex = offset; // Inicia a partir de mBatteryEndIndex
        this.mHourMeterEndIndex = this.mTotalFuelBeginIndex = offset += BluechipDataDecoderImplProtocol350.TOTAL_HOUR_METER_LEN;
        this.mTotalFuelEndIndex = this.mOdometerBeginIndex = offset += BluechipDataDecoderImplProtocol350.TOTAL_FUEL_LEN;
        this.mOdometerEndIndex = this.mSpeedBeginIndex = offset += BluechipDataDecoderImplProtocol350.ODOMETER_LEN;
        this.mSpeedEndIndex = this.mRPMBeginIndex = offset += BluechipDataDecoderImplProtocol350.SPEED_LEN;
        this.mRPMEndIndex = this.mAcceleratorPedalBeginIndex = offset += BluechipDataDecoderImplProtocol350.RPM_LEN;
        this.mAcceleratorPedalEndIndex = this.mEngineTorqueBeginIndex = offset += BluechipDataDecoderImplProtocol350.ACCELERATOR_PEDAL_LEN;
        this.mEngineTorqueEndIndex = this.mEngineLoadBeginIndex = offset += BluechipDataDecoderImplProtocol350.ENGINE_TORQUE_LEN;
        this.mEngineLoadEndIndex = this.mTurboPressureBeginIndex = offset += BluechipDataDecoderImplProtocol350.ENGINE_LOAD_LEN;
        this.mTurboPressureEndIndex = this.mAdmissionValveAirPressureBeginIndex = offset += BluechipDataDecoderImplProtocol350.TURBO_PRESSURE_LEN;
        this.mAdmissionValveAirPressureEndIndex = this.mEngineOilPressureBeginIndex = offset += BluechipDataDecoderImplProtocol350.ADMISSION_VALVE_AIR_PRESSURE_LEN;
        this.mEngineOilPressureEndIndex = this.mTransmissionOilPressureBeginIndex = offset += BluechipDataDecoderImplProtocol350.ENGINE_OIL_PRESSURE_LEN;
        this.mTransmissionOilPressureEndIndex = this.mFuelPressureBeginIndex = offset += BluechipDataDecoderImplProtocol350.TRANSMISSION_OIL_PRESSURE_LEN;
        this.mFuelPressureEndIndex = this.mEngineOilTemperatureBeginIndex = offset += BluechipDataDecoderImplProtocol350.FUEL_PRESSURE_LEN;
        this.mEngineOilTemperatureEndIndex = this.mEngineWaterTemperatureBeginIndex = offset += BluechipDataDecoderImplProtocol350.ENGINE_OIL_TEMPERATURE_LEN;
        this.mEngineWaterTemperatureEndIndex = this.mEngineAdmissionAirTemperatureBeginIndex = offset += BluechipDataDecoderImplProtocol350.ENGINE_WATER_TEMPERATURE_LEN;
        this.mEngineAdmissionAirTemperatureEndIndex = this.mEnvironmentAirTemperatureBeginIndex = offset += BluechipDataDecoderImplProtocol350.ENGINE_ADMISSION_AIR_TEMPERATURE_LEN;
        this.mEnvironmentAirTemperatureEndIndex = this.mTransmissionOilTemperatureBeginIndex = offset += BluechipDataDecoderImplProtocol350.ENVIRONMENT_AIR_TEMPERATURE_LEN;
        this.mTransmissionOilTemperatureEndIndex = this.mHydraulicFluidTemperatureBeginIndex = offset += BluechipDataDecoderImplProtocol350.TRANSMISSION_OIL_TEMPERATURE_LEN;
        this.mHydraulicFluidTemperatureEndIndex = this.mFuelTemperatureBeginIndex = offset += BluechipDataDecoderImplProtocol350.HYDRAULIC_FLUID_TEMPERATURE_LEN;
        this.mFuelTemperatureEndIndex = this.mFuelFlowBeginIndex = offset += BluechipDataDecoderImplProtocol350.FUEL_TEMPERATURE_LEN;
        this.mFuelFlowEndIndex = this.mFuelLevelBeginIndex = offset += BluechipDataDecoderImplProtocol350.FUEL_FLOW_LEN;
        this.mFuelLevelEndIndex = this.mTransmissionOilLevelBeginIndex = offset += BluechipDataDecoderImplProtocol350.FUEL_LEVEL_LEN;
        this.mTransmissionOilLevelEndIndex = this.mHydraulicFluidLevelBeginIndex = offset += BluechipDataDecoderImplProtocol350.TRANSMISSION_OIL_LEVEL_LEN;
        this.mHydraulicFluidLevelEndIndex = this.mStatusGroup0BeginIndex = offset += BluechipDataDecoderImplProtocol350.HYDRAULIC_FLUID_LEVEL_LEN;
        this.mStatusGroup0EndIndex = this.mAgriculturalImplementHeightPercentageBeginIndex = offset += BluechipDataDecoderImplProtocol350.STATUS_GROUP0_LEN;
        this.mAgriculturalImplementHeightPercentageEndIndex = this.mHarvestUnitSpeedBeginIndex = offset += BluechipDataDecoderImplProtocol350.AGRICULTURAL_IMPLEMENT_HEIGHT_LEN;
        this.mHarvestUnitSpeedEndIndex = this.mStatusGroup1BeginIndex = offset += BluechipDataDecoderImplProtocol350.HARVEST_UNIT_SPEED_LEN;
        this.mStatusGroup1EndIndex = this.mStatusGroup2BeginIndex = offset += BluechipDataDecoderImplProtocol350.STATUS_GROUP1_LEN;
        this.mStatusGroup2EndIndex = this.mStatusGroup3BeginIndex = offset += BluechipDataDecoderImplProtocol350.STATUS_GROUP2_LEN;
        this.mStatusGroup3EndIndex = this.mLeftSprayNozzleBeginIndex = offset += BluechipDataDecoderImplProtocol350.STATUS_GROUP3_LEN;
        this.mLeftSprayNozzleEndIndex = this.mRightSprayNozzleBeginIndex = offset += BluechipDataDecoderImplProtocol350.LEFT_SPRAY_NOZZLE_LEN;
        this.mRightSprayNozzleEndIndex = offset += BluechipDataDecoderImplProtocol350.RIGHT_SPRAY_NOZZLE_LEN;
        this.mCheckSumIndex = offset; // Checksum começa logo após o último campo
    }

    // --- Implementação dos Métodos da Interface ---

    public decodeFirmwareVersion(): number {
        return BluechipDataDecoderImplProtocol350.FIRMWARE_VERSION;
    }

    public decodeProtocolVersion(): number {
        return BluechipDataDecoderImplProtocol350.PROTOCOL_VERSION;
    }

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
        if (isNotAvailable(result)) {
            return null;
        } else {
            const recLat = parseInt(result, RADIX);
            const signedLat = recLat > 0x7FFFFFFF ? recLat - 0xFFFFFFFF - 1 : recLat;
            return signedLat * LAT_LONG_BASE;
        }
    }

    public decodeLongitude(): number | null {
        const result = this.encodedData.substring(this.mLongitudeBeginIndex, this.mLongitudeEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            const recLon = parseInt(result, RADIX);
            const signedLon = recLon > 0x7FFFFFFF ? recLon - 0xFFFFFFFF - 1 : recLon;
            return signedLon * LAT_LONG_BASE;
        }
    }

    public decodeCompass(): number | null {
        const result = this.encodedData.substring(this.mCompassBeginIndex, this.mCompassEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX); // * 1D
        }
    }

    public decodeBattery(): number | null {
        const result = this.encodedData.substring(this.mBatteryBeginIndex, this.mBatteryEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) * 0.05;
        }
    }

    public decodeHourMeter(): number | null {
        const result = this.encodedData.substring(this.mHourMeterBeginIndex, this.mHourMeterEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) * 0.05;
        }
    }

    public decodeTotalFuelUsage(): number | null {
        const result = this.encodedData.substring(this.mTotalFuelBeginIndex, this.mTotalFuelEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) * 0.05;
        }
    }

    public decodeOdometer(): number | null {
        const result = this.encodedData.substring(this.mOdometerBeginIndex, this.mOdometerEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) * 0.125;
        }
    }

    public decodeSpeed(): number | null {
        const result = this.encodedData.substring(this.mSpeedBeginIndex, this.mSpeedEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX); // * 1D
        }
    }

    public decodeRPM(): number | null {
        const result = this.encodedData.substring(this.mRPMBeginIndex, this.mRPMEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) * 0.125;
        }
    }

    public decodeAcceleratorPedal(): number | null {
        const result = this.encodedData.substring(this.mAcceleratorPedalBeginIndex, this.mAcceleratorPedalEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) * 0.4;
        }
    }

    public decodeEngineTorque(): number | null {
        const result = this.encodedData.substring(this.mEngineTorqueBeginIndex, this.mEngineTorqueEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) - 125;
        }
    }

    public decodeEngineLoad(): number | null {
        const result = this.encodedData.substring(this.mEngineLoadBeginIndex, this.mEngineLoadEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) * 0.4;
        }
    }

    public decodeTurboPressure(): number | null {
        const result = this.encodedData.substring(this.mTurboPressureBeginIndex, this.mTurboPressureEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) * 0.05;
        }
    }

    public decodeAdmissionValveAirPressure(): number | null {
        const result = this.encodedData.substring(this.mAdmissionValveAirPressureBeginIndex, this.mAdmissionValveAirPressureEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) * 0.05;
        }
    }

    public decodeEngineOilPressure(): number | null {
        const result = this.encodedData.substring(this.mEngineOilPressureBeginIndex, this.mEngineOilPressureEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) * 4;
        }
    }

    public decodeTransmissionOilPressure(): number | null {
        const result = this.encodedData.substring(this.mTransmissionOilPressureBeginIndex, this.mTransmissionOilPressureEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) * 16;
        }
    }

    public decodeFuelPressure(): number | null {
        const result = this.encodedData.substring(this.mFuelPressureBeginIndex, this.mFuelPressureEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) * 4;
        }
    }

    public decodeEngineOilTemperature(): number | null {
        const result = this.encodedData.substring(this.mEngineOilTemperatureBeginIndex, this.mEngineOilTemperatureEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) * 0.03125;
        }
    }

    public decodeEngineWaterTemperature(): number | null {
        const result = this.encodedData.substring(this.mEngineWaterTemperatureBeginIndex, this.mEngineWaterTemperatureEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) - 40;
        }
    }

    public decodeEngineAdmissionAirTemperature(): number | null {
        const result = this.encodedData.substring(this.mEngineAdmissionAirTemperatureBeginIndex, this.mEngineAdmissionAirTemperatureEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) - 40;
        }
    }

    public decodeEnvironmentAirTemperature(): number | null {
        const result = this.encodedData.substring(this.mEnvironmentAirTemperatureBeginIndex, this.mEnvironmentAirTemperatureEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) - 40;
        }
    }

    public decodeTransmissionOilTemperature(): number | null {
        const result = this.encodedData.substring(this.mTransmissionOilTemperatureBeginIndex, this.mTransmissionOilTemperatureEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) * 0.03125 - 273;
        }
    }

    public decodeHydraulicFluidTemperature(): number | null {
        const result = this.encodedData.substring(this.mHydraulicFluidTemperatureBeginIndex, this.mHydraulicFluidTemperatureEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) - 40;
        }
    }

    public decodeFuelTemperature(): number | null {
        const result = this.encodedData.substring(this.mFuelTemperatureBeginIndex, this.mFuelTemperatureEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) - 40;
        }
    }

    public decodeFuelFlow(): number | null {
        const result = this.encodedData.substring(this.mFuelFlowBeginIndex, this.mFuelFlowEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) * 0.05;
        }
    }

    public decodeFuelLevel(): number | null {
        const result = this.encodedData.substring(this.mFuelLevelBeginIndex, this.mFuelLevelEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) * 0.4;
        }
    }

    public decodeTransmissionOilLevel(): number | null {
        const result = this.encodedData.substring(this.mTransmissionOilLevelBeginIndex, this.mTransmissionOilLevelEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) * 0.4;
        }
    }

    public decodeHydraulicFluidLevel(): number | null {
        const result = this.encodedData.substring(this.mHydraulicFluidLevelBeginIndex, this.mHydraulicFluidLevelEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) * 0.4;
        }
    }

    // --- Métodos de Status (Grupo 0) ---
    private decodeStatusGroup0Byte(): number | null {
        const result = this.encodedData.substring(this.mStatusGroup0BeginIndex, this.mStatusGroup0EndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX);
    }

    public decodeFailureCodeStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup0Byte();
        if (byte1 === null) return null;
        switch (byte1 & 3) { // Bits 0, 1
            case OFF: return false;
            case ON: return true;
            default: return null; // 2 (Erro) ou 3 (Não Avaliado)
        }
    }

    public decodeRadiatorPropellerStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup0Byte();
        if (byte1 === null) return null;
        switch ((byte1 & 12) >> 2) { // Bits 2, 3
            case OFF: return false;
            case ON: return true;
            default: return null;
        }
    }

    public decodeSugarCaneElevatorStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup0Byte();
        if (byte1 === null) return null;
        switch ((byte1 & 48) >> 4) { // Bits 4, 5
            case OFF: return false;
            case ON: return true;
            default: return null;
        }
    }

    public decodeSugarCaneBaseCutStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup0Byte();
        if (byte1 === null) return null;
        switch ((byte1 & 192) >> 6) { // Bits 6, 7
            case OFF: return false;
            case ON: return true;
            default: return null;
        }
    }

    // --- Continuação dos Analógicos ---
    public decodeAgriculturalImplementHeightPercentage(): number | null {
        const result = this.encodedData.substring(this.mAgriculturalImplementHeightPercentageBeginIndex, this.mAgriculturalImplementHeightPercentageEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX) * 0.05;
        }
    }

    public decodeHarvestUnitSpeed(): number | null {
        const result = this.encodedData.substring(this.mHarvestUnitSpeedBeginIndex, this.mHarvestUnitSpeedEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            return parseInt(result, RADIX); // * 1D
        }
    }

    // --- Métodos de Status (Grupo 1) ---
    private decodeStatusGroup1Byte(): number | null {
        const result = this.encodedData.substring(this.mStatusGroup1BeginIndex, this.mStatusGroup1EndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX);
    }

    public decodePowerTakeOffStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup1Byte();
        if (byte1 === null) return null;
        switch (byte1 & 3) { // Bits 0, 1
            case OFF: return false;
            case ON: return true;
            default: return null;
        }
    }

    public decodeRtkPilotStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup1Byte();
        if (byte1 === null) return null;
        switch ((byte1 & 12) >> 2) { // Bits 2, 3
            case OFF: return false;
            case ON: return true;
            default: return null;
        }
    }

    public decodeIndustryStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup1Byte();
        if (byte1 === null) return null;
        switch ((byte1 & 48) >> 4) { // Bits 4, 5
            case OFF: return false;
            case ON: return true;
            default: return null;
        }
    }

    public decodeGrainDischargeStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup1Byte();
        if (byte1 === null) return null;
        switch ((byte1 & 192) >> 6) { // Bits 6, 7
            case OFF: return false;
            case ON: return true;
            default: return null;
        }
    }

    // --- Métodos de Status (Grupo 2) ---
     private decodeStatusGroup2Byte(): number | null {
        const result = this.encodedData.substring(this.mStatusGroup2BeginIndex, this.mStatusGroup2EndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX);
    }

    public decodeHarvestUnitStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup2Byte();
        if (byte1 === null) return null;
        switch (byte1 & 3) { // Bits 0, 1
            case OFF: return false;
            case ON: return true;
            default: return null;
        }
    }

    public decodePlatformStatus(): PlatformStatus | null {
        const byte1 = this.decodeStatusGroup2Byte();
        if (byte1 === null) return null;
        const tmp = (byte1 & 12) >> 2; // Bits 2, 3
        if (tmp === PLATFORM_STATUS_OFF || tmp === PLATFORM_STATUS_GOING_DOWN || tmp === PLATFORM_STATUS_GOING_UP) {
            return tmp;
        }
        return null; // Caso 3 (Não Avaliado) ou inválido
    }

    public decodePackingCottonProcessStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup2Byte();
        if (byte1 === null) return null;
        switch ((byte1 & 48) >> 4) { // Bits 4, 5
            case OFF: return false;
            case ON: return true;
            default: return null;
        }
    }

    public decodeWaterPumpStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup2Byte();
        if (byte1 === null) return null;
        switch ((byte1 & 192) >> 6) { // Bits 6, 7
            case OFF: return false;
            case ON: return true;
            default: return null;
        }
    }

    // --- Métodos de Status (Grupo 3) ---
    private decodeStatusGroup3Byte(): number | null {
        const result = this.encodedData.substring(this.mStatusGroup3BeginIndex, this.mStatusGroup3EndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX);
    }

    public decodeSprayApplicationMode(): SprayApplicationMode | null {
        const byte1 = this.decodeStatusGroup3Byte();
        if (byte1 === null) return null;
        const tmp = byte1 & 3; // Bits 0, 1
        if (tmp === SPRAY_APPLICATION_MODE_MANUAL || tmp === SPRAY_APPLICATION_MODE_TAXA1 || tmp === SPRAY_APPLICATION_MODE_TAXA2) {
            return tmp;
        }
        return null; // Caso 3 (Não Avaliado) ou inválido
    }

    public decodeSprayLiquidReleaseStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup3Byte();
        if (byte1 === null) return null;
        switch ((byte1 & 12) >> 2) { // Bits 2, 3
            case OFF: return false; // Fechado
            case ON: return true; // Aberto
            default: return null;
        }
    }

    public decodeSugarCanePrimaryExtractorStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup3Byte();
        if (byte1 === null) return null;
        switch ((byte1 & 48) >> 4) { // Bits 4, 5
            case OFF: return false;
            case ON: return true;
            default: return null;
        }
    }

    public decodeSugarCaneSecondaryExtractorStatus(): boolean | null {
        const byte1 = this.decodeStatusGroup3Byte();
        if (byte1 === null) return null;
        switch ((byte1 & 192) >> 6) { // Bits 6, 7
            case OFF: return false;
            case ON: return true;
            default: return null;
        }
    }

    // --- Métodos de Status (Bicos Pulverizadores - Esquerda) ---
    private decodeLeftSprayNozzleByte(): number | null {
        const result = this.encodedData.substring(this.mLeftSprayNozzleBeginIndex, this.mLeftSprayNozzleEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX);
    }

    public decodeCentralSprayNozzleStatus(): boolean | null {
        const byte1 = this.decodeLeftSprayNozzleByte();
        if (byte1 === null) return null;
        switch (byte1 & 3) { // Bits 0, 1
            case OFF: return false; // Fechado
            case ON: return true; // Aberto
            default: return null;
        }
    }

    public decodeLeftSprayNozzle1Status(): boolean | null {
         const byte1 = this.decodeLeftSprayNozzleByte();
        if (byte1 === null) return null;
        switch ((byte1 & 12) >> 2) { // Bits 2, 3
            case OFF: return false;
            case ON: return true;
            default: return null;
        }
    }

    public decodeLeftSprayNozzle2Status(): boolean | null {
        const byte1 = this.decodeLeftSprayNozzleByte();
        if (byte1 === null) return null;
        switch ((byte1 & 48) >> 4) { // Bits 4, 5
            case OFF: return false;
            case ON: return true;
            default: return null;
        }
    }

    public decodeLeftSprayNozzle3Status(): boolean | null {
        const byte1 = this.decodeLeftSprayNozzleByte();
        if (byte1 === null) return null;
        switch ((byte1 & 192) >> 6) { // Bits 6, 7
            case OFF: return false;
            case ON: return true;
            default: return null;
        }
    }

    // --- Métodos de Status (Bicos Pulverizadores - Direita) ---
    private decodeRightSprayNozzleByte(): number | null {
        const result = this.encodedData.substring(this.mRightSprayNozzleBeginIndex, this.mRightSprayNozzleEndIndex);
        return isNotAvailable(result) ? null : parseInt(result, RADIX);
    }

     public decodeRightSprayNozzle1Status(): boolean | null {
        const byte1 = this.decodeRightSprayNozzleByte();
        if (byte1 === null) return null;
        switch (byte1 & 3) { // Bits 0, 1
            case OFF: return false;
            case ON: return true;
            default: return null;
        }
    }

    public decodeRightSprayNozzle2Status(): boolean | null {
        const byte1 = this.decodeRightSprayNozzleByte();
        if (byte1 === null) return null;
        switch ((byte1 & 12) >> 2) { // Bits 2, 3
            case OFF: return false;
            case ON: return true;
            default: return null;
        }
    }

    public decodeRightSprayNozzle3Status(): boolean | null {
        const byte1 = this.decodeRightSprayNozzleByte();
        if (byte1 === null) return null;
        switch ((byte1 & 48) >> 4) { // Bits 4, 5
            case OFF: return false;
            case ON: return true;
            default: return null;
        }
    }

    // --- Métodos NÃO DISPONÍVEIS no Protocolo 3.5.0 ---
    public decodeLeftSprayNozzle4Status(): boolean | null { return null; }
    public decodeRightSprayNozzle4Status(): boolean | null { return null; }
    public decodeConveyorPlanterStatus(): boolean | null { return null; }
    public decodeElevatorConveyorBeltHourMeter(): number | null { return null; }
    public decodeAutoPilotHourMeter(): number | null { return null; }
    public decodeCaneBaseCutPressure(): number | null { return null; }
    public decodeCaneChipperPressure(): number | null { return null; }
    public decodeCaneBaseCutHeight(): number | null { return null; }
    public decodePrimaryExtractorSpeed(): number | null { return null; }


    // --- Métodos de Validação e Informação ---

    public checkSum(): number {
        const result = this.encodedData.substring(this.mCheckSumIndex); // Pega do índice até o final
        // Não checa isNotAvailable para checksum, assume que existe
        try {
          return parseInt(result, RADIX);
        } catch(e) {
          console.error("Erro ao decodificar checksum:", e, "Substring:", result);
          return -1; // Retorna -1 em caso de erro na conversão
        }
    }

    public isTelematicsAvailable(): boolean {
        // Baseado no Java 350
        return true;
    }

    public deviceVersion(): string {
       // Baseado no Java 350
       return "v3.5";
    }

    /**
     * Verifica se o comprimento da string de dados corresponde ao esperado por este protocolo.
     * Usado pela função factory `getInstance`.
     * @param encodedDataLength Comprimento da string hexadecimal limpa.
     * @returns True se o comprimento for válido E as versões baterem, false caso contrário.
     */
     public isValidProtocol(encodedDataLength: number): boolean {
        // A validação do Java 350 verifica comprimento E versões
        // Como o frame PRM V1 não tem versão no início, a checagem de versão aqui
        // pode não ser aplicável diretamente da mesma forma que nos protocolos V2+
        // Por segurança, vamos checar apenas o comprimento por enquanto,
        // mas a fábrica `getInstance` deve priorizar protocolos mais longos/recentes primeiro.
        // return encodedDataLength === BluechipDataDecoderImplProtocol350.ENCODED_DATA_LENGTH;

        // Mantendo a lógica original do Java (<=) pode causar problemas se um frame
        // de protocolo mais novo for mais curto por algum motivo. Usar === é mais seguro.
         return encodedDataLength === BluechipDataDecoderImplProtocol350.ENCODED_DATA_LENGTH;
        // Se precisar da validação exata do Java:
        // return encodedDataLength <= BluechipDataDecoderImplProtocol350.ENCODED_DATA_LENGTH &&
        //        this.decodeProtocolVersion() === BluechipDataDecoderImplProtocol350.PROTOCOL_VERSION &&
        //        this.decodeFirmwareVersion() === BluechipDataDecoderImplProtocol350.FIRMWARE_VERSION;
     }
}