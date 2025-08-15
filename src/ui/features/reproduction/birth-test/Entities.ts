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

export type PregnancyTestsHist = {
    testDate: Date
    totals: number
    pregnancyRate: number
    birthRate: number
}
