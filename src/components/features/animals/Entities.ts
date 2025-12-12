import { ComboBoxItem } from "@shared/common/ComboBox"

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

export enum AnimalType {
    REPRODUCTION_ANIMAL = "REPRODUCTION_ANIMAL",
    DAIRY_ANIMAL = "DAIRY_ANIMAL",
    BEEF_ANIMAL = "BEEF_ANIMAL",
    OFFSPRING = "OFFSPRING",
    DEAD_ANIMAL = "DEAD_ANIMAL",
    SLAUGHTERED_ANIMAL = "SLAUGHTERED_ANIMAL",
    OUTSIDE_ANIMAL = "OUTSIDE_ANIMAL",
}

const animalTypeMap: Map<string, string> = new Map([
    ["REPRODUCTION_ANIMAL", "Animal de Reprodução"],
    ["DAIRY_ANIMAL", "Animal de Ordenha"],
    ["BEEF_ANIMAL", "Animal de Abate"],
    ["DEAD_ANIMAL", "Animal Morto"],
    ["SLAUGHTERED_ANIMAL", "Animal Abatido"],
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
