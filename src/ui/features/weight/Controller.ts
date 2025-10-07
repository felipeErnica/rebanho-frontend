import { apiGet, apiPost, buildPageCall } from "@/util/ApiRequest"
import { WeightFilter } from "./Entities"

const WEIGHT_DASHBOARD = "weight/dashboard/"
const WEIGHT_INFO = "weight/info/"

export function getYearWeightGain() {
    return apiGet(WEIGHT_DASHBOARD + "year-gain")
}

export function getYearWeight() {
    return apiGet(WEIGHT_DASHBOARD + "year-weight")
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

export function getBestFathers() {
    return apiGet(WEIGHT_DASHBOARD + "best-fathers")
}

export function getBestMothers() {
    return apiGet(WEIGHT_DASHBOARD + "best-mothers")
}

export function findGroups() {
    return apiGet(WEIGHT_INFO + "groups")
}

export function findGroupsByDate(entryDate: Date) {
    return apiGet(WEIGHT_DASHBOARD + `groups/${entryDate.toISOString()}/entries`)
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
