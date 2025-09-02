// context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
// import { supabase } from '../api/supabase'; // Você precisará configurar o cliente Supabase
import { Profile } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lógica para obter a sessão inicial do Supabase
    // const fetchSession = async () => {
    //   const { data: { session }, error } = await supabase.auth.getSession();
    //   setSession(session);
    //   setUser(session?.user ?? null);
    //   setLoading(false);
    // };
    // fetchSession();

    // const { data: authListener } = supabase.auth.onAuthStateChange(
    //   async (_event, session) => {
    //     setSession(session);
    //     setUser(session?.user ?? null);
    //   }
    // );

    // return () => {
    //   authListener?.subscription.unsubscribe();
    // };
    setLoading(false); // Simulação
  }, []);

  // Um useEffect para buscar o perfil do usuário quando ele estiver autenticado
  useEffect(() => {
    if (user) {
      // Aqui você chamaria a função da sua API para buscar o perfil
      // Ex: const userProfile = await api.getProfile(user.id);
      // setProfile(userProfile);
    } else {
      setProfile(null);
    }
  }, [user]);

  const value = {
    session,
    user,
    profile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};