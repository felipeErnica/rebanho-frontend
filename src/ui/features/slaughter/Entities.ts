export type SlaughterEntry = {
    id: string;
    animalId?: string;
    animalName?: string;
    entryDate?: Date;
    discountRate?: number;
    slaughterhouseId: string;
    slaughterhouse: string;
    weight: number;
    discountWeight: number;
    deadWeight: number;
    performanceRate: number;
};

export type SlaughterEntryFilter = {
    isFiltered: boolean;
    animalId?: string[];
    minAnimalBirth?: Date;
    maxAnimalBirth?: Date;
    minEntryDate?: Date;
    maxEntryDate?: Date;
    minWeight?: number;
    maxWeight?: number;
    minDeadWeight?: number;
    maxDeadWeight?: number;
};

export type SlaughterGroup = {
    entryDate: Date; 
    slaughterhouse: string;
    animalsNumber: number;
    averageWeight: number;
    weightVariation: number;
    averageRate: number;
    rateVariation: number;
};

export type PerformanceRateHist = {
    entryDate: Date;
    performanceRate: number;
};

export type PerformanceRateCard = {
    current: number;
    trend: number;
    hist: PerformanceRateHist[];
};

export type AverageWeightHist = {
    entryDate: Date;
    averageWeight: number;
};

export type AverageWeightCard = {
    current: number;
    trend: number;
    hist: AverageWeightHist[];
};

export type SlaughterHist = {
    entryDate: Date;
    averageWeight: number;
    performanceRate: number;
};

export type TableRatings = {
    name: string;
    animalsNumber: number;
    averageWeight: number;
    weightComparison: number;
    performanceRate: number;
    rateComparison: number;
};
