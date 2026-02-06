import { ComboBoxItem } from "@shared/common/ComboBox";
import { ColorStrings } from "@shared/Globals";

export const StatusMap: Map<string, string> = new Map([
    ['FAILED', 'Falhou'],
    ['SUCCESS', 'Confirmado'],
    ['STAND_BY', 'Aguardando...'],
])

export const StatusColorMap: Map<string, ColorStrings> = new Map([
    ['FAILED', 'error'],
    ['SUCCESS', 'success'],
    ['STAND_BY', 'warning'],
])

export const StatusItens: ComboBoxItem[] = [
    { name: 'Falhou', value: 'FAILED' },
    { name: 'Sucesso', value: 'SUCCESS' },
    { name: 'Aguardando...', value: 'STAND_BY' },
]

export type BreedingEntry = {
    id: string;
    animalId: string;
    animalNumber: string;
    animalInfo: string;
    breedingDate: Date;
    bullId: string;
    bullName: string;
    birthStatus: string;
    pregnancyStatus: string
    observation?: string;
    childInformation?: string;
};

export type BreedingEntrySave = {
    id: string;
    animalId: string;
    breedingDate: Date;
    bullId: string;
    observation?: string;
    overwrite: boolean
    skipValidation: boolean
};

export type BreedingEntryDelete = {
    id: string
    ignorePregnancy: boolean
    changeFather: boolean
}

export type BreedingEntryFilter = {
    isFiltered: boolean;
    animals?: string[];
    bulls?: string[];
    minBreedingDate?: Date;
    maxBreedingDate?: Date;
    birthStatus?: string;
    pregnancyStatus?: string;
};

export type BreedingFoot = {
    totals: number;
    averageBirthRate: number;
    averagePregnancyRate: number;
};

export type CardEntry = {
    current: number;
    trend: number;
    hist: any;
};

export type BirthRateEntry = {
    breedingDate: Date;
    birthRate: number;
};

export type PregnancyRateEntry = {
    breedingDate: Date;
    pregnancyRate: number;
};

export type AnimalsNumberEntry = {
    breedingDate: Date;
    animalsNumber: number;
};

export type BreedingHist = {
    breedingDate: Date;
    animalsNumber: number;
    pregnanciesNumber: number;
    birthsNumber: number;
};

export type FutureBirths = {
    birthForecast: Date;
    birthsNumber: number;
};

export type BestBulls = {
    bullName: string;
    total: number;
    birthRate: number;
    pregnancyRate: number;
    birthComparisonRate: number;
    pregnancyComparisonRate: number;
};

export type BreedingGroup = {
    bullId?: string;
    bullName: string;
    breedingDate: Date;
    cowNumber: number;
    birthRate: number;
    pregnancyRate: number;
    birthComparisonRate: number;
    pregnancyComparisonRate: number;
};

export type LastEntry = {
    breedingDate: Date;
    entries: BreedingEntry[];
};
