// decoders/Protocol340.ts

import {
    // A Interface (o "contrato")
    IBluechipDataDecoder,
    // Tipos de Status
    SprayApplicationMode,
    PlatformStatus,
    // Constantes de Status
    ON,
    OFF,
    // Constantes de Decodificação
    RADIX,
    LAT_LONG_CONSTANT, // Embora não recomendado para uso direto na fórmula JS/TS
    LAT_LONG_BASE,
    // Funções de Ajuda
    isNotAvailable
} from './bluechipDecoder.types'; // Ajuste o caminho se necessário

export class BluechipDataDecoderImplProtocol340 implements IBluechipDataDecoder {

    // --- Constantes Estáticas da Classe ---
    private static readonly FIRMWARE_VERSION: number = 1; // Baseado no Java
    private static readonly PROTOCOL_VERSION: number = 0; // Baseado no Java
    // Comprimento esperado da string hex limpa para este protocolo
    public static readonly ENCODED_DATA_LENGTH: number = 29;

    // Constantes de Comprimento
    private static readonly ENGINE_LEN: number = 2;
    private static readonly LATITUDE_LEN: number = 8;
    private static readonly LONGITUDE_LEN: number = 8;
    private static readonly COMPASS_LEN: number = 4;
    private static readonly BATTERY_LEN: number = 4;

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
    // Não há mCheckSumIndex definido explicitamente no Java 340 para onInitIndexes

    constructor(encodedData: string) {
        this.encodedData = encodedData;
        this.onInitIndices(); // Calcula os índices ao criar a instância
    }

    // --- Cálculo dos Índices ---
    private onInitIndices(offset: number = 0): void {
        this.mEngineBeginIndex = offset;
        this.mEngineEndIndex = this.mLatitudeBeginIndex = offset += BluechipDataDecoderImplProtocol340.ENGINE_LEN;
        this.mLatitudeEndIndex = this.mLongitudeBeginIndex = offset += BluechipDataDecoderImplProtocol340.LATITUDE_LEN;
        this.mLongitudeEndIndex = this.mCompassBeginIndex = offset += BluechipDataDecoderImplProtocol340.LONGITUDE_LEN;
        this.mCompassEndIndex = this.mBatteryBeginIndex = offset += BluechipDataDecoderImplProtocol340.COMPASS_LEN;
        this.mBatteryEndIndex = offset + BluechipDataDecoderImplProtocol340.BATTERY_LEN;
    }

    // --- Implementação dos Métodos da Interface ---

    public decodeFirmwareVersion(): number {
        // Embora definido no Java, a documentação indica que FW/Protocol só existem a partir do V2/3.6.0 nos frames PRM.
        // Retornando 0 ou a constante do Java para consistência? Seguirei o Java.
        return BluechipDataDecoderImplProtocol340.FIRMWARE_VERSION;
    }

    public decodeProtocolVersion(): number {
        return BluechipDataDecoderImplProtocol340.PROTOCOL_VERSION;
    }

    public decodeEngineStatus(): boolean {
        const result = this.encodedData.substring(this.mEngineBeginIndex, this.mEngineEndIndex);
        const byte1 = parseInt(result, RADIX);
        const tmp = (byte1 & 2) >> 1; // Pega o bit 1
        return tmp === ON;
    }

    public decodeIgnitionStatus(): boolean {
        const result = this.encodedData.substring(this.mEngineBeginIndex, this.mEngineEndIndex);
        const byte1 = parseInt(result, RADIX);
        const tmp = (byte1 & 1); // Pega o bit 0
        return tmp === ON;
    }

    public decodeGpsStatus(): boolean {
        const result = this.encodedData.substring(this.mEngineBeginIndex, this.mEngineEndIndex);
        const byte1 = parseInt(result, RADIX);
        const tmp = (byte1 & 4) >> 2; // Pega o bit 2
        return tmp === ON;
    }

    public decodeLatitude(): number | null {
        const result = this.encodedData.substring(this.mLatitudeBeginIndex, this.mLatitudeEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            const recLat = parseInt(result, RADIX);
            // Conversão para signed 32-bit (importante!)
            const signedLat = recLat > 0x7FFFFFFF ? recLat - 0xFFFFFFFF - 1 : recLat;
            // Usando a fórmula direta (signed * base) que equivale à do PDF e evita BigDecimal
            return signedLat * LAT_LONG_BASE;
        }
    }

    public decodeLongitude(): number | null {
        const result = this.encodedData.substring(this.mLongitudeBeginIndex, this.mLongitudeEndIndex);
        if (isNotAvailable(result)) {
            return null;
        } else {
            const recLon = parseInt(result, RADIX);
            // Conversão para signed 32-bit
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

    // --- Métodos para Sensores NÃO Disponíveis no Protocolo 3.4.0 ---
    // (Implementados para satisfazer a interface, retornando null como no Java)
    public decodeHourMeter(): number | null { return null; }
    public decodeTotalFuelUsage(): number | null { return null; }
    public decodeOdometer(): number | null { return null; }
    public decodeSpeed(): number | null { return null; }
    public decodeRPM(): number | null { return null; }
    public decodeAcceleratorPedal(): number | null { return null; }
    public decodeEngineTorque(): number | null { return null; }
    public decodeEngineLoad(): number | null { return null; }
    public decodeTurboPressure(): number | null { return null; }
    public decodeAdmissionValveAirPressure(): number | null { return null; }
    public decodeEngineOilPressure(): number | null { return null; }
    public decodeTransmissionOilPressure(): number | null { return null; }
    public decodeFuelPressure(): number | null { return null; }
    public decodeEngineOilTemperature(): number | null { return null; }
    public decodeEngineWaterTemperature(): number | null { return null; }
    public decodeEngineAdmissionAirTemperature(): number | null { return null; }
    public decodeEnvironmentAirTemperature(): number | null { return null; }
    public decodeTransmissionOilTemperature(): number | null { return null; }
    public decodeHydraulicFluidTemperature(): number | null { return null; }
    public decodeFuelTemperature(): number | null { return null; }
    public decodeFuelFlow(): number | null { return null; }
    public decodeFuelLevel(): number | null { return null; }
    public decodeTransmissionOilLevel(): number | null { return null; }
    public decodeHydraulicFluidLevel(): number | null { return null; }
    public decodeFailureCodeStatus(): boolean | null { return null; }
    public decodeRadiatorPropellerStatus(): boolean | null { return null; }
    public decodeAgriculturalImplementHeightPercentage(): number | null { return null; }
    public decodeHarvestUnitSpeed(): number | null { return null; }
    public decodePowerTakeOffStatus(): boolean | null { return null; }
    public decodeRtkPilotStatus(): boolean | null { return null; }
    public decodeIndustryStatus(): boolean | null { return null; }
    public decodeGrainDischargeStatus(): boolean | null { return null; }
    public decodeHarvestUnitStatus(): boolean | null { return null; }
    public decodePlatformStatus(): PlatformStatus | null { return null; }
    public decodePackingCottonProcessStatus(): boolean | null { return null; }
    public decodeWaterPumpStatus(): boolean | null { return null; }
    public decodeSprayApplicationMode(): SprayApplicationMode | null { return null; }
    public decodeSprayLiquidReleaseStatus(): boolean | null { return null; }
    public decodeCentralSprayNozzleStatus(): boolean | null { return null; }
    public decodeLeftSprayNozzle1Status(): boolean | null { return null; }
    public decodeLeftSprayNozzle2Status(): boolean | null { return null; }
    public decodeLeftSprayNozzle3Status(): boolean | null { return null; }
    public decodeLeftSprayNozzle4Status(): boolean | null { return null; }
    public decodeRightSprayNozzle1Status(): boolean | null { return null; }
    public decodeRightSprayNozzle2Status(): boolean | null { return null; }
    public decodeRightSprayNozzle3Status(): boolean | null { return null; }
    public decodeRightSprayNozzle4Status(): boolean | null { return null; }
    public decodeConveyorPlanterStatus(): boolean | null { return null; }
    public decodeSugarCaneElevatorStatus(): boolean | null { return null; }
    public decodeSugarCaneBaseCutStatus(): boolean | null { return null; }
    public decodeSugarCanePrimaryExtractorStatus(): boolean | null { return null; }
    public decodeSugarCaneSecondaryExtractorStatus(): boolean | null { return null; }
    public decodeElevatorConveyorBeltHourMeter(): number | null { return null; }
    public decodeAutoPilotHourMeter(): number | null { return null; }
    public decodeCaneBaseCutPressure(): number | null { return null; }
    public decodeCaneChipperPressure(): number | null { return null; }
    public decodeCaneBaseCutHeight(): number | null { return null; }
    public decodePrimaryExtractorSpeed(): number | null { return null; }

    // --- Métodos de Validação e Informação ---

    public checkSum(): number {
        // O Java 340 retorna o comprimento esperado. O checksum real (AD no exemplo) não é usado.
        // Se precisar validar o checksum real, a lógica precisaria ser adicionada aqui
        // (calcular a soma dos bytes e comparar com o valor no final da string).
        // Seguindo o Java por enquanto:
        return BluechipDataDecoderImplProtocol340.ENCODED_DATA_LENGTH;
    }

    public isTelematicsAvailable(): boolean {
        // Baseado no Java 340
        return false;
    }

    public deviceVersion(): string {
        // Baseado no Java 340
        return "v3.4";
    }

    /**
     * Verifica se o comprimento da string de dados corresponde ao esperado por este protocolo.
     * Usado pela função factory `getInstance`.
     * @param encodedDataLength Comprimento da string hexadecimal limpa.
     * @returns True se o comprimento for válido, false caso contrário.
     */
    public isValidProtocol(encodedDataLength: number): boolean {
        // A lógica do Java era `encodedDataLength <= ENCODED_DATA_LENGTH`.
        // Usar `===` é geralmente mais seguro para garantir que é exatamente esta versão
        // se o comprimento for estritamente fixo. Mantendo a lógica original por segurança.
        return encodedDataLength <= BluechipDataDecoderImplProtocol340.ENCODED_DATA_LENGTH;
        // Considere usar === se souber que o comprimento para 3.4.0 é EXATAMENTE 29 (após limpeza).
        // return encodedDataLength === BluechipDataDecoderImplProtocol340.ENCODED_DATA_LENGTH;
    }
}