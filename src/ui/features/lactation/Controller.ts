import { apiGet } from "@/util/ApiRequest"

export const DASHBOARD_BASE = "lactation/dashboard/"

export function getMonthMilk() {
    return apiGet(DASHBOARD_BASE + "month-milk")
}

export function getAnimalsAverage() {
    return apiGet(DASHBOARD_BASE + "animals-average")
}

export function getRankedAnimals(rankBy: string) {
    if (rankBy == "best") return getBestAnimals();
    else return getWorstAnimals()
}

export function getBestAnimals() {
    return apiGet(DASHBOARD_BASE + "best-animals")
}

export function getWorstAnimals() {
    return apiGet(DASHBOARD_BASE + "worst-animals")
}

export function getProductionHist() {
    return apiGet(DASHBOARD_BASE + "milk-production")
}
