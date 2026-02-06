import {
    apiDelete,
    apiGet,
    apiPost,
    apiPut,
    buildFilterParams,
    buildPageParams
} from "@utils/ApiRequest"
import { LactationSave, LactationHistFilter, LactationAnimalFilter } from "./Entities";

export const DASHBOARD_BASE = "lactation/stats/"
export const LAC_BASE = "lactation/"

export function getLactationEntries(lacId: string) {
    return apiGet(LAC_BASE + `${lacId}/entries`)
}

export function getLactationEntriesFoot(lacId: string) {
    return apiGet(LAC_BASE + `${lacId}/entries/foot`)
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

export function getParentRatings(ratingOption: string) {
    return apiGet(DASHBOARD_BASE + ratingOption)
}

export function getDairyTypes() {
    return apiGet(DASHBOARD_BASE + "dairy-types")
}

export function findLactationsPage(
    filter: LactationHistFilter,
    sort: string,
    order: string,
    cursor?: string,
) {
    const params = buildPageParams("?", sort, order, filter, cursor)
    return apiGet(LAC_BASE + `page?${params}`)
}

export function getLactationsPageFoot(filter: LactationHistFilter) {
    const params = buildFilterParams(filter, "?")
    return apiGet(LAC_BASE + "page/foot" + params)
}

export function findLactationsAnimalsPage(
    filter: LactationAnimalFilter,
    sort: string,
    order: string,
    cursor?: string,
) {
    const params = buildPageParams("?", sort, order, filter, cursor)
    return apiGet(LAC_BASE + `animals/page?${params}`)
}

export function getLactationsAnimalsPageFoot(filter: LactationAnimalFilter) {
    const params = buildFilterParams(filter, "?")
    return apiGet(LAC_BASE + "animals/page/foot" + params)
}

export function findLactationById(id: string) {
    return apiGet(LAC_BASE + id)
}

export function updateLactation(data: LactationSave) {
    return apiPut(LAC_BASE, data)
}

export function deleteLactation(id: string) {
    return apiDelete(LAC_BASE + id)
}

export function addLactation(entry: LactationSave) {
    return apiPost(LAC_BASE, entry)
}
