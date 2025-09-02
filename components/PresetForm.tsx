// components/PresetForm.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Switch,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal, // Import Modal
} from 'react-native';
import { PresetCreate } from '../types';
import { SpotSelector } from './SpotSelector'; // Importa o seletor de picos
import { useSpots } from '../hooks';

interface PresetFormProps {
  onClose: () => void;
  onSubmit: (data: PresetCreate) => void;
  isSubmitting: boolean;
  preset?: PresetCreate; // Para edição futura
}

export const PresetForm = ({ onClose, onSubmit, isSubmitting, preset }: PresetFormProps) => {
  const { data: allSpots } = useSpots();
  const [name, setName] = useState(preset?.name || '');
  const [isDefault, setIsDefault] = useState(preset?.is_default || false);
  const [spotSelectorVisible, setSpotSelectorVisible] = useState(false);
  const [selectedSpotIds, setSelectedSpotIds] = useState<number[]>(preset?.spot_ids || []);

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Campo Obrigatório', 'Por favor, dê um nome ao seu preset.');
      return;
    }
    if (selectedSpotIds.length === 0) {
      Alert.alert('Campo Obrigatório', 'Selecione pelo menos um pico.');
      return;
    }
    
    // Dados mocados para os campos ainda não implementados
    const placeholderData = {
      start_time: '06:00:00', // Placeholder
      end_time: '18:00:00', // Placeholder
      day_selection_type: 'offsets' as 'offsets' | 'weekdays', // Placeholder
      day_selection_values: [0, 1], // Placeholder
    };

    onSubmit({
      name,
      spot_ids: selectedSpotIds,
      is_default: isDefault,
      ...placeholderData,
    });
  };

  const getSelectedSpotsText = () => {
    if (selectedSpotIds.length === 0) return "Nenhum pico selecionado";
    if (!allSpots) return `${selectedSpotIds.length} picos selecionados`;

    const selectedNames = allSpots
      .filter(spot => selectedSpotIds.includes(spot.spot_id))
      .map(spot => spot.name);
    
    return selectedNames.join(', ');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.headerButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{preset ? 'Editar' : 'Novo'} Preset</Text>
        <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#22d3ee" />
          ) : (
            <Text style={[styles.headerButtonText, { fontWeight: 'bold' }]}>Salvar</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form}>
        {/* Nome do Preset */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Nome do Preset</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ex: Checagem da Manhã"
            placeholderTextColor="#64748b"
          />
        </View>

        {/* Seletor de Picos */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Picos</Text>
          <TouchableOpacity style={styles.selectorButton} onPress={() => setSpotSelectorVisible(true)}>
            <Text style={styles.selectorButtonText} numberOfLines={1}>{getSelectedSpotsText()}</Text>
          </TouchableOpacity>
        </View>

        {/* Placeholder: Seletor de Dias */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Dias da Semana</Text>
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Seletor de Dias (a implementar)</Text>
          </View>
        </View>
        
        {/* Placeholder: Seletor de Horário */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Janela de Horário</Text>
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Seletor de Horário (a implementar)</Text>
          </View>
        </View>

        {/* Preset Padrão */}
        <View style={[styles.fieldContainer, styles.switchContainer]}>
          <Text style={styles.label}>Tornar Padrão</Text>
          <Switch
            trackColor={{ false: '#334155', true: '#22d3ee' }}
            thumbColor={isDefault ? '#f8fafc' : '#94a3b8'}
            onValueChange={setIsDefault}
            value={isDefault}
          />
        </View>
      </ScrollView>

      {/* Modal do Seletor de Picos */}
      <SpotSelector
        visible={spotSelectorVisible}
        onClose={() => setSpotSelectorVisible(false)}
        onSave={setSelectedSpotIds}
        initialSelectedIds={selectedSpotIds}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerButtonText: { color: '#22d3ee', fontSize: 16 },
  headerTitle: { color: '#e2e8f0', fontSize: 18, fontWeight: 'bold' },
  form: { padding: 16 },
  fieldContainer: { marginBottom: 24 },
  label: { color: '#cbd5e1', fontSize: 16, fontWeight: '500', marginBottom: 8 },
  input: {
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorButton: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
  },
  selectorButtonText: {
    color: '#e2e8f0',
    fontSize: 16,
  },
  placeholder: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#64748b',
  },
});