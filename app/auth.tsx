// app/auth.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

type AuthMode = 'login' | 'signup';

const AuthScreen = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      Alert.alert('Erro', 'Por favor, informe seu nome.');
      return;
    }

    setLoading(true);
    
    try {
      if (mode === 'login') {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password, name.trim());
        Alert.alert(
          'Sucesso!', 
          'Conta criada com sucesso. Verifique seu email para confirmar a conta.',
          [{ text: 'OK', onPress: () => setMode('login') }]
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.message || 'Ocorreu um erro. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Logo/Title */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoTitle}>TheCheck</Text>
            <Text style={styles.logoSubtitle}>Sua previsão de surf personalizada</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {mode === 'signup' && (
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Nome</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Seu nome completo"
                  placeholderTextColor="#94a3b8"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                placeholder="seu@email.com"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Sua senha"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? 'eye-off' : 'eye'} 
                    size={20} 
                    color="#94a3b8" 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>
                {mode === 'login' ? 'Entrar' : 'Criar Conta'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Toggle Mode */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            </Text>
            <TouchableOpacity onPress={toggleMode} style={styles.toggleButton}>
              <Text style={styles.toggleButtonText}>
                {mode === 'login' ? 'Cadastre-se' : 'Faça login'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          {mode === 'login' && (
            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.forgotText}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoTitle: {
    color: '#22d3ee',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  logoSubtitle: {
    color: '#94a3b8',
    fontSize: 18,
  },
  form: {
    gap: 16,
  },
  fieldContainer: {
    gap: 8,
  },
  fieldLabel: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 48,
    fontSize: 16,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 12,
  },
  submitButton: {
    backgroundColor: '#22d3ee',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  submitButtonText: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  toggleText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  toggleButton: {
    marginLeft: 8,
  },
  toggleButtonText: {
    color: '#22d3ee',
    fontSize: 16,
    fontWeight: '500',
  },
  forgotButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotText: {
    color: '#94a3b8',
    fontSize: 14,
  },
});

export default AuthScreen;