import { apiGet, apiPost } from "@/util/ApiRequest"
import { LactationGroupFilter } from "./Entities";

export const DASHBOARD_BASE = "lactation/dashboard/"
export const GROUP_BASE = "lactation/groups/"
export const ENTRIES_BASE = "lactation/entries/"
export const LAC_BASE = "lactation/lac-hist/"

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

export function getYearkyMilk() {
    return apiGet(DASHBOARD_BASE + "yearly-milk")
}

export function getParentRatings(ratingOption: string) {
    return apiGet(DASHBOARD_BASE + ratingOption)
}

export function getLastGroups() {
    return apiGet(DASHBOARD_BASE + "last-groups")
}

export function findGroupsPage(filter: LactationGroupFilter, order: string, cursor?: string) {
    const pageQuery = `page?order=${order}${cursor ? `&cursor=${cursor}` : ''}`
    return apiPost(GROUP_BASE + pageQuery, filter)
}

export function getGroupEntries(entryDate: Date) {
    const pageQuery = `entries?entryDate=${entryDate.toISOString()}`
    return apiGet(GROUP_BASE + pageQuery)
}
export function getGroupEntriesFoot(entryDate: Date) {
    const pageQuery = `entries/foot?entryDate=${entryDate.toISOString()}`
    return apiGet(GROUP_BASE + pageQuery)
}
export function findEntriesPage(
    filter: LactationGroupFilter, 
    sort: string, 
    order: string, 
    cursor?: string,
) {
    const pageQuery = `page?order=${order}&sort=${sort}${cursor ? `&cursor=${cursor}` : ''}`
    return apiPost(ENTRIES_BASE + pageQuery, filter)
}

export function getEntriesPageFoot(filter: LactationGroupFilter) {
    return apiPost(ENTRIES_BASE + "page/foot", filter)
}

export function findLactationsPage(
    filter: LactationGroupFilter, 
    sort: string, 
    order: string, 
    cursor?: string,
) {
    const pageQuery = `page?order=${order}&sort=${sort}${cursor ? `&cursor=${cursor}` : ''}`
    return apiPost(LAC_BASE + pageQuery, filter)
}

export function getLactationsPageFoot(filter: LactationGroupFilter) {
    return apiPost(LAC_BASE + "page/foot", filter)
}

export function getLactationEntries(lacId: string) {
    return apiGet(LAC_BASE + `${lacId}/entries`)
}

export function getLactationEntriesFoot(lacId: string) {
    return apiGet(LAC_BASE + `${lacId}/entries/foot`)
}
