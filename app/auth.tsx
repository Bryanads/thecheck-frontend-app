// app/auth.tsx
import React from 'react';
import { Text, SafeAreaView } from 'react-native';

const AuthScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-slate-900 justify-center items-center p-4">
      <Text className="text-cyan-400 text-4xl font-bold">TheCheck V2</Text>
      <Text className="text-slate-200 text-lg mt-4">Tela de Login / Cadastro</Text>
      {/* Aqui entram os campos de email/senha e botões */}
    </SafeAreaView>
  );
};

export default AuthScreen;