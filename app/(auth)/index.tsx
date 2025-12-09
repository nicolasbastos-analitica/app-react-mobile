import userData from "@/src/cache/users.json";
import { useAuth } from "@/src/context/AuthContext";
import { styles } from "@/src/styles/app/(auth)/_styles";
import "@/src/styles/app/global.css";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View
} from "react-native";
import { Button, Dialog, MD3Colors, Modal, Portal, ProgressBar, TextInput } from 'react-native-paper';

// --- Interfaces ---
interface UserData {
  login: string;
  name: string;
  company_code: number;
  user_id: number;
  password: string;
  company_id: number;
  company_unit_code: number;
  company_unit_id: number;
  employee_code: number;
  status_embedded: number;
}

interface UserDataFile {
  data: UserData[];
}

// Dados estáticos podem ficar fora
const SampleUserData = (userData as unknown as UserDataFile).data;
const backgroundImage = require("@/assets/images/background_img.png");
const logoAnalitica = require("@/assets/images/logo_analitica2x.png");

export default function Login() {
  // ============================================================
  // 1. HOOKS (DENTRO DO COMPONENTE)
  // ============================================================
  
  // Estados do Teclado
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Monitoramento do Teclado
  useEffect(() => {
    // Função quando abre
    const onKeyboardShow = (event: any) => {
      setKeyboardHeight(event.endCoordinates.height); // Pega a altura
      setKeyboardVisible(true);
    };

    // Função quando fecha
    const onKeyboardHide = () => {
      setKeyboardHeight(0);
      setKeyboardVisible(false);
    };

    // Adiciona Listeners
    const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardHide);

    // Limpa Listeners
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // Outros Estados
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [registrationInput, setRegistrationInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Contexto e Router
  const { setLogin } = useAuth();
  
  // Variáveis
  const appVersion = '1.0';

  // ============================================================
  // 2. FUNÇÕES
  // ============================================================

  const showPanel = () => setIsPanelVisible(true);
  const hidePanel = () => setIsPanelVisible(false);
  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

  function validateUser(login: string): UserData | null {
    const users = SampleUserData;
    const foundUser = users.find((user: UserData) => user.login === login);
    return foundUser || null;
  }

  const handleLogin = () => {
    setErrorMessage('');
    const foundUser = validateUser(registrationInput);

    if (foundUser) {
      setLogin(foundUser.login);
      console.log(`Usuário encontrado: ${foundUser.name}`);
      hidePanel();
      router.replace('/(tabs)/selecao_equipamento');
    } else {
      const message = "Usuário inválido. Verifique o número de registro.";
      setErrorMessage(message);
      Alert.alert("Erro de Login", message);
    }
  }

  // ============================================================
  // 3. RENDERIZAÇÃO
  // ============================================================
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        onLoadEnd={() => setImageLoaded(true)}
      >
        {!imageLoaded && (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
        <View style={styles.logoContainer}>
          <Image
            source={logoAnalitica}
            style={styles.logoAnalitica}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.versionText}>Versão {appVersion}</Text>

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
        // AQUI ESTÁ A LÓGICA DE ALTURA
        // Se o teclado abrir, adiciona margem inferior igual à altura do teclado
        contentContainerStyle={[
            styles.panelContainer, 
            isKeyboardVisible ? { marginBottom: keyboardHeight } : null
        ]}
      >
        {/* Como você já está controlando a margem manualmente, 
            talvez não precise do KeyboardAvoidingView aqui dentro, 
            mas deixei para garantir caso o modal tenha scroll interno */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
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
                    primary: "#8F8CB5",
                    outline: "#8F8CB5",
                    onSurfaceVariant: "#8F8CB5"
                  }
                }}
                value={registrationInput}
                onChangeText={setRegistrationInput}
                label="Número do registro"
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
                left={
                  <TextInput.Icon
                    icon="account-circle-outline"
                    color="#42405F"
                  />
                }
              />
              {errorMessage ? (
                <Text style={{ color: 'red', marginBottom: 16 }}>
                  {errorMessage}
                </Text>
              ) : null}
              
              <Button
                style={styles.iniciarButton}
                labelStyle={styles.iniciarButtonLabel}
                mode="contained"
                onPress={handleLogin}
              >
                Iniciar
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}