import { dateTransform } from "@/utils/Transformations"
import { Pasture } from "@features/farm-area/Entities"
import { ComboBoxItem } from "@shared/common/ComboBox"
import { render } from "react-dom"

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
    animalTypeMap.forEach((value, key) => comboBoxArray.push({ name: value, value: key }))
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

export function getAnimalLabel(item: Animal) {
    if (!item) return "-"
    if (!item.tag) return item.name
    if (!item.name) return item.tag
    return item.tag + " - " + item.name
}

export function getAnimalBirthLabel(item: Animal) {
    if (!item) return "-"
    const name = item.tag ? getAnimalLabel(item) : 'Desc.'
    const birthDate = item.birthDate ? dateTransform(item.birthDate) : 'Data Desc.'
    return name + ' - ' + item.sex + ' - ' + birthDate + ` ${getDeathLabel(item)}`
}

function getDeathLabel(item: Animal) {
    if (!item.deathDate) return ""
    if (!item.sex) return "(Morto)"
    return item.sex == 'F' ? "(Morta)" : "(Morto)"
}

export type Animal = {
    id: string
    name?: string
    tag?: string
    sex: string
    birthDate?: Date
    father?: Animal
    mother?: Animal
    weightBirth: number
    weaningDate?: Date
    deathDate?: Date
    animalType: string
    pasture?: Pasture
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
    ignoreDead: boolean
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
    minChildrenNumber?: number
    maxChildrenNumber?: number
    hasName?: boolean
    isLactating?: boolean
    isAlive?: boolean
    isInseminationBull?: boolean
    isTransferBull?: boolean
    isBreedingBull?: boolean
    isEmbryoDonor?: boolean
    isOutsideAnimal?: boolean
}
