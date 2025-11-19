import { ComboBoxItem } from "@/ui/shared/common/ComboBox"
import { ColorStrings } from "@/ui/shared/Globals"

export type InseminationEntry = {
    id: string
    animalId: string
    animalInfo: string
    inseminationDate: Date
    bullId: string
    bullName: string
    observation?: string
    childInformation: string
    pregnancyStatus: string
    birthStatus: string
    lossId?: string
    calfId?: string
}

export type LastEntry = {
    inseminationDate: Date
    entries: InseminationEntry[]
}

export type InseminationEntryFilter = {
    isFiltered: boolean
    animals?: string[]
    minInseminationDate?: Date
    maxInseminationDate?: Date
    bulls?: string[]
    birthStatus?: string
    pregnancyStatus?: string
}

export type InseminationEntrySave = {
    id?: string
    animalId: string
    inseminationDate: Date
    bullId: string
    observation?: string
}

export const InseminationStatusMap: Map<string, string> = new Map([
    ['FAILED', 'Falhou'],
    ['SUCCESS', 'Confirmado'],
    ['STAND_BY', 'Aguardando...'],
])

export const InseminationStatusColorMap: Map<string, ColorStrings> = new Map([
    ['FAILED', 'error'],
    ['SUCCESS', 'success'],
    ['STAND_BY', 'warning'],
])

export const InseminationsItens: ComboBoxItem[] = [
    { name: 'Falhou', value: 'FAILED' },
    { name: 'Sucesso', value: 'SUCCESS' },
    { name: 'Aguardando...', value: 'STAND_BY' },
]

export type InseminationGroup = {
    bullId: string
    bullName: string
    inseminationDate: Date
    cowNumber: number
    birthRate: number
    pregnancyRate: number
    birthComparisonRate: number
    pregnancyComparisonRate: number
}

export type InseminationFooter = {
    totals: number
    averageBirthRate: number
    averagePregnancyRate: number
}

export type InseminationBulls = {
    bullName: string
    total: number
    birthRate: number
    pregnancyRate: number
    birthComparisonRate: number
    pregnancyComparisonRate: number
}

export type AnimalsNumberEntry = {
    inseminationDate: Date
    animalsNumber: number
}

export type FutureBirthsEntry = {
    birthForecast: Date
    birthsNumber: number
}

export type InseminationHist = {
    inseminationDate: Date
    total: number
    birthNumbers: number
    pregnancyNumbers: number
}

export type BirthRateHist = {
    inseminationDate: Date
    birthRate: number
}

export type PregnancyRateHist = {
    inseminationDate: Date
    pregnancyRate: number
}

export type BirthRateStats = {
    hist: BirthRateHist[]
    current: number
    trend: number
}

export type PregnancyRateStats = {
    hist: PregnancyRateHist[]
    current: number
    trend: number
}

export type PregnantStats = {
    pregnantNumber: number
}

