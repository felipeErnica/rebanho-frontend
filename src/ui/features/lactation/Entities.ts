export type MilkEntry = {
    id: string
    animalId?: string
    animalName?: string
    entryDate?: Date
    quantity?: number
}

export type MilkEntryFilter = {
  isFiltered: boolean
  animals?: string[]
  minEntryDate?: Date
  maxEntryDate?: Date
  minQuantity?: number
  maxQuantity?: number
}

export type MilkEntryFoot = {
  animalsNumber: number
  totalMilk: number
  averageMilk: number
}

export type MonthMilkHist = {
    entryDate: Date
    totalMilk: number
}

export type AnimalsAverageHist = {
    entryDate: Date
    animalsNumber: number
}

export type MonthMilkCard = {
    current: number
    trend: number
    hist: MonthMilkHist[]
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

export type LactationGroup = {
    id: string
    entryDate: Date
    animalsNumber: number
    numberDifference: number
    totalMilk: number
    totalRate: number
    averageMilk: number
    averageRate: number
}

export type LactationGroupFilter = {
    isFiltered: boolean
    minEntryDate?: Date
    maxEntryDate?: Date
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
