import { ComboBoxItem } from "@/ui/shared/common/ComboBox";
import { ColorStrings } from "@/ui/shared/Globals";

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

export type MatingEntry = {
    id: string;
    animalId: string;
    animalNumber: string;
    animalName: string;
    matingDate: Date;
    bullId: string;
    bullName: string;
    birthStatus: string;
    pregnancyStatus: string
    observation?: string;
    childInformation?: string;
    createdAt: Date;
    deletedAt?: Date;
    userId: string;
};

export type MatingEntryFilter = {
    isFiltered: boolean;
    animals?: string[];
    bulls?: string[];
    minInseminationDate?: Date;
    maxInseminationDate?: Date;
    birthStatus?: string;
    pregnancyStatus?: string;
};

export type MatingFoot = {
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
    matingDate: Date;
    birthRate: number;
};

export type PregnancyRateEntry = {
    matingDate: Date;
    pregnancyRate: number;
};

export type AnimalsNumberEntry = {
    matingDate: Date;
    animalsNumber: number;
};

export type MatingHist = {
    matingDate: Date;
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

export type MatingGroup = {
    bullId?: string;
    bullName: string;
    matingDate: Date;
    cowNumber: number;
    birthRate: number;
    pregnancyRate: number;
    birthComparisonRate: number;
    pregnancyComparisonRate: number;
};

export type LastEntry = {
    matingDate: Date;
    entries: MatingEntry[];
};
