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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PresetCreate } from '../types';
import { SpotSelector } from './SpotSelector'; 
import { useSpots } from '../hooks';

interface PresetFormProps {
  onClose: () => void;
  onSubmit: (data: PresetCreate) => void;
  isSubmitting: boolean;
  preset?: PresetCreate; 
}

const MAX_DAY_OFFSET = 6;

export const PresetForm = ({ onClose, onSubmit, isSubmitting, preset }: PresetFormProps) => {
  const { data: allSpots } = useSpots();
  const [name, setName] = useState(preset?.name || '');
  const [isDefault, setIsDefault] = useState(preset?.is_default || false);
  const [spotSelectorVisible, setSpotSelectorVisible] = useState(false);
  const [selectedSpotIds, setSelectedSpotIds] = useState<number[]>(preset?.spot_ids || []);
  const [daySelectionType, setDaySelectionType] = useState<'offsets' | 'weekdays'>(
    preset?.day_selection_type || 'offsets'
  );
  const [daySelectionValues, setDaySelectionValues] = useState<number[]>(
    preset?.day_selection_values || (daySelectionType === 'offsets' ? [0] : [])
  );

  const maxDayOffset = daySelectionValues.length > 0 ? Math.max(...daySelectionValues) : -1;

  const handleSetMaxDayOffset = (offset: number) => {
    const newValues = Array.from({ length: offset + 1 }, (_, i) => i);
    setDaySelectionValues(newValues);
  };

  const toggleDaySelection = (day: number) => {
    setDaySelectionValues(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const isDaySelected = (day: number) => daySelectionValues.includes(day);

  const getSelectedSpotsText = () => {
    if (selectedSpotIds.length === 0) return "Nenhum pico selecionado";
    if (!allSpots) return `${selectedSpotIds.length} picos selecionados`;

    const selectedNames = allSpots
      .filter(spot => selectedSpotIds.includes(spot.spot_id))
      .map(spot => spot.name);

    return selectedNames.join(', ');
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Campo Obrigatório', 'Por favor, dê um nome ao seu preset.');
      return;
    }
    if (selectedSpotIds.length === 0) {
      Alert.alert('Campo Obrigatório', 'Selecione pelo menos um pico.');
      return;
    }
    if (daySelectionValues.length === 0) {
      Alert.alert('Campo Obrigatório', 'Selecione pelo menos um dia.');
      return;
    }

    onSubmit({
      name,
      spot_ids: selectedSpotIds,
      is_default: isDefault,
      day_selection_type: daySelectionType,
      day_selection_values: daySelectionValues,
      start_time: '', // placeholder
      end_time: '',   // placeholder
    });
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

        {/* Seletor de Tipo de Dias + Seleção */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Seleção de Dias</Text>
          <View style={styles.optionGroup}>
            <TouchableOpacity
              style={[styles.optionButton, daySelectionType === 'offsets' && styles.optionButtonActive]}
              onPress={() => setDaySelectionType('offsets')}
            >
              <Text style={[styles.optionText, daySelectionType === 'offsets' && styles.optionTextActive]}>
                A partir de Hoje
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, daySelectionType === 'weekdays' && styles.optionButtonActive]}
              onPress={() => setDaySelectionType('weekdays')}
            >
              <Text style={[styles.optionText, daySelectionType === 'weekdays' && styles.optionTextActive]}>
                Dias da Semana
              </Text>
            </TouchableOpacity>
          </View>

          {/* Seletor de fato */}
          {daySelectionType === 'offsets' ? (
            <View style={styles.counterContainer}>
              <TouchableOpacity 
                onPress={() => handleSetMaxDayOffset(Math.max(0, maxDayOffset - 1))} 
                style={styles.counterButton}
              >
                <Ionicons name="remove" size={24} color="#0f172a" />
              </TouchableOpacity>
              <View style={styles.counterDisplay}>
                <Text style={styles.counterText}>
                  {maxDayOffset === 0 ? "Hoje" : `${maxDayOffset + 1} dias`}
                </Text>
                {maxDayOffset > 0 && (
                  <Text style={styles.counterSubtitle}>
                    (Hoje + {maxDayOffset} dia{maxDayOffset > 1 ? 's' : ''})
                  </Text>
                )}
              </View>
              <TouchableOpacity 
                onPress={() => handleSetMaxDayOffset(Math.min(MAX_DAY_OFFSET, maxDayOffset + 1))} 
                style={styles.counterButton}
              >
                <Ionicons name="add" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.daysContainer}>
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.dayButton, isDaySelected(index) && styles.dayButtonActive]}
                  onPress={() => toggleDaySelection(index)}
                >
                  <Text style={[styles.dayButtonText, isDaySelected(index) && styles.dayButtonTextActive]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Placeholder Janela de Horário */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Janela de Horário</Text>
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderText}>A implementar</Text>
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
  input: { backgroundColor: '#1e293b', color: '#e2e8f0', borderRadius: 8, padding: 12, fontSize: 16 },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectorButton: { backgroundColor: '#1e293b', borderRadius: 8, padding: 12 },
  selectorButtonText: { color: '#e2e8f0', fontSize: 16 },
  optionGroup: { flexDirection: 'row', backgroundColor: '#1e293b', borderRadius: 8, overflow: 'hidden' },
  optionButton: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  optionButtonActive: { backgroundColor: '#22d3ee' },
  optionText: { color: '#cbd5e1', fontSize: 14, fontWeight: 'bold' },
  optionTextActive: { color: '#0f172a' },
  daysContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, paddingVertical: 8, backgroundColor: '#1e293b', borderRadius: 8 },
  dayButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#334155' },
  dayButtonActive: { backgroundColor: '#22d3ee' },
  dayButtonText: { color: '#e2e8f0', fontWeight: '500', textAlign: 'center' },
  dayButtonTextActive: { color: '#0f172a' },
  counterContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1e293b', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, marginTop: 8 },
  counterButton: { backgroundColor: '#22d3ee', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  counterDisplay: { alignItems: 'center', flex: 1, marginHorizontal: 10 },
  counterText: { fontSize: 16, fontWeight: 'bold', color: '#e2e8f0', textAlign: 'center' },
  counterSubtitle: { fontSize: 10, color: '#94a3b8', textAlign: 'center', marginTop: 2 },
  placeholderBox: { backgroundColor: '#1e293b', borderRadius: 8, padding: 16, alignItems: 'center', justifyContent: 'center' },
  placeholderText: { color: '#64748b', fontSize: 14, fontStyle: 'italic' },
});
