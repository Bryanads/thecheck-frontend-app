
export interface Spot {
  spot_id: number;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  // ... outros campos
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  surf_level?: string;
  // ... outros campos
}

export interface RecommendationRequest {
  spot_ids: number[];
  day_selection: {
    type: 'offsets' | 'weekdays';
    values: number[];
  };
  time_window: {
    start: string; // "HH:MM:SS"
    end: string;   // "HH:MM:SS"
  };
  limit: number;
}

export interface DetailedScores {
    wave_score: number;
    wind_score: number;
    tide_score: number;
    air_temperature_score: number;
    water_temperature_score: number;
}

export interface Recommendation {
  spot_id: number;
  spot_name: string;
  timestamp_utc: string; // ISO 8601 date string
  overall_score: number;
  detailed_scores: DetailedScores;
}

// Adicione as outras interfaces (Preset, Preference, Forecast, etc.)