import { apiGet, apiPost, buildPageCall } from "@/util/ApiRequest"
import { SlaughterEntryFilter } from "./Entities"

const SLAUGHTER_DASHBOARD = 'slaughter/dashboard/'
const SLAUGHTER_INFO = 'slaughter/info/'
const SLAUGHTER_SEARCH = 'slaughter/search/'


export function getLastDeadWeight() {
    return apiGet(SLAUGHTER_DASHBOARD + "last-dead-weight")
}

export function getLastAverageWeight() {
    return apiGet(SLAUGHTER_DASHBOARD + "last-weight")
}

export function getLastPerformance() {
    return apiGet(SLAUGHTER_DASHBOARD + "last-performance")
}

export function getWeightHist() {
    return apiGet(SLAUGHTER_DASHBOARD + "weight-hist")
}

export function getRateHist() {
    return apiGet(SLAUGHTER_DASHBOARD + "rate-hist")
}

export function getBestRatings(rating: string) {
    return apiGet(SLAUGHTER_DASHBOARD + rating)
}

export function getLastEntries() {
    return apiGet(SLAUGHTER_DASHBOARD + "last-entries")
}

export function getLastGroups() {
    return apiGet(SLAUGHTER_DASHBOARD + "last-groups")
}

export function findEntriesPage(
    filter: SlaughterEntryFilter,
    sort: string,
    order: string,
    cursor?: string,
) {
    const pageCall = buildPageCall(sort, order, cursor)
    return apiPost(SLAUGHTER_INFO + `entries/${pageCall}`, filter)
}

export function getEntriesPageFoot(filter: SlaughterEntryFilter) {
    return apiPost(SLAUGHTER_INFO + "entries/page/foot", filter)
}

export function findGroups(order: string) {
    return apiGet(SLAUGHTER_INFO + `groups?order=${order}`)
}

export function findEntriesByDate(entryDate: Date, sort: string, order: string) {
    return apiGet(SLAUGHTER_INFO + `groups/${entryDate.toISOString()}/entries?sort=${sort}&order=${order}`)
}

export function getEntriesByDateFoot(entryDate: Date) {
    return apiGet(SLAUGHTER_INFO + `groups/${entryDate.toISOString()}/entries/foot`)
}

export function searchSlaughterhouses() {
    return apiGet(SLAUGHTER_SEARCH + "/slaughterhouses")
}
