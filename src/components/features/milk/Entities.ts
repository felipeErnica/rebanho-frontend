
export type MilkEntry = {
    id: string
    animalId?: string
    animalInfo?: string
    pastureName?: string
    entryDate?: Date
    quantity?: number
}

export type MilkEntryFilter = {
    isFiltered: boolean
    animals?: string[]
    pastures?: string[]
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

export type MilkEntrySave = {
    id?: string
    animalId: string
    pastureId?: string
    entryDate?: Date
    quantity: number
    overwrite: boolean
    transferPasture: boolean
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

export type LactationGroupSave = {
    entryDate: Date
}

export type LactationGroupFilter = {
    isFiltered: boolean
    minEntryDate?: Date
    maxEntryDate?: Date
}

