import { AnimalType } from "../../animals/shared/AnimalEntities"

export type PastureAnimal = {
    id?: string
    name?: string
    ringNumber?: string
    sex: string
    fatherName?: string
    fatherId?: string
    motherName?: string
    motherId?: string
    birthDate?: Date
    deathDate?: Date
    farmId?: string
    farmName?: string
    animalType: AnimalType
}
