// components/SpotSelector.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSpots } from '../hooks';
import { Spot } from '../types';

interface SpotSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSave: (selectedIds: number[]) => void;
  initialSelectedIds: number[];
}

const SpotItem = ({ item, isSelected, onToggle }: { item: Spot; isSelected: boolean; onToggle: (id: number) => void; }) => (
  <TouchableOpacity style={styles.spotItem} onPress={() => onToggle(item.spot_id)}>
    <View style={{ flex: 1 }}>
      <Text style={styles.spotName}>{item.name}</Text>
      <Text style={styles.spotLocation}>{item.region}, {item.state}</Text>
    </View>
    <Ionicons 
      name={isSelected ? "checkbox" : "square-outline"} 
      size={24} 
      color={isSelected ? "#22d3ee" : "#94a3b8"} 
    />
  </TouchableOpacity>
);

export const SpotSelector = ({ visible, onClose, onSave, initialSelectedIds }: SpotSelectorProps) => {
  const { data: spots, isLoading } = useSpots();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>(initialSelectedIds);

  const filteredSpots = useMemo(() => {
    if (!spots) return [];
    return spots.filter(spot =>
      spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.region?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.state?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [spots, searchQuery]);

  const toggleSelection = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onSave(selectedIds);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.headerButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Selecionar Picos</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={[styles.headerButtonText, { fontWeight: 'bold' }]}>Salvar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Ionicons name="search" size={20} color="#94a3b8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar picos..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {isLoading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#22d3ee" />
          </View>
        ) : (
          <FlatList
            data={filteredSpots}
            keyExtractor={(item) => item.spot_id.toString()}
            renderItem={({ item }) => (
              <SpotItem
                item={item}
                isSelected={selectedIds.includes(item.spot_id)}
                onToggle={toggleSelection}
              />
            )}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </SafeAreaView>
    </Modal>
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
  searchContainer: { padding: 16 },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    color: '#e2e8f0',
    fontSize: 16,
    paddingVertical: 12,
    marginLeft: 8,
  },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { paddingHorizontal: 16 },
  spotItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  spotName: { color: '#e2e8f0', fontSize: 16, fontWeight: '500' },
  spotLocation: { color: '#94a3b8', fontSize: 14, marginTop: 2 },
});