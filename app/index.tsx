// app/index.tsx
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function Index() {
  const { user, loading } = useAuth();

  // Enquanto carrega
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-900">
        <ActivityIndicator size="large" color="#22d3ee" />
      </View>
    );
  }

  // Se não houver usuário → vai pra tela de login
  if (!user) {
    return <Redirect href="/auth" />;
  }

  // Se houver usuário → vai pra tela principal (tabs)
  return <Redirect href="/recommendations" />;
}
