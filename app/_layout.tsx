// app/_layout.tsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext'; // Ajuste o caminho se necessário
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const queryClient = new QueryClient();

export default function RootLayoutNav() {
  // Envolvemos toda a aplicação com os provedores de dados e autenticação
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack
          screenOptions={{
            // Fundo escuro por padrão em todas as telas
            contentStyle: { backgroundColor: '#0f172a' } 
          }}
        >
          {/* A rota 'index' é o nosso hub de redirecionamento, sem cabeçalho */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          
          {/* A tela de autenticação também não precisa de cabeçalho */}
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          
          {/* As abas principais do app. O cabeçalho será gerenciado pelo layout das abas. */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" />
      </AuthProvider>
    </QueryClientProvider>
  );
}