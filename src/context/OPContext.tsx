import opData from '@/src/cache/order_production.json'; // Ajuste o caminho do seu JSON
import { OP, OPDataFile } from '@/src/context/op.types';
import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { useGlobalState } from './GlobalStateContext';

interface OPContextData {
    // OP selecionada
    selectedOP: OP | null;
    selectedOPNumber: number | null;
    setSelectedOPNumber: (opNumber: number) => void;

    // Todas as OP disponíveis
    allOP: OP[];

    // OP filtradas por equipment_group
    opByEquipmentGroup: OP[];

    // Funções auxiliares
    getOPByNumber: (opNumber: number) => OP | undefined;
    getOPByEquipmentGroup: (equipmentGroup: number) => OP[];
    getOPByCompanyUnit: (companyUnitId: number) => OP[];
    getOPByOperationCode: (operationCode: number) => OP[];
    getOPByRegion: (region: number) => OP[];
    searchOP: (searchText: string) => OP[];
    clearSelection: () => void;
}

const OPContext = createContext<OPContextData>({} as OPContextData);

interface OPProviderProps {
    children: ReactNode;
}

export const OPProvider: React.FC<OPProviderProps> = ({ children }) => {
    const { equipmentGroupId } = useGlobalState(); // Pega o grupo do estado global
    const [selectedOPNumber, setSelectedOPNumberState] = useState<number | null>(null);

    // Carrega todas as OP do JSON
    const allOP = useMemo(() => (opData as OPDataFile).data, []);

    // Busca a OP selecionada
    const selectedOP = useMemo(() => {
        if (selectedOPNumber === null) return null;
        return allOP.find((op) => op.os_number === selectedOPNumber) || null;
    }, [selectedOPNumber, allOP]);

    // Filtra OP pelo equipment_group do estado global
    // const opByEquipmentGroup = useMemo(() => {
    //     if (equipmentGroupId === null) return [];
    //     return allOP.filter((op) => op.equipment_group === equipmentGroupId);
    // }, [equipmentGroupId, allOP]);

    const opByEquipmentGroup = useMemo(() => {
        // Filtra todas as OPs onde o grupo é igual ao novo ID (20)
        return allOP.filter((op) => op.equipment_group === 20);
    }, [equipmentGroupId, allOP]);
    
    // Função para definir a OP selecionada
    const setSelectedOPNumber = (opNumber: number): void => {
        setSelectedOPNumberState(opNumber);
    };

    // Buscar OP por número
    const getOPByNumber = (opNumber: number): OP | undefined => {
        return allOP.find((op) => op.os_number === opNumber);
    };

    // Buscar OP por equipment_group
    const getOPByEquipmentGroup = (equipmentGroup: number): OP[] => {
        return allOP.filter((op) => op.equipment_group === equipmentGroup);
    };

    // Buscar OP por company_unit_id
    const getOPByCompanyUnit = (companyUnitId: number): OP[] => {
        return allOP.filter((op) => op.company_unit_id === companyUnitId);
    };

    // Buscar OP por operation_code
    const getOPByOperationCode = (operationCode: number): OP[] => {
        return allOP.filter((op) => op.operation_code === operationCode);
    };

    // Buscar OP por region
    const getOPByRegion = (region: number): OP[] => {
        return allOP.filter((op) => op.region_01 === region);
    };

    // Buscar OP por texto (nome ou número)
    const searchOP = (searchText: string): OP[] => {
        if (!searchText) return opByEquipmentGroup;

        const search = searchText.toLowerCase();
        return opByEquipmentGroup.filter((op) =>
            op.name.toLowerCase().includes(search) ||
            op.os_number.toString().includes(search)
        );
    };

    // Limpar seleção
    const clearSelection = (): void => {
        setSelectedOPNumberState(null);
    };

    return (
        <OPContext.Provider
            value={{
                selectedOP,
                selectedOPNumber,
                setSelectedOPNumber,
                allOP,
                opByEquipmentGroup,
                getOPByNumber,
                getOPByEquipmentGroup,
                getOPByCompanyUnit,
                getOPByOperationCode,
                getOPByRegion,
                searchOP,
                clearSelection,
            }}
        >{children}</OPContext.Provider>
    );
};


export const useOP = (): OPContextData => {
    const context = useContext(OPContext);

    if (!context) {
        throw new Error('useOP deve ser usado dentro de um OPProvider');
    }

    return context;
};