export type PastureEntries = {
    id: string
    animalId?: string
    animalName?: string
    animalBirthDate?: string
    animalRingNumber?: string
    entryDate?: string
}

export type PastureEntriesFilter = {
    isFiltered: boolean
    animalRingNumber?: string
    animalName?: string
    minAnimalBirthDate?: Date
    maxAnimalBirthDate?: Date
    maxEntryDate?: Date
    minEntryDate?: Date
}
