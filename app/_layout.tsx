import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { EquipmentProvider } from '@/src/context/EquipmentContext';
import { GlobalStateProvider } from '@/src/context/GlobalStateContext';
import { OPProvider } from '@/src/context/OPContext'; // 👈 IMPORTA (Ordem de Produção)
import { OpProvider } from '@/src/context/OperationContext';
import { UserProvider } from '@/src/context/UserContext';
import '@/src/styles/app/global.css';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { TelemetryProvider } from '../src/decoder/TelemetryContext';

export const unstable_settings = {
    initialRouteName: '(auth)',
};

function NavigationController() {
    const { userLogin } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        const inAuthGroup = segments[0] === '(auth)';

        if (!userLogin && !inAuthGroup) {
            router.replace('/(auth)');
        } else if (userLogin && inAuthGroup) {
            router.replace('/(tabs)/selecao_equipamento');
        }
    }, [userLogin, segments]);

    return <Slot />;
}

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
        'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
    });

    const colorScheme = useColorScheme();

    useEffect(() => {
        if (fontError) throw fontError;
    }, [fontError]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <TelemetryProvider>
            <AuthProvider>
                <UserProvider>
                    <GlobalStateProvider>
                        <OpProvider> {/* Operações */}
                            <OPProvider> {/* 👈 Ordem de Produção */}
                                <EquipmentProvider>
                                    <PaperProvider>
                                        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                                            <NavigationController />
                                            <StatusBar style="auto" />
                                        </ThemeProvider>
                                    </PaperProvider>
                                </EquipmentProvider>
                            </OPProvider>
                        </OpProvider>
                    </GlobalStateProvider>
                </UserProvider>
            </AuthProvider>
        </TelemetryProvider>
    );
}