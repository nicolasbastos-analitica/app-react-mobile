import { Tabs } from 'expo-router';
import React from 'react';
import '../global.css';


import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { PaperProvider } from 'react-native-paper';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <PaperProvider>

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
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
            tabBarButton: () => null
          }}
        />
        <Tabs.Screen
          name='Login'
          options={{
            title: 'Login',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />
          }}
        />
        <Tabs.Screen
          name='SelecaoEquipamento'
          options={{
            title: 'SelecaoEquipamento',
            // tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
            tabBarButton: () => null
          }}
        />
        <Tabs.Screen
          name='RecuperarSenha'
          options={{
            title: 'RecuperarSenha',
            // tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
            tabBarButton: () => null
          }}
        />
        <Tabs.Screen
          name='Implemento'
          options={{
            title: 'Implemento',
            // tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />
             tabBarButton: () => null, // <--- oculta essa rota da barra de tabs

          }}
        />
      </Tabs>
    </PaperProvider>
  );
}
