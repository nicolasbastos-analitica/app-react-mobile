import { ImageBackground } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Avatar, Button, Icon, TextInput } from "react-native-paper";
import { styles } from "./styles";

const colheitadeira = require("@/assets/images/colheitadeira2x.png")
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
const implemento1 = '00001';
const implemento2 = '00002';


export default function Home() {
    const [selectedEquip, setSelectedEquip] = useState("colhedora");
    const [IsActivate, setIsActivate] = useState(true);
    const [implemento1Text, setImplemento1Text] = useState('');
    const handleClearImplemento1 = () => {
        setImplemento1Text('');
    };
    const params = useLocalSearchParams();
    const turnoID = params.turnoID;
    const turnoHora = params.turnoHora;
    const zona = params.ordemZona;
    const funcao = params.ordemFuncao;
    const ordemID = params.ordemID;


    return (
        <View style={styles.containerGeral}>
            <View style={styles.containerHeader}>

                <View style={[styles.containerBlueSwitchON, IsActivate ? styles.containerBlueSwitchON : styles.containerBlueSwitchOFF]}>
                    <Pressable
                        // Garante que o clique mude o estado
                        onPress={() => setIsActivate(!IsActivate)}
                    >
                        <View style={styles.iconBluetooth}>

                            <TextInput.Icon
                                icon="bluetooth"
                                color={() => IsActivate ? "#fff" : "#050412"}
                            />
                        </View>
                        <View style={styles.switch}>

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
                        </View>
                    </Pressable>

                </View>
                <Pressable onPress={() => router.replace('/(auth)')} style={styles.buttonSair}>
                    <Text style={styles.buttonSairLabel}>Sair</Text>
                </Pressable>
            </View>

            <View style={styles.containerBody}>
                <View style={styles.containerUser} >
                    <Avatar.Image size={36} source={haveIcon == false ? nullUserIcon : userIcon} />
                    <View style={styles.userTextContainer} >
                        <Text style={styles.panelUser}>
                            {user}
                        </Text>
                        <View style={styles.turnoInfo}>
                            <Text style={[styles.turno]}><Text>Turno </Text>{turnoID}  </Text>
                            <Text style={[styles.ordemProducao]}>{turnoHora} </Text>
                        </View>
                    </View>
                </View>




                <View style={styles.maquinaInfo}>
                    <ImageBackground source={colheitadeira} style={styles.maquinaImg}>
                        <View style={[styles.tituloMaquina, styles.tituloMargin]}>
                            <Icon source={iconColhedora} color="#FFF" size={37}></Icon>
                            <Text style={styles.nmMaquina}>Colhedora</Text>
                            <View style={styles.iconSeta}>
                                <Icon source="chevron-right" color="#FFF" size={18} ></Icon>
                            </View>
                        </View>

                        <View style={styles.numMAquinaContainer}>
                            <Text style={styles.numMaquina}>Nº</Text><Text style={styles.numEquip}>{numEquip}</Text>
                        </View>
                        <View style={styles.modeloMAquinaContainer}>
                            <Text style={[styles.numMaquina, styles.alinhamentoModelo]}>Modelo</Text><Text style={styles.numEquip}>{modeloEquip}</Text>
                        </View>
                        <View style={styles.modeloMAquinaContainer}>
                            <Text style={[styles.numMaquina, styles.alinhamentoModelo]}>Implemento 1</Text><Text style={styles.numEquip}>{implemento1}</Text>
                        </View>
                        <View style={styles.modeloMAquinaContainer}>
                            <Text style={[styles.numMaquina, styles.alinhamentoModelo]}>Implemento 2</Text><Text style={styles.numEquip}>{implemento2}</Text>
                        </View>
                    </ImageBackground>

                    <Pressable
                        style={
                            styles.ordemProducaoItemTurno
                        }
                    >
                        <View style={styles.ordemProducaoHeader}>
                            <Text style={styles.tituloOrdemProducao}>Ordem Produção</Text>
                            <View style={styles.iconSeta}>
                                <Icon source="chevron-right" color="#000" size={18} ></Icon>
                            </View>
                        </View>
                        <Text style={[styles.zona]}>
                            {funcao}
                        </Text>
                        <View style={styles.ordemProducaoInfoSelected}>
                            <Text style={[styles.ordemProducao]}>{ordemID}</Text>
                            <Text style={[styles.zona]}>Zona: </Text>
                            <Text style={[styles.zona]}>{zona}</Text>
                        </View>

                    </Pressable>

                </View>

            </View>
            <View style={styles.containerBottom}>
                <Text style={styles.tituloBotoes}>Iniciar Jornada</Text>
                <View style={styles.botaoProximo}>
                    <Button
                        style={styles.nextButton}
                        labelStyle={styles.nextButtonLabel}
                        mode="contained"
                        onPress={() => router.replace('/(tabs)/selecao_implementos')}
                    >
                        Automática
                    </Button>
                    <Button
                        style={styles.nextButtonRed}
                        labelStyle={styles.nextButtonLabel}
                        mode="contained"
                        onPress={() => router.replace('/(tabs)/selecao_implementos')}
                    >
                        Interferência
                    </Button>
                </View>
            </View>

        </View>
    );
}
