import { Animal } from "@features/animals/Entities"

export type BirthEntry = {
    calf: Animal
    mother: Animal
    father?: Animal
    birthInterval?: number
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
    id?: string
    tag?: string,
    birthDate: Date
    pastureId?: string
    motherId: string
    fatherId?: string
    sex?: string
    observation?: string
    noPasture: boolean
    overwrite: boolean
    ignoreTag: boolean
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

export type IntervalAnimal = {
    animalName: string
    birthNumbers: number
    intervalAverage: number
    averageRate: number
}
