import { ComboBoxItem } from "@/ui/shared/common/ComboBox"
import { ColorStrings } from "@/ui/shared/Globals"

export type InseminationEntry = {
    id: string
    animalId?: string
    animalName?: string
    groupId?: string
    inseminationDate?: Date
    bullName?: string
    observation?: string
    status?: string
    lossId?: string
    calfId?: string
}

export type EntriesFooter = {
    totals: number
    birthRate: number
}

export type InseminationEntryFilter = {
    isFiltered: boolean
    animals?: string[]
    groups?: string[]
    minInseminationDate?: Date
    maxInseminationDate?: Date
    bulls?: string[]
    status?: string
}

export const InseminationStatusMap: Map<string, string> = new Map([
    ['FAILED', 'Inseminação Falhou'],
    ['SUCCESS', 'Inseminação Bem Sucedida'],
    ['STAND_BY', 'Aguardando Confirmação'],
    ['PREGNANT', 'Vaca Prenha'],
])

export const InseminationStatusColorMap: Map<string, ColorStrings> = new Map([
    ['FAILED', 'error'],
    ['SUCCESS', 'success'],
    ['STAND_BY', 'warning'],
    ['PREGNANT', 'info'],
])

export function statusMapToComboBox() {
    const items: ComboBoxItem[] = []
    InseminationStatusMap.forEach((value, key) => items.push({ name: value, value: key }))
    return items
}

export type InseminationGroup = {
    id: string
    bullId: string
    bullName: string
    inseminationDate: Date
    cowNumber: number
    birthRate: number
    comparisonRate: number
}

export type GroupFooter = {
    totals: number
    averageBirthRate: number
}

export type InseminationBulls = {
    bullName: string
    total: number
    birthRate: number
    comparisonRate: number
}

export type PregnantsNumber = {
    pregnantNumber: number
}

export type InseminationHist = {
    dateMonth: Date
    total: number
    birthRate: number
}

export type BirthRateHist = {
    dateMonth: Date
    birthRate: number
}

export type BirthRateStats = {
    hist: BirthRateHist[]
    current: number
    trend: number
}

export type PregnantStats = {
    pregnantNumber: number
}

