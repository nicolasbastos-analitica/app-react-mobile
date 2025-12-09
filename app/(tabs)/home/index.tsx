import CircularProgress from "@/components/CircularProgress";
import ModalExit from "@/components/ModalExit";
import { useGlobalState } from "@/src/context/GlobalStateContext";
import { useOP } from "@/src/context/OPContext";
import { useOperations } from "@/src/context/OperationContext";
import { useUser } from "@/src/context/UserContext";
import { useTelemetry } from "@/src/decoder/TelemetryContext";
import { styles } from "@/src/styles/app/(tabs)/home/_styles";
import { ImageBackground } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Avatar, Button, Icon, IconButton, Modal, TextInput } from "react-native-paper";


// Assets
const colheitadeira = require("@/assets/images/colheitadeira.png");
const iconColhedora = require("@/assets/images/colhedora4x.png");
const userIcon = require('@/assets/images/react-logo.png');
const nullUserIcon = require('@/assets/images/user_icon.png');
const metaConcluida = require('@/assets/images/circle-check-regular-full.png');
const metaInalcancada = require("@/assets/images/circle-xmark-regular-full.png");
const checkIcon = require('@/assets/images/check.png')
const iconAguardandoTransbordo = require('@/assets/images/icon_aguardando_transbordo.png')
const iconCombustivel = require('@/assets/images/icon_combustivel.png')
const iconInterferenciaMotorLigado = require("@/assets/images/icon_interferencia_motor_ligado.png")
const iconInterferenciasOperacionais = require("@/assets/images/icon_interferencias_operacionais.png")
const iconManutencao = require("@/assets/images/icon_manutencao.png")
const iconExit = require("@/assets/images/icon_exit.png")
// Constants
const numEquip = 34531;
const modeloEquip = 'New Holland Tc5090';

const fallbackUser = "Usuário não identificado";
const fallbacknumRegistro = '000000001';
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
const interferencias = [
    { interferencia: 'Manutenção Elétrica' },
    { interferencia: 'Manutenção Mecânica' },
    { interferencia: 'Manutenção Elevador' },
    { interferencia: 'Reparos' },
    { interferencia: 'Hidráulica' },
    { interferencia: 'Outros' },
]

export default function Home() {
    const { setEquipmentGroupId } = useOperations();
    const { setCompanyUnitId } = useOperations();
    const { setEquipmentNumber } = useGlobalState();
    const { selectedGroup } = useOperations();
    const { deviceName, isConnected } = useTelemetry();  // <-- AGORA ESTÁ CERTO
    const { opByEquipmentGroup, setSelectedOPNumber, selectedOPNumber } = useOP();
    const {
        displayUserName,
        displayUserLogin,
        loggedInUserData,
        equipmentNumber
    } = useUser();

    const companyUnitId = loggedInUserData?.company_unit_id || 0;

    const maquina = 20;
    // Carrega o grupo da máquina
    useEffect(() => {
        const loadGroup = async () => {
            await setEquipmentGroupId(maquina); // Atualize para o valor correto da máquina
            await setCompanyUnitId(companyUnitId); // Atualize para a unidade da empresa correta
        };
        loadGroup();
    }, []);
    // Handlers
    const handleSelectOP = (id: number | null) => {
        setSelectedOPId(id);
        if (id) {
            setSelectedOPNumber(id);
        }
    };

    // 1. Pega os dados do Contexto (Correto)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModal2Visible, setIsModal2Visible] = useState(false);
    const [isModalExitVisible, setIsModalExitVisible] = useState(false);
    const [isModalInterferenciaVisible, setIsModalInterferenciaVisible] = useState(false);
    const [isModalInterferenciaManutencaoVisible, setIsModalInterferenciaManutencaoVisible] = useState(false);
    const [modalText, setModalText] = useState('');
    const [modal2Text, setModal2Text] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<OrdemProducao | null>(null);
    const [selectedOPId, setSelectedOPId] = useState<number | null>(null);

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
    
    

    const ordensFiltradas = opByEquipmentGroup.filter(
        (op) =>
            op.company_unit_id === companyUnitId && // Filtra pela unidade da empresa
            op.equipment_group === maquina && // Filtra pela máquina/grupo
            (modalText.length === 0 || // Filtros adicionais
                op.name.toLowerCase().includes(modalText.toLowerCase()) ||
                op.os_number.toString().includes(modalText))
    );
    const uniqueOrdens = ordensFiltradas.filter(
        (op, index, self) =>
            index === self.findIndex(
                (t) => t.os_number === op.os_number && t.company_unit_id === op.company_unit_id
            )
    );

    const turnoID = params.turnoID || 'T1';
    const turnoHora = params.turnoHora || '08:00';
    const zona = params.ordemZona || 'A1';
    const funcao = params.ordemFuncao || 'Operador';
    const ordemID = params.ordemID || '999';

    const handleSelect = (id: string | null) => {
        setSelectedId(id);
    };

    interface OrdemProducao {
        id: string;
        zona: string;
        funcao: string;
    }


    const [ordemAtual, setOrdemAtual] = useState<OrdemProducao>({
        id: (params.ordemID as string) || '999',
        zona: (params.ordemZona as string) || 'A1',
        funcao: (params.ordemFuncao as string) || 'Operador',
    });
    return (

        <View style={styles.containerGeral}>

            {/* --- HEADER --- */}
            <View style={styles.containerHeader}>
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
                <Pressable onPress={() => setIsModalExitVisible(true)} style={styles.buttonSair}>
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
                            <Text style={styles.panelUser}>{displayUserName}</Text>
                            <View style={styles.turnoInfo}>
                                <Text style={[styles.turno]}>Registro </Text>
                                <Text style={[styles.ordemProducao]}>{displayUserLogin}</Text>
                            </View>
                        </View>
                    </View>

                    {/* INFO DA MÁQUINA */}
                    <View style={styles.maquinaInfo}>
                        <Pressable onPress={() => router.replace('/(tabs)/selecao_equipamento')}>

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
                        </Pressable>

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
                    <Button style={styles.nextButtonRed} labelStyle={styles.nextButtonLabel} mode="contained" onPress={() => setIsModalInterferenciaVisible(true)}>
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
                            {/* 👈 USA AS ORDENS DE PRODUÇÃO DO CONTEXT */}
                            {uniqueOrdens.map((op, index) => {
                                const isSelected = selectedOPId === op.os_number;

                                return (
                                    <Pressable
                                        key={`op-${op.os_number}-${op.company_unit_id}-${index}`}
                                        onPress={() => handleSelectOP(isSelected ? null : op.os_number)}
                                        style={[
                                            styles.ordemProducaoItem,
                                            isSelected && styles.ordemProducaoItemSelected,
                                        ]}
                                    >
                                        <View style={styles.ordemProducaoInfo}>
                                            <Text
                                                style={[
                                                    styles.ordemProducao,
                                                    isSelected && styles.ordemProducaoTextSelected,
                                                ]}
                                            >
                                                {op.os_number}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.zona,
                                                    isSelected && styles.zonaTextSelected,
                                                ]}
                                            >
                                                Zona: {op.region_01}
                                            </Text>
                                        </View>
                                        <View style={styles.posicaoCheckModal1}>
                                            {isSelected && <Icon source={checkIcon} size={14} color="#FFF" />}
                                        </View>
                                        <Text
                                            style={[
                                                styles.funcao,
                                                isSelected && styles.funcaoTextSelected,
                                            ]}
                                        >
                                            {op.name}
                                        </Text>
                                    </Pressable>
                                );
                            })}

                            {/* Mensagem quando não há resultados */}
                            {ordensFiltradas.length === 0 && (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>
                                        Nenhuma ordem de produção encontrada
                                    </Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>

                </View>
                <View style={styles.botaoSelect}>
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
                            onPress={() => { router.replace('/(tabs)/jornada_automatica'); setIsModal2Visible(false) }}

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

            {/* MODAIS INTERFERENCIA  */}
            {/* MODAL INTERFERENCIAS */}

            <Modal
                visible={isModalInterferenciaVisible}

                onDismiss={() => { setIsModalInterferenciaVisible(false) }}
                contentContainerStyle={styles.modalInterferencia}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalHeader, styles.modalInterferenciaContainer]}>
                        <Text style={styles.tituloPaginaModal}>Iterferência</Text>
                        <IconButton icon="close" mode="contained" onPress={() => { setIsModalInterferenciaVisible(false) }}
                            containerColor={styles.botaoVoltar.backgroundColor}
                            iconColor={styles.botaoVoltarLabel.color}
                            style={[styles.botaoVoltar, styles.botaofecharModal]}
                            size={14}>

                        </IconButton>

                    </View>
                    <ScrollView>
                        <View style={styles.containerInterferencias}>

                            {/* COMECO ITEM MANUTENCAO  */}
                            <View style={styles.containerOrdens}>

                                <Pressable
                                    style={[
                                        styles.ordemProducaoItem
                                    ]}
                                    onPress={() => { setIsModalInterferenciaManutencaoVisible(true); setIsModalInterferenciaVisible(false) }}
                                >
                                    <View style={styles.ordemProducaoInfo}>
                                        <View style={[styles.contornoIcon, styles.manutencao]}>
                                            <Icon source={iconManutencao} size={14} />
                                        </View>
                                        <View style={styles.checkposition}>
                                            <Text style={styles.funcao}>
                                                Manutenção
                                            </Text>

                                        </View>
                                        {(
                                            <Icon source={checkIcon} size={14} color="#FFF" />
                                        )}
                                    </View>


                                </Pressable>

                            </View>

                            {/* FIM ITEM MANUTENCAO  */}
                            <View style={styles.containerOrdens}>

                                <Pressable
                                    style={[
                                        styles.ordemProducaoItem
                                    ]}
                                >
                                    <View style={styles.ordemProducaoInfo}>
                                        <View style={[styles.contornoIcon, styles.combustivel]}>
                                            <Icon source={iconCombustivel} size={14} />
                                        </View>
                                        <View style={styles.checkposition}>
                                            <Text style={styles.funcao}>
                                                Combustível e Lubrificação
                                            </Text>

                                        </View>
                                        {(
                                            <Icon source="chevron-right" color="#625F7E" size={18} />
                                        )}
                                    </View>


                                </Pressable>

                            </View>

                            {/* FIM ITEM MANUTENCAO  */}

                            {/* FIM ITEM MANUTENCAO  */}
                            <View style={styles.containerOrdens}>

                                <Pressable
                                    style={[
                                        styles.ordemProducaoItem
                                    ]}
                                >
                                    <View style={styles.ordemProducaoInfo}>
                                        <View style={[styles.contornoIcon, styles.transbordo]}>
                                            <Icon source={iconAguardandoTransbordo} size={14} />
                                        </View>
                                        <View style={styles.checkposition}>
                                            <Text style={styles.funcao}>
                                                Aguardando Transbordo
                                            </Text>

                                        </View>
                                        {(
                                            <Icon source={checkIcon} size={14} color="#FFF" />
                                        )}
                                    </View>


                                </Pressable>

                            </View>

                            {/* FIM ITEM MANUTENCAO  */}

                            {/* FIM ITEM MANUTENCAO  */}
                            <View style={styles.containerOrdens}>

                                <Pressable
                                    style={[
                                        styles.ordemProducaoItem
                                    ]}
                                >
                                    <View style={styles.ordemProducaoInfo}>
                                        <View style={[styles.contornoIcon, styles.interferenciasOperacionais]}>
                                            <Icon source={iconInterferenciasOperacionais} size={14} />
                                        </View>
                                        <View style={styles.checkposition}>
                                            <Text style={styles.funcao}>
                                                Interferências Operacionais
                                            </Text>

                                        </View>
                                        {(
                                            <Icon source="chevron-right" color="#625F7E" size={18} />
                                        )}
                                    </View>


                                </Pressable>

                            </View>

                            {/* FIM ITEM MANUTENCAO  */}
                            {/* FIM ITEM MANUTENCAO  */}
                            <View style={styles.containerOrdens}>

                                <Pressable
                                    style={[
                                        styles.ordemProducaoItem
                                    ]}
                                >
                                    <View style={styles.ordemProducaoInfo}>
                                        <View style={[styles.contornoIcon, styles.interferenciaMotorLigado]}>
                                            <Icon source={iconInterferenciaMotorLigado} size={14} />
                                        </View>
                                        <View style={styles.checkposition}>
                                            <Text style={styles.funcao}>
                                                Interferências Operacionais
                                            </Text>

                                        </View>
                                        {(
                                            <Icon source={checkIcon} size={14} color="#FFF" />
                                        )}
                                    </View>


                                </Pressable>

                            </View>

                            {/* FIM ITEM MANUTENCAO  */}
                        </View>

                    </ScrollView>

                </View>

            </Modal>
            {/* FIM MODAL  */}

            <Modal
                visible={isModalInterferenciaManutencaoVisible}

                onDismiss={() => { setIsModalInterferenciaManutencaoVisible(false) }}
                contentContainerStyle={styles.modalInterferencia}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalHeader, styles.modalInterferenciaContainer]}>
                        <Text style={styles.tituloPaginaModal}>Iterferência</Text>
                        <IconButton icon="close" mode="contained" onPress={() => { setIsModalInterferenciaManutencaoVisible(false) }}
                            containerColor={styles.botaoVoltar.backgroundColor}
                            iconColor={styles.botaoVoltarLabel.color}
                            style={[styles.botaoVoltar, styles.botaofecharModal]}
                            size={14}>

                        </IconButton>

                    </View>
                    <ScrollView>
                        <View style={styles.containerInterferencias}>

                            {/* COMECO ITEM MANUTENCAO  */}
                            <View style={styles.containerOrdens}>

                                <Pressable
                                    style={[
                                        styles.ordemProducaoItem
                                    ]}
                                    onPress={() => setIsModalInterferenciaManutencaoVisible(true)}

                                >
                                    <View style={styles.ordemProducaoInfo}>
                                        <View style={[styles.contornoIcon, styles.manutencao]}>
                                            <Icon source={iconManutencao} size={14} />
                                        </View>
                                        <View style={styles.checkposition}>
                                            <Text style={styles.funcao}>
                                                Manutenção
                                            </Text>

                                        </View>
                                        {(
                                            <Icon source={checkIcon} size={14} color="#FFF" />
                                        )}
                                    </View>


                                </Pressable>

                            </View>
                        </View>

                    </ScrollView>
                    <ScrollView>
                        <View style={[styles.containerOrdens, styles.containerManutencao]}>

                            {interferencias.map((item) => {
                                const isSelected = selectedId === item.interferencia;

                                return (

                                    <Pressable
                                        key={item.interferencia}
                                        onPress={() => handleSelect(isSelected ? null : item.interferencia)}
                                        style={[
                                            styles.ordemProducaoItem,
                                            isSelected && styles.ordemProducaoItemSelected
                                        ]}
                                    >
                                        <View style={styles.ordemProducaoInfo}>
                                            <View style={styles.checkposition}>
                                                <Text style={[styles.funcao, isSelected && styles.funcaoTextSelected]}>
                                                    {item.interferencia}
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
                            onPress={() => { router.replace('/(tabs)/jornada_automatica'); setIsModalInterferenciaManutencaoVisible(false) }}

                            // 1. Passe o ícone direto na propriedade (aceita o require)
                            icon={checkIcon}

                            // 2. Inverta a ordem (Texto <- Ícone)
                            contentStyle={{ flexDirection: 'row-reverse' }}
                        >
                            Selecionar
                        </Button>
                    </View>
                </View>
            </Modal>
            {/* FIM MODAL  */}
            {/* MODAL SAIR  */}
            <ModalExit
                visible={isModalExitVisible}
                onDismiss={() => setIsModalExitVisible(false)}
            />



        </View>
    );
}

const haveIcon = false;