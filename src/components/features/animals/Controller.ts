import { apiGet, apiPut } from "@utils/ApiRequest";
import { AnimalSave } from "./Entities";

const ANIMAL_BASE = "animals/"

export function updateAnimal(entry: AnimalSave) {
    return apiPut(ANIMAL_BASE + "update", entry)
}

export function updateNoValidation(entry: AnimalSave) {
    return apiPut(ANIMAL_BASE + "update-no-validation", entry)
}

export function addAnimal(entry: AnimalSave) {
    return apiPut(ANIMAL_BASE + "add", entry)
}

export function replaceAnimal(entry: AnimalSave) {
    return apiPut(ANIMAL_BASE + "replace", entry)
}

export function addNoValidation(entry: AnimalSave) {
    return apiPut(ANIMAL_BASE + "add-no-validation", entry)
}

export function searchMaleChildren(id: string) {
    return apiGet(ANIMAL_BASE + `${id}/male-offspring`)
}

export function searchFemaleChildren(id: string) {
    return apiGet(ANIMAL_BASE + `${id}/female-offspring`)
}

export function findById(id: string) {
    return apiGet(ANIMAL_BASE + id)
}
