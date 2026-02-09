export function getPastureLabel(pasture: Pasture) {
    if (!pasture) return "-"
    return `${pasture.name} (${pasture.farm.name})`
}

export type Farm = {
    id:string
    name: string
    taxNumber?: string
    state?: string
    city?: string
}

export type Pasture = {
    id: string
    name: string
    farm: Farm
    pastureSize: number
    animalsNumber: number
}

export type PastureFilter = {
    isFiltered: boolean
    name?: string
    farmId?: string
    minPastureSize?: number
    maxPastureSize?: number
    minAnimalsNumber?: number
    maxAnimalsNumber?: number
}

export type PastureEntry = {
    id: string
    pastureId?: string
    animalId?: string
    animalName?: string
    animalBirthDate?: Date
    animalRingNumber?: string
    animalFather?: string
    animalMother?: string
    entryDate?: Date
}

export type PastureEntrySave = {
    id?: string
    pastureId: string
    animalId: string
    entryDate?: Date
}

export type PastureEntriesFilter = {
    isFiltered: boolean
    animalRingNumber?: string
    animalName?: string
    fathers?: string[]
    mothers?: string[]
    minAnimalBirthDate?: Date
    maxAnimalBirthDate?: Date
    maxEntryDate?: Date
    minEntryDate?: Date
}

export type PastureStats = {
    totalAnimals: {
        current: number
        trend: number
        history: { date: string, value: number }[]
    }
    occupiedPastures: {
        current: number
        total: number
    }
    recentMoves: {
        current: number
        trend: number
        history: { date: string, value: number }[]
    }
}

export type PastureOccupancy = {
    id: string
    name: string
    animalCount: number
    maxCapacity?: number
    usagePercentage: number
}
