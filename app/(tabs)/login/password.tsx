import React from "react";
import { Text, View } from "react-native";
import { Button, Icon, IconButton, TextInput } from "react-native-paper";
import { styles } from './styles';
const sendEmailIcon = require('@/assets/images/send_email.png')

export default function password() {
    return (
        <View style={styles.containerPasssword}>
            <View>
                <IconButton icon="chevron-left" mode="contained" onPress={() => { }}
                    containerColor={styles.botaoVoltar.backgroundColor}
                    iconColor={styles.botaoVoltarLabel.color}
                    style={[styles.botaoVoltar, styles.botaoVoltarRecuperarSenha]}
                    size={14}>
                </IconButton>
            </View>

            <View style={styles.containerBody}>
                <Text style={styles.Titulo}>
                    Esqueceu sua senha?
                </Text>
                <Text style={styles.textoEsqueceuSenha}>
                    Digite seu e-mail para que seja enviada uma nova senha de acesso.
                </Text>
                <TextInput
                    theme={{
                        roundness: 8,
                        colors: {
                            primary: "#8F8CB5", // Cor (focado)
                            outline: "#8F8CB5", // Cor da borda (inativo)
                            onSurfaceVariant: "#8F8CB5" // Cor do label (inativo)
                        }
                    }}
                    label="Confirme seu e-mail"
                    mode="outlined"
                    style={styles.inputRecuperarSenha}
                    left={
                        <TextInput.Icon
                            icon={'email-outline'}
                            // style={{ width: 13, height: 14 }} 
                            color="#42405F"
                        />
                    }

                />
            </View>
            <View style={styles.containerBotaEnviar}>
                <Button
                    style={styles.botaoRecuperarSenha}
                    labelStyle={styles.botaoLoginLabel}
                    mode="contained"
                    onPress={()=>{}}
                >
                    <Text style={styles.textBotaoEntrar}>Entrar <Icon source={sendEmailIcon} color="#FFFFFF" size={14} /></Text>

                </Button>


            </View>
        </View>
        
    );
}