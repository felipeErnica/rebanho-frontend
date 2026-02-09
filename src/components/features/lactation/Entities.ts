import { Animal } from "@features/animals/Entities"

export type LactationAnimal = {
    id: string
    tag?: string
    name?: string
    birthDate?: Date
    lactation?: Lactation
}

export type Lactation = {
    id: string
    cow: Animal
    calf?: Animal
    startDate: Date
    endDate?: Date
    lacPeriod: number
    averageProduction: number
    totalProduction: number
    lacInterval: number
    peak: number
    observation?: string
}

export type LactationSave = {
    id?: string
    animalId?: string
    startDate?: Date
    calfId?: string
    endDate?: Date
    pastureId?: string
    observation?: string
    overwrite: boolean
    transferPasture: boolean
    noPasture: boolean
    noBirth: boolean
}

export type LactationFilter = {
    isFiltered: boolean
    hasEndDate?: boolean
    hasCalf?: boolean
    animals?: string[]
    minCalfBirthDate?: Date
    maxCalfBirthDate?: Date
    minStartDate?: Date
    maxStartDate?: Date
    minEndDate?: Date
    maxEndDate?: Date
    minLacPeriod?: number
    maxLacPeriod?: number
    minAverageProduction?: number
    maxAverageProduction?: number
    minTotalProduction?: number
    maxTotalProduction?: number
    minLacInterval?: number
    maxLacInterval?: number
    minPeak?: number
    maxPeak?: number
    observation?: string
}

export type LactationAnimalFilter = {
    isFiltered: boolean
    animals?: string[]
    isLactating?: boolean
    hasLactation?: boolean
    hasCalf?: boolean
    minCalfBirthDate?: Date
    maxCalfBirthDate?: Date
    minStartDate?: Date
    maxStartDate?: Date
    minEndDate?: Date
    maxEndDate?: Date
    minLacPeriod?: number
    maxLacPeriod?: number
    minAverageProduction?: number
    maxAverageProduction?: number
    minTotalProduction?: number
    maxTotalProduction?: number
    minLacInterval?: number
    maxLacInterval?: number
    minPeak?: number
    maxPeak?: number
    observation?: string
}

export type LactationHistFoot = {
    totalLacs: number
    averagePeriod?: number
    averageProduction?: number
    averageTotal?: number
    averageInterval?: number
    averagePeak?: number
}

export type DairyAnimalsType = {
    dry: number
    lactating: number
}

export type AnimalsRating = {
    animalName: string
    avgTotal: number
    avgPeriod: number
    avgProd: number
    avgInterval: number
    lacNum: number
    periodRate: number
    totalRate: number
    prodRate: number
    intervalRate: number
}

export type ParentsRating = {
    parentName: string
    avgTotal: number
    avgPeriod: number
    avgProd: number
    avgInterval: number
    childrenNumber: number
    lacRate: number
    periodRate: number
    totalRate: number
    prodRate: number
    intervalRate: number
}
