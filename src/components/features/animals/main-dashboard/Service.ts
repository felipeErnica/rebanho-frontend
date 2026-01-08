import { apiGet } from "@/utils/ApiRequest"

const ANIMAL_DASHBOARD = "animals/stats/"

export function getBirthHist() {
    return apiGet(ANIMAL_DASHBOARD + "birth")
}

export function getDeathHist() {
    return apiGet(ANIMAL_DASHBOARD + "death")
}

export function getDairyHist() {
    return apiGet(ANIMAL_DASHBOARD + "dairy")
}

export function getSlaughterHist() {
    return apiGet(ANIMAL_DASHBOARD + "slaughter")
}

export function getAnimalByTypes() {
    return apiGet(ANIMAL_DASHBOARD + "types")
}

export function getLastDeaths() {
    return apiGet(ANIMAL_DASHBOARD + "last-deaths")
}

export function getAgeAndSex() {
    return apiGet(ANIMAL_DASHBOARD + "age-and-sex")
}

