import { apiGet, apiPost, apiPut, buildPageCall } from "@utils/ApiRequest";
import { AnimalSave, AnimalFilter } from "./Entities";
const ANIMAL_BASE = "animals/"


export function updateAnimal(entry: AnimalSave) {
    return apiPut(ANIMAL_BASE + "update", entry)
}

export function addAnimal(entry: AnimalSave) {
    return apiPut(ANIMAL_BASE + "add", entry)
}

export function searchAnimal(filter: AnimalFilter = { isFiltered: false }) {
    return apiPost(ANIMAL_BASE + 'search', filter)
}

export function findById(id: string) {
    return apiGet(ANIMAL_BASE + id)
}

export function findAnimals(filter: AnimalFilter, sort: string, order: string, cursor?: string) {
    const pageCall = buildPageCall(sort, order, cursor)
    return apiPost(ANIMAL_BASE + pageCall, filter)
}

export function findAnimalsTotal(filter: AnimalFilter) {
    return apiPost(ANIMAL_BASE + "total", filter)
}

export function findDeadAnimals(filter: AnimalFilter, sort: string, order: string, cursor?: string) {
    const pageCall = buildPageCall(sort, order, cursor)
    return apiPost(ANIMAL_BASE + pageCall, { ...filter, isAlive: false })
}

export function getDeadAnimalsFoot(filter: AnimalFilter) {
    return apiPost(ANIMAL_BASE + "page/foot", { ...filter, isAlive: false })
}
