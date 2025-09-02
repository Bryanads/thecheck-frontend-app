// screens/RecommendationsScreen.tsx
import React from 'react';
import { SafeAreaView, FlatList } from 'react-native';
import { RecommendationCard } from '../../components/RecommendationCard';
import { Recommendation } from '../../types';

// Dados mocados para exemplo
const MOCK_RECOMMENDATIONS: Recommendation[] = [
    { spot_id: 1, spot_name: 'Arpoador', timestamp_utc: new Date(Date.now() + 3600 * 1000 * 5).toISOString(), overall_score: 92, detailed_scores: { wave_score: 95, wind_score: 90, tide_score: 88, air_temperature_score: 94, water_temperature_score: 85 } },
    { spot_id: 2, spot_name: 'Joatinga', timestamp_utc: new Date(Date.now() + 3600 * 1000 * 2).toISOString(), overall_score: 78, detailed_scores: { wave_score: 80, wind_score: 75, tide_score: 82, air_temperature_score: 94, water_temperature_score: 85 } },
    { spot_id: 3, spot_name: 'Prainha', timestamp_utc: new Date(Date.now() + 3600 * 1000 * 8).toISOString(), overall_score: 45, detailed_scores: { wave_score: 50, wind_score: 40, tide_score: 60, air_temperature_score: 94, water_temperature_score: 85 } },
];

const RecommendationsScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <FlatList
        className="p-4"
        data={MOCK_RECOMMENDATIONS}
        keyExtractor={(item) => item.spot_id.toString()}
        renderItem={({ item }) => (
          <RecommendationCard
            recommendation={item}
            onPress={() => alert(`Navegar para detalhes de ${item.spot_name}`)}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default RecommendationsScreen;