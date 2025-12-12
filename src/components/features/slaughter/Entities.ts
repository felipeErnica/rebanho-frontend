export type SlaughterEntry = {
    id: string;
    animalId?: string;
    animalInfo?: string;
    fatherName?: string;
    motherName?: string;
    entryDate: Date;
    discountRate: number;
    butcherId: string;
    butcher: string;
    weight: number;
    discountWeight: number;
    deadWeight: number;
    performanceRate: number;
};

export type SlaughterEntrySave = {
    id: string;
    animalId?: string;
    entryDate: Date;
    discountRate: number;
    butcherId: string;
    weight: number;
    deadWeight: number;
};

export type SlaughterFoot = {
    animalsNumber: number;
    averageWeight: number;
    averageDeadWeight: number;
    averageRate: number;
};

export type SlaughterEntryFilter = {
    isFiltered: boolean;
    animals?: string[];
    fathers?: string[];
    mothers?: string[];
    butchers?: string[];
    minAnimalBirth?: Date;
    maxAnimalBirth?: Date;
    minEntryDate?: Date;
    maxEntryDate?: Date;
    minWeight?: number;
    maxWeight?: number;
    minDeadWeight?: number;
    maxDeadWeight?: number;
};

export type ButcherEntry = {
    id: string
    name: string
    cnpj?: string
    address?: string
    discount?: number
    animalsNumber: number
    averageWeight: number
    averageRate: number
};

export type ButcherSave = {
    id: string
    name: string
    cnpj?: string
    address?: string
    discount?: number
};

export type SlaughterGroup = {
    entryDate: Date;
    butcher: string;
    animalsNumber: number;
    averageWeight: number;
    weightVariation: number;
    averageDeadWeight: number;
    deadWeightVariation: number;
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

export type WeightCardEntry = {
    current: number;
    trend: number;
    hist: AverageWeightHist[];
};

export type WeightHist = {
    entryDate: Date;
    weight: number;
    deadWeight: number;
};

export type RateHist = {
    entryDate: Date;
    averageRate: number;
};

export type TableRatings = {
    name: string;
    animalsNumber: number;
    averageWeight: number;
    weightComparison: number;
    performanceRate: number;
    rateComparison: number;
};
