import { apiGet, apiPost, buildPageCall } from "@/util/ApiRequest"
import { SlaughterEntryFilter } from "./Entities"

const SLAUGHTER_DASHBOARD = 'slaughter/dashboard/'
const SLAUGHTER_INFO = 'slaughter/info/'

export function getLastAverageWeight() {
    return apiGet(SLAUGHTER_DASHBOARD + "last-weight")
}

export function getLastPerformance() {
    return apiGet(SLAUGHTER_DASHBOARD + "last-performance")
}

export function getSlaughterGraph() {
    return apiGet(SLAUGHTER_DASHBOARD + "slaughter-graph")
}

export function getBestFathers() {
    return apiGet(SLAUGHTER_DASHBOARD + "best-fathers")
}

export function getBestMothers() {
    return apiGet(SLAUGHTER_DASHBOARD + "best-mothers")
}

export function getBestSlaughterhouses() {
    return apiGet(SLAUGHTER_DASHBOARD + "best-slaughterhouses")
}

export function getLastEntries() {
    return apiGet(SLAUGHTER_DASHBOARD + "last-entries")
}

export function getLastGroup() {
    return apiGet(SLAUGHTER_DASHBOARD + "last-group")
}

export function findEntriesPage(
    filter: SlaughterEntryFilter,
    sort: string,
    order: string,
    cursor?: string,
) {
    const pageCall = buildPageCall(sort, order, cursor)
    return apiPost(SLAUGHTER_INFO + `entries/page${pageCall}`, filter)
}

export function findGroups() {
    return apiGet(SLAUGHTER_INFO + "groups")
}

export function findEntriesByDate(entryDate: Date) {
    return apiGet(SLAUGHTER_DASHBOARD + `groups/${entryDate.toISOString()}/entries`)
}
