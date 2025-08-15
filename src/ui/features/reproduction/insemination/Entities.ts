import { ComboBoxItem } from "@/ui/shared/common/ComboBox"
import { ColorStrings } from "@/ui/shared/Globals"

export type InseminationEntry = {
    id: string
    animalId?: string
    animalName?: string
    inseminationDate?: Date
    bullId?: string
    bullName?: string
    observation?: string
    pregnancyStatus?: string
    status?: string
    lossId?: string
    calfId?: string
}

export type InseminationEntryFilter = {
    isFiltered: boolean
    animals?: string[]
    minInseminationDate?: Date
    maxInseminationDate?: Date
    bulls?: string[]
    status?: string
}

export const InseminationStatusMap: Map<string, string> = new Map([
    ['FAILED', 'Falhou'],
    ['SUCCESS', 'Confirmado'],
    ['STAND_BY', 'Aguardando Confirmação'],
])

export const InseminationStatusColorMap: Map<string, ColorStrings> = new Map([
    ['FAILED', 'error'],
    ['SUCCESS', 'success'],
    ['STAND_BY', 'warning'],
])

export function statusMapToComboBox() {
    const items: ComboBoxItem[] = []
    InseminationStatusMap.forEach((value, key) => items.push({ name: value, value: key }))
    return items
}

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

export type PregnantsNumber = {
    pregnantNumber: number
}

export type InseminationHist = {
    dateMonth: Date
    total: number
    birthRate: number
    pregnancyRate: number
}

export type BirthRateHist = {
    dateMonth: Date
    birthRate: number
}

export type PregnancyRateHist = {
    dateMonth: Date
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

