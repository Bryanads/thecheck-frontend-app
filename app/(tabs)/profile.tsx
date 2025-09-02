// app/(tabs)/profile.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useProfile, useUpdateProfile, usePresets } from '../../hooks';
import { ScoreGauge } from '../../components/ScoreGauge';

const ProfileScreen = () => {
  const { signOut, user } = useAuth();
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useProfile();
  const { data: presets } = usePresets();
  const { mutate: updateProfile, isPending: updating } = useUpdateProfile();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    location: '',
    bio: '',
    surf_level: '',
    stance: '',
  });

  // Inicializa formulário quando abrir modal
  React.useEffect(() => {
    if (showEditModal && profile) {
      setEditForm({
        name: profile.name || '',
        location: profile.location || '',
        bio: profile.bio || '',
        surf_level: profile.surf_level || '',
        stance: profile.stance || '',
      });
    }
  }, [showEditModal, profile]);

  const handleSignOut = async () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
              Alert.alert('Erro', 'Não foi possível sair da conta');
            }
          },
        },
      ]
    );
  };

  const handleSaveProfile = () => {
    const updates = Object.entries(editForm).reduce((acc, [key, value]) => {
      if (value.trim() && value !== profile?.[key as keyof typeof profile]) {
        acc[key as keyof typeof editForm] = value.trim();
      }
      return acc;
    }, {} as any);

    if (Object.keys(updates).length === 0) {
      setShowEditModal(false);
      return;
    }

    updateProfile(updates, {
      onSuccess: () => {
        setShowEditModal(false);
        refetchProfile();
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      },
      onError: (error: any) => {
        Alert.alert('Erro', error.message || 'Não foi possível atualizar o perfil');
      },
    });
  };

  if (profileLoading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-900 justify-center items-center">
        <ActivityIndicator size="large" color="#22d3ee" />
        <Text className="text-slate-200 mt-4">Carregando perfil...</Text>
      </SafeAreaView>
    );
  }

  const getSurfLevelLabel = (level?: string) => {
    const levels = {
      'iniciante': 'Iniciante',
      'intermediario': 'Intermediário',
      'avancado': 'Avançado'
    };
    return levels[level as keyof typeof levels] || 'Não informado';
  };

  const getStanceLabel = (stance?: string) => {
    const stances = {
      'regular': 'Regular',
      'goofy': 'Goofy'
    };
    return stances[stance as keyof typeof stances] || 'Não informado';
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header do Perfil */}
        <View className="bg-slate-800 p-6 mb-4">
          <View className="items-center">
            {/* Avatar */}
            <View className="w-20 h-20 bg-cyan-400 rounded-full items-center justify-center mb-4">
              <Text className="text-slate-900 text-2xl font-bold">
                {profile?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            
            {/* Nome e Email */}
            <Text className="text-slate-200 text-xl font-bold">{profile?.name}</Text>
            <Text className="text-slate-400 text-base mt-1">{user?.email}</Text>
            
            {/* Localização */}
            {profile?.location && (
              <View className="flex-row items-center mt-2">
                <Ionicons name="location-outline" size={16} color="#94a3b8" />
                <Text className="text-slate-400 text-sm ml-1">{profile.location}</Text>
              </View>
            )}
          </View>

          {/* Bio */}
          {profile?.bio && (
            <Text className="text-slate-300 text-center mt-4 italic">
              "{profile.bio}"
            </Text>
          )}

          {/* Botão Editar */}
          <TouchableOpacity
            className="bg-cyan-400 rounded-lg py-3 mt-4"
            onPress={() => setShowEditModal(true)}
          >
            <Text className="text-slate-900 text-center font-bold">Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Informações do Surfista */}
        <View className="bg-slate-800 rounded-lg mx-4 p-4 mb-4">
          <Text className="text-slate-200 text-lg font-bold mb-4">Informações de Surf</Text>
          
          <View className="space-y-3">
            <InfoRow 
              icon="trending-up-outline" 
              label="Nível" 
              value={getSurfLevelLabel(profile?.surf_level)} 
            />
            <InfoRow 
              icon="footsteps-outline" 
              label="Stance" 
              value={getStanceLabel(profile?.stance)} 
            />
          </View>
        </View>

        {/* Estatísticas */}
        <View className="bg-slate-800 rounded-lg mx-4 p-4 mb-4">
          <Text className="text-slate-200 text-lg font-bold mb-4">Suas Estatísticas</Text>
          
          <View className="flex-row justify-around">
            <StatCard 
              title="Presets" 
              value={presets?.length || 0} 
              icon="bookmarks-outline" 
            />
            <StatCard 
              title="Picos Favoritos" 
              value="12" 
              icon="heart-outline" 
            />
            <StatCard 
              title="Sessions" 
              value="47" 
              icon="water-outline" 
            />
          </View>
        </View>

        {/* Menu de Opções */}
        <View className="bg-slate-800 rounded-lg mx-4 p-4 mb-4">
          <Text className="text-slate-200 text-lg font-bold mb-4">Configurações</Text>
          
          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-slate-700">
            <View className="flex-row items-center">
              <Ionicons name="bookmarks-outline" size={20} color="#22d3ee" />
              <Text className="text-slate-200 ml-3">Meus Presets</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-slate-700">
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={20} color="#22d3ee" />
              <Text className="text-slate-200 ml-3">Picos e Preferências</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-slate-700">
            <View className="flex-row items-center">
              <Ionicons name="notifications-outline" size={20} color="#22d3ee" />
              <Text className="text-slate-200 ml-3">Notificações</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <Ionicons name="help-circle-outline" size={20} color="#22d3ee" />
              <Text className="text-slate-200 ml-3">Ajuda e Suporte</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Botão Sair */}
        <TouchableOpacity
          className="bg-red-600 rounded-lg mx-4 p-4 mb-8"
          onPress={handleSignOut}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text className="text-white font-bold ml-2">Sair da Conta</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Edição */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className="flex-1 bg-slate-900">
          <View className="flex-row items-center justify-between p-4 border-b border-slate-800">
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text className="text-cyan-400 text-base">Cancelar</Text>
            </TouchableOpacity>
            <Text className="text-slate-200 text-lg font-bold">Editar Perfil</Text>
            <TouchableOpacity 
              onPress={handleSaveProfile}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator size="small" color="#22d3ee" />
              ) : (
                <Text className="text-cyan-400 text-base font-bold">Salvar</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <View className="space-y-4">
              <FormField
                label="Nome"
                value={editForm.name}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, name: text }))}
                placeholder="Seu nome completo"
              />

              <FormField
                label="Localização"
                value={editForm.location}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, location: text }))}
                placeholder="Cidade, Estado"
              />

              <FormField
                label="Bio"
                value={editForm.bio}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, bio: text }))}
                placeholder="Conte um pouco sobre você..."
                multiline
                numberOfLines={3}
              />

              {/* Nível de Surf */}
              <View>
                <Text className="text-slate-300 text-base font-medium mb-2">Nível de Surf</Text>
                <View className="flex-row space-x-2">
                  {['iniciante', 'intermediario', 'avancado'].map((level) => (
                    <TouchableOpacity
                      key={level}
                      className={`px-4 py-2 rounded-lg ${
                        editForm.surf_level === level ? 'bg-cyan-400' : 'bg-slate-800'
                      }`}
                      onPress={() => setEditForm(prev => ({ ...prev, surf_level: level }))}
                    >
                      <Text className={`text-sm font-medium ${
                        editForm.surf_level === level ? 'text-slate-900' : 'text-slate-300'
                      }`}>
                        {getSurfLevelLabel(level)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Stance */}
              <View>
                <Text className="text-slate-300 text-base font-medium mb-2">Stance</Text>
                <View className="flex-row space-x-2">
                  {['regular', 'goofy'].map((stance) => (
                    <TouchableOpacity
                      key={stance}
                      className={`px-4 py-2 rounded-lg ${
                        editForm.stance === stance ? 'bg-cyan-400' : 'bg-slate-800'
                      }`}
                      onPress={() => setEditForm(prev => ({ ...prev, stance: stance }))}
                    >
                      <Text className={`text-sm font-medium ${
                        editForm.stance === stance ? 'text-slate-900' : 'text-slate-300'
                      }`}>
                        {getStanceLabel(stance)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

// Componentes auxiliares
const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View className="flex-row items-center">
    <Ionicons name={icon as any} size={20} color="#22d3ee" />
    <Text className="text-slate-400 ml-3 flex-1">{label}:</Text>
    <Text className="text-slate-200 font-medium">{value}</Text>
  </View>
);

const StatCard = ({ title, value, icon }: { title: string; value: number | string; icon: string }) => (
  <View className="items-center">
    <View className="w-12 h-12 bg-cyan-400 rounded-full items-center justify-center mb-2">
      <Ionicons name={icon as any} size={20} color="#0f172a" />
    </View>
    <Text className="text-slate-200 text-xl font-bold">{value}</Text>
    <Text className="text-slate-400 text-xs">{title}</Text>
  </View>
);

const FormField = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  multiline = false, 
  numberOfLines = 1 
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
  numberOfLines?: number;
}) => (
  <View>
    <Text className="text-slate-300 text-base font-medium mb-2">{label}</Text>
    <TextInput
      className="bg-slate-800 text-slate-200 rounded-lg px-4 py-3 text-base"
      placeholder={placeholder}
      placeholderTextColor="#94a3b8"
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical={multiline ? 'top' : 'center'}
    />
  </View>
);

export default ProfileScreen;