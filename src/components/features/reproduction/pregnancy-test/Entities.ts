import { ComboBoxItem } from "@shared/common/ComboBox"

export const BirthStatusMap: Map<string, string> = new Map([
    ['FAILED', 'Falhou'],
    ['SUCCESS', 'Confirmado'],
    ['STAND_BY', 'Aguardando...'],
])

export const BirthStatusItems: ComboBoxItem[] = [
    { value: 'FAILED', name: 'Falhou' },
    { value: 'SUCCESS', name: 'Confirmado' },
    { value: 'STAND_BY', name: 'Aguardando...' },
]

export const PregnancyStatusMap: Map<string, string> = new Map([
    ['FAILED', 'Vazia'],
    ['SUCCESS', 'Prenha'],
])

export const PregnancyStatusItems: ComboBoxItem[] = [
    { name: 'Vazia', value: 'FAILED' },
    { value: 'SUCCESS', name: 'Prenha' },
]

export type TestEntry = {
    id: string
    testDate: Date
    animalId: string
    animalInfo: string
    birthForecast?: Date
    birthStatus: string
    pregnancyStatus: string
    childInformation?: string
    observation?: string
}

export type TestEntrySave = {
    id: string
    testDate: Date
    animalId: string
    pregnancyStatus: string
    pregnancyTime?: number
    observation?: string
}

export type TestEntryForm = {
    id: string
    testDate: Date
    animalId: string
    birthForecast?: Date 
    pregnancyTime?: number 
    forecastType: 'days' | 'date'
    pregnancyStatus: string
    observation?: string 
}

export type LastEntryProps = {
    testDate: Date
    entries: TestEntry[]
}

export type TestEntryFilter = {
    isFiltered: boolean
    minTestDate?: Date
    maxTestDate?: Date
    animals?: string[]
    minBirthForecast?: Date
    maxBirthForecast?: Date
    birthStatus?: string
    pregnancyStatus?: string
}

export type TestEntryFooter = {
    totals: number
    pregnancyRate: number
    birthRate: number
}

export type TestAnimal = {
    animalName: string
    totals: number
    pregnancyRate: number
    birthRate: number
    pregnancyComparison: number
    birthComparison: number
}

type PregnancyRateHist = {
    testDate: Date
    pregnancyRate: number
}

export type AnimalsNumberHist = {
    testDate: Date
    animalsNumber: number
}

export type PregnancyRateStats = {
    current: number
    trend: number
    hist: PregnancyRateHist[]
}

type BirthRateHist = {
    testDate: Date
    birthRate: number
}

export type BirthRateStats = {
    current: number
    trend: number
    hist: BirthRateHist[]
}

export type NextBirths = {
    birthForecast: Date
    birthNumbers: number
}

export type PregnancyTestsHist = {
    testDate: Date
    totals: number
    pregnancies: number
    births: number
}

export type TestGroup = {
    testDate: Date
    animalsNumber: number
    pregnancyRate: number
    pregnancyComparison: number
    birthRate: number
    birthComparison: number
}
