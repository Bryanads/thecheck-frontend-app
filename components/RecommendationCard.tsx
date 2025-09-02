// components/RecommendationCard.tsx
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Recommendation } from '../types';
import { ScoreGauge } from './ScoreGauge';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onPress: () => void;
}

export const RecommendationCard = ({ recommendation, onPress }: RecommendationCardProps) => {
  const date = new Date(recommendation.timestamp_utc);
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-slate-800 rounded-lg p-4 flex-row items-center justify-between mb-4" // Cor de superfície #1e293b
    >
      <View>
        <Text className="text-white font-bold text-lg">{recommendation.spot_name}</Text>
        <Text className="text-gray-400 text-base">{date.toLocaleDateString()}</Text>
        <Text className="text-cyan-400 text-xl font-bold mt-1">{time}</Text> 
      </View>
      <ScoreGauge score={recommendation.overall_score} />
    </TouchableOpacity>
  );
};