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

export type EmbryoTransfer = {
    id: string;
    receiverId: string;
    receiverInfo: string;
    donorId: string;
    donorInfo: string;
    bullId: string;
    bullName: string;
    transferDate: Date;
    birthStatus: string;
    pregnancyStatus: string;
    observation?: string;
    childInformation?: string;
};

export type EmbryoTransferSave = {
    id: string;
    receiverId: string;
    donorId: string;
    bullId: string;
    transferDate: Date;
    observation?: string;
};

export type TransferEntryFilter = {
    isFiltered: boolean;
    animals?: string[];
    bulls?: string[];
    minMatingDate?: Date;
    maxMatingDate?: Date;
    birthStatus?: string;
    pregnancyStatus?: string;
};

export type TransferFoot = {
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
    transferDate: Date;
    birthRate: number;
};

export type PregnancyRateEntry = {
    transferDate: Date;
    pregnancyRate: number;
};

export type AnimalsNumberEntry = {
    transferDate: Date;
    animalsNumber: number;
};

export type TransferHist = {
    transferDate: Date;
    animalsNumber: number;
    pregnanciesNumber: number;
    birthsNumber: number;
};

export type FutureBirths = {
    birthForecast: Date;
    birthsNumber: number;
};

export type BestAnimals = {
    animalName: string;
    total: number;
    birthRate: number;
    pregnancyRate: number;
    birthComparisonRate: number;
    pregnancyComparisonRate: number;
};

export type TransferGroup = {
    transferDate: Date;
    cowNumber: number
    birthRate: number;
    pregnancyRate: number;
    birthComparisonRate: number;
    pregnancyComparisonRate: number;
}

export type LastEntry = {
    transferDate: Date;
    entries: EmbryoTransfer[];
};
