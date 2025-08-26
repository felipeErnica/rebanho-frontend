export type Loss = {
    id: string
    animalId?: string
    animalName?: string
    lossDate?: Date
    observation?: string
}

export type LossFooter = {
    totals: number
}

export type LossFilter = {
    isFiltered: boolean
    animals?: string[]
    minLossDate?: Date
    maxLossDate?: Date
}

export type LossRate = {
    trend: number
    current: number
    hist: LossRateHist[]
}

export type LossRateHist = {
    lossDate: Date
    lossRate: number
}

export type LossNumbersHist = {
    lossDate: Date
    lossNumbers: number
}

export type MostLossesAnimals = {
    animalName: string
    losses: number
    lossRate: number
    rateComparison: number
}
