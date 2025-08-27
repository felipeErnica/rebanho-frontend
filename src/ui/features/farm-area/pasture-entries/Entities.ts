export type PastureEntry = {
    id: string
    animalId?: string
    animalName?: string
    animalBirthDate?: Date
    animalRingNumber?: string
    animalFather?: string
    animalMother?: string
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
