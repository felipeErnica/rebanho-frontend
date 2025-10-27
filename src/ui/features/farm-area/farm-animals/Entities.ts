import { AnimalType } from "../../animals/Entities"

export type AnimalFarm = {
    id: string
    name?: string
    ringNumber?: string
    sex?: string
    fatherName?: string
    fatherId?: string
    motherName?: string
    motherId?: string
    birthDate?: Date
    pastureName?: string
    pastureId?: string
    farmId?: string
    animalType?: AnimalType
}
