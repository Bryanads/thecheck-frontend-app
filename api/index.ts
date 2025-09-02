// api/index.ts
import apiClient from './client';
import {
  Profile,
  ProfileUpdate,
  Spot,
  Preset,
  PresetCreate,
  PresetUpdate,
  Preference,
  PreferenceUpdate,
  Recommendation,
  RecommendationRequest,
  SpotForecast
} from '../types';

// ===== PROFILE API =====
export const getProfile = async (): Promise<Profile> => {
  const response = await apiClient.get('/profile');
  return response.data;
};

export const updateProfile = async (updates: ProfileUpdate): Promise<Profile> => {
  const response = await apiClient.put('/profile', updates);
  return response.data;
};

// ===== SPOTS API =====
export const getAllSpots = async (): Promise<Spot[]> => {
  const response = await apiClient.get('/spots');
  return response.data;
};

export const getSpotById = async (spotId: number): Promise<Spot> => {
  const response = await apiClient.get(`/spots/${spotId}`);
  return response.data;
};

// ===== PRESETS API =====
export const getPresets = async (): Promise<Preset[]> => {
  const response = await apiClient.get('/presets');
  return response.data;
};

export const createPreset = async (preset: PresetCreate): Promise<Preset> => {
  const response = await apiClient.post('/presets', preset);
  return response.data;
};

export const updatePreset = async (presetId: number, updates: PresetUpdate): Promise<Preset> => {
  const response = await apiClient.put(`/presets/${presetId}`, updates);
  return response.data;
};

export const deletePreset = async (presetId: number): Promise<void> => {
  await apiClient.delete(`/presets/${presetId}`);
};

// ===== PREFERENCES API =====
export const getSpotPreferences = async (spotId: number): Promise<Preference> => {
  const response = await apiClient.get(`/preferences/spot/${spotId}`);
  return response.data;
};

export const updateSpotPreferences = async (spotId: number, updates: PreferenceUpdate): Promise<Preference> => {
  const response = await apiClient.put(`/preferences/spot/${spotId}`, updates);
  return response.data;
};

// ===== FORECASTS API =====
export const getSpotForecast = async (spotId: number): Promise<SpotForecast> => {
  const response = await apiClient.get(`/forecasts/spot/${spotId}`);
  return response.data;
};

// ===== RECOMMENDATIONS API =====
export const getRecommendations = async (request: RecommendationRequest): Promise<Recommendation[]> => {
  const response = await apiClient.post('/recommendations', request);
  return response.data;
};