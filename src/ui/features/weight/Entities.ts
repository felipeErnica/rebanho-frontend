export type WeightFilter = {
    isFiltered: boolean
    animals?: string[]
    minEntryDate?: Date
    maxEntryDate?: Date
}

export type WeightEntry = {
  id: string;
  animalId: string;
  animalName: string;
  entryDate: Date;  
  weight: number;
  weightVariation: number;
  weightGain: number;
};

export type WeightFoot = {
    animalsNumber: number
    averageWeight: number
    averageGain: number
}

export type WeightGroup = {
  entryDate: Date
  animalsNumber: number;
  averageWeight: number;
  weightVariation: number;
  averageGain: number;
  gainVariation: number;
};

export type AverageWeightGain = {
  entryDate: Date
  averageGain: number;
};

export type CardWeightGain = {
  trend: number;
  current: number;
  hist: AverageWeightGain[];
};

export type AverageWeight = {
  entryDate: Date
  averageWeight: number;
};

export type CardWeight = {
  trend: number;
  current: number;
  hist: AverageWeight[];
};

export type AnimalRating = {
  animalName: string;
  averageGain: number;
  gainTrend: number;
  childrenNumber: number;
};
