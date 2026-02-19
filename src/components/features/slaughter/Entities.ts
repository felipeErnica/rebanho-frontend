import { Animal } from "@features/animals/Entities";
import { Butcher } from "@features/butchers/Entities";

export type Slaughter = {
    id: string;
    animal?: Animal
    butcher: Butcher
    entryDate: Date;
    discountRate?: number;
    weight?: number;
    discountWeight?: number;
    deadWeight?: number;
    performanceRate?: number;
};

export type SlaughterSave = {
    id?: string;
    animalId?: string;
    entryDate: Date;
    discountRate: number;
    butcherId: string;
    weight: number;
    deadWeight: number;
    overwrite: boolean
    ignoreDeath: boolean
};

export type SlaughterFoot = {
    animalsNumber: number;
    averageWeight: number;
    averageDeadWeight: number;
    averageRate: number;
};

export type SlaughterFilter = {
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

export type SlaughterGroup = {
    entryDate: Date;
    butcher: Butcher;
    animalsNumber: number;
    averageWeight: number;
    weightVariation: number;
    averageDeadWeight: number;
    deadWeightVariation: number;
    averageRate: number;
    rateVariation: number;
};

export type WeightHist = {
    entryDate: Date;
    weight: number;
    deadWeight: number;
};

export type TableRatings = {
    name: string;
    animalsNumber: number;
    averageWeight: number;
    weightComparison: number;
    performanceRate: number;
    rateComparison: number;
};
