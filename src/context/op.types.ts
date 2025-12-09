// Estrutura de uma Ordem de Produção individual
export interface OP {
    os_number: number;
    name: string;
    equipment_group: number;
    company_unit_id: number;
    operation_code: number;
    region_01: number;
}

// Estrutura do arquivo JSON completo
export interface OPDataFile {
    data: OP[];
}