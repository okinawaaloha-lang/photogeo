export interface Recommendation {
  title: string;
  reason: string;
  keywords: string;
}

export interface LocationData {
  placeName: string;
  city: string;
  country: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  } | null;
  confidence: string; // e.g., "High", "Medium", "Low"
  reasoning: string[]; // List of visual cues used
  recommendation: Recommendation;
}

export interface AnalysisState {
  isLoading: boolean;
  data: LocationData | null;
  error: string | null;
}