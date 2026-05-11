export interface UserReview {
  id: string;
  itemName: string;
  rating: number;
  content: string;
  category?: string;
  date?: string;
}

export interface UserProfile {
  name: string;
  bio: string;
  history: UserReview[];
  traits: string[];
}

export interface ItemMetadata {
  name: string;
  category: string;
  description: string;
  features: string[];
  priceRange?: string;
}

export interface SimulationResult {
  review: string;
  rating: number;
  reasoning: string;
}

export interface Recommendation {
  item: ItemMetadata;
  reasoning: string;
  matchScore: number; // 0-100
}

export interface RecommendationResult {
  recommendations: Recommendation[];
  analysis: string; // The agent's reasoning process
}
