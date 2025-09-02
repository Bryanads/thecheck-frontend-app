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
  StyleSheet, // Importa StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useProfile, useUpdateProfile, usePresets } from '../../hooks';
import { router } from 'expo-router';

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
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22d3ee" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
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
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header do Perfil */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {profile?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            
            <Text style={styles.profileName}>{profile?.name}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            
            {profile?.location && (
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color="#94a3b8" />
                <Text style={styles.locationText}>{profile.location}</Text>
              </View>
            )}
          </View>

          {profile?.bio && (
            <Text style={styles.bioText}>
              "{profile.bio}"
            </Text>
          )}

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => setShowEditModal(true)}
          >
            <Text style={styles.editProfileButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Informações do Surfista */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informações de Surf</Text>
          <View style={styles.infoRowsContainer}>
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
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Suas Estatísticas</Text>
          <View style={styles.statsContainer}>
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
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Configurações</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/(tabs)/presets')}
          >
            <View style={styles.menuItemContent}>
              <Ionicons name="bookmarks-outline" size={20} color="#22d3ee" />
              <Text style={styles.menuItemText}>Meus Presets</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/(tabs)/spots-preferences')}
          >
            <View style={styles.menuItemContent}>
              <Ionicons name="location-outline" size={20} color="#22d3ee" />
              <Text style={styles.menuItemText}>Picos e Preferências</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Ionicons name="notifications-outline" size={20} color="#22d3ee" />
              <Text style={styles.menuItemText}>Notificações</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={styles.menuItemContent}>
              <Ionicons name="help-circle-outline" size={20} color="#22d3ee" />
              <Text style={styles.menuItemText}>Ajuda e Suporte</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Botão Sair */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <View style={styles.signOutButtonContent}>
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text style={styles.signOutButtonText}>Sair da Conta</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de Edição */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text style={styles.modalHeaderButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <TouchableOpacity 
              onPress={handleSaveProfile}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator size="small" color="#22d3ee" />
              ) : (
                <Text style={[styles.modalHeaderButtonText, { fontWeight: 'bold' }]}>Salvar</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScrollView}>
            <View style={styles.formContainer}>
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
                <Text style={styles.formLabel}>Nível de Surf</Text>
                <View style={styles.optionsContainer}>
                  {['iniciante', 'intermediario', 'avancado'].map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.optionButton,
                        editForm.surf_level === level && styles.optionButtonSelected
                      ]}
                      onPress={() => setEditForm(prev => ({ ...prev, surf_level: level }))}
                    >
                      <Text style={[
                        styles.optionButtonText,
                        editForm.surf_level === level && styles.optionButtonTextSelected
                      ]}>
                        {getSurfLevelLabel(level)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {/* Stance */}
              <View>
                <Text style={styles.formLabel}>Stance</Text>
                <View style={styles.optionsContainer}>
                  {['regular', 'goofy'].map((stance) => (
                    <TouchableOpacity
                      key={stance}
                      style={[
                        styles.optionButton,
                        editForm.stance === stance && styles.optionButtonSelected
                      ]}
                      onPress={() => setEditForm(prev => ({ ...prev, stance: stance }))}
                    >
                      <Text style={[
                        styles.optionButtonText,
                        editForm.stance === stance && styles.optionButtonTextSelected
                      ]}>
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
const InfoRow = ({ icon, label, value }: { icon: any; label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={20} color="#22d3ee" />
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const StatCard = ({ title, value, icon }: { title: string; value: number | string; icon: any }) => (
  <View style={styles.statCard}>
    <View style={styles.statIconContainer}>
      <Ionicons name={icon} size={20} color="#0f172a" />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const FormField = ({ 
  label, value, onChangeText, placeholder, multiline = false, numberOfLines = 1 
}: {
  label: string; value: string; onChangeText: (text: string) => void;
  placeholder: string; multiline?: boolean; numberOfLines?: number;
}) => (
  <View>
    <Text style={styles.formLabel}>{label}</Text>
    <TextInput
      style={styles.textInput}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  loadingContainer: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#e2e8f0', marginTop: 16 },
  profileHeader: { backgroundColor: '#1e293b', padding: 24, marginBottom: 16 },
  avatarContainer: { alignItems: 'center' },
  avatar: { width: 80, height: 80, backgroundColor: '#22d3ee', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarText: { color: '#0f172a', fontSize: 32, fontWeight: 'bold' },
  profileName: { color: '#e2e8f0', fontSize: 24, fontWeight: 'bold' },
  profileEmail: { color: '#94a3b8', fontSize: 16, marginTop: 4 },
  locationContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  locationText: { color: '#94a3b8', fontSize: 14, marginLeft: 4 },
  bioText: { color: '#cbd5e1', textAlign: 'center', marginTop: 16, fontStyle: 'italic' },
  editProfileButton: { backgroundColor: '#22d3ee', borderRadius: 8, paddingVertical: 12, marginTop: 16 },
  editProfileButtonText: { color: '#0f172a', textAlign: 'center', fontWeight: 'bold' },
  card: { backgroundColor: '#1e293b', borderRadius: 8, marginHorizontal: 16, padding: 16, marginBottom: 16 },
  cardTitle: { color: '#e2e8f0', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  infoRowsContainer: { gap: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  infoLabel: { color: '#94a3b8', marginLeft: 12, flex: 1 },
  infoValue: { color: '#e2e8f0', fontWeight: '500' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  statCard: { alignItems: 'center' },
  statIconContainer: { width: 48, height: 48, backgroundColor: '#22d3ee', borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { color: '#e2e8f0', fontSize: 20, fontWeight: 'bold' },
  statTitle: { color: '#94a3b8', fontSize: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#334155' },
  menuItemContent: { flexDirection: 'row', alignItems: 'center' },
  menuItemText: { color: '#e2e8f0', marginLeft: 12 },
  signOutButton: { backgroundColor: '#dc2626', borderRadius: 8, margin: 16, padding: 16 },
  signOutButtonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  signOutButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },
  // Modal Styles
  modalContainer: { flex: 1, backgroundColor: '#0f172a' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  modalHeaderButtonText: { color: '#22d3ee', fontSize: 16 },
  modalTitle: { color: '#e2e8f0', fontSize: 18, fontWeight: 'bold' },
  modalScrollView: { flex: 1, padding: 16 },
  formContainer: { gap: 16 },
  formLabel: { color: '#cbd5e1', fontSize: 16, fontWeight: '500', marginBottom: 8 },
  textInput: { backgroundColor: '#1e293b', color: '#e2e8f0', borderRadius: 8, padding: 12, fontSize: 16 },
  optionsContainer: { flexDirection: 'row', gap: 8 },
  optionButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#1e293b' },
  optionButtonSelected: { backgroundColor: '#22d3ee' },
  optionButtonText: { color: '#cbd5e1', fontSize: 14, fontWeight: '500' },
  optionButtonTextSelected: { color: '#0f172a' },
});

export default ProfileScreen;