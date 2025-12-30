import { apiGet, apiPost, apiPut, buildPageCall } from "@utils/ApiRequest";
import { AnimalSave } from "./Entities";
import { IFilters } from "@utils/Filter";

const ANIMAL_BASE = "animals/"
const ANIMAL_DASHBOARD = "animals/dashboard/"

export function getBirthHist() {
    return apiGet(ANIMAL_DASHBOARD + "birth-hist")
}

export function getDeathHist() {
    return apiGet(ANIMAL_DASHBOARD + "death-hist")
}

export function getDairyHist() {
    return apiGet(ANIMAL_DASHBOARD + "dairy-hist")
}

export function getSlaughterHist() {
    return apiGet(ANIMAL_DASHBOARD + "slaughter-hist")
}

export function getAnimalByTypes() {
    return apiGet(ANIMAL_DASHBOARD + "animal-types")
}

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
    return apiPost(ANIMAL_BASE + pageCall, filter)
}

export function findAnimalsTotal(filter: IFilters) {
    return apiPost(ANIMAL_BASE + "total", filter)
}
