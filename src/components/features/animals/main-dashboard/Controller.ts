import { apiGet } from "@/utils/ApiRequest"

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

export function getLastDeaths() {
    return apiGet(ANIMAL_DASHBOARD + "last-deaths")
}

export function getAgeAndSex() {
    return apiGet(ANIMAL_DASHBOARD + "age-and-sex")
}

