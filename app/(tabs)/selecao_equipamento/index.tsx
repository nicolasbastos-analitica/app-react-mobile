import userData from '@/src/assets/cache/users.json';
import { useTelemetry } from "@/src/decoder/TelemetryContext";
import { useAuth } from "@/src/login/AuthContext";
import { styles } from "@/src/styles/app/(tabs)/selecao_equipamento/_styles";
import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Avatar, Button, IconButton, TextInput } from "react-native-paper";

interface UserData {
    login: string;
    name: string;
    company_code: number;
    user_id: number;
    password: string;
    company_id: number;
    company_unit_code: number;
    company_unit_id: number;
    employee_code: number;
    status_embedded: number;
}
interface UserDataFile {
    data: UserData[];
}
const colheitadeira = require("@/assets/images/colheitadeira.png")
const iconColhedora = require("@/assets/images/colhedora4x.png");
const iconTrator = require("@/assets/images/trator.png");
const iconUnion = require("@/assets/images/Union.png");
const numEquip = 34531;
const modeloEquip = 'New Holland Tc5090';
// const { userLogin } = useAuth();
//User 

const fallbackUser = "Usuário não identificado";
const fallbacknumRegistro = '000000001';
const haveIcon = false;
const userIcon = require('@/assets/images/react-logo.png');
const nullUserIcon = require('@/assets/images/user_icon.png');

export default function SelecaoEquipamento() {
    const SampleUserData = (userData as unknown as UserDataFile).data; // Tipagem forçada para o JSON
    const { deviceName, isConnected } = useTelemetry();  // <-- AGORA ESTÁ CERTO
    const { userLogin, signOut } = useAuth();
    const loggedInUserData = userLogin
        ? SampleUserData.find(user => user.login === userLogin)
        : null;

    const displayUserName = loggedInUserData ? loggedInUserData.name : fallbackUser;
    const displayUserLogin = userLogin ? userLogin : fallbacknumRegistro;
    const [selectedEquip, setSelectedEquip] = useState("colhedora");
    const [IsActivate, setIsActivate] = useState(true);
    const [implemento1Text, setImplemento1Text] = useState('');
    const handleClearImplemento1 = () => {
        setImplemento1Text('');
    };
    return (
        <View style={styles.containerGeral}>
            <View style={styles.containerHeader}>
                <IconButton icon="chevron-left" mode="contained" onPress={() => { router.replace('/(auth)'); signOut(); }}
                    containerColor={styles.botaoVoltar.backgroundColor}
                    iconColor={styles.botaoVoltarLabel.color}
                    style={[styles.botaoVoltar, styles.botaoVoltarRecuperarSenha]}
                    size={14}>

                </IconButton>
                <View style={[styles.containerBlueSwitchON, isConnected ? styles.containerBlueSwitchON : styles.containerBlueSwitchOFF]}>
                    <Text style={styles.textBlue}>{deviceName}</Text>
                    <Pressable
                    // Garante que o clique mude o estado
                    // onPress={() => setIsActivate(!isConnected)}
                    >
                        <View style={[styles.customSwitchTrack,
                        isConnected ? styles.customSwitchTrack : styles.customSwitchTrackOFF
                        ]}>
                            <View
                                // Aplica a bolinha e define a posição (esquerda/direita)
                                style={[
                                    styles.customSwitchThumb,
                                    isConnected ? styles.customSwitchThumbActive : styles.customSwitchThumbInactive && styles.customSwitchThumbOFF
                                ]}
                            />
                        </View>
                    </Pressable>
                    <Text style={styles.styleActivation}>{isConnected ? "ON" : "OFF"}</Text>
                </View>
            </View>

            <View style={styles.containerBody}>
                <View style={styles.containerUser} >
                    <Avatar.Image size={36} source={haveIcon == false ? nullUserIcon : userIcon} />
                    <View style={styles.userTextContainer} >
                        <Text style={styles.panelUser}>
                            {displayUserName}
                        </Text>
                        <Text style={styles.panelDescription}>
                            Registro <Text style={[styles.numRegistro]}>{displayUserLogin}</Text>
                        </Text>
                    </View>
                </View>
                <Text style={styles.tituloPagina}>Seleção de Máquina</Text>


                <TextInput
                    theme={{
                        roundness: 8,
                        colors: {
                            primary: "#8F8CB5", // Cor (focado)
                            outline: "#8F8CB5", // Cor da borda (inativo)
                            onSurfaceVariant: "#8F8CB5" // Cor do label (inativo)
                        }
                    }}
                    label="Buscar máquina"
                    mode="outlined"
                    value={implemento1Text}
                    onChangeText={setImplemento1Text}
                    style={styles.input}
                    left={
                        <TextInput.Icon
                            icon='magnify'
                            color="#42405F"
                        />}


                    right={
                        implemento1Text.length > 0 ? (
                            <TextInput.Icon
                                icon="close"
                                color="#8F8CB5"
                                onPress={handleClearImplemento1}
                            />
                        ) : null
                    }
                />

                <View style={styles.maquinaInfo}>
                    {/* <View style={[styles.tituloMaquina]}>
                        <Icon source={iconColhedora} color="#FFF" size={37}></Icon>
                        <Text style={styles.nmMaquina}>Colhedora</Text>
                    </View> */}
                    <View style={styles.infoMaquinaContainer}>
                        <View style={[styles.tituloMaquina]}>
                            {/* <Icon source={iconColhedora} color="#FFF" size={37}></Icon> */}
                            <Text style={styles.nmMaquina}>Colhedora</Text>
                        </View>
                        <View style={styles.numMAquinaContainer}>
                            <Text style={styles.numMaquina}>Código </Text><Text style={styles.numEquip}>{numEquip}</Text>
                        </View>
                        <View style={styles.modeloMAquinaContainer}>
                            <Text style={[styles.numMaquina, styles.alinhamentoModelo]}>Modelo</Text><Text style={[styles.numEquip, styles.alinhamentoModeloMarca]}>{modeloEquip}</Text>
                        </View>
                    </View>


                </View>
                <ImageBackground source={colheitadeira} style={styles.maquinaImg}>
                    <View style={styles.blurIMG}>
                    </View>
                </ImageBackground>
            </View>
            <View style={styles.botaoProximo}>
                <Button
                    style={styles.nextButton}
                    labelStyle={styles.nextButtonLabel}
                    mode="contained"
                    onPress={() => router.replace('/(tabs)/selecao_implementos')}
                >
                    Próximo
                </Button>
            </View>

        </View>
    );
}
