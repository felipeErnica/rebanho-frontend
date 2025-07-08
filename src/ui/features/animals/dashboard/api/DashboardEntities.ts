export type TotalGeneral = {
    totalAnimals: number
    totalMales: number
    totalFemales: number
}

export type AnimalsByAgeAndFarm = {
    id: string
    farmId: string
    farmName: string
    newbornMale: number
    newbornFemale: number
    babyMale: number
    babyFemale: number
    childMale: number
    childFemale: number
    youngMale: number
    youngFemale: number
    adultMale: number
    adultFemale: number
    oldMale: number
    oldFemale: number
    totalMale: number
    totalFemale: number
    total: number
}

export type AnimalsByAge = {
    ageCategory: string
    minBirthDate: Date
    maxBirthDate: Date
    male: number
    female: number
}

export type AnimalsByYear = {
    year: number
    totalAnimals: number
}

export type AnimalsByType = {
    beefCattle: number
    dairyCattle: number
    reproductionAnimals: number
    offspring: number
}

export type AnimalDashboardFilter = {
    isFiltered: boolean
    farmId?: string
    sex?: string
    pastureId?: string
    animalType?: string
    minBirthDate?: Date
    maxBirthDate?: Date
    isActive?: boolean
}
