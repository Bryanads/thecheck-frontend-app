// components/RecommendationCard.tsx
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
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
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.spotName}>{recommendation.spot_name}</Text>
        <Text style={styles.date}>{date.toLocaleDateString()}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <ScoreGauge score={recommendation.overall_score} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  spotName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  date: {
    color: '#94a3b8',
    fontSize: 16,
  },
  time: {
    color: '#22d3ee',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
});