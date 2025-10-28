import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  deviceName: { fontSize: 16, fontWeight: '500' },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#7f8c8d' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 15, fontSize: 16, color: '#3498db' },
  connectedContainer: { flex: 1 },
  infoText: { fontSize: 18, marginBottom: 10 },
  dataBox: {
    flex: 1, // Permite que ele cresça se houver espaço
    minHeight: 100, // Altura mínima caso não haja muito dado
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },

  // === ESTILOS ADICIONADOS ===
  sensorDisplay: { // <--- Adicionado
    width: '100%',
    padding: 15,
    backgroundColor: '#e9f5f8', // Um fundo levemente diferente
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#d0e0e3',
  },
  sensorTitle: { // <--- Adicionado
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  sensorText: { // <--- Adicionado
    fontSize: 16,
    marginBottom: 5,
    color: '#34495e',
  },
  errorText: { // <--- Adicionado
    fontSize: 16,
    color: '#c0392b', // Vermelho para erro
    fontWeight: 'bold',
  },
  // === FIM DOS ESTILOS ADICIONADOS ===
});