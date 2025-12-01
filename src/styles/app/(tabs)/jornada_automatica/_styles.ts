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
    paddingRight: 24,
    paddingLeft: 24,
    paddingTop: 32,
    paddingBottom: 16,
    backgroundColor: "#FAFBFD",
    borderBottomColor: "#F5F4FF",
    borderWidth: 1
  },

  // --- Switch do Header ---
  telemetria: {
    width: 180,
    height: 'auto',
    backgroundColor: '#050412',
    borderRadius: 8,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    flexDirection: 'row'
  },
  telemetriaTetxt: {
    color: "#FFF",
    fontFamily: "Montserrat",
    fontSize: 11,

  },
  separacaoTelemetria: {
    color: "#625F7E",
    marginRight: 6,
    marginLeft: 6,
  },
  

  // --- Botão Sair ---
  buttonSair: {
    backgroundColor: "#EF4C51",
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 80,
    // marginRight: 24,
    // marginTop: 24,
  },
  buttonSairLabel: {
    color: "#FFF",
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
  },

  containerBody: {
    backgroundColor: "#FFF",
    flex: 1
  },
  containerEvento: {
    marginTop: 16,
    marginBottom: 16,
    marginLeft: 24,
    marginRight: 24,
    backgroundColor: "#FFF",
    width: 'auto',
    height: 456,
    borderWidth: 1,
    borderColor: '#D4D3DF',
    // flex: 1,
    borderRadius:8

  },
  elementosHeaderEvento: {
    height: "auto",
    borderBottomWidth: 1,
    borderColor: '#D4D3DF',
    flexDirection:'row',
    alignItems:'center',
    padding:12
  },
  textEvento:{
    flexDirection:'column',
    marginLeft:16
  },
  textEventoSubTitulo:{
    fontFamily:'Montserrat',
    fontSize:9,
    color:'#625F7E'
  },
  textoTituloEvento:{
    fontFamily:'Montserrat-Bold',
    color:'#050412',
    fontSize:14,
  },
  iconSeta: {
    marginLeft: 'auto',
  },
  elementosBodyEvento:{
    backgroundColor:'#E6F8F1',
    height:'auto',
    alignItems:'center',
    padding:16
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
    alignContent:'center',
    borderRadius: 24,
    // marginTop: 16,
    // marginRight: ,
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
    // marginTop: 16,
    // marginRight: 24,
    gap:4
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
    position:'absolute',
    left:1.7 // Cor verde da preta
  },
  customSwitchThumbActive: {
    alignSelf: 'flex-end', // Posição direita (ON)
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
  contornoIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  eventoAtivoIcon: {
    backgroundColor: 'rgba(0, 177, 107, 0.10)'
  },
  eventoAutomaticoContador:{
    height:'auto',
    justifyContent:"center",
    alignContent:'center',
    alignItems:'center'
  },
  eventoAutomaticoContadorTitulo:{
    fontFamily:'Montserrat-Bold',
    fontSize:12,
    color:'#00B16B'

  },
  // ==================================================
  // 2. ELEMENTOS COMPARTILHADOS (Lista, Textos)
  // ==================================================
  ordemProducao: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    color: "#24C0DE",
    marginRight: 8,
    height: 15,
  },
  checkposition: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
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
  funcaoTextSelected: {
    color: '#FAFBFD',
    fontFamily: 'Montserrat-Bold',
    fontSize: 12,
    height: 15,
  },

  // ==================================================
  // 3. MODAL
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
    height: 40,
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
  botaoVoltarLabel: {
    fontFamily: "Font Awesome 6 Pro",
    fontSize: 14,
    color: '#625F7E',
    fontWeight: '600',
  },
  botaofecharModal: {
    marginBottom: 12,
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
    marginBottom: 8,
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
  ordemProducaoTextSelected: {
    color: '#24C0DE',
  },
  zonaTextSelected: {
    color: '#FFFFFF',
  },

  // Elementos dentro do Item da Lista
  posicaoCheckModal1: {
    position: 'absolute',
    right: 12,
    top: '62%',
  },

  // Footer do Modal (Botão Selecionar/Iniciar)
  botaoProximo: {
    flexDirection: 'row',
    marginLeft: 24,
  },
  nextButtonModal: {
    height: 56,
    borderRadius: 8,
    backgroundColor: "#00B16B",
    justifyContent: 'center',
    margin: 24,
  },
  nextButtonLabel: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: 'Montserrat-Bold',
  },
  iniciarCicloContainerBottom: {
    borderTopWidth: 1,
    borderTopColor: '#D4D3DF',
    borderStyle: 'solid',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  botaoIniciarCiclo: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 118,
  },
  CicloButton: {
    borderRadius: 8,
    backgroundColor: "#00B16B",
    justifyContent: 'center',
    gap: 2,
    padding: 6,
    width: '80%',
  },
  CicloButtonLabel: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: 'Montserrat-Bold',
  },
});