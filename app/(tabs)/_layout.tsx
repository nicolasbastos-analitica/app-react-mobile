// app/(tabs)/_layout.tsx
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { TelemetryProvider } from '../decoder/TelemetryContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <TelemetryProvider>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />

      {/* Telas que fazem parte do fluxo logado, mas não aparecem na barra */}
      <Tabs.Screen
        name="SelecaoEquipamento"
        options={{
          href: null, // Esconde da barra
        }}
      />
      
      <Tabs.Screen
        name="Implemento"
        options={{
          href: null, // Esconde da barra
        }}
      />
         <Tabs.Screen
        name="home"
        options={{
          href: null, // Esconde da barra
        }}
      />
    </Tabs>
    </TelemetryProvider>
  );
}