import { ReproductionStatus } from "./enums/ReproductionStatus"

export type BirthTest = {
    id: string
    groupId: string
    groupDate: string
    animalId: string
    animalName: string
    animalNumber: string
    isPregnant: boolean
    birthForecast: Date
    observation: string
    status: ReproductionStatus
    lossId: string
    calfId: string
}
