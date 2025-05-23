export type SlaughterEntry = {
    id: string
    animalId: string
    animalName: string
    animalNumber: string
    animalBirth: Date
    animalSex: string
    groupId: string
    slaughterhouse: string
    slaughterDate: Date
    weight: number
    deadWeight: number
}

export type Slaughterhouse = {
    id: string
    name: string
    taxNumber: string
    city: string
    state: string
    weightDiscount: number
}

export type WeightEntry = {
    id: string
    animalId: string
    animalName: string
    animalNumber: string
    animalSex: string
    groupId: string
    groupDate: string
    weight: number
}
