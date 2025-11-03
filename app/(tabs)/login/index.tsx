import React, { useState } from "react";
import {
  View,
  ImageBackground,
  ActivityIndicator,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import "../../global.css";
// Removi o 'Drawer' que não estava sendo usado
import { Avatar, Button, Dialog, MD3Colors, Modal, Portal, ProgressBar, TextInput, } from 'react-native-paper';
const backgroundImage = require("@/assets/images/splash_screen.png");
// const lock = require("@/assets/images/lock.png")
import { styles } from "./styles";

export default function Login() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [isPasswordPanelVisible, setIsPasswordPanelVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isDialogVisible, setDialogVisible] = useState(false);
  
  const showPanel = () => setIsPanelVisible(true);
  const hidePanel = () => setIsPanelVisible(false);
  const showPasswordPanel = () => setIsPasswordPanelVisible(true);
  const hidePasswordPanel = () => setIsPasswordPanelVisible(false);
  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

  const user = 'José da Silva Machado';
  const numRegistro = '000000001';

  

  return (
    <View style={{ flex: 1 }}>
      {/* ... (ImageBackground e Botão "Iniciar" não mudam) ... */}
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        onLoadEnd={() => setImageLoaded(true)}
      >
        {!imageLoaded && (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
        <Button
          style={styles.botao_login}
          labelStyle={styles.botao_login_label}
          mode="contained"
          onPress={showPanel}
        >
          Iniciar
        </Button>
        <Button
          style={styles.botao_sincronizacao}
          labelStyle={styles.botao_login_label}
          mode="contained"
          onPress={showDialog}
        >
          Sincronizar
        </Button>
        <Portal>
          <Dialog visible={isDialogVisible} onDismiss={hideDialog}>
            <Dialog.Content>
              <Text>Sincronizando...</Text>
              <ProgressBar progress={0.5} color={MD3Colors.error50} />
            </Dialog.Content>
          </Dialog>
        </Portal>
      </ImageBackground>

      <Modal
        visible={isPanelVisible}
        onDismiss={hidePanel}
        contentContainerStyle={styles.panelContainer}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView contentContainerStyle={styles.panelContent}>
            <View style={styles.containerItens}>
              <Text style={styles.panelTitle}>Login</Text>
              <Text style={styles.panelDescription}>
                Digite o número do seu registro para localizar seu perfil.
              </Text>
              <TextInput
                theme={{
                  roundness: 8,
                  colors: {
                    primary: "#8F8CB5", // Cor (focado)
                    outline: "#8F8CB5", // Cor da borda (inativo)
                    onSurfaceVariant: "#8F8CB5" // Cor do label (inativo)
                  }
                }}
                label="Número do registro"
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
                left={
                  <TextInput.Icon
                    icon="account-circle-outline"
                    color="#00B16B"
                  />
                }
              />
              <View style={styles.paginationDots}>
                <View style={[styles.dot, styles.dotActive]} />
                <View style={styles.dot} />
              </View>
              <Button
                style={styles.iniciarButton}
                labelStyle={styles.iniciarButtonLabel}
                mode="contained"
                onPress={showPasswordPanel}
              >
                Iniciar
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* modal 2 : tela de senha */}

      <Modal
        visible={isPasswordPanelVisible}
        onDismiss={hidePasswordPanel}
        contentContainerStyle={styles.passwordPanelContainer}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >

          <ScrollView contentContainerStyle={styles.panelContent}>
          <Button icon="chevron-left" mode="contained" onPress={hidePasswordPanel} style={styles.botaoVoltar} labelStyle={styles.botaoVoltarLabel}>
            Voltar
          </Button>
            <Text style={styles.panelTitle}>Bem-vindo</Text>

            <View style={styles.containerUser} >
              <Avatar.Image size={64} source={require('@/assets/images/react-logo.png')} />
              <View style={styles.userTextContainer} >
                <Text style={styles.panelUser}>
                  {user}
                </Text>
                <Text style={styles.panelDescription}>
                  Registro <Text style={[styles.numRegistro]}>{numRegistro}</Text>
                </Text>
              </View>
            </View>
            <Text style={styles.panelDescriptionPassword}>
              Insira sua senha de acesso.
            </Text>

            <TextInput
              theme={{
                roundness: 8,
                colors: {
                  primary: "#8F8CB5", // Cor (focado)
                  outline: "#8F8CB5", // Cor da borda (inativo)
                  onSurfaceVariant: "#8F8CB5" // Cor do label (inativo)
                }
              }}
              label="Senha de acesso"
              mode="outlined"
              secureTextEntry={isPasswordVisible ? false : true}
              style={styles.input}
              left={
                <TextInput.Icon
                  icon='lock'
                  color="#00B16B"
                />
              }
              right={
                <TextInput.Icon
                  icon={isPasswordVisible ? 'eye' : 'eye-off'}
                  color='#8f8cb5'
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                />
              }
            />
            <Button style={styles.botao_esqueci_senha} labelStyle={styles.label_botao_esqueci_senha}>Esqueci minha senha</Button>

            <View style={styles.paginationDots}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={[styles.dot, styles.dotActive]} />
            </View>
            <Button
              style={styles.iniciarButton}
              labelStyle={styles.iniciarButtonLabel}
              mode="contained"
              onPress={hidePasswordPanel}
            >
              Iniciar
            </Button>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}