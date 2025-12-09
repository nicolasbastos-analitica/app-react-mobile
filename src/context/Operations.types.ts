// Estrutura de uma operação individual
export interface Operation {
    operation_name: string;
    operation_id: number;
    is_cargo_transfer: boolean | null;
    is_follow_harverster: boolean;
    is_go_industry: boolean;
    is_elevator: boolean;
    is_planter: boolean;
    measurement_unit: string | null;
    has_engine_idle: boolean;
    engine_idle_sec: number | null;
    interferences: any[]; // Array vazio no JSON
}

// Estrutura de interferência (pode ser aninhada)
export interface Interference {
    id: number;
    code?: number;
    name: string;
    color: string;
    icon: string | null;
    motor_on: boolean;
    interferences?: Interference[]; // Interferências aninhadas
}

// Estrutura do grupo de equipamentos
export interface EquipmentGroup {
    group_name: string;
    group_id: number;
    type_equipment: string | null;
    interferences: Interference[];
    operations: Operation[];
}

// Estrutura do arquivo JSON completo
export interface OpDataFile {
    data: EquipmentGroup[];
}