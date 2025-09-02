// app/(tabs)/spots-preferences.tsx
import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

const SpotsPreferencesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Picos e Preferências' }} />
      <View style={styles.content}>
        <Ionicons name="options-outline" size={64} color="#64748b" />
        <Text style={styles.title}>
          Personalize suas Preferências
        </Text>
        <Text style={styles.subtitle}>
          Selecione um pico da lista para ajustar as condições ideais de surf para você.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    color: '#e2e8f0',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
});


export default SpotsPreferencesScreen;