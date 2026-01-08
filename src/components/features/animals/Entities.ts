import { ComboBoxItem } from "@shared/common/ComboBox"

export enum AnimalType {
    REPRODUCTION_ANIMAL = "REPRODUCTION_ANIMAL",
    DAIRY_ANIMAL = "DAIRY_ANIMAL",
    BEEF_ANIMAL = "BEEF_ANIMAL",
    OFFSPRING = "OFFSPRING",
}

const animalTypeMap: Map<string, string> = new Map([
    ["REPRODUCTION_ANIMAL", "Animal de Reprodução"],
    ["DAIRY_ANIMAL", "Animal de Ordenha"],
    ["BEEF_ANIMAL", "Animal de Abate"],
    ["OFFSPRING", "Animal de Cria"],
])

export function animalTypeToComboBox(): ComboBoxItem[] {
    const comboBoxArray: ComboBoxItem[] = []
    animalTypeMap.forEach((value, key) => comboBoxArray.push({ name: value, value: key}))
    return comboBoxArray
}

export function transformAnimalType(type?: string, sex?: string) {
    if (!type) return
    let typeText = animalTypeMap.get(type)
    if (sex && type === 'REPRODUCTION_ANIMAL') {
        typeText = sex === 'M' ? 'Touro' : 'Matriz'
    }
    return typeText
}

export type Animal = {
    id: string
    name?: string
    ringNumber?: string
    weightBirth: number
    sex: string
    weaningDate?: Date
    fatherName?: string
    fatherId?: string
    motherName?: string
    motherId?: string
    birthDate?: Date
    deathDate?: Date
    pastureName?: string
    animalType: string
    averageProd?: number
    averageProdInterval?: number
    averageBirthInterval?: number
    averagePeak?: number
    isInseminationBull?: boolean
    isTransferBull?: boolean
    isBreedingBull?: boolean
    isEmbryoDonor?: boolean
    isOutsideAnimal?: boolean
    observation?: string
}

export type AnimalFoot = {
    total: number
    averageProd?: number
    averageBirthInterval?: number
    averageLacInterval?: number
    averagePeak?: number
}

export type AnimalSave = {
    id?: string
    ringNumber?: string
    name?: string
    weightBirth?: number
    sex: string
    fatherId?: string
    motherId?: string
    birthDate?: Date
    deathDate?: Date
    weaningDate?: Date
    animalType: string
    observation?: string
    isInseminationBull?: boolean
    isTransferBull?: boolean
    isBreedingBull?: boolean
    isEmbryoDonor?: boolean
    isOutsideAnimal?: boolean
}

export type AnimalFilter = {
    isFiltered: boolean
    name?: string
    ringNumber?: string
    sex?: string
    minWeaningDate?: Date
    maxWeaningDate?: Date
    fathers?: string[]
    mothers?: string[]
    minBirthDate?: Date
    maxBirthDate?: Date
    minDeathDate?: Date
    maxDeathDate?: Date
    pastures?: string[]
    farms?: string[]
    types?: string[]
    minAverageProd?: number
    maxAverageProd?: number
    minAverageBirthInterval?: number
    maxAverageBirthInterval?: number
    minAveragePeak?: number
    maxAveragePeak?: number
    minChildrenQuantity?: number
    maxChildrenQuantity?: number
    isAlive?: boolean
    isInseminationBull?: boolean
    isTransferBull?: boolean
    isBreedingBull?: boolean
    isEmbryoDonor?: boolean
    isOutsideAnimal?: boolean
}
