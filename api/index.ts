// api/index.ts
import apiClient from './client';
import { Profile, Recommendation, RecommendationRequest, Spot } from '../types';
// Perfil
export const getProfile = async (): Promise<Profile> => {
    const response = await apiClient.get('/profile');
    return response.data;
};

// Spots
export const getAllSpots = async (): Promise<Spot[]> => {
    const response = await apiClient.get('/spots');
    return response.data;
};

// Recomendações
export const getRecommendations = async (request: RecommendationRequest): Promise<Recommendation[]> => {
    const response = await apiClient.post('/recommendations', request);
    return response.data;
};

// Adicione aqui as outras chamadas de API (presets, preferences, forecasts)...