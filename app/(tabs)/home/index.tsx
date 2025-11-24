import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ImageBackground } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Avatar, Button, Icon } from "react-native-paper";
import { styles } from "./styles";


// IMPORTANTE: Importando seu componente novo do Figma
import CircularProgress from "@/components/CircularProgress";

// Assets
const colheitadeira = require("@/assets/images/colheitadeira2x.png");
const iconColhedora = require("@/assets/images/colhedora4x.png");
const userIcon = require('@/assets/images/react-logo.png');
const nullUserIcon = require('@/assets/images/user_icon.png');

// Constants
const numEquip = 34531;
const modeloEquip = 'New Holland Tc5090';
const user = 'José da Silva Machado';
const implemento1 = '00001';
const implemento2 = '00002';

const disponibilidadeManutencaoPorcentagem = 88;
const efetividadeAgricolaPorcentagem = 72;
const metaDisponibilidadeManutencaoPorcentagem = 85;
const metaEfetividadeAgricolaPorcentagem = 70;

export default function Home() {
    const [IsActivate, setIsActivate] = useState(true);
    const params = useLocalSearchParams();

    // Tratamento de parâmetros (evita erros se vier vazio)
    const turnoID = params.turnoID || 'T1';
    const turnoHora = params.turnoHora || '08:00';
    const zona = params.ordemZona || 'A1';
    const funcao = params.ordemFuncao || 'Operador';
    const ordemID = params.ordemID || '999';

    return (
        <View style={styles.containerGeral}>

            {/* --- HEADER --- */}
            <View style={styles.containerHeader}>
                <View style={[styles.containerBlueSwitchON, IsActivate ? styles.containerBlueSwitchON : styles.containerBlueSwitchOFF]}>
                    <Pressable onPress={() => setIsActivate(!IsActivate)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                            {/* Ícone corrigido: Usar Icon direto, não TextInput.Icon */}
                            <Icon
                                source="bluetooth"
                                color={IsActivate ? "#fff" : "#050412"}
                                size={24}
                            />
                        </View>
                    </Pressable>
                </View>

                <Pressable onPress={() => router.replace('/(auth)')} style={styles.buttonSair}>
                    <Text style={styles.buttonSairLabel}>Sair</Text>
                </Pressable>
            </View>

            {/* --- BODY --- */}
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={styles.containerBody}>

                    {/* INFO DO USUÁRIO */}
                    <View style={styles.containerUser} >
                        <Avatar.Image size={36} source={haveIcon ? userIcon : nullUserIcon} />
                        <View style={styles.userTextContainer} >
                            <Text style={styles.panelUser}>{user}</Text>
                            <View style={styles.turnoInfo}>
                                <Text style={[styles.turno]}>Turno {turnoID} </Text>
                                <Text style={[styles.ordemProducao]}>{turnoHora} </Text>
                            </View>
                        </View>
                    </View>

                    {/* INFO DA MÁQUINA */}
                    <View style={styles.maquinaInfo}>
                        <ImageBackground source={colheitadeira} style={styles.maquinaImg}>
                            <View style={[styles.tituloMaquina, styles.tituloMargin]}>
                                <Icon source={iconColhedora} color="#FFF" size={37} />
                                <Text style={styles.nmMaquina}>Colhedora</Text>
                                <View style={styles.iconSeta}>
                                    <Icon source="chevron-right" color="#FFF" size={18} />
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

                        <Pressable style={styles.ordemProducaoItemTurno}>
                            <View style={styles.ordemProducaoHeader}>
                                <Text style={styles.tituloOrdemProducao}>Ordem Produção</Text>
                                <View style={styles.iconSeta}>
                                    <Icon source="chevron-right" color="#000" size={18} />
                                </View>
                            </View>
                            <Text style={[styles.zona]}>{funcao}</Text>
                            <View style={styles.ordemProducaoInfoSelected}>
                                <Text style={[styles.ordemProducao]}>{ordemID}</Text>
                                <Text style={[styles.zona]}>Zona: {zona}</Text>
                            </View>
                        </Pressable>
                    </View>

                    {/* --- INDICADORES (GRÁFICO NOVO) --- */}
                    <View style={styles.containerIndicadores}>
                        <Text style={styles.tituloIndicadores}>Indicadores</Text>
                        <Text style={styles.descricaoIndicadores}>Médias operacionais do dia</Text>

                        <View style={styles.card}>
                            <Text style={styles.textMediaDia}>
                                Média dia
                            </Text>
                            {/* Componente Novo do Figma (88%) */}
                            <CircularProgress percentage={disponibilidadeManutencaoPorcentagem} />
                            <Text style={styles.textCard}>Disponibilidade de Manutenção</Text>
                            <View style={styles.meta}>
                                <Text style={styles.textMeta}>Meta {metaDisponibilidadeManutencaoPorcentagem}%</Text>
                                <FontAwesomeIcon icon='circle-xmark' size={16}  color='#00B16B'/>
                            </View>
                        </View>

                    </View>

                </View>
            </ScrollView>

            {/* --- FOOTER --- */}
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

// Pequena variável auxiliar se não estiver definida globalmente
const haveIcon = false;