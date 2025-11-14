import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";
import "../../global.css";
// Removi o 'Drawer' que não estava sendo usado
import { Avatar, Button, Dialog, Icon, IconButton, MD3Colors, Modal, Portal, ProgressBar, TextInput } from 'react-native-paper';
const backgroundImage = require("@/assets/images/splash_screen.png");
// const lock = require("@/assets/images/lock.png")
import { Link } from 'expo-router';
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
  const haveIcon = false;
  const userIcon = require('@/assets/images/react-logo.png');
  const nullUserIcon = require('@/assets/images/user_icon.png');
  const lockIcon = require('@/assets/images/lock_icon.png')



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
          style={styles.botaoLogin}
          labelStyle={styles.botaoLoginLabel}
          mode="contained"
          onPress={showPanel}
        >
          Iniciar
        </Button>
        <Button
          style={styles.botaoSincronizacao}
          labelStyle={styles.botaoLoginLabel}
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
            <IconButton icon="chevron-left" mode="contained" onPress={hidePasswordPanel} 
            containerColor={styles.botaoVoltar.backgroundColor} 
            iconColor={styles.botaoVoltarLabel.color} 
            style={styles.botaoVoltar} 
            size={14}>
            </IconButton>

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
                  icon={()=> (<Image source={lockIcon}/>)}
                  // style={{ width: 13, height: 14 }} 
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
            <Button style={styles.botaoEsqueciSenha} labelStyle={styles.labelBotaoEsqueciSenha}>Esqueci minha senha</Button>

            <View style={styles.paginationDots}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={[styles.dot, styles.dotActive]} />
            </View>
            <Link href="/(tabs)/selecao_equipamento" asChild >
              <Pressable style={styles.botaoEntrar}>
                <Text style={styles.textBotaoEntrar}>Entrar <Icon source="check" color="#FFFFFF" size={20} /></Text>
              </Pressable>
            </Link>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}