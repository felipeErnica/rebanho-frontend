export type LactationHist = {
    id: string
    animalId: string
    animalName: string
    calfId: string
    calfInfo: string
    startDate: Date
    endDate?: Date
    lacPeriod: number
    averageProduction: number
    totalProduction: number
    lacInterval: number
    peak: number
    observation?: string
}

export type AddLactationStruct = {
    id?: string
    animalId?: string
    pastureId?: string
    startDate?: Date
    calfId?: string
    endDate?: Date
    observation?: string
}

export type LactationHistFilter = {
    isFiltered: boolean
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

export type LactationHistFoot = {
    totalLacs: number
    averagePeriod: number
    averageProduction: number
    averageTotal: number
    averageInterval: number
    averagePeak: number
}

export type DairyAnimalsType = {
    dry: number
    lactating: number
}

export type AnimalsAverageHist = {
    entryDate: Date
    animalsNumber: number
}

export type TotalMilkHist = {
    entryDate: Date
    totalMilk: number
}

export type AverageMilkHist = {
    entryDate: Date
    averageMilk: number
}

export type AnimalsAverage = {
    current: number
    trend: number
    hist: AnimalsAverageHist[]
}

export type MilkProductionHist = {
    entryDate: Date
    animalsNumber: number
    totalMilk: number
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
