import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Tela de Login */}
      <Stack.Screen name="index" options={{ title: "Login" }} />
      
      {/* Tela de Recuperar Senha */}
      <Stack.Screen name="password" options={{ title: "Recuperar Senha" }} />
    </Stack>
  );
}