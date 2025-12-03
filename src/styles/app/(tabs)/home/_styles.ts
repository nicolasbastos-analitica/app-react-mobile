import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  // ==================================================
  // 1. ROOT & HEADER (Topo da Tela)
  // ==================================================
  containerGeral: {
    backgroundColor: "#FAFBFD",
    flex: 1,
  },
  containerHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    gap:4,
    marginLeft: 24,
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
    gap:4
  },
  textBlue: {
    color: "#FFF",
    fontFamily: 'Montserrat-Bold', // JÁ CORRETO
    fontSize: 11,
  },
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
    position: 'absolute',
    left: 1.7 // Cor verde da preta
  },
  customSwitchThumbActive: {
    alignSelf: 'flex-end', // Posição direita (ON)
  },
  customSwitchThumbInactive: {
    alignSelf: 'flex-start', // Posição esquerda (OFF)
  },

 styleActivation: {
    fontFamily: 'Montserrat-Bold', // JÁ CORRETO
    fontSize: 11,
  },

  // --- Botão Sair ---
  buttonSair: {
    backgroundColor: "#EF4C51",
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 52,
    marginRight: 24,
    marginTop: 24,
  },
  buttonSairLabel: {
    color: "#FFF",
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
  },

  // ==================================================
  // 2. BODY (Conteúdo Principal)
  // ==================================================
  containerBody: {
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 24,
    flex: 1,
  },

  // --- Info do Usuário ---
  containerUser: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  userTextContainer: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  panelUser: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#050412',
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
  ordemProducao: { // Usado tanto no usuário quanto no card da máquina
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    color: "#24C0DE",
    marginRight: 8,
    height: 15,
  },
  checkposition: {
    flexDirection: 'row',        // Alinha Texto e Ícone lado a lado
    justifyContent: 'space-between', // Texto na esquerda <---> Ícone na direita
    alignItems: 'center',        // Centraliza verticalmente

    // --- O SEGREDO ---
    flex: 1,                     // Faz essa View crescer e ocupar todo o espaço vazio da linha

    marginLeft: 12,              // (Opcional) Um espaço para não colar no ID
  },
  // --- Info da Máquina (Card Preto) ---
  maquinaInfo: {
    marginBottom: 24,
    marginTop: 24,
  },
  maquinaImg: {
    backgroundColor: '#000',
    height: 240,
    borderRadius: 12,
  },
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
  tituloMargin: {
    // Usado para ajustes extras se precisar
  },
  nmMaquina: {
    color: '#FFF',
    fontFamily: 'Montserrat',
    fontSize: 14,
    marginLeft: 8,
  },
  iconSeta: {
    marginLeft: 'auto',
  },

  // Detalhes da Máquina (Nº, Modelo, etc)
  numMAquinaContainer: {
    height: 32,
    width: 82,
    backgroundColor: 'rgba(5, 4, 18, 0.70)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    marginBottom: 8,
  },
  numMaquina: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#FFF',
    height: 17,
    width: 'auto',
  },
  numEquip: {
    color: '#FFF',
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    fontStyle: 'normal',
    marginLeft: 8,
    height: 17,
    width: 'auto',
  },
  modeloMAquinaContainer: {
    height: 32,
    backgroundColor: 'rgba(5, 4, 18, 0.70)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 16,
    marginBottom: 8,
    width: 'auto',
  },
  alinhamentoModelo: {
    marginLeft: 8,
  },

  // Botão de Ordem de Produção (Dentro da Máquina)
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
  },
  ordemProducaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  tituloOrdemProducao: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: "#050412",
    marginBottom: 8,
    height: 17,
  },
  zona: {
    color: "#050412",
    fontFamily: 'Montserrat',
    fontSize: 12,
  },
  ordemProducaoInfoSelected: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },

  // ==================================================
  // 3. INDICADORES & GRÁFICOS
  // ==================================================
  tituloIndicadores: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
    color: '#050412',
  },
  descricaoIndicadores: {
    color: '#625F7E',
    fontFamily: 'Montserrat',
    fontSize: 12,
    marginTop: 0.5,
    marginBottom: 8,
  },

  // Container dos Gráficos (Lado a Lado)
  graficos: {
    flexDirection: 'row',
    gap: 12,
  },
  containerIndicadores: {
    flex: 1, // Divide a tela em 50%
    marginBottom: 8,
  },

  // --- Card Padrão (Gráficos) ---
  card: {
    width: 'auto',
    height: 'auto',
    backgroundColor: 'rgba(0, 177, 107, 0.10)',
    borderRadius: 12,
    borderColor: '#F5F4FF',
    borderWidth: 1,
    alignContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
    overflow: 'hidden',
  },
  textMediaDia: {
    fontSize: 12,
    color: '#625F7E',
    marginBottom: 8,
    fontFamily: 'Montserrat',
  },
  textCard: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    color: '#050412',
    marginTop: 8,
    textAlign: 'center',
    height: 40,
    marginRight: 12,
    marginLeft: 12,
  },
  meta: {
    backgroundColor: "#FAFBFD",
    width: "100%",
    padding: 12,
    borderWidth: 1,
    flexDirection: 'row',
    borderColor: '#F5F4FF',
    justifyContent: 'space-between',
    gap: 'auto',
    alignItems: 'center',
    marginTop: 'auto', // Sticky Footer do Card
  },
  textMeta: {
    color: '#625F7E',
    fontFamily: 'Montserrat',
    fontSize: 10,
  },

  // --- Card de Horas/Velocidade ---
  cardHora: {
    width: 'auto',
    height: 'auto',
    borderRadius: 12,
    borderColor: '#F5F4FF',
    borderWidth: 1,
    alignContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
    overflow: 'hidden',
    backgroundColor: '#FAFBFD',
  },
  horas: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  contadorHora: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
  },
  hzinho: {
    fontFamily: 'Montserrat',
    fontSize: 12,
  },
  // Cores condicionais
  dentroDaMedia: {
    color: '#00B16B',
    paddingTop: 8,
  },
  foraDaMedia: {
    color: '#EF4C51',
    paddingTop: 8,
  },
  tituloCardHoras: {
    marginBottom: 12,
  },

  // ==================================================
  // 4. FOOTER (Botões de Ação)
  // ==================================================
  containerBottom: {
    borderTopWidth: 1,
    borderTopColor: '#D4D3DF',
    borderStyle: 'solid',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: 121,
    marginBottom: 24,
  },
  tituloBotoes: {
    flex: 1,
    fontFamily: 'Montserrat-Bold',
    fontSize: 22,
    marginTop: 24,
    marginLeft: 24,
    color: '#050412',
  },
  botaoProximo: {
    flexDirection: 'row',
    marginLeft: 24,
  },
  nextButton: {
    height: 56,
    borderRadius: 8,
    backgroundColor: "#00B16B",
    justifyContent: 'center',
    marginTop: 12,
    marginRight: 12,
    width: '45%',
  },
  nextButtonRed: {
    height: 56,
    borderRadius: 8,
    backgroundColor: "#EF4C51",
    justifyContent: 'center',
    marginTop: 12,
    marginRight: 12,
    width: '45%',
  },
  nextButtonLabel: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: 'Montserrat-Bold',
  },

  // ==================================================
  // 5. MODAL
  // ==================================================
  modalOrdemProducao: {
    flex: 1,
    height: 646,
    bottom: -34,
    position: 'absolute',
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '100%',
    alignSelf: 'center',
    zIndex: 9999,
  },
  modalInterferencia: {
    flex: 1,
    height: 'auto',
    bottom: -34,
    position: 'absolute',
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '100%',
    alignSelf: 'center',
    zIndex: 9999,
  },
  modalContainer: {
    flexDirection: 'column',
    flex: 1,
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 0,
    marginTop: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  modalInterferenciaContainer: {
    marginBottom: 24
  },
  tituloPaginaModal: {
    flex: 1,
    fontFamily: 'Montserrat-Bold',
    fontSize: 22,
    marginTop: 4,
    color: '#050412',
  },
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
  textExit: {
    fontFamily: "Montserrat",
    fontSize: 18,
    marginBottom: 24,
    marginTop: 24
  },
  botaoVoltarLabel: {
    fontFamily: "Font Awesome 6 Pro",
    fontSize: 14,
    color: '#625F7E',
    fontWeight: '600',
  },
  botaofecharModal: {
    // marginBottom: 12,
  },
  modalInput: {
    zIndex: 10,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
    marginTop: 24,
  },

  // Lista de Ordens dentro do Modal
  containerOrdens: {
    zIndex: 1,
    // marginBottom: 8,
  }, containerInterferencias: {
    marginBottom: 24
  },
  ordemProducaoItem: {
    backgroundColor: "#FAFBFD",
    borderColor: '#F5F4FF',
    borderWidth: 1,
    borderRadius: 8,
    height: 'auto',
    padding: 12,
    marginBottom: 8,
  },
  ordemProducaoItemSelected: {
    backgroundColor: "#050412",
    borderRadius: 8,
    height: 'auto',
    padding: 12,
    marginBottom: 8,
  },
  ordemProducaoInfo: {
    flexDirection: 'row',
    marginBottom: 4,
    alignContent: 'center',
    alignItems: 'center',
  },
  contornoIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  manutencao: {
    backgroundColor: '#EF4C51',
  },
  combustivel: {
    backgroundColor: "#FFD300"
  },
  transbordo: {
    backgroundColor: '#FF8845'
  },
  interferenciasOperacionais: {
    backgroundColor: '#1C899E'
  },
  interferenciaMotorLigado: {
    backgroundColor: '#050412'
  },
  ordemProducaoTextSelected: {
    color: '#24C0DE',
  },
  zonaTextSelected: {
    color: '#FFFFFF',
  },
  containerManutencao: {
    marginBottom: 10
  },
  // Elementos dentro do Item da Lista
  posicaoCheckModal1: {
    position: 'absolute',
    right: 12,
    top: '62%',
  },
  funcao: {
    color: "#050412",
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    height: 15,
  },
  funcaoTextSelected: {
    color: '#FAFBFD',
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    height: 15,
  },

  // Footer do Modal (Botão Selecionar/Iniciar)
  nextButtonModal: {
    height: 56,
    borderRadius: 8,
    backgroundColor: "#00B16B",
    justifyContent: 'center',
    margin: 24,
  },
  iniciarCicloContainerBottom: {
    borderTopWidth: 1,
    borderTopColor: '#D4D3DF',
    borderStyle: 'solid',
    // flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  botaoIniciarCiclo: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 118,
    // margin:24,
    // marginBottom:24
  },
  CicloButton: {
    borderRadius: 8,
    backgroundColor: "#00B16B",
    justifyContent: 'center',
    gap: 2,
    padding: 6,
    width: '80%',
    // height:4,
    // marginTop:24,
    // marginBottom:24
  },
  exitButtonModal: {
    backgroundColor: '#EF4C51'
  },
  CicloButtonLabel: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: 'Montserrat-Bold',
  },
  containerBotaoIniciar: {
    marginRight: 12
  },
});