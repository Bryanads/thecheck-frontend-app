// app/(tabs)/recommendations.tsx
import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  FlatList, 
  RefreshControl, 
  Text, 
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { RecommendationCard } from '../../components/RecommendationCard';
import { usePresets, useGetRecommendations } from '../../hooks';
import { RecommendationRequest } from '../../types';
import { Ionicons } from '@expo/vector-icons';

const RecommendationsScreen = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const { data: presets, isLoading: presetsLoading, refetch: refetchPresets } = usePresets();
  const { mutate: getRecommendations, data: recommendations, isPending: recommendationsLoading } = useGetRecommendations();

  useEffect(() => {
    if (presets && presets.length > 0 && !selectedPresetId) {
      const defaultPreset = presets.find(p => p.is_default) || presets[0];
      setSelectedPresetId(defaultPreset.preset_id);
      loadRecommendations(defaultPreset);
    }
  }, [presets]);

  const loadRecommendations = (preset: any) => {
    if (!preset) return;

    const request: RecommendationRequest = {
      spot_ids: preset.spot_ids,
      day_selection: {
        type: preset.day_selection_type,
        values: preset.day_selection_values,
      },
      time_window: {
        start: preset.start_time,
        end: preset.end_time,
      },
      limit: 10,
    };

    getRecommendations(request);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchPresets();
      if (selectedPresetId) {
        const currentPreset = presets?.find(p => p.preset_id === selectedPresetId);
        if (currentPreset) {
          loadRecommendations(currentPreset);
        }
      }
    } finally {
      setRefreshing(false);
    }
  };

  const onPresetChange = (presetId: number) => {
    setSelectedPresetId(presetId);
    const preset = presets?.find(p => p.preset_id === presetId);
    if (preset) {
      loadRecommendations(preset);
    }
  };

  if (presetsLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22d3ee" />
        <Text style={styles.loadingText}>Carregando presets...</Text>
      </SafeAreaView>
    );
  }

  if (!presets || presets.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Ionicons name="settings-outline" size={64} color="#22d3ee" />
        <Text style={styles.emptyTitle}>Nenhum preset encontrado</Text>
        <Text style={styles.emptySubtitle}>
          Crie seu primeiro preset para começar a receber recomendações personalizadas
        </Text>
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>Criar Preset</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Suas Recomendações</Text>
        
        <View style={styles.presetSelector}>
          {presets.map((preset) => (
            <TouchableOpacity
              key={preset.preset_id}
              style={[
                styles.presetButton,
                selectedPresetId === preset.preset_id && styles.presetButtonActive
              ]}
              onPress={() => onPresetChange(preset.preset_id)}
            >
              <Text style={[
                styles.presetButtonText,
                selectedPresetId === preset.preset_id && styles.presetButtonTextActive
              ]}>
                {preset.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {recommendationsLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22d3ee" />
          <Text style={styles.loadingText}>Buscando recomendações...</Text>
        </View>
      ) : !recommendations || recommendations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="water-outline" size={64} color="#64748b" />
          <Text style={styles.emptyTitle}>Nenhuma recomendação encontrada</Text>
          <Text style={styles.emptySubtitle}>
            Tente ajustar seu preset ou verifique novamente mais tarde
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={recommendations}
          keyExtractor={(item) => `${item.spot_id}-${item.timestamp_utc}`}
          renderItem={({ item }) => (
            <RecommendationCard
              recommendation={item}
              onPress={() => {
                console.log('Navegar para detalhes:', item);
              }}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#22d3ee"
              colors={['#22d3ee']}
            />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#e2e8f0',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    color: '#e2e8f0',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#94a3b8',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#22d3ee',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#0f172a',
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitle: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  presetSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e293b',
  },
  presetButtonActive: {
    backgroundColor: '#22d3ee',
  },
  presetButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#cbd5e1',
  },
  presetButtonTextActive: {
    color: '#0f172a',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  separator: {
    height: 12,
  },
});

export default RecommendationsScreen;