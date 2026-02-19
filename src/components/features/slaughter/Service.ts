import { apiDelete, apiGet, apiPost, apiPut, buildFilterParams, buildPageParams } from "@utils/ApiRequest"
import { SlaughterFilter, SlaughterSave } from "./Entities"

const SLAUGHTER_STATS = 'slaughter/stats/'
const SLAUGHTER_GROUP = 'slaughter/groups/'
const SLAUGHTER_ENTRIES = 'slaughter'
const SLAUGHTER_BUTCHER = 'slaughter/butcher/'

export function getLastDeadWeight() {
    return apiGet(SLAUGHTER_STATS + "last-dead-weight")
}

export function getLastAverageWeight() {
    return apiGet(SLAUGHTER_STATS + "last-weight")
}

export function getLastPerformance() {
    return apiGet(SLAUGHTER_STATS + "last-performance")
}

export function getWeightHist() {
    return apiGet(SLAUGHTER_STATS + "weight-hist")
}

export function getRateHist() {
    return apiGet(SLAUGHTER_STATS + "rate-hist")
}

export function getBestRatings(rating: string) {
    return apiGet(SLAUGHTER_STATS + rating)
}

export function getLastSlaughter() {
    return apiGet(SLAUGHTER_STATS + "last-entries")
}

export function getLastGroups() {
    return apiGet(SLAUGHTER_STATS + "last-groups")
}

export function findEntriesPage(
    filter: SlaughterFilter,
    sort: string,
    order: string,
    cursor?: string,
) {
    const params = buildPageParams("?", sort, order, filter, cursor)
    return apiGet(SLAUGHTER_ENTRIES + "/page" + params)
}

export function getEntriesPageFoot(filter: SlaughterFilter) {
    const params = buildFilterParams(filter, "?")
    return apiGet(SLAUGHTER_ENTRIES + "/page/foot" + params)
}

export function findEntries(filter: SlaughterFilter, sort: string = "animal_order", order: string = "asc") {
    const params = buildFilterParams(filter, "&")
    return apiGet(SLAUGHTER_ENTRIES + `/entries?sort=${sort}&order=${order}` + params)
}

export function getEntriesFoot(filter: SlaughterFilter) {
    const params = buildFilterParams(filter, "?")
    return apiGet(SLAUGHTER_ENTRIES + `/entries/foot` + params)
}

export function deleteSlaughter(id: string) {
    return apiDelete(SLAUGHTER_ENTRIES + `/${id}`)
}

export function updateSlaughter(entry: SlaughterSave) {
    return apiPut(SLAUGHTER_ENTRIES, entry)
}

export function addSlaughter(entry: SlaughterSave) {
    return apiPost(SLAUGHTER_ENTRIES, entry)
}

export function updateSlaughterBatch(entries: SlaughterSave[]) {
    return apiPut(SLAUGHTER_ENTRIES + "/batch", entries)
}

export function deleteSlaughterBatch(ids: string[]) {
    return apiDelete(SLAUGHTER_ENTRIES + `/batch?ids=${ids}`)
}

export function findGroups(order: string) {
    return apiGet(SLAUGHTER_GROUP + `page?order=${order}`)
}

export function findButchersEntries(
    id: string,
    filter: SlaughterFilter,
    sort: string,
    order: string,
    cursor?: string,
) {
    const params = buildPageParams("?", sort, order, filter, cursor)
    return apiGet(SLAUGHTER_BUTCHER + `${id}/page` + params)
}

export function findButcherEntriesFoot(id: string, filter: SlaughterFilter) {
    const params = buildFilterParams(filter, "?")
    return apiGet(SLAUGHTER_BUTCHER + `${id}/page/foot` + params)
}
