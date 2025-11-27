import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import '@/src/styles/app/global.css';
import { TelemetryProvider } from '../src/decoder/TelemetryContext';

export const unstable_settings = {
  // Define a rota inicial padrão caso haja dúvida no deep linking
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
  });

  const colorScheme = useColorScheme();

  // Garante que erros no carregamento da fonte sejam tratados
  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  // Enquanto a fonte não carrega, não renderiza nada (ou poderia ser um Splash)
  if (!fontsLoaded) {
    return null;
  }

  return (
    <TelemetryProvider>
    <PaperProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          
          {/* Rota para o fluxo de Autenticação (Login, Recuperar Senha) */}
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />

          {/* Rota para o fluxo Principal do App (Abas) */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* Modal global (opcional, mantive do seu código original) */}
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </PaperProvider>
    </TelemetryProvider>
  );
}