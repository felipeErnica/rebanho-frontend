import { apiDelete, apiGet, apiPost, apiPut, buildPageCall } from "@utils/ApiRequest"
import { WeightEntrySave, WeightFilter } from "./Entities"
import { dateToISO } from "@/utils/Transformations"

const WEIGHT_DASHBOARD = "weight/dashboard/"
const WEIGHT_ENTRIES = "weight/entries/"
const WEIGHT_GROUP = "weight/groups/"

export function getGainHist() {
    return apiGet(WEIGHT_DASHBOARD + "gain-hist")
}

export function getWeightHist() {
    return apiGet(WEIGHT_DASHBOARD + "weight-hist")
}

export function getLastWeightGain() {
    return apiGet(WEIGHT_DASHBOARD + "last-gain")
}

export function getLastWeight() {
    return apiGet(WEIGHT_DASHBOARD + "last-weight")
}

export function getLastEntries() {
    return apiGet(WEIGHT_DASHBOARD + "last-entries")
}

export function getLastGroups() {
    return apiGet(WEIGHT_DASHBOARD + "last-groups")
}

export function getAnimalsRating(rateType: string) {
    return apiGet(WEIGHT_DASHBOARD + rateType)
}

export function findGroups(order: string) {
    return apiGet(WEIGHT_GROUP + `page?order=${order}`)
}

export function findEntriesByDate(
    entryDate: Date, 
    order: string, 
    sort: string
) {
    return apiGet(WEIGHT_GROUP + `${dateToISO(entryDate)}/entries?order=${order}&sort=${sort}`)
}

export function getEntriesFootByDate(entryDate: Date) {
    return apiGet(WEIGHT_GROUP + `${dateToISO(entryDate)}/entries/foot`)
}

export function findEntriesPage(
    filter: WeightFilter,
    sort: string,
    order: string,
    cursor?: string,
) {
    const pageQuery = buildPageCall(sort, order, cursor)
    return apiPost(WEIGHT_ENTRIES + pageQuery, filter)
}

export function getEntriesPageFoot(filter: WeightFilter) {
    return apiPost(WEIGHT_ENTRIES + `page/foot`, filter)
}

export function deleteWeight(id: string) {
    return apiDelete(WEIGHT_ENTRIES + `${id}/delete`)
}

export function updateWeight(entry: WeightEntrySave) {
    return apiPut(WEIGHT_ENTRIES + "update", entry)
}

export function addWeight(entry: WeightEntrySave) {
    return apiPut(WEIGHT_ENTRIES + "add", entry)
}

export function replaceWeight(entry: WeightEntrySave) {
    return apiPut(WEIGHT_ENTRIES + "replace", entry)
}
