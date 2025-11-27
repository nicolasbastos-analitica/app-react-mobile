import { styles } from "@/src/styles/app/(tabs)/selecao_equipamento/_styles";
import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Avatar, Button, Icon, IconButton, TextInput } from "react-native-paper";

const colheitadeira = require("@/assets/images/colheitadeira.png")
const iconColhedora = require("@/assets/images/colhedora4x.png");
const iconTrator = require("@/assets/images/trator.png");
const iconUnion = require("@/assets/images/Union.png");
const numEquip = 34531;
const modeloEquip = 'New Holland Tc5090';

//User 
const user = 'José da Silva Machado';
const numRegistro = '000000001';
const haveIcon = false;
const userIcon = require('@/assets/images/react-logo.png');
const nullUserIcon = require('@/assets/images/user_icon.png');
const Blue = 'BLUE_530';

export default function SelecaoEquipamento() {
    const [selectedEquip, setSelectedEquip] = useState("colhedora");
    const [IsActivate, setIsActivate] = useState(true);
    const [implemento1Text, setImplemento1Text] = useState('');
    const handleClearImplemento1 = () => {
        setImplemento1Text('');
    };
    return (
        <View style={styles.containerGeral}>
            <View style={styles.containerHeader}>
                <IconButton icon="chevron-left" mode="contained" onPress={() => router.replace('/(auth)')}
                    containerColor={styles.botaoVoltar.backgroundColor}
                    iconColor={styles.botaoVoltarLabel.color}
                    style={[styles.botaoVoltar, styles.botaoVoltarRecuperarSenha]}
                    size={14}>

                </IconButton>
                <View style={[styles.containerBlueSwitchON, IsActivate ? styles.containerBlueSwitchON : styles.containerBlueSwitchOFF]}>
                    <Text style={styles.textBlue}>{Blue}</Text>
                    <Pressable
                        // Garante que o clique mude o estado
                        onPress={() => setIsActivate(!IsActivate)}
                    >
                        <View style={[styles.customSwitchTrack,
                        IsActivate ? styles.customSwitchTrack : styles.customSwitchTrackOFF
                        ]}>
                            <View
                                // Aplica a bolinha e define a posição (esquerda/direita)
                                style={[
                                    styles.customSwitchThumb,
                                    IsActivate ? styles.customSwitchThumbActive : styles.customSwitchThumbInactive && styles.customSwitchThumbOFF
                                ]}
                            />
                        </View>
                    </Pressable>
                    <Text style={styles.styleActivation}>{IsActivate ? "ON" : "OFF"}</Text>
                </View>
            </View>

            <View style={styles.containerBody}>
                <View style={styles.containerUser} >
                    <Avatar.Image size={36} source={haveIcon == false ? nullUserIcon : userIcon} />
                    <View style={styles.userTextContainer} >
                        <Text style={styles.panelUser}>
                            {user}
                        </Text>
                        <Text style={styles.panelDescription}>
                            Registro <Text style={[styles.numRegistro]}>{numRegistro}</Text>
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
                    label="Buscar equipamento"
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
                    <ImageBackground source={colheitadeira} style={styles.maquinaImg}>
                        <View style={[styles.tituloMaquina, styles.tituloMargin]}>
                            <Icon source={iconColhedora} color="#FFF" size={37}></Icon>
                            <Text style={styles.nmMaquina}>Colhedora</Text>
                        </View>
                        <View style={styles.numMAquinaContainer}>
                            <Text style={styles.numMaquina}>Nº</Text><Text style={styles.numEquip}>{numEquip}</Text>
                        </View>
                        <View style={styles.modeloMAquinaContainer}>
                            <Text style={[styles.numMaquina, styles.alinhamentoModelo]}>Modelo</Text><Text style={styles.numEquip}>{modeloEquip}</Text>
                        </View>
                    </ImageBackground>
                </View>

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
