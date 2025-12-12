import equipmentsJson from '@/src/cache/equipments.json';
import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

// --- Interfaces ---

export interface Equipment {
    class: 'Auxiliar' | 'Principal' | 'Proprio';
    code: number;
    company_code: number;
    company_unit_code: number;
    equipment_operational_group_code: number;
    hourmeter: boolean;
    id: number;
    is_implement: number | null;
    model_name: string;
    odometer: boolean;
    operation_group_id: number | null;
    status_embedded: number;
    type: string;
    bluechip_bluetooth_name: string | null;
    harvester_code: string | null;
    planter_code: string | null;
    truck_number: string | null;
}

// ✅ Interface corrigida para a estrutura real do JSON
interface EquipmentDataFile {
    data: {
        harvesters?: any[];
        planters?: any[];
        trucks?: any[];
        sprays?: any[];
        loaders?: any[];
        other_equipment?: any[];
        equipment: Equipment[]; // ✅ AQUI ESTÃO OS DADOS COMPLETOS! 
        implements?: any[];
    };
}

const useGlobalState = () => {
    const defaultCompanyUnitId = 115;
    return { companyUnitId: defaultCompanyUnitId };
};

// --- Contexto ---

interface EquipmentContextData {
    selectedEquipment: Equipment | null;
    selectedImplement1: Equipment | null;
    selectedImplement2: Equipment | null;
    selectedEquipmentCode: number | null;
    setSelectedEquipmentCode: (code: number) => void;
    setSelectedImplementCode1: (code: number) => void;
    setSelectedImplementCode2: (code: number) => void;
    allEquipment: Equipment[];
    allMachines: Equipment[];
    equipmentByCompanyUnit: Equipment[];
    equipmentByCode: Equipment[];
    getEquipmentByCode: (code: number) => Equipment | undefined;
    getEquipmentByCompanyUnit: (companyUnitId: number) => Equipment[];
    getEquipmentByType: (type: string) => Equipment[];
    searchEquipment: (searchText: string, includeAllUnits?: boolean) => Equipment[];
    clearSelection: () => void;
    allImplements: any[];
}

const EquipmentContext = createContext<EquipmentContextData>({} as EquipmentContextData);

interface EquipmentProviderProps {
    children: ReactNode;
}

// --- Provider ---

export const EquipmentProvider: React.FC<EquipmentProviderProps> = ({ children }) => {
    const { companyUnitId } = useGlobalState();

    const [selectedEquipmentCode, setSelectedEquipmentCodeState] = useState<number | null>(null);
    const [selectedImplementCode1, setSelectedImplementCode1State] = useState<number | null>(null);
    const [selectedImplementCode2, setSelectedImplementCode2State] = useState<number | null>(null);

    // ✅ BUSCA OS DADOS COMPLETOS DA SEÇÃO "equipment"
    const allEquipment = useMemo(() => {
        const data = (equipmentsJson as unknown as EquipmentDataFile).data;

        // ✅ Pega todos os equipamentos da seção "equipment"
        const result = data.equipment || [];

        // DEBUG
        console.log('📦 Total de equipamentos carregados:', result.length);
        console.log('📦 Primeiro equipamento:', result[0]);
        console.log('📦 Campos disponíveis:', Object.keys(result[0] || {}));

        return result;
    }, []);

    // ✅ Filtra apenas MÁQUINAS (is_implement === null ou 0)
    const allMachines = useMemo(() => {
        const machines = allEquipment.filter((e) =>
            e.is_implement === null || e.is_implement === 0
        );

        console.log('🚜 Total de MÁQUINAS (sem implementos):', machines.length);
        if (machines.length > 0) {
            console.log('🚜 Primeira máquina:', machines[0]);
        }

        return machines;
    }, [allEquipment]);

    const allImplements = useMemo(() => {
        const Implements = allEquipment.filter((e) =>
            e.is_implement === 1 || e.is_implement !== null
        );
        return Implements;
    }, [allEquipment]);
    const selectedEquipment = useMemo(() => {
        if (selectedEquipmentCode === null) return null;
        return allEquipment.find((e) => e.code === selectedEquipmentCode) || null;
    }, [selectedEquipmentCode, allEquipment]);

    const selectedImplement1 = useMemo(() => {
        if (selectedImplementCode1 === null) return null;
        return allEquipment.find((e) => e.code === selectedImplementCode1) || null;
    }, [selectedImplementCode1, allEquipment]);

    const selectedImplement2 = useMemo(() => {
        if (selectedImplementCode2 === null) return null;
        return allEquipment.find((e) => e.code === selectedImplementCode2) || null;
    }, [selectedImplementCode2, allEquipment]);

    const equipmentByCompanyUnit = useMemo(() => {
        if (companyUnitId === null) return [];
        return allEquipment.filter((e) => e.company_unit_code === companyUnitId);
    }, [companyUnitId, allEquipment]);

    const equipmentByCode = useMemo(() => {
        if (selectedEquipmentCode === null) return [];
        return allEquipment.filter((e) => e.code === selectedEquipmentCode);
    }, [allEquipment, selectedEquipmentCode]);

    const setSelectedEquipmentCode = useCallback((code: number): void => {
        setSelectedEquipmentCodeState(code);
    }, []);

    const setSelectedImplementCode1 = useCallback((code: number): void => {
        setSelectedImplementCode1State(code);
    }, []);

    const setSelectedImplementCode2 = useCallback((code: number): void => {
        setSelectedImplementCode2State(code);
    }, []);

    // --- Funções Auxiliares ---

    const getEquipmentByCode = useCallback((code: number): Equipment | undefined => {
        return allEquipment.find((e) => e.code === code);
    }, [allEquipment]);

    const getEquipmentByCompanyUnitFn = useCallback((unitId: number): Equipment[] => {
        return allEquipment.filter((e) => e.company_unit_code === unitId);
    }, [allEquipment]);

    const getEquipmentByType = useCallback((type: string): Equipment[] => {
        const lowerCaseType = type.toLowerCase();
        return allEquipment.filter((e) => e.type.toLowerCase() === lowerCaseType);
    }, [allEquipment]);

    const searchEquipment = useCallback((searchText: string, includeAllUnits: boolean = false): Equipment[] => {
        // ✅ Se includeAllUnits for true, busca em TODAS as máquinas
        const sourceList = includeAllUnits
            ? allMachines
            : equipmentByCompanyUnit.filter(e => e.is_implement === null || e.is_implement === 0);

        if (!searchText) return sourceList;

        const search = searchText.toLowerCase();
        return sourceList.filter((e) =>
            (e.model_name && e.model_name.toLowerCase().includes(search)) ||
            (e.code && e.code.toString().includes(search)) ||
            (e.class && e.class.toLowerCase().includes(search))
        );
    }, [equipmentByCompanyUnit, allMachines]);

    const clearSelection = useCallback((): void => {
        setSelectedEquipmentCodeState(null);
    }, []);

    const contextValue = useMemo(() => ({
        selectedEquipment,
        selectedImplement1,
        selectedImplement2,
        selectedEquipmentCode,
        setSelectedEquipmentCode,
        setSelectedImplementCode1,
        setSelectedImplementCode2,
        allEquipment,
        allMachines,
        allImplements,
        equipmentByCompanyUnit,
        equipmentByCode,
        getEquipmentByCode,
        getEquipmentByCompanyUnit: getEquipmentByCompanyUnitFn,
        getEquipmentByType,
        searchEquipment,
        clearSelection,
    }), [
        selectedEquipment,
        selectedImplement1,
        selectedImplement2,
        selectedEquipmentCode,
        setSelectedEquipmentCode,
        allEquipment,
        allMachines,
        allImplements,
        equipmentByCompanyUnit,
        equipmentByCode,
        getEquipmentByCode,
        getEquipmentByCompanyUnitFn,
        getEquipmentByType,
        searchEquipment,
        clearSelection,
    ]);

    return (
        <EquipmentContext.Provider value={contextValue}>
            {children}
        </EquipmentContext.Provider>
    );
};

export const useEquipment = (): EquipmentContextData => {
    const context = useContext(EquipmentContext);

    if (!context || Object.keys(context).length === 0) {
        throw new Error('useEquipment deve ser usado dentro de um EquipmentProvider');
    }

    return context;
};