// api/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Tipos para autenticação
export type AuthUser = {
  id: string;
  email: string;
  // outros campos do Supabase user
};

export type AuthSession = {
  access_token: string;
  user: AuthUser;
  // outros campos da sessão
};