// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        // Define o ícone para cada aba
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'help-circle';

          if (route.name === 'recommendations') {
            iconName = focused ? 'water' : 'water-outline';
          } else if (route.name === 'forecasts') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // Define as cores e estilos da barra de abas
        tabBarActiveTintColor: '#22d3ee',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#1e293b',
          borderTopColor: '#1e293b',
        },
        // Define os estilos do cabeçalho
        headerStyle: {
          backgroundColor: '#1e293b',
        },
        headerTintColor: '#e2e8f0',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      {/* Aba de Recomendações */}
      <Tabs.Screen
        name="recommendations"
        options={{
          title: 'Recomendações',
        }}
      />
      {/* Aba de Previsões */}
      <Tabs.Screen
        name="forecasts"
        options={{
          title: 'Previsões',
        }}
      />
      {/* Aba de Perfil */}
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false, // O cabeçalho é controlado dentro de cada tela do fluxo de perfil
          title: 'Perfil',
        }}
      />
      
      {/* Telas que NÃO aparecem na barra de abas */}
      <Tabs.Screen
        name="presets"
        options={{
          href: null, // A opção href: null esconde a tela da barra de abas
        }}
      />
      <Tabs.Screen
        name="spots-preferences"
        options={{
          href: null, // A opção href: null esconde a tela da barra de abas
        }}
      />
    </Tabs>
  );
}