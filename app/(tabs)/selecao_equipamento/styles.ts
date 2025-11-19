import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  // 1. GERAL / ROOT
  containerGeral: {
    backgroundColor: "#FAFBFD",
    flex: 1, // <--- ADICIONE ISSO
  },
  containerHeader: {
    display: 'flex',
    flexDirection: 'row',
    // justifyContent:'space-between',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  // 2. BOTÃO DE VOLTAR
  botaoVoltar: {
    display: 'flex',
    justifyContent: 'center',
    width: 40,
    height: 40,
    alignItems: 'center',
    backgroundColor: '#F5F4FF',
    borderRadius: 8,
    margin: 0,
  },
  botaoVoltarLabel: {
    fontFamily: "Font Awesome 6 Pro", // MANTIDO: Fontes de ícone não devem ser alteradas
    fontSize: 14,
    color: '#625F7E',
    fontWeight: '600', // MANTIDO: Por ser uma fonte de ícone
  },
  botaoVoltarRecuperarSenha: {
    marginTop: 32,
    marginLeft: 24,
    marginRight: 24,
  },

  // 3. SWITCH BLUE_350
  containerBlueSwitchON: {
    backgroundColor: '#00B16B',
    width: 150,
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    marginTop: 32,
    marginRight: 24,
    gap:4
  },
  containerBlueSwitchOFF: {
    backgroundColor: '#EF4C51',
    width: 150,
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    marginTop: 32,
    marginRight: 24,
    gap:4
  },
  textBlue: {
    color: "#FFF",
    fontFamily: 'Montserrat-Bold', // JÁ CORRETO
    fontSize: 11,
  },
  styleActivation: {
    fontFamily: 'Montserrat-Bold', // JÁ CORRETO
    fontSize: 11,
  },

  // 4. CORPO PRINCIPAL
  containerBody: {
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 24,
    flex: 1,
  },

  // 4.1. CONTAINER DO USUÁRIO
  containerUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTextContainer: {
    marginLeft: 12,
    justifyContent: 'center',
    marginTop: 24,
  },
  panelUser: {
    fontFamily: 'Montserrat', // JÁ CORRETO
    fontSize: 14,
    color: '#050412',
  },
  panelDescription: {
    fontFamily: 'Montserrat', // JÁ CORRETO
    fontSize: 12,
    color: '#050412',
    marginBottom: 24,
  },
  numRegistro: {
    fontFamily: 'Montserrat-Bold', // JÁ CORRETO
  },

  // 4.2. TÍTULO DA PÁGINA
  tituloPagina: {
    fontFamily: 'Montserrat-Bold', // ATUALIZADO (era Montserrat + fontWeight: 700)
    fontSize: 22,
    // fontStyle: 'normal', // Pode ser removido
    // fontWeight: '700', // REMOVIDO
    color: '#050412',
  },

  // 4.3. INPUT DE BUSCA
  input: {
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
    marginTop: 24,
  },

  // 4.4. CARD DA MÁQUINA (ImageBackground)
  maquinaInfo: {
    height: 240,
    marginBottom: '25%'
  },
  maquinaImg: {
    backgroundColor: '#000',
    height: 240,
    borderRadius: 12,
  },

  // 4.4.1. TÍTULO MÁQUINA (COLHEDORA)
  tituloMaquina: {
    height: 32,
    width: 135,
    backgroundColor: 'rgba(5, 4, 18, 0.70)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    padding: 8,
    marginTop: 16,
    marginLeft: 16,
  },
  nmMaquina: {
    color: '#FFF',
    fontFamily: 'Montserrat', // ADICIONADO
    fontSize: 14,
    marginLeft: 8,
  },
  tituloMargin: {
    marginBottom: 82
  },

  // 4.4.2. NÚMERO MÁQUINA
  numMAquinaContainer: {
    height: 32,
    width: 82,
    backgroundColor: 'rgba(5, 4, 18, 0.70)',
    // display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    marginBottom: 8
  },
  numMaquina: {
    fontFamily: 'Montserrat', // ADICIONADO
    fontSize: 14,
    color: '#FFF',
    height:17

  },
  numEquip: {
    color: '#FFF',
    fontFamily: 'Montserrat-Bold', // JÁ CORRETO
    fontSize: 14,
    fontStyle: 'normal',
    marginLeft: 8,
    height:17
    
  },

  // 4.4.3. MODELO MÁQUINA
  modeloMAquinaContainer: {
    height: 32,
    backgroundColor: 'rgba(5, 4, 18, 0.70)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 16,
    marginBottom: 8,
  },
  alinhamentoModelo: {
    marginLeft: 8
  },

  // 5. BOTÃO PRÓXIMO E SEPARADOR (RODAPÉ)
  botaoProximo: {
    borderTopWidth: 1,
    borderTopColor: '#D4D3DF',
    borderStyle: 'solid',
  },
  nextButton: {
    height: 56,
    borderRadius: 8,
    backgroundColor: "#00B16B",
    justifyContent: 'center',
    margin:24,
  },
  nextButtonLabel: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: 'Montserrat-Bold', // ATUALIZADO (era fontWeight: bold)
    // fontWeight: 'bold', // REMOVIDO
  },
  // ... no seu styles.js

  // Adicione esta seção de estilo para o switch customizado
  customSwitchTrack: {
    width: 25,
    height: 17, // Altura da barra
    backgroundColor: '#050412', // Cor escura do trilho
    borderRadius: 10,
    padding: 3, // Espaçamento interno
    justifyContent: 'center',
  },
  customSwitchTrackOFF: {
    width: 25,
    height: 17, // Altura da barra
    backgroundColor: '#EF4C51', // Cor escura do trilho
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "050412",
    padding: 3, // Espaçamento interno
    justifyContent: 'center',
  },
  customSwitchThumb: {
    width: 9, // Largura da bolinha (MENOR que a altura da barra: 20)
    height: 9, // Altura da bolinha
    borderRadius: 7,
    backgroundColor: '#00B16B', // Cor verde da bolinha
  },
  customSwitchThumbOFF: {
    width: 9, // Largura da bolinha (MENOR que a altura da barra: 20)
    height: 9, // Altura da bolinha
    borderRadius: 7,
    backgroundColor: '#000',
    position:'absolute',
    left:1.7 // Cor verde da preta
  },
  customSwitchThumbActive: {
    alignSelf: 'flex-end', // Posição direita (ON)
  },
  customSwitchThumbInactive: {
    alignSelf: 'flex-start', // Posição esquerda (OFF)
  },
});