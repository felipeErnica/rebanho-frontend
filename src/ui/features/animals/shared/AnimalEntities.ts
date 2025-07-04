export type AnimalSave = {
    name: string
    color: string
    weightBirth: number
    ringNumber: string
    sex: string
    fatherId: string
    motherId: string
    birthDate: Date
    pastureId: string
    animalType: AnimalType
    observation: string
}

export enum AnimalType {
    REPRODUCTION_ANIMAL = "REPRODUCTION_ANIMAL",
    DAIRY_ANIMAL = "DAIRY_ANIMAL", 
    BEEF_ANIMAL = "BEEF_ANIMAL",
    OFFSPRING = "OFFSPRING",
    DEAD_ANIMAL = "DEAD_ANIMAL",
    SLAUGHTERED_ANIMAL = "SLAUGHTERED_ANIMAL",
    OUTSIDE_ANIMAL = "OUTSIDE_ANIMAL",
}
