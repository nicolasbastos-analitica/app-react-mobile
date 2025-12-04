// app/(auth)/_layout.tsx

import { useAuth } from '@/src/login/AuthContext';
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  // 1. Tenta obter o login (número de registro) do estado global
  const { userLogin } = useAuth(); 

  // 2. Se o usuárioLogin existir (usuário está logado), redireciona imediatamente
  if (userLogin) {
    // Redireciona o usuário para a primeira tela de abas
    return <Redirect href="/(tabs)/selecao_equipamento" />; 
  }

  // 3. Se o userLogin for null (usuário NÃO está logado), renderiza as telas de autenticação
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Tela de Login (o index é a tela de login principal) */}
      <Stack.Screen name="index" options={{ title: "Login" }} />
      
      {/* Tela de Recuperar Senha */}
      {/* <Stack.Screen name="password" options={{ title: "Recuperar Senha" }} /> */}
    </Stack>
  );
}