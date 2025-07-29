export type PastureEntries = {
    id: string
    animalId?: string
    animalName?: string
    animalBirthDate?: string
    animalRingNumber?: string
    animalFather?: string
    animalMother?: string
    entryDate?: string
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
