// components/ScoreGauge.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface ScoreGaugeProps {
  score: number;
  size?: number;
}

export const ScoreGauge = ({ score, size = 80 }: ScoreGaugeProps) => {
  const getColor = () => {
    if (score >= 75) return 'text-green-500'; // #22c55e
    if (score >= 50) return 'text-yellow-500'; // #eab308
    return 'text-red-500'; // #ef4444
  };

  return (
    <View
      className="items-center justify-center rounded-full bg-slate-700"
      style={{ width: size, height: size, borderWidth: size / 10, borderColor: '#1e293b' }}
    >
      <Text className={`text-2xl font-bold ${getColor()}`}>{Math.round(score)}</Text>
    </View>
  );
};