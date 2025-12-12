import { useAuth } from '@/src/context/AuthContext';
import { useEquipment } from '@/src/context/EquipmentContext';
import { useGlobalState } from '@/src/context/GlobalStateContext';
import { useOP } from '@/src/context/OPContext';
import { useOperations } from '@/src/context/OperationContext';
import { useUser } from '@/src/context/UserContext';
import { useTelemetry } from '@/src/decoder/TelemetryContext';
import { styles } from '@/src/styles/app/(tabs)/selecao_implementos/_styles';
import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Keyboard, Pressable, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Avatar, Button, Icon, IconButton, Modal, TextInput } from "react-native-paper";

const iconImplemento = require("@/assets/images/implemento_icon.png");
const colheitadeira = require("@/assets/images/colheitadeira.png")
const iconColhedora = require("@/assets/images/colhedora4x.png");
const iconTrator = require("@/assets/images/trator.png");
const iconUnion = require("@/assets/images/Union.png");
const checkIcon = require('@/assets/images/check.png')
const userIcon = require('@/assets/images/react-logo.png');
const nullUserIcon = require('@/assets/images/user_icon.png');

const caminhao = require("@/assets/images/caminhao.png")
const trator = require("@/assets/images/trator.png")
const pulverizadora = require('@/assets/images/pulverizadora.png');
const haveIcon = false;

const turnos = [
    { id: 'A', hora: '23:00 às 07:20' },
    { id: 'B', hora: '07:00 às 15:20' },
    { id: 'C', hora: '15:00 às 23:20' },
]

interface OrdemProducao {
    id: string;
    zona: string;
    funcao: string;
}

interface Turno {
    id: string;
    hora: string;
}

export default function Implementos() {
    const { setEquipmentGroupId, setCompanyUnitId, selectedGroup } = useOperations();
    const { setEquipmentNumber } = useGlobalState();
    const { opByEquipmentGroup, setSelectedOPNumber, selectedOPNumber } = useOP();
    const { displayUserName, displayUserLogin, loggedInUserData } = useUser();
    const { deviceName, isConnected } = useTelemetry();
    const { userLogin } = useAuth();

    // ✅ Hook do equipamento
    const { selectedEquipment, selectedEquipmentCode } = useEquipment();

    // Estados
    const [implemento1Text, setImplemento1Text] = useState('');
    const [implemento2Text, setImplemento2Text] = useState('');
    const [modalText, setModalText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModal2Visible, setIsModal2Visible] = useState(false);
    const [selectedOPId, setSelectedOPId] = useState<number | null>(null);
    const [selectedTurnoId, setSelectedTurnoId] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<OrdemProducao | null>(null);
    const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
    const pickTheGroup = selectedEquipment ? selectedEquipment.operation_group_id : '---';

    const companyUnitId = loggedInUserData?.company_unit_id || 0;

    // ✅ Usa o operation_group_id do equipamento selecionado (com fallback)
    const equipmentGroupId = selectedEquipment?.operation_group_id || 0;

    // ✅ Proteção:  Redireciona se não houver equipamento selecionado
    useEffect(() => {
        if (!selectedEquipment) {
            router.replace('/(tabs)/selecao_equipamento');
        }
    }, [selectedEquipment]);

    // Carrega o grupo da máquina
    useEffect(() => {
        if (selectedEquipment) {
            const loadGroup = async () => {
                await setEquipmentGroupId(equipmentGroupId);
                await setCompanyUnitId(companyUnitId);
            };
            loadGroup();
        }
    }, [selectedEquipment, equipmentGroupId, companyUnitId]);

    // Handlers
    const handleSelectOP = (id: number | null) => {
        setSelectedOPId(id);
        if (id) {
            setSelectedOPNumber(id);
        }
    };

    // 1. CONSUMO DO CONTEXTO
    const {
        allMachines,          // ALTERADO: Agora usa allMachines (sem implementos)
        setSelectedEquipmentCode,
        setSelectedImplementCode1,     // ADICIONADO: Pega todos os implementos
        setSelectedImplementCode2,     // ADICIONADO: Pega todos os implementos
        allImplements,
    } = useEquipment();

    // 2. ESTADOS LOCAIS
    const [searchText2, setSearchText2] = useState('');
    const [searchText1, setSearchText1] = useState('');
    const [showList, setShowList] = useState(false);
    const [showImplement1, setShowImplement1] = useState(false);
    const [showImplement2, setShowImplement2] = useState(false);

    const filteredImplements = useMemo(() => {
        // Se não tiver texto digitado, retorna TODOS os implementos
        if (!searchText1) return allImplements;
        if (selectedEquipment === null) return allImplements;
        const upperSearch = searchText1.toUpperCase();

        return allImplements.filter((item: { model_name: string; code: { toString: () => string | string[]; }; }) =>
            (item.model_name && item.model_name.toUpperCase().includes(upperSearch)) ||
            (item.code && item.code.toString().includes(upperSearch))
        );
    }, [searchText1, allImplements]);
    const filteredImplements2 = useMemo(() => {
        // Se não tiver texto digitado, retorna TODOS os implementos
        if (!searchText2) return allImplements;
        if (selectedEquipment == null) return allImplements;
        const upperSearch = searchText2.toUpperCase();

        return allImplements.filter((item: { model_name: string; code: { toString: () => string | string[]; }; }) =>
            (item.model_name && item.model_name.toUpperCase().includes(upperSearch)) ||
            (item.code && item.code.toString().includes(upperSearch))
        );
    }, [searchText2, allImplements]);
    // 4. HANDLERS

    const handleSelectImplement = (item: any) => {
        setSelectedImplementCode1(item.code);
        setSearchText1(`${item.code} - ${item.model_name}`);
        setShowImplement1(false);
        Keyboard.dismiss();
    };
    const handleSelectImplement2 = (item: any) => {
        setSelectedImplementCode2(item.code);
        setSearchText2(`${item.code} - ${item.model_name}`);
        setShowImplement2(false);
        Keyboard.dismiss();
    };




    const handleClearSearch = () => {
        setSearchText2('');
        setShowList(false);
    };

    const handleSelectTurno = (id: string | null) => {
        setSelectedTurnoId(id);
    };

    const handleClearImplemento1 = () => setSearchText1('');
    const handleClearImplemento2 = () => setSearchText2('');
    const handleClearModal = () => setModalText('');

    const handleConfirmOP = () => {
        if (!selectedOPId) return;

        const selected = opByEquipmentGroup.find(op => op.os_number == selectedOPId);
        if (selected) {
            setSelectedOrder({
                id: selected.os_number.toString(),
                zona: selected.region_01.toString(),
                funcao: selected.name
            });
        }

        setIsModalVisible(false);
        setIsModal2Visible(true);
    };

    const handleConfirmTurno = () => {
        if (!selectedTurnoId) return;

        const turnoSelecionado = turnos.find(t => t.id == selectedTurnoId);
        setSelectedTurno(turnoSelecionado || null);

        setIsModal2Visible(false);
        setIsModalVisible(false);

        if (turnoSelecionado && selectedOrder) {
            router.replace({
                pathname: '/(tabs)/home',
                params: {
                    turnoID: turnoSelecionado.id,
                    turnoHora: turnoSelecionado.hora,
                    ordemID: selectedOrder.id,
                    ordemZona: selectedOrder.zona,
                    ordemFuncao: selectedOrder.funcao
                }
            });
        }
    };

    // ✅ Usa o equipmentGroupId dinâmico
    const ordensFiltradas = opByEquipmentGroup.filter(
        (op) =>
            String(op.company_unit_id) == String(companyUnitId) &&
            String(op.equipment_group) == String(equipmentGroupId) && // ✅ Usa o grupo do equipamento
            (modalText.length == 0 ||
                op.name.toLowerCase().includes(modalText.toLowerCase()) ||
                op.os_number.toString().includes(modalText))
    );

    const uniqueOrdens = ordensFiltradas.filter(
        (op, index, self) =>
            index === self.findIndex(
                (t) => t.os_number == op.os_number && t.company_unit_id == op.company_unit_id
            )
    );
    console.log("DEBUG FILTRO:");
    console.log("Meu ID Unidade:", companyUnitId, typeof companyUnitId);
    console.log("Meu ID Grupo:", equipmentGroupId, typeof equipmentGroupId);
    console.log("Total de OPs:", opByEquipmentGroup.length);
    if (opByEquipmentGroup.length > 0) {
        console.log("Exemplo OP:", opByEquipmentGroup[0].company_unit_id, opByEquipmentGroup[0].equipment_group);
    }
// ... (código anterior)

    // DEBUG: Conta quantas OPs batem exatamente com o que você precisa
    const opsDoGrupo10 = opByEquipmentGroup.filter(op => 
        op.company_unit_id == companyUnitId && 
        op.equipment_group == equipmentGroupId
    );
    console.log(`🔎 PROCURANDO: Unidade ${companyUnitId} e Grupo ${equipmentGroupId}`);
    console.log(`✅ ENCONTRADAS: ${opsDoGrupo10.length} ordens compatíveis.`);

    // ... (restante do código)
    // ✅ Se não houver equipamento, mostra tela de carregamento/erro
    if (!selectedEquipment) {
        return (
            <View style={[styles.containerGeral, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontSize: 16, color: '#8F8CB5', marginBottom: 20 }}>
                    Carregando equipamento...
                </Text>
            </View>
        );
    }

    const handleDimissOutside = () => {
        Keyboard.dismiss();
        setShowList(false);
        setShowImplement1(false);
        setShowImplement2(false);
    }

    return (
        <TouchableWithoutFeedback onPress={handleDimissOutside}>

            <View style={styles.containerGeral}>
                <View style={styles.containerHeader}>
                    <IconButton
                        icon="chevron-left"
                        mode="contained"
                        onPress={() => router.replace('/(tabs)/selecao_equipamento')}
                        containerColor={styles.botaoVoltar.backgroundColor}
                        iconColor={styles.botaoVoltarLabel.color}
                        style={[styles.botaoVoltar, styles.botaoVoltarRecuperarSenha]}
                        size={14}
                    />

                    <View style={[styles.containerBlueSwitchON, isConnected ? styles.containerBlueSwitchON : styles.containerBlueSwitchOFF]}>
                        <Text style={styles.textBlue}>{deviceName}</Text>
                        <Pressable>
                            <View style={[styles.customSwitchTrack,
                            isConnected ? styles.customSwitchTrack : styles.customSwitchTrackOFF
                            ]}>
                                <View
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
                    <View style={styles.containerUser}>
                        <Avatar.Image size={36} source={haveIcon ? userIcon : nullUserIcon} />
                        <View style={styles.userTextContainer}>
                            <Text style={styles.panelUser}>{displayUserName}</Text>
                            <Text style={styles.panelDescription}>
                                Registro <Text style={styles.numRegistro}>{displayUserLogin}</Text>
                            </Text>
                        </View>
                    </View>

                    <View style={styles.maquinaInfo}>
                        <View style={styles.blurIMG}></View>

                        <ImageBackground source={[pickTheGroup == 10 ? caminhao : null, pickTheGroup == 12 ? trator : null, pickTheGroup == 18 ? colheitadeira : null, pickTheGroup == 2 || 11 ? pulverizadora : null]} style={styles.maquinaImg}>
                            <View style={styles.blurIMG}></View>

                            <View style={[styles.tituloMaquina, styles.tituloMargin]}>
                                {/* <Icon source={iconColhedora} color="#FFF" size={37} /> */}
                                {/* ✅ Usa optional chaining */}
                                <Text style={styles.nmMaquina}>
                                    {selectedEquipment.class || 'Máquina'}
                                </Text>
                            </View>
                            <View style={styles.numMAquinaContainer}>
                                <Text style={styles.numMaquina}>Nº</Text>
                                <Text style={styles.numEquip}>{selectedEquipmentCode || '---'}</Text>
                            </View>
                            <View style={styles.modeloMAquinaContainer}>
                                <Text style={[styles.numMaquina, styles.alinhamentoModelo]}>Modelo</Text>
                                {/* ✅ Proteção contra null */}
                                <Text style={styles.numEquip} numberOfLines={1}>
                                    {selectedEquipment.model_name || 'N/A'}
                                </Text>
                            </View>
                        </ImageBackground>

                        <Text style={styles.tituloPagina}>Implementos</Text>
                        <Text style={styles.subTitulos}>Implemento 1</Text>
                        {(!isModalVisible && !isModal2Visible) && (
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
                                value={searchText1}
                                onChangeText={(searchText1) => {
                                    setSearchText1(searchText1);
                                    setShowImplement1(true);

                                }}
                                onFocus={() => {
                                    setShowImplement1(true);
                                }}
                                onBlur={() => {
                                    setShowImplement1(false);
                                }}
                                style={styles.input}
                                left={<TextInput.Icon icon={iconImplemento} color="#42405F" />}
                                right={
                                    searchText1.length > 0 ? (
                                        <TextInput.Icon icon="close" color="#8F8CB5" onPress={handleClearImplemento1} />
                                    ) : null
                                }
                            />
                        )}

                        {showImplement1 && (
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 290,
                                    left: 0,
                                    right: 0,
                                    backgroundColor: 'white',
                                    borderRadius: 8,
                                    elevation: 5,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    maxHeight: 200,
                                    zIndex: 101,
                                    borderWidth: 1,
                                    borderColor: '#ddd'
                                }}
                            >
                                <FlatList
                                    data={filteredImplements}
                                    keyExtractor={(item) => (item.code ? item.code.toString() : Math.random().toString())}
                                    keyboardShouldPersistTaps="handled"
                                    nestedScrollEnabled={true}
                                    style={{ flex: 1 }}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => handleSelectImplement(item)}
                                            style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}
                                        >
                                            <View style={styles.containerList}>
                                                <Text style={styles.codeList}>{item.code}</Text>
                                                <Text style={styles.nameList}> {item.model_name || 'Sem Nome'}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    ListEmptyComponent={
                                        <View style={{ padding: 15 }}>
                                            <Text style={{ color: '#8F8CB5' }}>
                                                Nenhum implemento encontrado.
                                            </Text>
                                        </View>
                                    }
                                />
                            </View>
                        )}
                        <Text style={styles.subTitulos}>Implemento 2</Text>
                        {(!isModalVisible && !isModal2Visible) && (
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
                                value={searchText2}
                                onChangeText={(searchText2) => {
                                    setSearchText2(searchText2);
                                    setShowImplement2(true);

                                }}
                                onFocus={() => {
                                    setShowImplement2(true);
                                }}
                                onBlur={() => {
                                    setShowImplement2(false);
                                }}
                                style={styles.input}
                                left={<TextInput.Icon icon={iconImplemento} color="#42405F" />}
                                right={
                                    searchText2.length > 0 ? (
                                        <TextInput.Icon icon="close" color="#8F8CB5" onPress={handleClearImplemento2} />
                                    ) : null
                                }
                            />
                        )}
                        {showImplement2 && (
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 404,
                                    left: 0,
                                    right: 0,
                                    backgroundColor: 'white',
                                    borderRadius: 8,
                                    elevation: 5,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    maxHeight: 200,
                                    zIndex: 101,
                                    borderWidth: 1,
                                    borderColor: '#ddd'
                                }}
                            >
                                <FlatList
                                    data={filteredImplements2}
                                    keyExtractor={(item) => (item.code ? item.code.toString() : Math.random().toString())}
                                    keyboardShouldPersistTaps="handled"
                                    nestedScrollEnabled={true}
                                    style={{ flex: 1 }}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => handleSelectImplement2(item)}
                                            style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}
                                        >
                                            <View style={styles.containerList}>
                                                <Text style={styles.codeList}>{item.code}</Text>
                                                <Text style={styles.nameList}> {item.model_name || 'Sem Nome'}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    ListEmptyComponent={
                                        <View style={{ padding: 15 }}>
                                            <Text style={{ color: '#8F8CB5' }}>
                                                Nenhum implemento encontrado.
                                            </Text>
                                        </View>
                                    }
                                />
                            </View>
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

                {/* Modal 1 - Ordem de Produção */}
                <Modal
                    visible={isModalVisible}
                    onDismiss={() => setIsModalVisible(false)}
                    contentContainerStyle={styles.modalOrdemProducao}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.tituloPaginaModal}>Ordem de Produção</Text>
                            <IconButton
                                icon="close"
                                mode="contained"
                                onPress={() => setIsModalVisible(false)}
                                containerColor={styles.botaoVoltar.backgroundColor}
                                iconColor={styles.botaoVoltarLabel.color}
                                style={[styles.botaoVoltar, styles.botaofecharModal]}
                                size={14}
                            />
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
                                label="Buscar ordem de produção"
                                mode="outlined"
                                value={modalText}
                                onChangeText={setModalText}
                                style={styles.input}
                                left={<TextInput.Icon icon='magnify' color="#42405F" />}
                                right={
                                    modalText.length > 0 ? (
                                        <TextInput.Icon icon="close" color="#8F8CB5" onPress={handleClearModal} />
                                    ) : null
                                }
                            />
                        </View>

                        <ScrollView>
                            <View style={styles.containerOrdens}>
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

                    <View style={styles.botaoProximo}>
                        <Button
                            style={styles.nextButtonModal}
                            labelStyle={styles.nextButtonLabel}
                            mode="contained"
                            disabled={selectedOPId === null}
                            onPress={handleConfirmOP}
                        >
                            Selecionar
                        </Button>
                    </View>
                </Modal >

                {/* Modal 2 - Turno */}
                < Modal
                    visible={isModal2Visible}
                    onDismiss={() => setIsModal2Visible(false)
                    }
                    contentContainerStyle={styles.modalOrdemProducao2}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.tituloPaginaModal}>Turno de Trabalho</Text>
                            <IconButton
                                icon="close"
                                mode="contained"
                                onPress={() => setIsModal2Visible(false)}
                                containerColor={styles.botaoVoltar.backgroundColor}
                                iconColor={styles.botaoVoltarLabel.color}
                                style={[styles.botaoVoltar, styles.botaofecharModal]}
                                size={14}
                            />
                        </View>

                        <View style={[styles.maquinaInfo, styles.maquinaInfoModal]}>
                            <ImageBackground source={[pickTheGroup == 10 ? caminhao : null, pickTheGroup == 12 ? trator : null, pickTheGroup == 18 ? colheitadeira : null, pickTheGroup == 2 || 11 ? pulverizadora : null]} style={styles.maquinaImg}>
                                <View style={[styles.tituloMaquina, styles.tituloMargin]}>
                                    <Text style={styles.nmMaquina}>Máquina</Text>
                                </View>
                                <View style={styles.numMAquinaContainer}>
                                    <Text style={styles.numMaquina}>Nº</Text>
                                    {/* ✅ Usa o código do equipamento selecionado */}
                                    <Text style={styles.numEquip}>{selectedEquipmentCode || '---'}</Text>
                                </View>
                                <View style={styles.modeloMAquinaContainer}>
                                    <Text style={[styles.numMaquina, styles.alinhamentoModelo]}>Modelo</Text>
                                    {/* ✅ Usa o modelo do equipamento selecionado */}
                                    <Text style={styles.numEquip} numberOfLines={1}>
                                        {selectedEquipment.model_name || 'N/A'}
                                    </Text>
                                </View>
                            </ImageBackground>

                            {selectedOrder ? (
                                <Pressable style={styles.ordemProducaoItemTurno}>
                                    <Text style={styles.tituloOrdemProducao}>Ordem Produção</Text>
                                    <Text style={styles.zona}>{selectedOrder.funcao}</Text>
                                    <View style={styles.ordemProducaoInfoSelected}>
                                        <Text style={styles.ordemProducao}>OP: {selectedOrder.id}</Text>
                                        <Text style={styles.zona}>Região: {selectedOrder.zona}</Text>
                                    </View>
                                </Pressable>
                            ) : (
                                <Text>Nenhuma ordem selecionada. </Text>
                            )}
                        </View>

                        <View style={styles.modalScrollWrapper}>
                            <ScrollView style={styles.scrollViewTurnos}>
                                {turnos.map((item) => {
                                    const isSelected = selectedTurnoId === item.id;

                                    return (
                                        <Pressable
                                            key={item.id}
                                            onPress={() => handleSelectTurno(isSelected ? null : item.id)}
                                            style={[
                                                styles.turnnoItem,
                                                isSelected && styles.turnnoItemSelected
                                            ]}
                                        >
                                            <View style={styles.turnoInfo}>
                                                <Text style={[styles.turno, isSelected && styles.funcaoTextSelected]}>
                                                    Turno {item.id}
                                                </Text>
                                                <Text style={styles.ordemProducao}>{item.hora}</Text>
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
                            disabled={selectedTurnoId === null}
                            onPress={handleConfirmTurno}
                        >
                            Confirmar
                        </Button>
                    </View>
                </Modal >
            </View >
        </TouchableWithoutFeedback>

    );
}