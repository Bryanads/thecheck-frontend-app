// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'help-circle';

          // Define os ícones para cada aba
          if (route.name === 'recommendations') {
            iconName = focused ? 'water' : 'water-outline';
          } else if (route.name === 'forecasts') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // Estilos baseados no seu Design System
        tabBarActiveTintColor: '#22d3ee',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#1e293b',
          borderTopColor: '#1e293b',
        },
        headerStyle: {
          backgroundColor: '#1e293b',
        },
        headerTintColor: '#e2e8f0',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tabs.Screen
        name="recommendations"
        options={{
          title: 'Recomendações',
        }}
      />
      <Tabs.Screen
        name="forecasts"
        options={{
          title: 'Previsões',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
        }}
      />
    </Tabs>
  );
}