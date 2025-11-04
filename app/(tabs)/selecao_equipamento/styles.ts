import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  avatar: {
  },
  containerGeral: {
    marginLeft: 24,
  },
  containerAvatar: {
    marginTop: 82,
    marginLeft: 334,
  },
  tituloPagina: {
    fontFamily: 'Montserrat',
    fontSize: 22,
    fontStyle: 'normal',
    fontWeight: '700',
    color: '#050412',
    marginTop: 24,
    marginBottom: 24,

  },
  containerBotoes: {
    display: 'flex',
    flexDirection: 'row',
    columnGap: 16,

  },
  botaoEquipUnselect: {
    backgroundColor: 'white',
    display: 'flex',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    width: 155,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#8F8CB5',
    height: 65
  },
  iconsTrator: {

  },
  botaoEquipUnselectLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontStyle: 'normal',
    color: '#8F8CB5',

  },
  botaoEquipSelect: {
    backgroundColor: '#00B16B',
    display: 'flex',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    width: 155,
    borderRadius: 40,
    height: 65

  },
  botaoEquipSelectLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontStyle: 'normal'
  },
  icons: {
    width: 37.067,
    height: 20,
  },
  input: {
    backgroundColor: '#FFFFFF', // Fundo do input
    marginBottom: 24,
    marginTop: 24,
    marginRight: 24
  },
  botaoEspecificacaoSelect: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#080719', // cor semelhante ao exemplo
    borderRadius: 12,
    height: 60,
    marginRight: 24,

  },
  modeloEquipSelect: {
    color: '#FAFBFD',
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 14 * 1.2,
    marginRight: 90
  },
  numEquip: {
    color: '#FAFBFD',
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 14,
    marginRight: 8
  },
  botaoEspecificacaoUnselect: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white', // cor semelhante ao exemplo
    borderRadius: 12,
    height: 60,
    marginTop:8,
    marginRight: 24,
  },
  numEquipUnselect: {
    color: '#050412',
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 14,
    marginRight: 8
  },
  nextButton:{
     height: 56,
    borderRadius: 8,
    backgroundColor: "#00B16B",
    justifyContent: 'center',
    marginLeft:24,
    marginRight:24,
    marginTop:18,
  },
  nextButtonLabel:{
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: 'bold',
  },
}
);