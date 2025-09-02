// app/index.tsx
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Aguarda o fim do carregamento para decidir para onde redirecionar
    if (!loading) {
      if (user) {
        // Se há um usuário, redireciona para a tela principal (recomendações)
        router.replace('/recommendations');
      } else {
        // Se não há usuário, redireciona para a tela de autenticação
        router.replace('/auth');
      }
    }
  }, [user, loading, router]); // Adiciona dependências para re-executar quando mudarem

  // Sempre exibe um indicador de carregamento enquanto a lógica de redirecionamento é processada
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
      <ActivityIndicator size="large" color="#22d3ee" />
    </View>
  );
}