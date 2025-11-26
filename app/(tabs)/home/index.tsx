import CircularProgress from "@/components/CircularProgress";
import { ImageBackground } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Avatar, Button, Icon, IconButton, Modal, TextInput } from "react-native-paper";
import { styles } from "./styles";

// Assets
const colheitadeira = require("@/assets/images/colheitadeira.png");
const iconColhedora = require("@/assets/images/colhedora4x.png");
const userIcon = require('@/assets/images/react-logo.png');
const nullUserIcon = require('@/assets/images/user_icon.png');
const metaConcluida = require('@/assets/images/circle-check-regular-full.png');
const metaInalcancada = require("@/assets/images/circle-xmark-regular-full.png");
const checkIcon = require('@/assets/images/check.png')
// Constants
const numEquip = 34531;
const modeloEquip = 'New Holland Tc5090';
const user = 'José da Silva Machado';
const implemento1 = '00001';
const implemento2 = '00002';

const disponibilidadeManutencaoPorcentagem = 8;
const efetividadeAgricolaPorcentagem = 72;
const metaDisponibilidadeManutencaoPorcentagem = 85;
const metaEfetividadeAgricolaPorcentagem = 70;
const tempoMedioCarregamentoHora = 22;
const tempoMedioCarregamentoMinuto = 0;
const CarregamentoHora = 12;
const CarregamentoMinuto = 0;
const tempoMedioManobraHora = 1;
const tempoMedioManobraMinuto = 2;
const ManobraHora = 1;
const ManobraMinuto = 8;
const metaVelocidadeMedia = 40;
const velocidadeMedia = 40;
const mediaTransbordo = 999;
const metaMediaTransbordo = 2;

const metaVelocidadeAlcancada = metaVelocidadeMedia >= velocidadeMedia;
const metaMediaTransbordoAlcancada = mediaTransbordo <= metaMediaTransbordo;

const tempoMetaTotalManobra = (tempoMedioManobraHora * 60) + tempoMedioManobraMinuto;
const tempoGastoTotalManobra = (ManobraHora * 60) + ManobraMinuto;
const isMetaManobraAlcancada = tempoGastoTotalManobra <= tempoMetaTotalManobra;

const tempoMetaTotalCarregamento = (tempoMedioCarregamentoHora * 60) + tempoMedioCarregamentoMinuto;
const tempoGastoTotalCarregamento = (CarregamentoHora * 60) + CarregamentoMinuto;
const isMetaCarregamentoAlcancada = tempoGastoTotalCarregamento <= tempoMetaTotalCarregamento;

const mockOrdens = [
    { id: '000143', zona: '47588', funcao: 'Colheita Mecânica 2 linhas' },
    { id: '000144', zona: '47589', funcao: 'Corte, Transbordo e Transporte (CTT)' },
    { id: '000145', zona: '47590', funcao: 'Fertirrigação' },
    { id: '000146', zona: '47591', funcao: 'Preparo e correção de solo' },
];
const cicloOperacional = [
    { id: '200', ciclo: 'Carregando', },
    { id: '251', ciclo: 'Deslocamento Carregando', },
    { id: '256', ciclo: 'Motor Desligado (sem apontamento)', },
    { id: '249', ciclo: 'Descarga', },
    { id: '201  ', ciclo: 'Deslocamento Descarga', },
];

export default function Home() {
    // 1. Pega os dados do Contexto (Correto)
    // const { sensorData, connectedDevice } = useTelemetry();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModal2Visible, setIsModal2Visible] = useState(false);
    const [modalText, setModalText] = useState('');
    const [modal2Text, setModal2Text] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<OrdemProducao | null>(null);

    const [IsActivate, setIsActivate] = useState(true);

    // 2. Lê a velocidade (Se for null, usa 0)
    // const velocidadeMedia = sensorData.speed ?? 0;
    const handleClearModal = () => {
        setModalText('');
    };
    const handleClearModal2 = () => {
        setModal2Text('');
    };
    const params = useLocalSearchParams();

    const turnoID = params.turnoID || 'T1';
    const turnoHora = params.turnoHora || '08:00';
    const zona = params.ordemZona || 'A1';
    const funcao = params.ordemFuncao || 'Operador';
    const ordemID = params.ordemID || '999';


    const ordensFiltradas = mockOrdens.filter(item =>
        item.id.includes(modalText)
    );
    const handleSelect = (id: string | null) => {
        setSelectedId(id);
    };

    interface OrdemProducao {
        id: string;
        zona: string;
        funcao: string;
    }
    const [ordemAtual, setOrdemAtual] = useState<OrdemProducao>({
        id: params.ordemID || '999',
        zona: params.ordemZona || 'A1',
        funcao: params.ordemFuncao || 'Operador',
    });
    return (

        <View style={styles.containerGeral}>

            {/* --- HEADER --- */}
            <View style={styles.containerHeader}>
                <View style={[styles.containerBlueSwitchON, IsActivate ? styles.containerBlueSwitchON : styles.containerBlueSwitchOFF]}>
                    <Pressable onPress={() => setIsActivate(!IsActivate)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                            <Icon
                                source="bluetooth"
                                // Muda a cor se estiver conectado de verdade
                                // color={connectedDevice ? "#00B16B" : (IsActivate ? "#fff" : "#050412")}
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

                        <Pressable style={styles.ordemProducaoItemTurno} onPress={() => setIsModalVisible(true)}>
                            <View style={styles.ordemProducaoHeader}>
                                <Text style={styles.tituloOrdemProducao}>Ordem Produção</Text>
                                <View style={styles.iconSeta}>
                                    <Icon source="chevron-right" color="#000" size={18} />
                                </View>
                            </View>
                            <Text style={[styles.zona]}>{ordemAtual.funcao}</Text>
                            <View style={styles.ordemProducaoInfoSelected}>
                                <Text style={[styles.ordemProducao]}>{ordemAtual.id}</Text>
                                <Text style={[styles.zona]}>Zona: {ordemAtual.zona}</Text>
                            </View>
                        </Pressable>
                    </View>

                    <Text style={styles.tituloIndicadores}>Indicadores</Text>
                    <Text style={styles.descricaoIndicadores}>Médias operacionais do dia</Text>

                    {/* GRÁFICOS CIRCULARES */}
                    <View style={styles.graficos}>
                        <View style={styles.containerIndicadores}>
                            <View style={styles.card}>
                                <Text style={styles.textMediaDia}>Média dia</Text>
                                <CircularProgress percentage={disponibilidadeManutencaoPorcentagem} />
                                <Text style={styles.textCard}>Disponibilidade de Manutenção</Text>
                                <View style={styles.meta}>
                                    <Text style={styles.textMeta}>Meta {metaDisponibilidadeManutencaoPorcentagem}%</Text>
                                    <Icon source={metaDisponibilidadeManutencaoPorcentagem <= disponibilidadeManutencaoPorcentagem ? metaConcluida : metaInalcancada} size={12} color="00B16B" />
                                </View>
                            </View>
                        </View>

                        <View style={styles.containerIndicadores}>
                            <View style={styles.card}>
                                <Text style={styles.textMediaDia}>Média dia</Text>
                                <CircularProgress percentage={efetividadeAgricolaPorcentagem} />
                                <Text style={styles.textCard}>Disponibilidade de Manutenção</Text>
                                <View style={styles.meta}>
                                    <Text style={styles.textMeta}>Meta { }%</Text>
                                    <Icon source={metaEfetividadeAgricolaPorcentagem <= efetividadeAgricolaPorcentagem ? metaConcluida : metaInalcancada} size={12} color="00B16B" />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.graficos}>

                        {/* Card: Tempo Carregamento */}
                        <View style={styles.containerIndicadores}>
                            <View style={[styles.cardHora]}>
                                <Text style={styles.textMediaDia}>Média turno</Text>
                                <View style={styles.horas}>
                                    <Text style={[styles.contadorHora, isMetaCarregamentoAlcancada ? styles.dentroDaMedia : styles.foraDaMedia]}>
                                        00:{CarregamentoHora < 10 && '0'}{CarregamentoHora}:{CarregamentoMinuto < 10 && '0'}{CarregamentoMinuto}
                                    </Text>
                                    <Text style={[styles.hzinho, isMetaCarregamentoAlcancada ? styles.dentroDaMedia : styles.foraDaMedia]}> h</Text>
                                </View>
                                <Text style={[styles.textCard, styles.tituloCardHoras]}>Total Transbordo Carregado</Text>
                                <View style={styles.meta}>
                                    <Text style={styles.textMeta}>Média geral 00:{tempoMedioCarregamentoHora < 10 && '0'}{tempoMedioCarregamentoHora}:{tempoMedioCarregamentoMinuto < 10 && '0'}{tempoMedioCarregamentoMinuto} h</Text>
                                    <Icon source={isMetaCarregamentoAlcancada ? metaConcluida : metaInalcancada} size={12} color="00B16B" />
                                </View>
                            </View>
                        </View>
                        {/* Card: Tempo transbordo */}
                        {/* Card: Tempo manobra */}
                        <View style={styles.containerIndicadores}>
                            <View style={[styles.cardHora]}>
                                <Text style={styles.textMediaDia}>Média turno</Text>
                                <View style={styles.horas}>
                                    <Text style={[styles.contadorHora, isMetaManobraAlcancada ? styles.dentroDaMedia : styles.foraDaMedia]}>
                                        00:{ManobraHora < 10 && '0'}{ManobraHora}:{ManobraMinuto < 10 && '0'}{ManobraMinuto}
                                    </Text>
                                    <Text style={[styles.hzinho, isMetaManobraAlcancada ? styles.dentroDaMedia : styles.foraDaMedia]}> h</Text>
                                </View>
                                <Text style={[styles.textCard, styles.tituloCardHoras]}>Tempo médio de Manobra</Text>
                                <View style={styles.meta}>
                                    <Text style={styles.textMeta}>Média geral 00:{tempoMedioManobraHora < 10 && '0'}{tempoMedioManobraHora}:{tempoMedioManobraMinuto < 10 && '0'}{tempoMedioManobraMinuto} h</Text>
                                    <Icon source={isMetaManobraAlcancada ? metaConcluida : metaInalcancada} size={12} color="00B16B" />
                                </View>
                            </View>
                        </View>

                    </View>
                    {/* CARDS DE TEMPO E VELOCIDADE */}
                    <View style={styles.graficos}>

                        {/* Card: Tempo transbordo */}
                        {/* Card: Tempo transbordo */}
                        <View style={styles.containerIndicadores}>
                            <View style={[styles.cardHora]}>
                                <Text style={styles.textMediaDia}>Média turno</Text>
                                <View style={styles.horas}>
                                    <Text style={[styles.contadorHora, metaMediaTransbordoAlcancada ? styles.dentroDaMedia : styles.foraDaMedia]}>
                                        {mediaTransbordo}
                                    </Text>
                                    <Text style={[styles.hzinho, metaMediaTransbordoAlcancada ? styles.dentroDaMedia : styles.foraDaMedia]}> h</Text>
                                </View>
                                <Text style={[styles.textCard, styles.tituloCardHoras]}>Total Transbordo Carregado</Text>
                                <View style={styles.meta}>
                                    <Text style={styles.textMeta}>Média geral 00:{metaMediaTransbordo < 10 && '0'}{metaMediaTransbordo}:10 h</Text>
                                    <Icon source={metaMediaTransbordoAlcancada ? metaConcluida : metaInalcancada} size={12} color="00B16B" />
                                </View>
                            </View>
                        </View>

                        {/* Card: Velocidade Média (VIVO) */}
                        <View style={styles.containerIndicadores}>
                            <View style={[styles.cardHora]}>
                                <Text style={styles.textMediaDia}>Média turno</Text>
                                <View style={styles.horas}>
                                    {/* AQUI ESTÁ A VARIÁVEL VIVA */}
                                    <Text style={[styles.contadorHora, metaVelocidadeAlcancada ? styles.dentroDaMedia : styles.foraDaMedia]}>
                                        {velocidadeMedia}
                                    </Text>
                                    <Text style={[styles.hzinho, metaVelocidadeAlcancada ? styles.dentroDaMedia : styles.foraDaMedia]}> km/h</Text>
                                </View>
                                <Text style={[styles.textCard, styles.tituloCardHoras]}>Velocidade Média</Text>
                                <View style={styles.meta}>
                                    <Text style={styles.textMeta}>Média geral {metaVelocidadeMedia} km/h</Text>
                                    <Icon source={metaVelocidadeAlcancada ? metaConcluida : metaInalcancada} size={12} color="00B16B" />
                                </View>
                            </View>
                        </View>

                    </View>
                </View>
            </ScrollView>

            {/* --- FOOTER --- */}
            <View style={styles.containerBottom}>
                <Text style={styles.tituloBotoes}>Iniciar Jornada</Text>
                <View style={styles.botaoProximo}>
                    <Button style={styles.nextButton} labelStyle={styles.nextButtonLabel} mode="contained" onPress={() => setIsModal2Visible(true)}>
                        Automática
                    </Button>
                    <Button style={styles.nextButtonRed} labelStyle={styles.nextButtonLabel} mode="contained" onPress={() => router.replace('/(tabs)/selecao_implementos')}>
                        Interferência
                    </Button>
                </View>
            </View>




            {/* Modal  */}

            <Modal
                visible={isModalVisible}

                onDismiss={() => { setIsModalVisible(false) }}
                contentContainerStyle={styles.modalOrdemProducao}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.tituloPaginaModal}>Ordem de Produção</Text>
                        <IconButton icon="close" mode="contained" onPress={() => { setIsModalVisible(false) }}
                            containerColor={styles.botaoVoltar.backgroundColor}
                            iconColor={styles.botaoVoltarLabel.color}
                            style={[styles.botaoVoltar, styles.botaofecharModal]}
                            size={14}>

                        </IconButton>

                    </View>
                    <View style={styles.modalInput}>
                        <TextInput
                            theme={{
                                roundness: 8,
                                colors: {
                                    primary: "#8F8CB5", // Cor (focado)
                                    outline: "#8F8CB5", // Cor da borda (inativo)
                                    onSurfaceVariant: "#8F8CB5" // Cor do label (inativo)
                                }
                            }}
                            label="Buscar implemento"
                            mode="outlined"
                            value={modalText}
                            onChangeText={setModalText}
                            style={styles.input}
                            left={
                                <TextInput.Icon
                                    icon='magnify'
                                    color="#42405F"
                                />}
                            right={
                                modalText.length > 0 ? (
                                    <TextInput.Icon
                                        icon="close"
                                        color="#8F8CB5"
                                        onPress={handleClearModal}
                                    />
                                ) : null
                            }
                        />
                    </View>
                    <ScrollView>
                        <View style={styles.containerOrdens}>

                            {ordensFiltradas.map((item) => {
                                const isSelected = selectedId === item.id;

                                return (

                                    <Pressable
                                        key={item.id}
                                        onPress={() => handleSelect(isSelected ? null : item.id)}
                                        style={[
                                            styles.ordemProducaoItem,
                                            isSelected && styles.ordemProducaoItemSelected
                                        ]}
                                    >
                                        <View style={styles.ordemProducaoInfo}>
                                            <Text style={[styles.ordemProducao, isSelected && styles.ordemProducaoTextSelected]}>{item.id}</Text>
                                            <Text style={[styles.zona, isSelected && styles.zonaTextSelected]}>Zona: </Text>
                                            <Text style={[styles.zona, isSelected && styles.zonaTextSelected]}>{item.zona}</Text>

                                        </View>
                                        <View style={styles.posicaoCheckModal1}>

                                            {isSelected && (
                                                <Icon source={checkIcon} size={14} color="#FFF" />
                                            )}
                                        </View>
                                        <Text style={[styles.funcao, isSelected && styles.funcaoTextSelected]}>
                                            {item.funcao}

                                        </Text>
                                    </Pressable>

                                );
                            })}
                        </View>
                    </ScrollView>

                </View>
                <View style={styles.botaoProximo}>
                    <Button
                        style={styles.nextButtonModal}
                        labelStyle={styles.nextButtonLabel}
                        mode="contained"
                        onPress={() => { setIsModalVisible(false); const selectedOrder = mockOrdens.find(order => order.id === selectedId); setSelectedOrder(selectedOrder || null); if (selectedOrder) { setOrdemAtual(selectedOrder) } }}
                    >
                        Selecionar
                    </Button>
                </View>
            </Modal>

            <Modal
                visible={isModal2Visible}

                onDismiss={() => { setIsModal2Visible(false) }}
                contentContainerStyle={styles.modalOrdemProducao}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.tituloPaginaModal}>Ciclo Operacional</Text>
                        <IconButton icon="close" mode="contained" onPress={() => { setIsModal2Visible(false) }}
                            containerColor={styles.botaoVoltar.backgroundColor}
                            iconColor={styles.botaoVoltarLabel.color}
                            style={[styles.botaoVoltar, styles.botaofecharModal]}
                            size={14}>

                        </IconButton>

                    </View>
                    <View style={styles.modalInput}>
                        <TextInput
                            theme={{
                                roundness: 8,
                                colors: {
                                    primary: "#8F8CB5", // Cor (focado)
                                    outline: "#8F8CB5", // Cor da borda (inativo)
                                    onSurfaceVariant: "#8F8CB5" // Cor do label (inativo)
                                }
                            }}
                            label="Buscar implemento"
                            mode="outlined"
                            value={modal2Text}
                            onChangeText={setModal2Text}
                            style={styles.input}
                            left={
                                <TextInput.Icon
                                    icon='magnify'
                                    color="#42405F"
                                />}
                            right={
                                modal2Text.length > 0 ? (
                                    <TextInput.Icon
                                        icon="close"
                                        color="#8F8CB5"
                                        onPress={handleClearModal2}
                                    />
                                ) : null
                            }
                        />
                    </View>
                    <ScrollView>
                        <View style={styles.containerOrdens}>

                            {cicloOperacional.map((item) => {
                                const isSelected = selectedId === item.id;

                                return (

                                    <Pressable
                                        key={item.id}
                                        onPress={() => handleSelect(isSelected ? null : item.id)}
                                        style={[
                                            styles.ordemProducaoItem,
                                            isSelected && styles.ordemProducaoItemSelected
                                        ]}
                                    >
                                        <View style={styles.ordemProducaoInfo}>
                                            <Text style={[styles.ordemProducao, isSelected && styles.ordemProducaoTextSelected]}>{item.id}</Text>
                                            <View style={styles.checkposition}>
                                                <Text style={[styles.funcao, isSelected && styles.funcaoTextSelected]}>
                                                    {item.ciclo}
                                                </Text>

                                            </View>
                                            {isSelected && (
                                                <Icon source={checkIcon} size={14} color="#FFF" />
                                            )}
                                        </View>


                                    </Pressable>

                                );
                            })}
                        </View>
                    </ScrollView>

                </View>
                <View style={styles.iniciarCicloContainerBottom}>
                    <View style={styles.botaoIniciarCiclo}>
                        <Button
                            style={styles.CicloButton}
                            labelStyle={styles.CicloButtonLabel}
                            mode="contained"
                            onPress={() =>{ router.replace('/(tabs)/jornada_automatica'); setIsModal2Visible(false)} }

                            // 1. Passe o ícone direto na propriedade (aceita o require)
                            icon={checkIcon}

                            // 2. Inverta a ordem (Texto <- Ícone)
                            contentStyle={{ flexDirection: 'row-reverse' }}
                        >
                            Iniciar
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const haveIcon = false;