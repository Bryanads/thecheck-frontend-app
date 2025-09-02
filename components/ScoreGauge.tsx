// components/ScoreGauge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ScoreGaugeProps {
  score: number;
  size?: number;
}

export const ScoreGauge = ({ score, size = 80 }: ScoreGaugeProps) => {
  const getColor = () => {
    if (score >= 75) return '#22c55e'; // Verde
    if (score >= 50) return '#eab308'; // Amarelo
    return '#ef4444'; // Vermelho
  };

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: size / 10,
    borderColor: '#1e293b',
    backgroundColor: '#334155',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  const textStyle = {
    fontSize: size / 3,
    fontWeight: 'bold' as const,
    color: getColor(),
  };

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{Math.round(score)}</Text>
    </View>
  );
};