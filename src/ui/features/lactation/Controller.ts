import { apiGet, apiPost, buildPageCall } from "@/util/ApiRequest"
import { LactationGroupFilter } from "./Entities";

export const DASHBOARD_BASE = "lactation/dashboard/"
export const GROUP_BASE = "lactation/groups/"
export const ENTRIES_BASE = "lactation/entries/"
export const LAC_BASE = "lactation/lac-hist/"

export function getLastMilk() {
    return apiGet(DASHBOARD_BASE + "last-milk")
}

export function getLastAverageMilk() {
    return apiGet(DASHBOARD_BASE + "last-avg-milk")
}

export function getLastCount() {
    return apiGet(DASHBOARD_BASE + "last-count")
}

export function getRankedAnimals(rankBy: string) {
    return apiGet(DASHBOARD_BASE + rankBy)
}

export function getLastEntries() {
    return apiGet(DASHBOARD_BASE + "last-entries")
}

export function getMilkProduction() {
    return apiGet(DASHBOARD_BASE + "milk-production")
}

export function getYearProduction() {
    return apiGet(DASHBOARD_BASE + "year-milk")
}

export function getYearAverage() {
    return apiGet(DASHBOARD_BASE + "year-avg-milk")
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
    const pageQuery = buildPageCall(sort, order, cursor)
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

export function searchAllPastures() {
    return apiGet("farm-area/pastures/search-all")
}
