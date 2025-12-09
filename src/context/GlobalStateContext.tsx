import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface GlobalStateData {
    equipmentGroupId: number | null;
    equipmentNumber: string;
    lastSync: string;
    currentShift: string;
    selectedMachine: string;
}

interface GlobalStateContextData extends GlobalStateData {
    setEquipmentGroupId: (value: number) => Promise<void>;
    setEquipmentNumber: (value: string) => Promise<void>;
    setLastSync: (value: string) => Promise<void>;
    setCurrentShift: (value: string) => Promise<void>;
    setSelectedMachine: (value: string) => Promise<void>;
    clearGlobalState: () => Promise<void>;
    isLoading: boolean;
}

const GlobalStateContext = createContext<GlobalStateContextData>({} as GlobalStateContextData);

interface GlobalStateProviderProps {
    children: ReactNode;
}

const STORAGE_KEY = '@global_state';

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({ children }) => {
    const [equipmentGroupId, setEquipmentGroupIdState] = useState<number | null>(null);
    const [equipmentNumber, setEquipmentNumberState] = useState<string>('');
    const [lastSync, setLastSyncState] = useState<string>('');
    const [currentShift, setCurrentShiftState] = useState<string>('');
    const [selectedMachine, setSelectedMachineState] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        loadStoredData();
    }, []);

    const loadStoredData = async (): Promise<void> => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data: GlobalStateData = JSON.parse(stored);
                setEquipmentGroupIdState(data.equipmentGroupId ??  null);
                setEquipmentNumberState(data.equipmentNumber || '');
                setLastSyncState(data.lastSync || '');
                setCurrentShiftState(data.currentShift || '');
                setSelectedMachineState(data.selectedMachine || '');
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveData = async (updates: Partial<GlobalStateData>): Promise<void> => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            const currentData: GlobalStateData = stored 
                ? JSON.parse(stored) 
                : { 
                    equipmentGroupId: null,
                    equipmentNumber: '', 
                    lastSync: '', 
                    currentShift: '', 
                    selectedMachine: '' 
                };
            
            const newData = { ...currentData, ...updates };
            await AsyncStorage.setItem(STORAGE_KEY, JSON. stringify(newData));
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
        }
    };

    const setEquipmentGroupId = async (value: number): Promise<void> => {
        setEquipmentGroupIdState(value);
        await saveData({ equipmentGroupId: value });
    };

    const setEquipmentNumber = async (value: string): Promise<void> => {
        setEquipmentNumberState(value);
        await saveData({ equipmentNumber: value });
    };

    const setLastSync = async (value: string): Promise<void> => {
        setLastSyncState(value);
        await saveData({ lastSync: value });
    };

    const setCurrentShift = async (value: string): Promise<void> => {
        setCurrentShiftState(value);
        await saveData({ currentShift: value });
    };

    const setSelectedMachine = async (value: string): Promise<void> => {
        setSelectedMachineState(value);
        await saveData({ selectedMachine: value });
    };

    const clearGlobalState = async (): Promise<void> => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            setEquipmentGroupIdState(null);
            setEquipmentNumberState('');
            setLastSyncState('');
            setCurrentShiftState('');
            setSelectedMachineState('');
        } catch (error) {
            console.error('Erro ao limpar dados:', error);
        }
    };

    return (
        <GlobalStateContext. Provider
            value={{
                equipmentGroupId,
                equipmentNumber,
                lastSync,
                currentShift,
                selectedMachine,
                setEquipmentGroupId,
                setEquipmentNumber,
                setLastSync,
                setCurrentShift,
                setSelectedMachine,
                clearGlobalState,
                isLoading,
            }}
        >
            {children}
        </GlobalStateContext.Provider>
    );
};

export const useGlobalState = (): GlobalStateContextData => {
    const context = useContext(GlobalStateContext);
    
    if (! context) {
        throw new Error('useGlobalState deve ser usado dentro de um GlobalStateProvider');
    }
    
    return context;
};