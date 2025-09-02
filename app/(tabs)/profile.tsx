// screens/ProfileScreen.tsx
import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { useAuth } from '../../context/AuthContext'; // Ajuste o caminho se necessário

const ProfileScreen = () => {
  const { profile } = useAuth();
  return (
    <SafeAreaView className="flex-1 bg-slate-900 justify-center items-center">
      <Text className="text-slate-200 text-lg">Tela de Perfil</Text>
      <Text className="text-cyan-400 text-2xl mt-4">{profile?.name ?? 'Usuário'}</Text>
    </SafeAreaView>
  );
};

export default ProfileScreen;