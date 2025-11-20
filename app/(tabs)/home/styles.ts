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
    backgroundColor: '#3B82F6',
    width: 75,
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    marginTop: 32,
    marginRight: 24,
    gap: 4,
    marginLeft: 24
  },
  containerBlueSwitchOFF: {
    backgroundColor: '#FAFBFD',
    width: 75,
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    marginTop: 32,
    marginRight: 24,
    gap: 4,
    borderWidth: 2,
    borderColor: '#050412',
  },
  textBlue: {
    color: "#FFF",
    fontFamily: 'Montserrat-Bold', // JÁ CORRETO
    fontSize: 11,
  },
  styleActivation: {
    fontFamily: 'Montserrat-Bold', // JÁ CORRETO
    fontSize: 11,
    color: "#050412",
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
    marginTop: 24,
  },
  userTextContainer: {
    marginLeft: 12,
    justifyContent: 'center',
    // marginTop: 24,
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
    marginBottom: '25%',
    marginTop: 24,
  },
  maquinaImg: {
    backgroundColor: '#000',
    height: 240,
    borderRadius: 12,
  },

  // 4.4.1. TÍTULO MÁQUINA (COLHEDORA)
  tituloMaquina: {
    height: 32,
    width: 280,
    backgroundColor: 'rgba(5, 4, 18, 0.70)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  iconSeta: {
    marginLeft: 'auto',
  },
  tituloMargin: {
    // marginBottom: 82
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
    height: 17,
    width: 'auto'

  },
  numEquip: {
    color: '#FFF',
    fontFamily: 'Montserrat-Bold', // JÁ CORRETO
    fontSize: 14,
    fontStyle: 'normal',
    marginLeft: 8,
    height: 17,
    width: 'auto'

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
    width: 'auto'
  },
  alinhamentoModelo: {
    marginLeft: 8
  },

  // 5. BOTÃO PRÓXIMO E SEPARADOR (RODAPÉ)
  botaoProximo: {
   
    flexDirection: 'row',
    marginLeft: 24,

  },
  nextButton: {
    height: 56,
    borderRadius: 8,
    backgroundColor: "#00B16B",
    justifyContent: 'center',
    // margin: 24,
    marginTop: 12,
    marginRight: 12,
    width:'45%',
  },
  nextButtonRed:{
    height: 56,
    borderRadius: 8,
    backgroundColor: "#EF4C51",
    justifyContent: 'center',
    // margin: 24,
    marginTop: 12,
    marginRight: 12,
    width:'45%',
  },
  tituloBotoes: {
    flex: 1,
    fontFamily: 'Montserrat-Bold', // ATUALIZADO (era Montserrat + fontWeight: 700)
    fontSize: 22,
    marginTop: 24,
    marginLeft: 24,

    // marginTop: 24,
    // fontStyle: 'normal', // Pode ser removido
    // fontWeight: '700', // REMOVIDO
    color: '#050412',
  },
  containerBottom: {
    borderTopWidth: 1,
    borderTopColor: '#D4D3DF',
    borderStyle: 'solid',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: 121,
    marginBottom: 24

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
    backgroundColor: '#FFF', // Cor escura do trilho
    borderRadius: 10,
    padding: 3, // Espaçamento interno
    justifyContent: 'center',
  },
  switch: {
    marginLeft: 30,
    marginBottom: 4
  },
  customSwitchTrackOFF: {
    width: 25,
    height: 17, // Altura da barra
    backgroundColor: '#FAFBFD', // Cor escura do trilho
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
    backgroundColor: '#3B82F6', // Cor verde da bolinha
  },
  customSwitchThumbOFF: {
    width: 9, // Largura da bolinha (MENOR que a altura da barra: 20)
    height: 9, // Altura da bolinha
    borderRadius: 7,
    backgroundColor: '#000',
    position: 'absolute',
    left: 1.7 // Cor verde da preta
  },
  customSwitchThumbActive: {
    alignSelf: 'flex-end', // Posição direita (ON)
  },
  customSwitchThumbInactive: {
    alignSelf: 'flex-start', // Posição esquerda (OFF)
  },
  buttonSair: {
    backgroundColor: "#EF4C51",
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 52,
    marginRight: 24,
    marginTop: 24
  },
  buttonSairLabel: {
    color: "#FFF",
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
  },
  turnoInfo: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  turno: {
    color: "#050412",
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    height: 15,

  },
  ordemProducao: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    color: "#24C0DE",
    marginRight: 8,
    height: 15,

  },
  iconBluetooth: {
    marginRight: 8,
    marginBottom: 4
  },
  ordemProducaoItemTurno: {
    height: 83,
    backgroundColor: '#F5F4FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4D3DF',
    padding: 12,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 24,
    // marginBottom: 24,
  },
  tituloOrdemProducao: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: "#050412",
    marginBottom: 8,
    height: 17
  }, zona: {
    color: "#050412",
    fontFamily: 'Montserrat',
    fontSize: 12,

  }, ordemProducaoInfoSelected: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
  ordemProducaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between'
  },
  containerIndicadores:{
    // flex:1,
    // marginTop:'6%'
  },
  tituloIndicadores:{

  },

});