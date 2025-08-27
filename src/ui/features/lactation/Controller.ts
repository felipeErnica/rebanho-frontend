import { apiGet, apiPost } from "@/util/ApiRequest"
import { LactationGroupFilter } from "./Entities";

export const DASHBOARD_BASE = "lactation/dashboard/"
export const GROUP_BASE = "lactation/groups/"

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

export function getLastEntries() {
    return apiGet(DASHBOARD_BASE + "last-entries")
}

export function getProductionHist() {
    return apiGet(DASHBOARD_BASE + "milk-production")
}

export function getLastGroups() {
    return apiGet(DASHBOARD_BASE + "last-groups")
}

export function findGroupsPage(filter: LactationGroupFilter, order: string, cursor?: string) {
    const pageQuery = `page?order=${order}${cursor ? `&cursor=${cursor}` : ''}`
    return apiPost(GROUP_BASE + pageQuery, filter)
}

