import { Animal } from "@features/animals/Entities"
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

export type Test = {
    id: string
    cow: Animal
    calf?: Animal
    testDate: Date
    birthForecast?: Date
    birthStatus: string
    pregnancyStatus: string
    observation?: string
}

export type TestSave = {
    id: string
    testDate: Date
    animalId: string
    birthForecast?: Date
    pregnancyTime?: number
    forecastType: 'days' | 'date'
    pregnancyStatus: string
    observation?: string
    overwrite: boolean
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

export type TestEntryFoot = {
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

export type TestGroupSave = {
    oldTestDate: Date
    testDate: Date
}
