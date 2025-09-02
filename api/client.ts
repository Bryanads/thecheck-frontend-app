// api/client.ts
import axios from 'axios';
// import { supabase } from './supabase'; // Cliente Supabase

const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // URL da sua TheCheck API V2
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT do Supabase a cada requisição protegida
apiClient.interceptors.request.use(async (config) => {
    // const { data: { session } } = await supabase.auth.getSession();
    // const token = session?.access_token;
    // if (token && config.headers) {
    //     config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
});

export default apiClient;