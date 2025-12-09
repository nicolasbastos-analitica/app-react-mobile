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
    gap: 4
  },
containerBlueSwitchOFF: {
    backgroundColor: '#EF4C51',
    width: 150,
    marginLeft: 24,
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    marginTop: 32,
    marginRight: 24,
    gap: 4
  },

  customSwitchTrackOFF: {
    width: 25,
    height: 17, // Altura da barra
    backgroundColor: '#EF4C51', // Cor escura do trilho
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#050412",
    padding: 3, // Espaçamento interno
    justifyContent: 'center',
  },

  customSwitchThumbOFF: {
    width: 9, // Largura da bolinha (MENOR que a altura da barra: 20)
    height: 9, // Altura da bolinha
    borderRadius: 7,
    backgroundColor: '#000',
    position: 'absolute',
    left: 1.7 // Cor verde da preta
  },

  customSwitchThumbInactive: {
    alignSelf: 'flex-start', // Posição esquerda (OFF)
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
    flex: 1, // <--- ADICIONE ISSO

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
    marginTop: 24,
    // fontStyle: 'normal', // Pode ser removido
    // fontWeight: '700', // REMOVIDO
    color: '#050412',
  },
  subTitulos: {
    color: "#050412",
    fontFamily: 'Montserrat',
    fontSize: 12,
    marginTop: 16,
  },
  // 4.3. INPUT DE BUSCA
  input: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    marginTop: 8,
  },

  // 4.4. CARD DA MÁQUINA (ImageBackground)
  maquinaInfo: {
    // height: 126,
    marginBottom: '25%'
  },
  maquinaImg: {
    backgroundColor: '#000',
    // height: 126,
    borderRadius: 12,
  },
  blurIMG: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)', // Preto com 55% de opacidade (ajuste 0.90 para o que você precisa)
    borderRadius: 12,
    height: '100%',
    width: '100%',
  },
  // 4.4.1. TÍTULO MÁQUINA (COLHEDORA)
  tituloMaquina: {
    // height: 32,
    // width: 135,
    alignSelf: 'flex-start', // <--- ADICIONE ISSO: Faz o container ter a largura do conteúdo
    // padding:8,
    backgroundColor: 'rgba(5, 4, 18, 0.70)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // marginBottom: 8,
    // padding: 8,
    marginTop: 16,
    marginLeft: 16,
    // width:'auto',
    borderRadius: 4, // Opcional
  },
  nmMaquina: {
    color: '#FFF',
    fontFamily: 'Montserrat-Bold', // ADICIONADO
    fontSize: 16,
    // flex:1
    // marginLeft: 8,
    padding:8
  },
  tituloMargin: {
    // marginBottom: 8
  },

  // 4.4.2. NÚMERO MÁQUINA
  numMAquinaContainer: {
    height: 32,
    // width: 82,
    backgroundColor: 'rgba(5, 4, 18, 0.70)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 16,
    marginBottom: 8,
    paddingHorizontal: 8, // <--- ADICIONE ISSO: Dá um respiro lateral para o texto não colar na borda
    alignSelf: 'flex-start', // <--- ADICIONE ISSO
    borderRadius: 4, // Opcional
  },
  numMaquina: {
    fontFamily: 'Montserrat', // ADICIONADO
    fontSize: 14,
    color: '#FFF'
  },
  numEquip: {
    color: '#FFF',
    fontFamily: 'Montserrat-Bold', // JÁ CORRETO
    fontSize: 14,
    fontStyle: 'normal',
    marginLeft: 8
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
    paddingHorizontal: 8, // <--- ADICIONE ISSO
    alignSelf: 'flex-start', // <--- ADICIONE ISSO
    borderRadius: 4, // Opcional
  },
  alinhamentoModelo: {
    marginLeft: 8
  },
emptyContainer: {
    flex: 1,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginVertical: 20,
},
emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
},
  // 5. BOTÃO PRÓXIMO E SEPARADOR (RODAPÉ)
  botaoProximo: {
    // marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#D4D3DF',
    borderStyle: 'solid',
  },
  nextButton: {
    height: 56,
    borderRadius: 8,
    backgroundColor: "#00B16B",
    justifyContent: 'center',
    margin: 24,
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

  customSwitchThumb: {
    width: 9, // Largura da bolinha (MENOR que a altura da barra: 20)
    height: 9, // Altura da bolinha
    borderRadius: 7,
    backgroundColor: '#00B16B', // Cor verde da bolinha
  },

  customSwitchThumbActive: {
    alignSelf: 'flex-end', // Posição direita (ON)
  },
 
  panelContent: {
    padding: 24,
    paddingBottom: 40,
  },
  modalOrdemProducao: {
    flex: 1,
    height: 646,
    bottom: -34,
    position: 'absolute',
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '100%',
    alignSelf: 'center',
    // padding: 16,
    zIndex: 9999,
  }, tituloPaginaModal: {
    flex: 1,
    fontFamily: 'Montserrat-Bold', // ATUALIZADO (era Montserrat + fontWeight: 700)
    fontSize: 22,
    marginTop: 4,
    // marginTop: 24,
    // fontStyle: 'normal', // Pode ser removido
    // fontWeight: '700', // REMOVIDO
    color: '#050412',
  },
  modalContainer: {
    flexDirection: 'column', // <--- ADICIONE ISSO
    flex: 1,
    marginLeft: 24,
    marginRight: 24,
    marginBottom:0,
    marginTop: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    // flex:0.1,
    alignContent: 'center',
    height: 40,

  }, botaofecharModal: {
    marginBottom: 12,
  }, modalInput: {
    // flex:1,
    zIndex: 10,
    marginBottom: 4,
  }, containerOrdens: {
    // flex:1,
    zIndex: 1,
    marginBottom: 8,
  },
  ordemProducaoItem: {
    // flex:1,
    backgroundColor: "#FAFBFD",
    borderColor: '#F5F4FF',
    borderWidth: 1,
    borderRadius: 8,
    height: 58,
    padding: 12,
    marginBottom: 8,
  },
  ordemProducaoInfo: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  ordemProducao: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    color: "#24C0DE",
    marginRight: 8,
    height: 15,

  },
  zona: {
    color: "#050412",
    fontFamily: 'Montserrat',
    fontSize: 12,

  },
  funcao: {
    color: "#050412",
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    height: 15,

  },
  posicaoCheckModal1:{
    position:'absolute',
    right: 12, // Joga pra direita
    top: '62%',   // Alinha no topo (ajuste conforme padding do item)
  },
  nextButtonModal: {
    height: 56,
    borderRadius: 8,
    backgroundColor: "#00B16B",
    justifyContent: 'center',
    margin: 24,
  },
  ordemProducaoItemSelected: {
    // flex:1,
    backgroundColor: "#050412",
    // flex:1,
    borderRadius: 8,
    height: 58,
    padding: 12,
    marginBottom: 8,
  },
  ordemProducaoTextSelected: {
    color: '#24C0DE',
  },
  zonaTextSelected: {
    color: '#FFFFFF',
  },
  funcaoTextSelected: {
    color: '#FAFBFD',
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    height: 15,
  },
  modalContainer2: {
    flexDirection: 'column', // <--- ADICIONE ISSO
    flex: 1,
    marginLeft: 24,
    marginRight: 24,
    marginTop: 24,
  },
  modalOrdemProducao2: {
    flex: 1,
    height: 726,
    bottom: -34,
    position: 'absolute',
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '100%',
    alignSelf: 'center',
    // padding: 16,
    zIndex: 9999,
  },
  maquinaInfoModal: {
    marginTop: 24,
    marginBottom: 24,
  },
  turnnoItem: {
    // flex:1,
    marginBottom: 8,
    backgroundColor: "#FAFBFD",
    borderColor: '#F5F4FF',
    borderWidth: 1,
    borderRadius: 8,
    height: 58,
    padding: 12,
    // marginBottom: 8,
    flexDirection: 'column'
  },
  turnnoItemSelected: {
    // flex:1,
    backgroundColor: "#050412",
    borderRadius: 8,
    height: 58,
    padding: 12,
    // marginBottom: 8,
  },
  turnoInfo: {
    flexDirection: 'column',
    marginBottom: 4,
  },
  turno: {
    color: "#050412",
    fontFamily: 'Montserrat',
    fontSize: 12,
    height: 15,

  },
  tituloOrdemProducao: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: "#050412",
    marginBottom: 8,
    height: 17
  },
  ordemProducaoInfoSelected: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
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
  modalScrollWrapper: {
    flex: 1, // Isso garante que esta área absorva o espaço restante após os cabeçalhos
    marginTop: 10,
  },
  scrollViewTurnos: {
    flex: 1,
  }
});