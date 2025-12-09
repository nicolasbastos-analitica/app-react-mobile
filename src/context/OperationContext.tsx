import opData from '@/src/cache/operations.json';
import { EquipmentGroup, Interference, OpDataFile, Operation } from '@/src/context/Operations.types';
import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { useGlobalState } from './GlobalStateContext';

interface OpContextData {
    // Grupo de equipamento selecionado
    selectedGroup: EquipmentGroup | null;
    equipmentGroupId: number | null;
    setEquipmentGroupId: (groupId: number) => Promise<void>;
    setCompanyUnitId: (companyUnitId: number) => Promise<void>;

    // Operações do grupo selecionado
    operations: Operation[];
    currentOperation: Operation | null;
    currentOperationIndex: number;
    setCurrentOperationIndex: (index: number) => void;
    setCurrentOperationById: (operationId: number) => void;

    // Interferências do grupo
    interferences: Interference[];
    getAllInterferences: () => Interference[];

    // Todos os grupos disponíveis
    allGroups: EquipmentGroup[];

    // Funções auxiliares
    getGroupById: (groupId: number) => EquipmentGroup | undefined;
    getGroupByName: (groupName: string) => EquipmentGroup | undefined;
    getOperationById: (operationId: number) => Operation | undefined;
    clearSelection: () => Promise<void>;
}

const OpContext = createContext<OpContextData>({} as OpContextData);

interface OpProviderProps {
    children: ReactNode;
}

export const OpProvider: React.FC<OpProviderProps> = ({ children }) => {
    // 🔥 Pega as variáveis globais
    const {
        equipmentGroupId: globalEquipmentGroupId,
        setEquipmentGroupId: setGlobalEquipmentGroupId
    } = useGlobalState();

    const [currentOperationIndex, setCurrentOperationIndexState] = useState<number>(0);

    // Carrega todos os grupos do JSON
    const allGroups = useMemo(() => (opData as OpDataFile).data, []);

    // 🔥 Usa a variável global diretamente
    const equipmentGroupId = globalEquipmentGroupId;

    // Busca o grupo selecionado baseado na variável global
    const selectedGroup = useMemo(() => {
        if (equipmentGroupId === null) return null;
        return allGroups.find((group) => group.group_id === equipmentGroupId) || null;
    }, [equipmentGroupId, allGroups]);

    // Operações do grupo selecionado
    const operations = useMemo(() => selectedGroup?.operations || [], [selectedGroup]);

    // Operação atual (baseado no índice)
    const currentOperation = useMemo(() => {
        return operations.length > 0 && currentOperationIndex < operations.length
            ? operations[currentOperationIndex]
            : null;
    }, [operations, currentOperationIndex]);

    // Interferências do grupo selecionado (nível superior)
    const interferences = useMemo(() => selectedGroup?.interferences || [], [selectedGroup]);

    // Função para pegar TODAS as interferências (incluindo aninhadas)
    const getAllInterferences = useMemo((): Interference[] => {
        if (!selectedGroup) return [];

        const flatInterferences: Interference[] = [];

        const extractInterferences = (interfs: Interference[]) => {
            interfs.forEach((interf) => {
                if (interf.interferences && interf.interferences.length > 0) {
                    flatInterferences.push(...interf.interferences);
                    extractInterferences(interf.interferences);
                }
            });
        };

        extractInterferences(selectedGroup.interferences);
        return flatInterferences;
    }, [selectedGroup]);

    // 🔥 Função para definir o grupo (atualiza a variável global)
    const setEquipmentGroupId = async (groupId: number): Promise<void> => {
        await setGlobalEquipmentGroupId(groupId);
        setCurrentOperationIndexState(0); // Reset para primeira operação
    };
     const setCompanyUnitId = async (companyUnitId: number): Promise<void> => {
        await setGlobalEquipmentGroupId(companyUnitId);
        setCurrentOperationIndexState(0); // Reset para primeira operação
    };

    // Função para definir operação pelo ID
    const setCurrentOperationById = (operationId: number): void => {
        const index = operations.findIndex((op) => op.operation_id === operationId);
        if (index !== -1) {
            setCurrentOperationIndexState(index);
        }
    };

    // Buscar grupo por ID
    const getGroupById = (groupId: number): EquipmentGroup | undefined => {
        return allGroups.find((group) => group.group_id === groupId);
    };

    // Buscar grupo por nome
    const getGroupByName = (groupName: string): EquipmentGroup | undefined => {
        return allGroups.find((group) =>
            group.group_name.toLowerCase() === groupName.toLowerCase()
        );
    };

    // Buscar operação por ID (busca em todos os grupos)
    const getOperationById = (operationId: number): Operation | undefined => {
        for (const group of allGroups) {
            const operation = group.operations.find((op) => op.operation_id === operationId);
            if (operation) return operation;
        }
        return undefined;
    };

    // 🔥 Limpar seleção (limpa a variável global)
    const clearSelection = async (): Promise<void> => {
        await setGlobalEquipmentGroupId(0);
        setCurrentOperationIndexState(0);
    };

    return (
        <OpContext.Provider
            value={{
                selectedGroup,
                equipmentGroupId,
                setEquipmentGroupId,
                setCompanyUnitId,
                operations,
                currentOperation,
                currentOperationIndex,
                setCurrentOperationIndex: setCurrentOperationIndexState,
                setCurrentOperationById,
                interferences,
                getAllInterferences: () => getAllInterferences,
                allGroups,
                getGroupById,
                getGroupByName,
                getOperationById,
                clearSelection,
            }}>{children}</OpContext.Provider>
    );
};

export const useOperations = (): OpContextData => {
    const context = useContext(OpContext);

    if (!context) {
        throw new Error('useOperations deve ser usado dentro de um OpProvider');
    }

    return context;
};