import React, { useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { Avatar, Button, Icon, TextInput } from "react-native-paper";
import { styles } from "./styles";

const iconColhedora = require("@/assets/images/colhedora4x.png");
const iconTrator = require("@/assets/images/trator.png");
const iconUnion = require("@/assets/images/Union.png");
const numEquip = 80001;
const modeloEquip = 'New Holland Tc5090';
export default function SelecaoEquipamento() {
    const [selectedEquip, setSelectedEquip] = useState("colhedora");
    return (
        <View>
            <View style={styles.containerAvatar}>
                <Avatar.Image
                    style={styles.avatar}
                    size={45}
                    source={require("@/assets/images/react-logo.png")}
                />
            </View>

            <View style={styles.containerGeral}>
                <Text style={styles.tituloPagina}>Selecione o equipamento</Text>

                <View style={styles.containerBotoes}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false} // Esconde a barrinha
                        contentContainerStyle={{ gap: 10, paddingRight: 20 }} // espaçamento entre botões e na direita
                    >
                        <Button
                            icon={() => <Image source={iconColhedora} style={styles.icons} />}
                            style={styles.botaoEquipSelect}
                            labelStyle={styles.botaoEquipSelectLabel}
                            mode="contained"
                            onPress={() => { }}
                        >
                            Colhedora
                        </Button>

                        <Button
                            icon={() => <Image source={iconTrator} style={[styles.icons, { width: 25, height: 20 }]} />}
                            style={styles.botaoEquipUnselect}
                            labelStyle={styles.botaoEquipUnselectLabel}
                            mode="contained"
                            onPress={() => { }}
                        >
                            Trator
                        </Button>

                        <Button
                            icon={() => <Image source={iconUnion} style={styles.icons} />}
                            style={styles.botaoEquipUnselect}
                            labelStyle={styles.botaoEquipUnselectLabel}
                            mode="contained"
                            onPress={() => { }}
                        >
                            Union
                        </Button>
                    </ScrollView>
                </View>
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

                    style={styles.input}
                    left={
                        <TextInput.Icon
                            icon='magnify'
                            color="#00B16B"
                        />}
                />

                {/* Botoes de seleção de equipament */}
                <ScrollView
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    style={{ height: 380 }}
                >
                    <Button

                        style={styles.botaoEspecificacaoSelect}
                        mode="contained"
                        onPress={() => { }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.numEquip}>{numEquip}</Text>
                            <Text style={styles.modeloEquipSelect}>{modeloEquip}</Text>
                            <Icon source="check" size={20} color="#fff" />
                        </View>
                    </Button>

                    <Button

                        style={styles.botaoEspecificacaoUnselect}
                        mode="contained"
                        onPress={() => { }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.numEquipUnselect}>{numEquip}</Text>
                            <Text style={styles.numEquipUnselect}>{modeloEquip}</Text>
                            <Icon source="check" size={20} color="#fff" />
                        </View>
                    </Button>
                    <Button

                        style={styles.botaoEspecificacaoUnselect}
                        mode="contained"
                        onPress={() => { }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.numEquipUnselect}>{numEquip}</Text>
                            <Text style={styles.numEquipUnselect}>{modeloEquip}</Text>
                            <Icon source="check" size={20} color="#fff" />
                        </View>
                    </Button> <Button

                        style={styles.botaoEspecificacaoUnselect}
                        mode="contained"
                        onPress={() => { }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.numEquipUnselect}>{numEquip}</Text>
                            <Text style={styles.numEquipUnselect}>{modeloEquip}</Text>
                            <Icon source="check" size={20} color="#fff" />
                        </View>
                    </Button> <Button

                        style={styles.botaoEspecificacaoUnselect}
                        mode="contained"
                        onPress={() => { }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.numEquipUnselect}>{numEquip}</Text>
                            <Text style={styles.numEquipUnselect}>{modeloEquip}</Text>
                            <Icon source="check" size={20} color="#fff" />
                        </View>
                    </Button>
                    <Button

                        style={styles.botaoEspecificacaoUnselect}
                        mode="contained"
                        onPress={() => { }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.numEquipUnselect}>{numEquip}</Text>
                            <Text style={styles.numEquipUnselect}>{modeloEquip}</Text>
                            <Icon source="check" size={20} color="#fff" />
                        </View>
                    </Button>
                    <Button

                        style={styles.botaoEspecificacaoUnselect}
                        mode="contained"
                        onPress={() => { }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.numEquipUnselect}>{numEquip}</Text>
                            <Text style={styles.numEquipUnselect}>{modeloEquip}</Text>
                            <Icon source="check" size={20} color="#fff" />
                        </View>
                    </Button>
                    <Button

                        style={styles.botaoEspecificacaoUnselect}
                        mode="contained"
                        onPress={() => { }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.numEquipUnselect}>{numEquip}</Text>
                            <Text style={styles.numEquipUnselect}>{modeloEquip}</Text>
                            <Icon source="check" size={20} color="#fff" />
                        </View>
                    </Button>
                    <Button

                        style={styles.botaoEspecificacaoUnselect}
                        mode="contained"
                        onPress={() => { }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.numEquipUnselect}>{numEquip}</Text>
                            <Text style={styles.numEquipUnselect}>{modeloEquip}</Text>
                            <Icon source="check" size={20} color="#fff" />
                        </View>
                    </Button>
                    <Button

                        style={styles.botaoEspecificacaoUnselect}
                        mode="contained"
                        onPress={() => { }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.numEquipUnselect}>{numEquip}</Text>
                            <Text style={styles.numEquipUnselect}>{modeloEquip}</Text>
                            <Icon source="check" size={20} color="#fff" />
                        </View>
                    </Button>
                </ScrollView>
            </View>
            <Button
                style={styles.nextButton}
                labelStyle={styles.nextButtonLabel}
                mode="contained"
            >
                Iniciar
            </Button>
        </View>
    );
}
