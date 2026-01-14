import { apiGet, apiPost, apiPut, buildFilterParams, buildPageParams } from "@utils/ApiRequest";
import { AnimalSave, AnimalFilter } from "./Entities";
const ANIMAL_BASE = "animals/"


export function updateAnimal(entry: AnimalSave) {
    return apiPut(ANIMAL_BASE + entry.id, entry)
}

export function addAnimal(entry: AnimalSave) {
    return apiPost(ANIMAL_BASE + "add", entry)
}

export function searchAnimal(
    filter: AnimalFilter = { isFiltered: false },
    sort: string = 'animal_order',
    order: string = 'asc'
) {
    const params = buildPageParams(sort, order, filter)
    return apiGet(ANIMAL_BASE + `search?${params}`)
}

export function findById(id: string) {
    return apiGet(ANIMAL_BASE + id)
}

export function findAnimals(filter: AnimalFilter, sort: string, order: string, cursor?: string) {
    const pageCall = buildPageParams(sort, order, filter, cursor)
    return apiGet(ANIMAL_BASE + `page?${pageCall}`)
}

export function getAnimalsFoot(filter: AnimalFilter) {
    const params = buildFilterParams(filter)
    return apiGet(ANIMAL_BASE + `page/foot${params && `?${params}`}`)
}
