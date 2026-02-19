import { apiGet, apiPost, apiPut, buildFilterParams, buildPageParams } from "@utils/ApiRequest";
import { AnimalFilter, AnimalSave } from "./Entities";

const ANIMAL_BASE = "animals/"
const ANIMAL_STATS = "animals/stats/"

export function getBirthHist() {
    return apiGet(ANIMAL_STATS + "birth")
}

export function getDeathHist() {
    return apiGet(ANIMAL_STATS + "death")
}

export function getDairyHist() {
    return apiGet(ANIMAL_STATS + "dairy")
}

export function getSlaughterHist() {
    return apiGet(ANIMAL_STATS + "slaughter")
}

export function getAnimalByTypes() {
    return apiGet(ANIMAL_STATS + "types")
}

export function getLastDeaths() {
    return apiGet(ANIMAL_STATS + "last-deaths")
}

export function getAgeAndSex() {
    return apiGet(ANIMAL_STATS + "age-and-sex")
}

export function updateAnimal(entry: AnimalSave) {
    return apiPut(ANIMAL_BASE, entry)
}

export function addAnimal(entry: AnimalSave) {
    return apiPost(ANIMAL_BASE, entry)
}

export function searchAnimal(
    filter: AnimalFilter = { isFiltered: false },
    sort: string = 'animal_order',
    order: string = 'asc'
) {
    const params = buildPageParams("?", sort, order, filter)
    return apiGet(ANIMAL_BASE + "search" + params)
}

export function findById(id: string) {
    return apiGet(ANIMAL_BASE + id)
}

export function findAnimals(filter: AnimalFilter, sort: string, order: string, cursor?: string) {
    const params = buildPageParams("?", sort, order, filter, cursor)
    return apiGet(ANIMAL_BASE + "page" + params)
}

export function getAnimalsFoot(filter: AnimalFilter) {
    const params = buildFilterParams(filter, "?")
    return apiGet(ANIMAL_BASE + `page/foot` + params)
}

//Common searchs
export function searchInternalAnimals(filter?: AnimalFilter) {
    return searchAnimal(
        { ...filter, isFiltered: true, isOutsideAnimal: false },
        "animal_order,birth_date",
        "asc"
    )
}

export function searchMothers(filter?: AnimalFilter) {
    return searchAnimal({
        ...filter,
        isFiltered: true,
        sex: 'F',
        hasName: true,
        isOutsideAnimal: false
    })
}

export function searchAllMothers(filter?: AnimalFilter) {
    return searchAnimal({
        ...filter,
        isFiltered: true,
        sex: 'F',
        hasName: true,
    })
}

export function searchFathers(filter?: AnimalFilter) {
    return searchAnimal({
        ...filter,
        isFiltered: true,
        sex: 'M',
        hasName: true
    })
}
