import ModalExit from "@/components/ModalExit";
import { styles } from "@/src/styles/app/(tabs)/jornada_automatica/_styles";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Button, Icon, IconButton, Modal, TextInput } from "react-native-paper";

// Assets
const checkIcon = require('@/assets/images/check.png');
const iconEventoAtivo = require('@/assets/images/evento_ativo.png')
// Constants
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

const telemetria = 0;
const eventos = 0;

export default function JornadaAutomatica() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModal2Visible, setIsModal2Visible] = useState(false);
    const [isModalExitVisible, setIsModalExitVisible] = useState(false);
    const [modalText, setModalText] = useState('');
    const [modal2Text, setModal2Text] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [IsActivate, setIsActivate] = useState(true);

    const handleClearModal = () => {
        setModalText('');
    };
    const handleClearModal2 = () => {
        setModal2Text('');
    };

    const ordensFiltradas = mockOrdens.filter(item =>
        item.id.includes(modalText)
    );

    const handleSelect = (id: string | null) => {
        setSelectedId(id);
    };

    return (
        <View style={styles.containerGeral}>

            {/* --- HEADER --- */}
            <View style={styles.containerHeader}>
                <View style={styles.telemetria}>
                    {/* <Icon source={''} size={14}></Icon> */}
                    <Text style={styles.telemetriaTetxt}>Telemetria: {telemetria} </Text><Text style={styles.separacaoTelemetria}>|</Text><Text style={styles.telemetriaTetxt}>Eventos: {eventos}</Text>
                </View>

                <Pressable onPress={() => setIsModalExitVisible(true)} style={styles.buttonSair}>
                    <Text style={styles.buttonSairLabel}>Encerrar</Text>
                </Pressable>
            </View>
            <View style={styles.containerBody}>
                <View style={styles.containerEvento}>
                    <View style={styles.elementosHeaderEvento}>
                        <View style={[styles.contornoIcon, styles.eventoAtivoIcon]}>
                            <Icon source={iconEventoAtivo} size={16} />
                        </View>
                        <View style={styles.textEvento}>
                            <Text style={styles.textEventoSubTitulo}>Evento atual</Text>
                            <Text style={styles.textoTituloEvento}>Carregamento</Text>

                        </View>
                        <View style={styles.iconSeta}>
                            <Icon source="chevron-right" color="#625F7E" size={18} />
                        </View>
                    </View>
                <View style={styles.elementosBodyEvento}>
                <Text>oi</Text>
                </View>
                </View>
            </View>
            {/* Modal 1 - Ordem de Produção */}
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
                                    primary: "#8F8CB5",
                                    outline: "#8F8CB5",
                                    onSurfaceVariant: "#8F8CB5"
                                }
                            }}
                            label="Buscar implemento"
                            mode="outlined"
                            value={modalText}
                            onChangeText={setModalText}
                            style={styles.input}
                            left={<TextInput.Icon icon='magnify' color="#42405F" />}
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
                        onPress={() => { setIsModalVisible(false); }}
                    >
                        Selecionar
                    </Button>
                </View>
            </Modal>

            {/* Modal 2 - Ciclo Operacional */}
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
                                    primary: "#8F8CB5",
                                    outline: "#8F8CB5",
                                    onSurfaceVariant: "#8F8CB5"
                                }
                            }}
                            label="Buscar implemento"
                            mode="outlined"
                            value={modal2Text}
                            onChangeText={setModal2Text}
                            style={styles.input}
                            left={<TextInput.Icon icon='magnify' color="#42405F" />}
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
                            icon={checkIcon}
                            contentStyle={{ flexDirection: 'row-reverse' }}
                        >
                            Iniciar
                        </Button>
                    </View>
                </View>
            </Modal>
            {/* MODAL SAIR  */}
            <ModalExit
                visible={isModalExitVisible}
                onDismiss={() => setIsModalExitVisible(false)}
            />

        </View>
    );
}