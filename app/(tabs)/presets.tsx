// app/(tabs)/presets.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList,
  ActivityIndicator,
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { usePresets, useCreatePreset } from '../../hooks';
import { Preset, PresetCreate } from '../../types';
import { PresetForm } from '../../components/PresetForm';

const PresetsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { data: presets, isLoading, refetch: refetchPresets } = usePresets();
  const { mutate: createPreset, isPending: isCreating } = useCreatePreset();

  const handleCreatePreset = (presetData: Omit<PresetCreate, 'user_id'>) => {
    createPreset(presetData, {
      onSuccess: () => {
        setModalVisible(false);
        refetchPresets();
        Alert.alert('Sucesso!', 'Seu novo preset foi criado.');
      },
      onError: (error) => {
        Alert.alert('Erro', error.message || 'Não foi possível criar o preset.');
      }
    });
  };

  const renderItem = ({ item }: { item: Preset }) => (
    <View style={styles.presetItem}>
      <View style={styles.presetInfo}>
        <Text style={styles.presetName}>{item.name}</Text>
        {item.is_default && (
          <Ionicons name="star" size={16} color="#eab308" style={{ marginLeft: 8 }} />
        )}
      </View>
      <TouchableOpacity>
        <Ionicons name="ellipsis-vertical" size={20} color="#94a3b8" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Meus Presets' }} />

      {isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#22d3ee" />
        </View>
      ) : presets && presets.length > 0 ? (
        <FlatList
          data={presets}
          renderItem={renderItem}
          keyExtractor={(item) => item.preset_id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.centerContent}>
          <Ionicons name="bookmarks-outline" size={64} color="#64748b" />
          <Text style={styles.title}>Nenhum Preset Encontrado</Text>
          <Text style={styles.subtitle}>
            Crie seu primeiro preset para começar a receber recomendações.
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={20} color="#0f172a" />
          <Text style={styles.buttonText}>Criar Novo Preset</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <PresetForm
          onSubmit={handleCreatePreset}
          onClose={() => setModalVisible(false)}
          isSubmitting={isCreating}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { color: '#e2e8f0', fontSize: 20, fontWeight: 'bold', marginTop: 16, textAlign: 'center' },
  subtitle: { color: '#94a3b8', fontSize: 16, textAlign: 'center', marginTop: 8 },
  listContainer: { padding: 16 },
  presetItem: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  presetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  presetName: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  button: {
    backgroundColor: '#22d3ee',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#0f172a', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
});

export default PresetsScreen;