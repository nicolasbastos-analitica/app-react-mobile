import { Stack } from "expo-router";

export default function AuthLayout() {
    // ✅ REMOVE useAuth e Providers - navegação é controlada no root
    // ✅ Os Providers já estão no app/_layout.  tsx
    
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* Tela de Login */}
            <Stack.Screen name="index" options={{ title: "Login" }} />
            
            {/* Tela de Recuperar Senha (se precisar) */}
            {/* <Stack.Screen name="password" options={{ title: "Recuperar Senha" }} /> */}
        </Stack>
    );
}