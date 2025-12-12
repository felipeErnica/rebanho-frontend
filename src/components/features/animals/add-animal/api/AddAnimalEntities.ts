export type AddAnimalForm = {
    name: string
    color?: string
    weightBirth?: number
    ringNumber: string
    sex: string
    fatherId: string
    motherId: string
    birthDate?: Date
    entryDate: Date
    pastureId: string
    farmId: string
    type: string
    observation?: string
}

export type AnimalParent = {
    id: string
    publicName: string
}
