// 📂 Arquivo: app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Icon } from "react-native-paper";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ 
        headerShown: false,
        tabBarStyle: { display: 'none' } 
    }}>
      
      {/* Opcional: Se você tiver um index.tsx solto na pasta tabs */}
      <Tabs.Screen name="index" options={{ href: null }} /> 

      <Tabs.Screen 
        name="home/index"
        options={{ 
          title: "Home",
          tabBarIcon: ({ color }) => <Icon source="home" size={24} color={color} /> 
        }} 
      />

      <Tabs.Screen 
        name="jornada_automatica/index" 
        options={{ title: "Jornada" }} 
      />

      <Tabs.Screen 
        name="selecao_equipamento/index" 
        options={{ title: "Equipamento" }} 
      />

      <Tabs.Screen 
        name="selecao_implementos/index" 
        options={{ title: "Implementos" }} 
      />
    </Tabs>
  );
}