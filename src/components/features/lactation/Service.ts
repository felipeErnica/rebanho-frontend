import { apiDelete, apiGet, apiPost, apiPut, buildFilterParams, buildPageCall, buildPageParams } from "@utils/ApiRequest"
import { AddLactationStruct,  LactationHist, LactationHistFilter } from "./Entities";

export const DASHBOARD_BASE = "lactation/dashboard/"
export const LAC_BASE = "lactation/"

export function getLastMilk() {
    return apiGet(DASHBOARD_BASE + "last-milk")
}

export function getLastAverageMilk() {
    return apiGet(DASHBOARD_BASE + "last-avg-milk")
}

export function getLastLactating() {
    return apiGet(DASHBOARD_BASE + "last-lactating")
}

export function getLastDry() {
    return apiGet(DASHBOARD_BASE + "last-dry")
}

export function getRankedAnimals(rankBy: string) {
    return apiGet(DASHBOARD_BASE + rankBy)
}

export function getLastLac() {
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

export function getDairyTypes() {
    return apiGet(DASHBOARD_BASE + "dairy-types")
}

export function getLongLactations() {
    return apiGet(DASHBOARD_BASE + 'long-lactations')
}

export function findLactationsPage(
    filter: LactationHistFilter,
    sort: string,
    order: string,
    cursor?: string,
) {
    const params = buildPageParams(sort, order, filter, cursor)
    return apiGet(LAC_BASE + `page?${params}`)
}

export function getLactationsPageFoot(filter: LactationHistFilter) {
    const params = buildFilterParams(filter, "?")
    return apiGet(LAC_BASE + "page/foot" + params)
}

export function findLongLactationsPage(
    filter: LactationHistFilter,
    sort: string,
    order: string,
    cursor?: string,
) {
    const pageQuery = "long-lactations/" + buildPageCall(sort, order, cursor)
    return apiPost(LAC_BASE + pageQuery, filter)
}

export function getLongLactationsPageFoot(filter: LactationHistFilter) {
    return apiPost(LAC_BASE + "long-lactations/page/foot", filter)
}

export function findLactationById(id: string) {
    return apiGet(LAC_BASE + id)
}

export function searchLactating() {
    return apiGet(LAC_BASE + "search-lactating")
}

export function searchDryAnimals() {
    return apiGet(LAC_BASE + "search-dry")
}

export function searchCalfs() {
    return apiGet(LAC_BASE + "search-calfs")
}

export function updateEndDate(data: AddLactationStruct) {
    return apiPut(LAC_BASE + `end-lac`, data)
}

export function updateLactation(data: LactationHist) {
    return apiPut(LAC_BASE + "update", data)
}

export function deleteLactation(id: string) {
    return apiDelete(LAC_BASE + `delete/${id}`)
}

export function addLactation(entry: AddLactationStruct) {
    return apiPut(LAC_BASE + "add", entry)
}

export function findLacAnimalsPage(
    filter: LactationHistFilter,
    sort: string,
    order:string,
    cursor?: string,
) {
    const pageQuery = `lac-animals/${buildPageCall(sort, order, cursor)}`
    return apiPost(LAC_BASE + pageQuery, filter)
}

export function getLacAnimalsPageFoot(filter: LactationHistFilter) {
    return apiPost(LAC_BASE + "lac-animals/page/foot", filter)
}

export function findDryAnimalsPage(
    filter: LactationHistFilter,
    sort: string,
    order:string,
    cursor?: string,
) {
    const pageQuery = `dry-animals/${buildPageCall(sort, order, cursor)}`
    return apiPost(LAC_BASE + pageQuery, filter)
}

export function getDryAnimalsPageFoot(filter: LactationHistFilter) {
    return apiPost(LAC_BASE + "dry-animals/page/foot", filter)
}
