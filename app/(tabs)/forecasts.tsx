// app/(tabs)/forecasts.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSpots, useSpotForecast } from '../../hooks';
import { ForecastCharts } from '../../components/ForecastCharts';
import { Spot } from '../../types';

const ForecastsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [highlightedHourIndex, setHighlightedHourIndex] = useState<number | undefined>();
  const [showSpotModal, setShowSpotModal] = useState(false);

  const { data: spots, isLoading: spotsLoading } = useSpots();
  const { data: forecast, isLoading: forecastLoading } = useSpotForecast(
    selectedSpot?.spot_id || 0
  );

  // Filtra spots baseado na pesquisa
  const filteredSpots = spots?.filter(spot =>
    spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spot.region?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spot.state?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Seleciona um spot
  const handleSpotSelect = (spot: Spot) => {
    setSelectedSpot(spot);
    setSelectedDayIndex(0);
    setHighlightedHourIndex(undefined);
    setShowSpotModal(false);
    setSearchQuery('');
  };

  // Dados do dia selecionado
  const selectedDayData = forecast?.daily_forecasts[selectedDayIndex];

  // Renderiza item da lista de spots
  const renderSpotItem = ({ item }: { item: Spot }) => (
    <TouchableOpacity
      className="flex-row items-center justify-between p-4 bg-slate-800 rounded-lg mb-2"
      onPress={() => handleSpotSelect(item)}
    >
      <View className="flex-1">
        <Text className="text-slate-200 text-base font-bold">{item.name}</Text>
        {item.region && (
          <Text className="text-slate-400 text-sm">{item.region}, {item.state}</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      {/* Header com seletor de spot */}
      <View className="px-4 py-4 border-b border-slate-800">
        <Text className="text-slate-200 text-xl font-bold mb-4">Previsões Detalhadas</Text>
        
        <TouchableOpacity
          className="flex-row items-center justify-between bg-slate-800 rounded-lg p-4"
          onPress={() => setShowSpotModal(true)}
        >
          <View className="flex-1">
            {selectedSpot ? (
              <>
                <Text className="text-slate-200 text-base font-bold">{selectedSpot.name}</Text>
                <Text className="text-slate-400 text-sm">
                  {selectedSpot.region}, {selectedSpot.state}
                </Text>
              </>
            ) : (
              <Text className="text-slate-400 text-base">Selecione um pico</Text>
            )}
          </View>
          <Ionicons name="chevron-down" size={20} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Conteúdo principal */}
      {!selectedSpot ? (
        // Estado inicial - nenhum spot selecionado
        <View className="flex-1 justify-center items-center p-6">
          <Ionicons name="location-outline" size={64} color="#64748b" />
          <Text className="text-slate-200 text-xl font-bold mt-4 text-center">
            Selecione um Pico
          </Text>
          <Text className="text-slate-400 text-base text-center mt-2 mb-6">
            Escolha um pico para ver a previsão detalhada dos próximos 7 dias
          </Text>
          <TouchableOpacity
            className="bg-cyan-400 px-6 py-3 rounded-lg"
            onPress={() => setShowSpotModal(true)}
          >
            <Text className="text-slate-900 font-bold text-base">Selecionar Pico</Text>
          </TouchableOpacity>
        </View>
      ) : forecastLoading ? (
        // Loading da previsão
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#22d3ee" />
          <Text className="text-slate-200 mt-4">Carregando previsão...</Text>
        </View>
      ) : !forecast || forecast.daily_forecasts.length === 0 ? (
        // Nenhuma previsão disponível
        <View className="flex-1 justify-center items-center p-6">
          <Ionicons name="alert-circle-outline" size={64} color="#64748b" />
          <Text className="text-slate-200 text-xl font-bold mt-4 text-center">
            Previsão Indisponível
          </Text>
          <Text className="text-slate-400 text-base text-center mt-2">
            Não há dados de previsão disponíveis para este pico
          </Text>
        </View>
      ) : (
        // Previsão carregada com sucesso
        <View className="flex-1">
          {/* Seletor de dias */}
          <View className="px-4 py-3">
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={forecast.daily_forecasts}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => {
                const date = new Date(item.date);
                const isToday = index === 0;
                const isTomorrow = index === 1;
                const isSelected = selectedDayIndex === index;
                
                let dayLabel = date.toLocaleDateString('pt-BR', { 
                  weekday: 'short' 
                });
                
                if (isToday) dayLabel = 'Hoje';
                else if (isTomorrow) dayLabel = 'Amanhã';

                return (
                  <TouchableOpacity
                    className={`mr-3 px-4 py-3 rounded-lg min-w-20 items-center ${
                      isSelected ? 'bg-cyan-400' : 'bg-slate-800'
                    }`}
                    onPress={() => {
                      setSelectedDayIndex(index);
                      setHighlightedHourIndex(undefined);
                    }}
                  >
                    <Text className={`text-xs font-medium ${
                      isSelected ? 'text-slate-900' : 'text-slate-400'
                    }`}>
                      {dayLabel}
                    </Text>
                    <Text className={`text-sm font-bold mt-1 ${
                      isSelected ? 'text-slate-900' : 'text-slate-200'
                    }`}>
                      {date.getDate()}/{date.getMonth() + 1}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          {/* Gráficos da previsão */}
          {selectedDayData && (
            <ForecastCharts
              hourlyData={selectedDayData.hourly_data}
              highlightedIndex={highlightedHourIndex}
              onPointPress={setHighlightedHourIndex}
            />
          )}
        </View>
      )}

      {/* Modal de seleção de spot */}
      <Modal
        visible={showSpotModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className="flex-1 bg-slate-900">
          <View className="flex-row items-center justify-between p-4 border-b border-slate-800">
            <Text className="text-slate-200 text-lg font-bold">Selecionar Pico</Text>
            <TouchableOpacity onPress={() => setShowSpotModal(false)}>
              <Ionicons name="close" size={24} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Barra de pesquisa */}
          <View className="p-4">
            <View className="flex-row items-center bg-slate-800 rounded-lg px-4 py-3">
              <Ionicons name="search" size={20} color="#94a3b8" />
              <TextInput
                className="flex-1 ml-3 text-slate-200 text-base"
                placeholder="Pesquisar picos..."
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#94a3b8" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Lista de spots */}
          {spotsLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#22d3ee" />
              <Text className="text-slate-200 mt-4">Carregando picos...</Text>
            </View>
          ) : (
            <FlatList
              className="flex-1"
              contentContainerStyle={{ padding: 16 }}
              data={filteredSpots}
              keyExtractor={(item) => item.spot_id.toString()}
              renderItem={renderSpotItem}
              ItemSeparatorComponent={() => <View className="h-2" />}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default ForecastsScreen;