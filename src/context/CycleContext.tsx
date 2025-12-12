import { useCycle } from '@/src/context/CycleContext';
import { useOperations } from '@/src/context/OperationContext'; // Seu contexto de operação

// ... dentro do componente
const { getCycleForEquipment, getOperationsSequence } = useCycle();
const { companyUnitId, equipmentGroupId } = useOperations(); // Assumindo que você tem esses IDs

// 1. Carregar as operações quando a tela montar
useEffect(() => {
    if (companyUnitId && equipmentGroupId) {
        const cycle = getCycleForEquipment(companyUnitId, equipmentGroupId);
        
        if (cycle) {
            console.log("Automações disponíveis:", cycle.automation);
            console.log("Sequência de operações:", cycle.operation_sequence);
        } else {
            console.log("Nenhum ciclo configurado para esta máquina.");
        }
    }
}, [companyUnitId, equipmentGroupId]);