// app/index.tsx
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext'; // Ajuste o caminho se necessário

export default function Index() {
  const { session, loading } = useAuth();

  // Enquanto o status do login está sendo verificado, mostramos um loading.
  // O layout principal (_layout.tsx) vai garantir o fundo escuro.
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-900">
        <ActivityIndicator size="large" color="#22d3ee" />
      </View>
    );
  }

  // Se não houver sessão, o usuário é redirecionado para a tela de autenticação.
  if (!session) {
    return <Redirect href="/auth" />;
  }

  // Se houver uma sessão, o usuário é redirecionado para a tela principal do app.
  return <Redirect href="/recommendations" />;
}