import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { Button, IconButton, TextInput } from "react-native-paper";
import { styles } from './styles';
const sendEmailIcon = require('@/assets/images/send_email.png')

export default function password() {
    const router = useRouter();
    function sendEmail() {
        return 0;
    }

    return (

        <View style={styles.containerPasssword}>
            <View >

                <View>
                    <IconButton icon="chevron-left" mode="contained" onPress={() => router.replace('/(tabs)/login')}
                        containerColor={styles.botaoVoltar.backgroundColor}
                        iconColor={styles.botaoVoltarLabel.color}
                        style={[styles.botaoVoltar, styles.botaoVoltarRecuperarSenha]}
                        size={14}>
                    </IconButton>
                </View>
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
                    labelStyle={styles.botaoRecuperarSenhaLabel}
                    mode="contained"
                    icon={sendEmailIcon}
                    contentStyle={{ flexDirection: 'row-reverse' }}
                    onPress={() => { sendEmail() }}
                >Enviar
                </Button>

            </View>
        </View>

    );
}