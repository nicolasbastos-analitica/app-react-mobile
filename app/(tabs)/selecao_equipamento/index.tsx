import { useAuth } from "@/src/context/AuthContext";
import { useEquipment } from "@/src/context/EquipmentContext";
import { useUser } from "@/src/context/UserContext";
import { useTelemetry } from "@/src/decoder/TelemetryContext";
import { styles } from "@/src/styles/app/(tabs)/selecao_equipamento/_styles";
import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Keyboard, Pressable, Text, TouchableOpacity, View } from "react-native";
import { Avatar, Button, IconButton, TextInput } from "react-native-paper";

const colheitadeira = require("@/assets/images/colheitadeira.png")
const caminhao = require("@/assets/images/caminhao.png")
const trator = require("@/assets/images/trator.png")
const userIcon = require('@/assets/images/react-logo.png');
const nullUserIcon = require('@/assets/images/user_icon.png');
const pulverizadora = require('@/assets/images/pulverizadora.png');

export default function SelecaoEquipamento() {

    // 1. CONSUMO DO CONTEXTO
    const {
        allMachines,          // ALTERADO: Agora usa allMachines (sem implementos)
        selectedEquipment,
        setSelectedEquipmentCode
    } = useEquipment();

    const {
        displayUserName,
        displayUserLogin,
    } = useUser();

    const { deviceName, isConnected } = useTelemetry();
    const { signOut } = useAuth();

    // 2. ESTADOS LOCAIS
    const [searchText, setSearchText] = useState('');
    const [showList, setShowList] = useState(false);

    // 3. LÓGICA DE FILTRO - CORRIGIDA
    const filteredMachines = useMemo(() => {
        // Se não tiver texto digitado, retorna TODAS as máquinas (sem implementos)
        if (!searchText) return allMachines;

        const upperSearch = searchText.toUpperCase();

        // Filtra apenas pelo que foi digitado (Nome ou Código)
        return allMachines.filter(item =>
            (item.model_name && item.model_name.toUpperCase().includes(upperSearch)) ||
            (item.code && item.code.toString().includes(upperSearch))
        );
    }, [searchText, allMachines]); // ALTERADO: Agora depende de allMachines

    // 4. HANDLERS
    const handleSelectMachine = (item: any) => {
        setSelectedEquipmentCode(item. code);
        setSearchText(`${item.model_name}`);
        setShowList(false);
        Keyboard.dismiss();
    };

    const handleClearSearch = () => {
        setSearchText('');
        setShowList(false);
    };

    // Dados de exibição
    const displayCode = selectedEquipment ?  selectedEquipment.code : '---';
    const displayModel = selectedEquipment ? selectedEquipment.model_name : 'Nenhuma máquina selecionada';
    const fallbackUser = "Usuário não identificado";
    const pickTheGroup = selectedEquipment ?  selectedEquipment.operation_group_id : '---';
    const haveIcon = false;

    return (
        <View style={styles.containerGeral}>
            <View style={styles.containerHeader}>
                <IconButton icon="chevron-left" mode="contained" onPress={() => { router.replace('/(auth)'); signOut(); }}
                    containerColor={styles.botaoVoltar.backgroundColor}
                    iconColor={styles.botaoVoltarLabel.color}
                    style={[styles.botaoVoltar, styles.botaoVoltarRecuperarSenha]}
                    size={14}
                />
                <View style={[styles.containerBlueSwitchON, isConnected ? styles.containerBlueSwitchON : styles. containerBlueSwitchOFF]}>
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
                <View style={styles.containerUser} >
                    <Avatar.Image size={36} source={haveIcon == false ? nullUserIcon : userIcon} />
                    <View style={styles.userTextContainer} >
                        <Text style={styles.panelUser}>{displayUserName || fallbackUser}</Text>
                        <Text style={styles.panelDescription}>Registro <Text style={[styles.numRegistro]}>{displayUserLogin}</Text></Text>
                    </View>
                </View>

                <Text style={styles.tituloPagina}>Seleção de Máquina</Text>

                {/* --- ÁREA DE PESQUISA (Dropdown) --- */}
                <View style={{ zIndex: 100 }}>
                    <TextInput
                        theme={{ roundness: 8, colors: { primary: "#8F8CB5", outline: "#8F8CB5", onSurfaceVariant: "#8F8CB5" } }}
                        label="Buscar máquina"
                        mode="outlined"
                        value={searchText}
                        onChangeText={(text) => {
                            setSearchText(text);
                            setShowList(true);
                        }}
                        onFocus={() => setShowList(true)}
                        style={styles.input}
                        left={<TextInput.Icon icon='magnify' color="#42405F" />}
                        right={searchText.length > 0 ?  <TextInput.Icon icon="close" color="#8F8CB5" onPress={handleClearSearch} /> : null}
                    />

                    {/* --- LISTA FLUTUANTE --- */}
                    {showList && (
                        <View
                            style={{
                                position: 'absolute',
                                top: 80,
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
                                data={filteredMachines}
                                keyExtractor={(item) => (item.code ? item.code. toString() : Math.random().toString())} 
                                keyboardShouldPersistTaps="handled"
                                nestedScrollEnabled={true}
                                style={{ flex: 1 }}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => handleSelectMachine(item)}
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
                                            Nenhuma máquina encontrada.
                                        </Text>
                                    </View>
                                }
                            />
                        </View>
                    )}
                </View>

                {/* --- CARD DA MÁQUINA --- */}
                <View style={styles.maquinaInfo}>
                    <View style={styles.infoMaquinaContainer}>
                        <View style={[styles.tituloMaquina]}>
                            <Text style={styles.nmMaquina}>Máquina</Text>
                        </View>
                        <View style={styles.numMAquinaContainer}>
                            <Text style={styles.numMaquina}>Código </Text>
                            <Text style={styles.numEquip}>{displayCode}</Text>
                        </View>
                        <View style={styles.modeloMAquinaContainer}>
                            <Text style={[styles.numMaquina, styles.alinhamentoModelo]}>Modelo</Text>
                            <Text style={[styles.numEquip, styles. alinhamentoModeloMarca]} numberOfLines={1}>{displayModel}</Text>
                        </View>
                    </View>
                </View>

                <ImageBackground source={[pickTheGroup == 10 ? caminhao : null, pickTheGroup == 12 ? trator : null, pickTheGroup == 18 ? colheitadeira : null, pickTheGroup == 2 || 11 ? pulverizadora : null]} style={styles.maquinaImg}>
                    <View style={styles.blurIMG}></View>
                </ImageBackground>
            </View>

            <View style={styles.botaoProximo}>
                <Button
                    style={styles.nextButton}
                    labelStyle={styles.nextButtonLabel}
                    mode="contained"
                    disabled={!selectedEquipment}
                    onPress={() => router.replace('/(tabs)/selecao_implementos')}
                >
                    Próximo
                </Button>
            </View>
        </View>
    );
}