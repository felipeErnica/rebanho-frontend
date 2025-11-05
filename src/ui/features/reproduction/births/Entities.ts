export type BirthEntry = {
    id: string
    motherId: string
    motherInfo: string
    motherOrder: number
    calfId: string
    calfName: string
    calfBirthDate: Date
    calfSex: string
    calfFatherId?: string
    calfFather?: string
    birthInterval?: number
    observation?: string
    createdAt: Date
    deletedAt?: Date
    userId: string
}

export type BirthEntryFilter = {
    isFiltered: boolean
    mothers?: string[]
    minBirthDate?: Date
    maxBirthDate?: Date
    sex?: string
    fathers?: string[]
    minBirthInterval?: number
    maxBirthInterval?: number
}

export type BirthEntrySave = {
    id: string
    motherId: string
    calfId: string
    birthInterval?: number
    observation?: string
    createdAt: Date
    deletedAt?: Date
    userId: string
}

export type BirthFooter = {
    total: number
    intervalAverage: number
}

export type BirthsBySex = {
    birthMonth: Date
    males: number
    females: number
}

export type BirthsByDate = {
    date: Date
    birthTotal: number
    deathTotal: number
}

export type BirthIntervalHist = {
    birthDate: Date
    intervalAverage: number
}

export type DeathIndexHist = {
    entryDate: Date
    deathIndex: number
}

export type BirthNumberEntry = {
    entryDate: Date
    birthTotal: number
}

export type DeathNumberEntry = {
    entryDate: Date
    deathsTotal: number
}

export type LossHist = {
    month: Date
    losses: number
}

export type IntervalAnimal = {
    animalName: string
    birthNumbers: number
    intervalAverage: number
    averageRate: number
}

export type IntervalStats = {
    currentInterval: number
    intervalTrend: number
    intervalHist: BirthIntervalHist[]
}

export type DeathStats = {
    currentDeathIndex: number
    deathTrend: number
    deathIndexHist: DeathIndexHist[]
}

export type LossStats = {
    lossNumbers: number
    lossTrend: number
    lossHist: LossHist[]
}

export type CurrentStats = {
    currentBirthNumbers: number
    birthNumbersTrend: number
    birthHistory: BirthsByDate[]
}
