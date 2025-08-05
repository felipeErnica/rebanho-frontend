export type BirthBySex = {
    birthMonth: Date
    males: number
    females: number
}

export type BirthIndex = {
    totalBirths: number
    deathNumbers: number
    deathPercentage: number
}

export type BirthsByDate = {
    date: Date
    birthTotal: number
    deathTotal: number
}

export type BirthIntervalHist = {
    month: Date
    intervalAverage: number
}

export type DeathIndexHist = {
    month: Date
    deathIndex: number
}

export type LossHist = {
    month: Date
    losses: number
}

export type IntervalAnimal = {
    animalName: string
    intervalAverage: number
    birthNumbers: number
    averageRate: number
}

export type BirthStats = {
    currentInterval: number
    intervalTrend: number
    intervalHist: BirthIntervalHist[]
    deathIndex: number
    deathTrend: number
    deathIndexHist: DeathIndexHist[]
    currentBirthNumbers: number
    birthNumbersTrend: number
    currentDeathNumbers: number
    deathNumbersTrend: number
    lossTrend: number
    losses: number
    lossHist: LossHist[]
    pregnantsNumber: number
    birthHistory: BirthsByDate[]
}

