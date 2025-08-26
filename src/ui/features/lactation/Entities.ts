export type MilkEntry = {
  id: string
  animalId?: string
  animalName?: string
  entryDate?: Date
  quantity?: number
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
  hist: MonthMilkHist[] // can be replaced with a more specific type if known
}

export type AnimalsAverage = {
  current: number
  trend: number
  hist: AnimalsAverageHist[] // can be replaced with a more specific type if known
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
  lacNum: number
  periodRate: number
  totalRate: number
  prodRate: number
}
