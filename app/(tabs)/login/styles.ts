import { BackHandler, StyleSheet } from "react-native";
import { Modal } from "react-native-paper";

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Seu botão de Login (gatilho)
  botao_login: {
    position: 'absolute',
    bottom: 120,
    height: 56,
    width: '80%',
    backgroundColor: "#00B16B",
    borderRadius: 8,
    justifyContent: 'center',
  },
  botao_sincronizacao: {
    position: 'absolute',
    bottom: 50,
    height: 56,
    width: '80%',
    backgroundColor: "#007d4c",
    borderRadius: 8,
    justifyContent: 'center',
  },
  botao_login_label: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: 'bold',
  },

  // --- NOVOS ESTILOS PARA O PAINEL BRANCO ---

  // O container do Modal (a "parte branca")
  panelContainer: {
    backgroundColor: '#FAFBFD',
    position: 'absolute',
    bottom: -39,
    borderRadius: 23,
    width: '100%',
    maxHeight: '80%',
  },
  passwordPanelContainer: {
    backgroundColor: '#FAFBFD',
    position: 'absolute',
    width: '100%',
    height: '100%',
    bottom: -26,
  },
  panelContent: {
    padding: 24,
    paddingBottom: 40,
  },

  panelTitle: {
    fontSize: 28,
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 24,
  },
  panelDescription: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
  },
  panelDescriptionPassword: {
    fontSize: 16,
    color: '#050412',
    marginBottom: 24,
  },
  panelUser: {
    fontSize: 20,
    color: '#666666',
    // marginBottom: 24,
  },
  containerUser: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  containerItens: {
    marginTop: 36,
    marginBottom: 36,
    marginLeft: 24,
    marginRight: 24,
  },
  userTextContainer: {
    marginLeft: 16,
    justifyContent: 'center',
    // alignItems:'center',
    marginTop: 21,
  },
  numRegistro: {
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#FFFFFF', // Fundo do input
    marginBottom: 24,
  },
  botaoVoltar: {
    display: 'flex',
    padding: 4,
    justifyContent: 'center',
    width: 120,
    alignItems: 'center',
    gap: 12,
    // marginLeft: 24,
    backgroundColor: '#F5F4FF',
    borderRadius: 8,
  },
  botao_esqueci_senha: {
    backgroundColor: 'rgba(0, 177, 107, 0.10)',
    color: 'black',
    paddingBottom: 8,
    paddingTop: 8,
    paddingLeft: 12,
    paddingRight: 12,
    marginBottom:24,
    justifyContent:'center',
    width:200,
    // height:40,
  },
  label_botao_esqueci_senha: {
    color: '#00B16B',
    fontSize:14,
    fontFamily:'Montserrat',
    fontWeight:700,
  },
  botaoVoltarLabel: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#625F7E',
    fontWeight: '600',

  },

  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 16,
    backgroundColor: '#E0E0E0', // Cor da bolinha inativa
    marginHorizontal: 4,
    gap: 24,
  },
  dotActive: {
    backgroundColor: '#00B16B', // Cor da bolinha ativa
  },
  iniciarButton: {
    height: 56,
    borderRadius: 8,
    backgroundColor: "#00B16B",
    justifyContent: 'center',
  },
  iniciarButtonLabel: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: 'bold',
  },

});