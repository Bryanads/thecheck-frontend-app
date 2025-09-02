// hooks/index.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api';
import { 
  ProfileUpdate, 
  PresetCreate, 
  PresetUpdate, 
  PreferenceUpdate,
  RecommendationRequest 
} from '../types';

// ===== PROFILE HOOKS =====
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: api.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: ProfileUpdate) => api.updateProfile(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

// ===== SPOTS HOOKS =====
export const useSpots = () => {
  return useQuery({
    queryKey: ['spots'],
    queryFn: api.getAllSpots,
    staleTime: 30 * 60 * 1000, // 30 minutes - dados dos spots não mudam frequentemente
  });
};

export const useSpot = (spotId: number) => {
  return useQuery({
    queryKey: ['spots', spotId],
    queryFn: () => api.getSpotById(spotId),
    staleTime: 30 * 60 * 1000,
  });
};

// ===== PRESETS HOOKS =====
export const usePresets = () => {
  return useQuery({
    queryKey: ['presets'],
    queryFn: api.getPresets,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreatePreset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (preset: PresetCreate) => api.createPreset(preset),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presets'] });
    },
  });
};

export const useUpdatePreset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ presetId, updates }: { presetId: number; updates: PresetUpdate }) =>
      api.updatePreset(presetId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presets'] });
    },
  });
};

export const useDeletePreset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (presetId: number) => api.deletePreset(presetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presets'] });
    },
  });
};

// ===== PREFERENCES HOOKS =====
export const useSpotPreferences = (spotId: number) => {
  return useQuery({
    queryKey: ['preferences', 'spot', spotId],
    queryFn: () => api.getSpotPreferences(spotId),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateSpotPreferences = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ spotId, updates }: { spotId: number; updates: PreferenceUpdate }) =>
      api.updateSpotPreferences(spotId, updates),
    onSuccess: (_, { spotId }) => {
      queryClient.invalidateQueries({ queryKey: ['preferences', 'spot', spotId] });
    },
  });
};

// ===== FORECASTS HOOKS =====
export const useSpotForecast = (spotId: number) => {
  return useQuery({
    queryKey: ['forecasts', 'spot', spotId],
    queryFn: () => api.getSpotForecast(spotId),
    staleTime: 30 * 60 * 1000, // 30 minutes - dados de previsão têm TTL
    enabled: !!spotId, // Só executa se spotId for válido
  });
};

// ===== RECOMMENDATIONS HOOKS =====
export const useRecommendations = (request: RecommendationRequest | null) => {
  return useQuery({
    queryKey: ['recommendations', request],
    queryFn: () => api.getRecommendations(request!),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!request, // Só executa se request for fornecido
  });
};

// Hook para buscar recomendações sob demanda
export const useGetRecommendations = () => {
  return useMutation({
    mutationFn: (request: RecommendationRequest) => api.getRecommendations(request),
  });
};