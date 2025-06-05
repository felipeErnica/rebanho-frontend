export type TotalGeneral = {
    totalAnimals: number
    totalMales: number
    totalFemales: number
}

export type AnimalsByAgeAndFarm = {
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
}

export type AnimalsByAge = {
    ageCategory: string
    male: number
    female: number
}

export type AnimalsByType = {
    beefCattle: number
    dairyCattle: number
    reproductionAnimals: number
    offspring: number
}

export type AnimalDashboardFilter = {
    isFiltered: boolean
    minBirthDate?: Date
    maxBirthDate?: Date
    farms?: string[]
    isActive?: boolean
}
