export type MilkEntry = {
    id: string
    animalId: string
    animalNumber: string
    animalName: string
    pastureId: string
    pastureName: string
    lactationId: string
    entryDate: Date
    milkQuantity: number
}

export type Lactation = {
    id: string
    cowId: string
    cowName: string
    cowNumber: string
    cowPasture: string
    cowOrder: number
    calfId: string
    calfBirthDate: Date
    calfSex: string
    calfFather: string
    startDate: Date
    endDate: Date
    productionPeriod: number
    productionTotal: number
    averageProduction: number
    peakProduction: number
    isr: number
    observation: string
}
