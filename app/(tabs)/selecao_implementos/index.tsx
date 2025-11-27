import { styles } from '@/src/styles/app/(tabs)/selecao_implementos/_styles';
import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Avatar, Button, Icon, IconButton, Modal, TextInput } from "react-native-paper";

const iconImplemento = require("@/assets/images/implemento_icon.png");
const colheitadeira = require("@/assets/images/colheitadeira.png")
const iconColhedora = require("@/assets/images/colhedora4x.png");
const iconTrator = require("@/assets/images/trator.png");
const iconUnion = require("@/assets/images/Union.png");
const checkIcon = require('@/assets/images/check.png')

const numEquip = 34531;
const modeloEquip = 'New Holland Tc5090';

//User 
const user = 'José da Silva Machado';
const numRegistro = '000000001';
const haveIcon = false;
const userIcon = require('@/assets/images/react-logo.png');
const nullUserIcon = require('@/assets/images/user_icon.png');
const Blue = 'BLUE_530';
const mockOrdens = [
    { id: '000143', zona: '47588', funcao: 'Colheita Mecânica 2 linhas' },
    { id: '000144', zona: '47589', funcao: 'Corte, Transbordo e Transporte (CTT)' },
    { id: '000145', zona: '47590', funcao: 'Fertirrigação' },
    { id: '000146', zona: '47591', funcao: 'Preparo e correção de solo' },
];
const turnos = [
    { id: 'A', hora: '23:00 às 07:20' },
    { id: 'B', hora: '07:00 às 15:20' },
    { id: 'C', hora: '15:00 às 23:20' },
]



export default function Implementos() {
    const [selectedEquip, setSelectedEquip] = useState("colhedora");
    const [isActivate, setIsActivate] = useState(true);
    const [implemento1Text, setImplemento1Text] = useState('');
    const [implemento2Text, setImplemento2Text] = useState('');
    const [modalText, setModalText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModal2Visible, setIsModal2Visible] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<OrdemProducao | null>(null);
    const [selectedTurno, setSelectedTurno] = useState<turno | null>(null);
    const handleSelect = (id: string | null) => {
        setSelectedId(id);
    };
    const handleClearImplemento1 = () => {
        setImplemento1Text('');
    };
    const handleClearImplemento2 = () => {
        setImplemento2Text('');
    };
    const handleClearModal = () => {
        setModalText('');
    };

    interface OrdemProducao {
        id: string;
        zona: string;
        funcao: string;
    }
    interface turno {
        id: string;
        hora: string;
    }
    const ordensFiltradas = mockOrdens.filter(item =>
        item.id.includes(modalText)
    );
    return (
        <View style={styles.containerGeral}>
            <View style={styles.containerHeader}>
                <IconButton icon="chevron-left" mode="contained" onPress={() => router.replace('/(auth)')}
                    containerColor={styles.botaoVoltar.backgroundColor}
                    iconColor={styles.botaoVoltarLabel.color}
                    style={[styles.botaoVoltar, styles.botaoVoltarRecuperarSenha]}
                    size={14}>

                </IconButton>
                <View style={[styles.containerBlueSwitchON, isActivate ? styles.containerBlueSwitchON : styles.containerBlueSwitchOFF]}>
                    <Text style={styles.textBlue}>{Blue}</Text>
                    <Pressable
                        // Garante que o clique mude o estado
                        onPress={() => setIsActivate(!isActivate)}
                    >
                        <View style={[styles.customSwitchTrack,
                        isActivate ? styles.customSwitchTrack : styles.customSwitchTrackOFF
                        ]}>
                            <View
                                // Aplica a bolinha e define a posição (esquerda/direita)
                                style={[
                                    styles.customSwitchThumb,
                                    isActivate ? styles.customSwitchThumbActive : styles.customSwitchThumbInactive && styles.customSwitchThumbOFF
                                ]}
                            />
                        </View>
                    </Pressable>
                    <Text style={styles.styleActivation}>{isActivate ? "ON" : "OFF"}</Text>
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

                    <Text style={styles.tituloPagina}>Implementos</Text>
                    <Text style={styles.subTitulos}>Implemento 1</Text>
                    {(!isModalVisible && !isModal2Visible) && (
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
                            value={implemento1Text}
                            onChangeText={setImplemento1Text}
                            style={styles.input}
                            left={
                                <TextInput.Icon
                                    icon={iconImplemento}
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
                    )}
                    <Text style={styles.subTitulos}>Implemento 2</Text>
                    {(!isModalVisible && !isModal2Visible) && (

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
                            value={implemento2Text}
                            onChangeText={setImplemento2Text}
                            style={styles.input}
                            left={
                                <TextInput.Icon
                                    icon={iconImplemento}
                                    color="#42405F"
                                />}
                            right={
                                implemento2Text.length > 0 ? (
                                    <TextInput.Icon
                                        icon="close"
                                        color="#8F8CB5"
                                        onPress={handleClearImplemento2}
                                    />
                                ) : null
                            }
                        />
                    )}
                </View>

            </View>
            <View style={styles.botaoProximo}>
                <Button
                    style={styles.nextButton}
                    labelStyle={styles.nextButtonLabel}
                    mode="contained"
                    onPress={() => setIsModalVisible(true)}
                >
                    Próximo
                </Button>
            </View>

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
                        onPress={() => { setIsModalVisible(false); setIsModal2Visible(true); const selectedOrder = mockOrdens.find(order => order.id === selectedId); setSelectedOrder(selectedOrder || null); }}
                    >
                        Selecionar
                    </Button>
                </View>
            </Modal>

            {/* Modal 2 */}
            <Modal
                visible={isModal2Visible}

                onDismiss={() => { setIsModalVisible(false) }}
                contentContainerStyle={styles.modalOrdemProducao2}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.tituloPaginaModal}>Turno de Trabalho</Text>
                        <IconButton icon="close" mode="contained" onPress={() => { setIsModal2Visible(false) }}
                            containerColor={styles.botaoVoltar.backgroundColor}
                            iconColor={styles.botaoVoltarLabel.color}
                            style={[styles.botaoVoltar, styles.botaofecharModal]}
                            size={14}>

                        </IconButton>

                    </View>
                    <View style={[styles.maquinaInfo, styles.maquinaInfoModal]}>
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
                        {selectedOrder ? (
                            <Pressable
                                style={
                                    styles.ordemProducaoItemTurno
                                }
                            >
                                <Text style={styles.tituloOrdemProducao}>Ordem Produção</Text>
                                <Text style={[styles.zona]}>
                                    {selectedOrder.funcao}
                                </Text>
                                <View style={styles.ordemProducaoInfoSelected}>
                                    <Text style={[styles.ordemProducao]}>{selectedOrder.id}</Text>
                                    <Text style={[styles.zona]}>Zona: </Text>
                                    <Text style={[styles.zona]}>{selectedOrder.zona}</Text>
                                </View>
                                

                            </Pressable>
                        ) : (
                            <Text>Nenhuma ordem selecionada.</Text>
                        )}

                    </View>

                    
                    <View style={styles.modalScrollWrapper}>
                        <ScrollView style={styles.scrollViewTurnos}>
                            {turnos.map((item) => {
                                const isSelected = selectedId === item.id;

                                return (
                                    <Pressable
                                        key={item.id}
                                        onPress={() => handleSelect(isSelected ? null : item.id)}
                                        style={[
                                            styles.turnnoItem,
                                            isSelected && styles.turnnoItemSelected
                                        ]}
                                    >
                                        <View style={styles.turnoInfo}>
                                            <Text style={[styles.turno, isSelected && styles.funcaoTextSelected]}><Text>Turno </Text>{item.id}</Text>
                                            <Text style={[styles.ordemProducao, isSelected && styles.ordemProducao]}>{item.hora} </Text>
                                        </View>
                                        <View style={styles.posicaoCheckModal1}>

                                            {isSelected && (
                                                <Icon source={checkIcon} size={14} color="#FFF" />
                                            )}
                                        </View>
                                        
                                    </Pressable>
                                );
                            })}
                        </ScrollView>
                    </View>
                </View>
                <View style={styles.botaoProximo}>
                    <Button
                        style={styles.nextButtonModal}
                        labelStyle={styles.nextButtonLabel}
                        mode="contained"
                        onPress={() => {
                            const selectedTurno = turnos.find(turnos => turnos.id === selectedId); setSelectedTurno(selectedTurno || null); setIsModal2Visible(false); setIsModalVisible(false);
                            if (selectedTurno) {
                                router.replace({
                                    pathname: '/(tabs)/home',
                                    params: {
                                        turnoID: selectedTurno.id,
                                        turnoHora: selectedTurno.hora,
                                        ordemID: selectedOrder?.id,
                                        ordemZona: selectedOrder?.zona,
                                        ordemFuncao: selectedOrder?.funcao
                                    }
                                });

                            };
                        }}
                    >
                        Confirmar
                    </Button>
                </View>
            </Modal>
        </View>
    );
}
