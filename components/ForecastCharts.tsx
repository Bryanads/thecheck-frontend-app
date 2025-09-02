// components/ForecastCharts.tsx
import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { HourlyForecast } from '../types';

interface ForecastChartsProps {
  hourlyData: HourlyForecast[];
  highlightedIndex?: number;
  onPointPress?: (index: number) => void;
}

const screenWidth = Dimensions.get('window').width;

export const ForecastCharts = ({ 
  hourlyData, 
  highlightedIndex, 
  onPointPress 
}: ForecastChartsProps) => {
  if (!hourlyData || hourlyData.length === 0) {
    return (
      <View className="bg-slate-800 rounded-lg p-4 m-4">
        <Text className="text-slate-400 text-center">Nenhum dado disponível</Text>
      </View>
    );
  }

  // Configurações do gráfico
  const chartConfig = {
    backgroundGradientFrom: '#1e293b',
    backgroundGradientTo: '#1e293b',
    color: (opacity = 1) => `rgba(34, 211, 238, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 1,
    style: {
      borderRadius: 8,
    },
    propsForLabels: {
      fontSize: 10,
      fill: '#94a3b8',
    },
    propsForVerticalLabels: {
      fontSize: 10,
      fill: '#94a3b8',
    },
    propsForHorizontalLabels: {
      fontSize: 10,
      fill: '#94a3b8',
    },
  };

  // Prepara dados das ondas
  const waveData = {
    labels: hourlyData.map((_, index) => {
      const hour = new Date(hourlyData[index].timestamp_utc).getHours();
      return `${hour}h`;
    }),
    datasets: [
      {
        data: hourlyData.map(h => h.conditions.swell_height_sg || 0),
        color: (opacity = 1) => `rgba(34, 211, 238, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  // Prepara dados do vento
  const windData = {
    labels: hourlyData.map((_, index) => {
      const hour = new Date(hourlyData[index].timestamp_utc).getHours();
      return `${hour}h`;
    }),
    datasets: [
      {
        data: hourlyData.map(h => h.conditions.wind_speed_sg || 0),
        color: (opacity = 1) => `rgba(251, 191, 36, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  // Prepara dados da maré
  const tideData = {
    labels: hourlyData.map((_, index) => {
      const hour = new Date(hourlyData[index].timestamp_utc).getHours();
      return `${hour}h`;
    }),
    datasets: [
      {
        data: hourlyData.map(h => h.conditions.sea_level_sg || 0),
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Gráfico de Ondas */}
      <View className="bg-slate-800 rounded-lg p-4 m-4">
        <Text className="text-slate-200 text-lg font-bold mb-4">
          Altura das Ondas (m)
        </Text>
        <LineChart
          data={waveData}
          width={screenWidth - 64}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={{
            borderRadius: 8,
          }}
          onDataPointClick={(data) => {
            if (onPointPress) {
              onPointPress(data.index);
            }
          }}
        />
      </View>

      {/* Gráfico de Vento */}
      <View className="bg-slate-800 rounded-lg p-4 mx-4 mb-4">
        <Text className="text-slate-200 text-lg font-bold mb-4">
          Velocidade do Vento (km/h)
        </Text>
        <LineChart
          data={windData}
          width={screenWidth - 64}
          height={200}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(251, 191, 36, ${opacity})`,
          }}
          bezier
          style={{
            borderRadius: 8,
          }}
          onDataPointClick={(data) => {
            if (onPointPress) {
              onPointPress(data.index);
            }
          }}
        />
      </View>

      {/* Gráfico de Maré */}
      <View className="bg-slate-800 rounded-lg p-4 mx-4 mb-4">
        <Text className="text-slate-200 text-lg font-bold mb-4">
          Nível da Maré (m)
        </Text>
        <LineChart
          data={tideData}
          width={screenWidth - 64}
          height={200}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
          }}
          bezier
          style={{
            borderRadius: 8,
          }}
          onDataPointClick={(data) => {
            if (onPointPress) {
              onPointPress(data.index);
            }
          }}
        />
      </View>

      {/* Dados detalhados do ponto selecionado */}
      {typeof highlightedIndex === 'number' && hourlyData[highlightedIndex] && (
        <View className="bg-slate-800 rounded-lg p-4 mx-4 mb-4">
          <Text className="text-cyan-400 text-lg font-bold mb-4">
            Detalhes - {new Date(hourlyData[highlightedIndex].timestamp_utc).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
          
          <View className="space-y-2">
            <DetailRow
              label="Altura da Onda"
              value={`${hourlyData[highlightedIndex].conditions.swell_height_sg?.toFixed(1) || 'N/A'} m`}
            />
            <DetailRow
              label="Período"
              value={`${hourlyData[highlightedIndex].conditions.swell_period_sg?.toFixed(1) || 'N/A'} s`}
            />
            <DetailRow
              label="Vento"
              value={`${hourlyData[highlightedIndex].conditions.wind_speed_sg?.toFixed(1) || 'N/A'} km/h`}
            />
            <DetailRow
              label="Direção do Vento"
              value={`${hourlyData[highlightedIndex].conditions.wind_direction_sg?.toFixed(0) || 'N/A'}°`}
            />
            <DetailRow
              label="Maré"
              value={`${hourlyData[highlightedIndex].conditions.sea_level_sg?.toFixed(2) || 'N/A'} m`}
            />
            <DetailRow
              label="Temp. Água"
              value={`${hourlyData[highlightedIndex].conditions.water_temperature_sg?.toFixed(1) || 'N/A'}°C`}
            />
            <DetailRow
              label="Temp. Ar"
              value={`${hourlyData[highlightedIndex].conditions.air_temperature_sg?.toFixed(1) || 'N/A'}°C`}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

// Componente auxiliar para mostrar detalhes
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row justify-between py-1">
    <Text className="text-slate-400 text-base">{label}:</Text>
    <Text className="text-slate-200 text-base font-medium">{value}</Text>
  </View>
);