export type TestEntry = {
    id: string
    testDate?: Date
    animalId?: string
    animalName?: string
    birthForecast?: Date
    birthStatus?: string
    pregnancyStatus?: string
    observation?: string
    lossId?: string
    calfId?: string
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
    pregnancyRate: number
    birthRate: number
}

export type TestGroup = {
    testDate: Date
    animalsNumber: number
    pregnancyRate: number
    pregnancyComparison: number
    birthRate: number
    birthComparison: number
}
