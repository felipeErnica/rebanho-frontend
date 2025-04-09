export type Animal = {
    id: string,
    name: string,
    ringNumber: string,
    birthDate: Date,
    deathDate: Date,
    averageBirthInterval: number
}

export type AnimalFilter = {
    isFiltered: boolean,
    name?: string,
    identificationNumber?: string,
    sex?: string,
    minWeaningDate?: Date,
    maxWeaningDate?: Date,
    fathers?: string[],
    mothers?: string[],
    minBirthDate?: Date,
    maxBirthDate?: Date,
    minDeathDate?: Date,
    maxDeathDate?: Date,
    pastures?: string[],
    status?: string[],
    minIsr?: number,
    maxIsr?: number,
    minAverageProd?: number,
    maxAverageProd?: number,
    minAverageBirthInterval?: number,
    maxAverageBirthInterval?: number,
    minAveragePeak?: number,
    maxAveragePeak?: number,
    minChildrenQuantity?: number,
    maxChildrenQuantity?: number
}
