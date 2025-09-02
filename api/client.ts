// api/client.ts
import axios from 'axios';
import { supabase } from './supabase';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT do Supabase a cada requisição protegida
apiClient.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn('Erro ao obter token de autenticação:', error);
  }
  return config;
});

// Interceptor para lidar com respostas de erro
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido - realizar logout
      await supabase.auth.signOut();
    }
    return Promise.reject(error);
  }
);

export default apiClient;