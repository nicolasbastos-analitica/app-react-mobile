import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { Button, IconButton, Modal } from "react-native-paper";
// ⚠️ Ajuste este caminho para onde está seu arquivo styles.ts
import { styles } from "@/src/styles/app/(tabs)/home/_styles";

const iconExit = require("@/assets/images/icon_exit.png");

interface ModalExitProps {
    visible: boolean;
    onDismiss: () => void;
}

export default function ModalExit({ visible, onDismiss }: ModalExitProps) {
    
    const handleExit = () => {
        onDismiss(); // Fecha o modal visualmente
        router.replace('/(auth)'); // Navega para fora
    };

    return (
        <Modal
            visible={visible}
            onDismiss={onDismiss}
            contentContainerStyle={styles.modalInterferencia} // Reutilizando o estilo do modal interferencia que tem o tamanho certo
        >
            <View style={styles.modalContainer}>
                {/* Header */}
                <View style={styles.modalHeader}>
                    <Text style={styles.tituloPaginaModal}>Sair do Metrics?</Text>
                    <IconButton
                        icon="close"
                        mode="contained"
                        onPress={onDismiss}
                        containerColor={styles.botaoVoltar.backgroundColor}
                        iconColor={styles.botaoVoltarLabel.color}
                        style={[styles.botaoVoltar, styles.botaofecharModal]}
                        size={14}
                    />
                </View>

                {/* Texto */}
                <Text style={styles.textExit}>
                    Tem certeza que deseja confirmar essa ação?
                </Text>
            </View>

            {/* Botão Inferior */}
            <View style={styles.iniciarCicloContainerBottom}>
                <View style={styles.botaoIniciarCiclo}>
                    <Button
                        style={[styles.CicloButton, styles.exitButtonModal]}
                        labelStyle={styles.CicloButtonLabel}
                        mode="contained"
                        onPress={handleExit}
                        icon={iconExit}
                        contentStyle={{ flexDirection: 'row-reverse' }}
                    >
                        Sair
                    </Button>
                </View>
            </View>
        </Modal>
    );
}