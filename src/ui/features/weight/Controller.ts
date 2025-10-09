import { apiGet, apiPost, buildPageCall } from "@/util/ApiRequest"
import { WeightFilter } from "./Entities"

const WEIGHT_DASHBOARD = "weight/dashboard/"
const WEIGHT_INFO = "weight/info/"

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

export function findGroups() {
    return apiGet(WEIGHT_INFO + "groups")
}

export function findEntriesByDate(entryDate: Date) {
    return apiGet(WEIGHT_INFO + `groups/${entryDate.toISOString()}/entries`)
}

export function findEntriesFootByDate(entryDate: Date) {
    return apiGet(WEIGHT_INFO + `groups/${entryDate.toISOString()}/entries/foot`)
}

export function findEntriesPage(
    filter: WeightFilter,
    sort: string,
    order: string,
    cursor?: string,
) {
    const pageQuery = buildPageCall(sort, order, cursor)
    return apiPost(WEIGHT_INFO + `entries/${pageQuery}`, filter)
}

export function getEntriesPageFoot(filter: WeightFilter) {
    return apiPost(WEIGHT_INFO + `entries/page/foot`, filter)
}
