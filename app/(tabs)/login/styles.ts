import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#000'
  },
  afterClick1: {
    position: 'absolute',
    top: '40%'
  },
  // Botão "Iniciar" (Background)
  logoContainer: {
    position: 'absolute',
    top: '40%',
    alignItems: 'center',
  },
  logoAnalitica: {
    width: 250,
    height: 80,
    marginBottom: 16,
  },
  versionText: {
    fontFamily: 'Montserrat', // Adicionado
    color: '#FFFFFF',
    fontSize: 14,
    // fontWeight: '500', // Removido para garantir uso da fonte correta, ou mantenha se a fonte suportar pesos
    position: 'absolute',
    top: '75%',
    alignItems: 'center',
  },
  botaoLogin: {
    position: 'absolute',
    bottom: 120,
    height: 56,
    width: '80%',
    backgroundColor: "#00B16B",
    borderRadius: 8,
    justifyContent: 'center',
    alignContent: 'center'
  },
  // Label dos botões Iniciar e Sincronizar (Background)
  botaoLoginLabel: {
    fontFamily: 'Montserrat-Bold', // Alterado de bold para a fonte específica
    fontSize: 18,
    color: "#FFFFFF",
  },
  // Botão "Sincronizar" (Background)
  botaoSincronizacao: {
    position: 'absolute',
    bottom: 50,
    height: 56,
    width: '80%',
    backgroundColor: "#007d4c",
    borderRadius: 8,
    justifyContent: 'center',
  },

  // --- Modal 1: Painel de Login (Registro) ---

  // O container do Modal (a "parte branca")
  panelContainer: {
    backgroundColor: '#FAFBFD',
    position: 'absolute',
    bottom: -39,
    borderRadius: 23,
    width: '100%',
    maxHeight: '80%',
  },
  panelContent: {
    padding: 24,
    paddingBottom: 40,
  },
  containerItens: {
    // Styles comentados mantidos como no original
  },
  // Título "Login"
  panelTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold', // Já estava correto
    color: '#000000',
    marginBottom: 24,
  },
  // Descrição "Digite o número..."
  panelDescription: {
    fontFamily: 'Montserrat', // Já estava correto
    fontSize: 12,
    color: '#050412',
    marginBottom: 24,
  },

  input: {
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
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
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
    gap: 24,
  },
  dotActive: {
    backgroundColor: '#00B16B',
  },
  // Botão "Iniciar" (Dentro do Modal 1)
  iniciarButton: {
    height: 56,
    borderRadius: 8,
    backgroundColor: "#00B16B",
    justifyContent: 'center',
  },
  // Label do botão "Iniciar" (Dentro do Modal 1)
  iniciarButtonLabel: {
    fontFamily: 'Montserrat-Bold', // Alterado de bold para a fonte
    fontSize: 18,
    color: "#FFFFFF",
  },

  // --- Modal 2: Painel de Senha ---

  passwordPanelContainer: {
    backgroundColor: '#FAFBFD',
    position: 'absolute',
    width: '100%',
    height: 416,
    bottom: -35,
    borderRadius: 20,
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
  // Label do botão de voltar - MANTIDO FONT AWESOME PARA NÃO QUEBRAR O ÍCONE
  botaoVoltarLabel: {
    fontFamily: "Font Awesome 6 Pro", 
    fontSize: 14,
    color: '#625F7E',
    fontWeight: '600',
  },
  containerUser: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTextContainer: {
    marginLeft: 12,
    justifyContent: 'center',
    marginTop: 24,
  },
  panelUser: {
    fontFamily: 'Montserrat', // Já estava correto
    fontSize: 14,
    color: '#050412',
  },
  numRegistro: {
    fontFamily: 'Montserrat-Bold', // Já estava correto
  },
  panelDescriptionPassword: {
    fontSize: 16,
    fontFamily: 'Montserrat', // Já estava correto
    color: '#050412',
    marginBottom: 24,
  },
  botaoEsqueciSenha: {
    backgroundColor: 'rgba(143, 140, 181, 0.10)',
    color: 'black',
    marginBottom: 24,
    justifyContent: 'center',
    width: 200,
    height:33,
    borderRadius: 100,
    alignContent:'center',
    alignItems:'center'
  },
  labelBotaoEsqueciSenha: {
    color: '#625F7E',
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
   gap:12,
     // Alterado (era Montserrat + fontWeight 700)
  },
  botaoEntrar: {
    display: 'flex',
    height: 56,
    borderRadius: 8,
    backgroundColor: "#00B16B",
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBotaoEntrar: {
    fontFamily: 'Montserrat-Bold', // Alterado (era fontWeight 600)
    fontSize: 18,
    color: "#FFFFFF",
  },

  // Recuperação de senha :

  containerPasssword: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
  botaoVoltarRecuperarSenha: {
    marginTop: 32,
    marginLeft: 24,
    marginRight: 24,
  },
  containerBody: {
    padding: 24,
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  Titulo: {
    color: '#050412',
    fontFamily: 'Montserrat-Bold', // Já estava correto
    fontSize: 20,
    marginBottom: 24,
  },
  textoEsqueceuSenha: {
    fontFamily: 'Montserrat', // Já estava correto
    color: '#050412',
    fontSize: 16,
    marginBottom: 24,
  },
  inputRecuperarSenha: {
    maxHeight: '10%',
    width: "100%",
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  containerBotaEnviar: {
    padding: 24,
  },
  botaoRecuperarSenha: {
    backgroundColor: "#00B16B",
    borderRadius: 8,
    height: 41,
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center'
  },
  botaoRecuperarSenhaLabel: {
    fontFamily: 'Montserrat-Bold', // Alterado (era Montserrat + fontWeight 600)
    fontSize: 14,
    color:'#FAFBFD'
  },
});