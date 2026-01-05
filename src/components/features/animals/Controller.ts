import { apiGet, apiPost, apiPut, buildPageCall } from "@utils/ApiRequest";
import { AnimalSave } from "./Entities";
import { IFilters } from "@utils/Filter";

const ANIMAL_BASE = "animals/"
const ANIMAL_INFO = "animals/info/"


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

export function findAnimals(filter: IFilters, sort: string, order: string, cursor?: string) {
    const pageCall = buildPageCall(sort, order, cursor)
    return apiPost(ANIMAL_INFO + pageCall, filter)
}

export function findAnimalsTotal(filter: IFilters) {
    return apiPost(ANIMAL_BASE + "total", filter)
}
