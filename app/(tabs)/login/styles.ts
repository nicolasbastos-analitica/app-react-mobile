import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Botão "Iniciar" (Background)
  botaoLogin: {
    position: 'absolute',
    bottom: 120,
    height: 56,
    width: '80%',
    backgroundColor: "#00B16B",
    borderRadius: 8,
    justifyContent: 'center',
  },
  // Label dos botões Iniciar e Sincronizar (Background)
  botaoLoginLabel: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: 'bold',
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
  // Estilo do conteúdo do ScrollView (usado nos dois modais)
  panelContent: {
    padding: 24,
    paddingBottom: 40,
  },
  // Container dos itens no Modal 1
  containerItens: {
    marginTop: 36,
    marginBottom: 36,
    marginLeft: 24,
    marginRight: 24,
  },
  // Título "Login"
  panelTitle: {
    fontSize: 28,
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 24,
  },
  // Descrição "Digite o número..." (usado também no Modal 2)
  panelDescription: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 24,
  },
  // Input (usado nos dois modais)
  input: {
    backgroundColor: '#FFFFFF', // Fundo do input
    marginBottom: 24,
  },
  // Container das bolinhas (usado nos dois modais)
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  // Bolinha inativa
  dot: {
    width: 10,
    height: 10,
    borderRadius: 16,
    backgroundColor: '#E0E0E0', // Cor da bolinha inativa
    marginHorizontal: 4,
    gap: 24,
  },
  // Bolinha ativa
  dotActive: {
    backgroundColor: '#00B16B', // Cor da bolinha ativa
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
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: 'bold',
  },

  // --- Modal 2: Painel de Senha ---

  // Container do Modal 2
  passwordPanelContainer: {
    backgroundColor: '#FAFBFD',
    position: 'absolute',
    width: '100%',
    height: '60%',
    bottom: -26,
    borderRadius: 20,
  },
  // Botão de voltar
  botaoVoltar: {
    display: 'flex',
    justifyContent: 'center',
    width: 40,
    height: 40,
    alignItems: 'center',
    backgroundColor: '#F5F4FF',
    borderRadius: 8,
    margin:0,
  },
  // Label do botão de voltar
  botaoVoltarLabel: {
    fontFamily: "Font Awesome 6 Pro",
    fontSize: 14,
    color: '#625F7E',
    fontWeight: '600',
  },
  // Container do Avatar + Textos
  containerUser: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 24,
  },
  // Container dos textos (Nome e Registro)
  userTextContainer: {
    marginLeft: 16,
    justifyContent: 'center',
    // alignItems:'center',
    marginTop: 24,
  },
  // Texto do nome do usuário
  panelUser: {
    fontSize: 14,
    color: '#666666',
    // marginBottom: 24,
  },
  // Estilo do número de registro (bold)
  numRegistro: {
    fontWeight: 'bold',
  },
  // Descrição "Insira sua senha..."
  panelDescriptionPassword: {
    fontSize: 16,
    fontWeight:400,
    color: '#050412',
    marginBottom: 24,
  },
  // Botão "Esqueci minha senha"
  botaoEsqueciSenha: {
    backgroundColor: 'rgba(143, 140, 181, 0.10)',
    color: 'black',
    paddingBottom: 4,
    paddingTop: 4,
    // paddingLeft: 4,
    // paddingRight: 4,
    marginBottom: 24,
    justifyContent: 'center',
    width: 200,
    borderRadius:100,
    // height:40,
  },
  // Label do botão "Esqueci minha senha"
  labelBotaoEsqueciSenha: {
    color: '#625F7E',
    fontSize: 14,
    fontFamily: 'Montserrat',
    fontWeight:700

  },
  // Botão "Entrar" (Pressable)
  botaoEntrar: {
    display: 'flex',
    height: 56,
    borderRadius: 8,
    backgroundColor: "#00B16B",
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Texto do botão "Entrar"
  textBotaoEntrar: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight:'600'
    // fontWeight: 'bold',
  }
});