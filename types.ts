export interface Country {
  code: string;
  name: string;
  emissions: number;
}

export interface StructuralChanges {
  grid: boolean;
  transport: boolean;
  food: boolean;
}

export interface GeneratedStory {
  id: string;
  prompt: string;
  text: string;
  genre: string;
  createdAt: number;
}

export interface Exploration {
  id: string;
  name: string;
  countryCode: string | null;
  structuralChanges: StructuralChanges;
  participationRate: number;
  createdAt: number;
  stories: GeneratedStory[];
}

export type LifestyleCategory = 'food' | 'mobility' | 'home' | 'stuff';

export interface LifestyleTier {
  threshold: number;
  title: string;
  data: Record<LifestyleCategory, string[]>;
}
