import { apiDelete, apiGet, apiPost, apiPut, buildPageCall } from "@utils/ApiRequest"
import { SlaughterEntryFilter, SlaughterEntrySave, ButcherSave } from "./Entities"
import { dateToISO } from "@/utils/Transformations"

const SLAUGHTER_DASHBOARD = 'slaughter/dashboard/'
const SLAUGHTER_ENTRIES = 'slaughter/entries/'
const SLAUGHTER_GROUP = 'slaughter/groups/'
const BUTCHER = 'slaughter/butchers/'


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
    return apiPost(SLAUGHTER_ENTRIES + pageCall, filter)
}

export function getEntriesPageFoot(filter: SlaughterEntryFilter) {
    return apiPost(SLAUGHTER_ENTRIES + "page/foot", filter)
}

export function deleteSlaughter(id: string) {
    return apiDelete(SLAUGHTER_ENTRIES + `${id}/delete`)
}

export function updateSlaughter(entry: SlaughterEntrySave) {
    return apiPut(SLAUGHTER_ENTRIES + "update", entry)
}

export function addSlaughter(entry: SlaughterEntrySave) {
    return apiPut(SLAUGHTER_ENTRIES + "add", entry)
}

export function replaceSlaughter(entry: SlaughterEntrySave) {
    return apiPut(SLAUGHTER_ENTRIES + "replace", entry)
}

export function deleteButcher(id: string) {
    return apiDelete(BUTCHER + `${id}/delete`)
}

export function updateButcher(entry: ButcherSave) {
    return apiPut(BUTCHER + "update", entry)
}

export function addButcher(entry: ButcherSave) {
    return apiPut(BUTCHER + "add", entry)
}

export function replaceButcher(entry: ButcherSave) {
    return apiPut(BUTCHER + "replace", entry)
}

export function searchButcher() {
    return apiGet(BUTCHER + "search")
}

export function findButchers() {
    return apiGet(BUTCHER + "find-all")
}

export function findButcherById(id: string) {
    return apiGet(BUTCHER + id)
}

export function findButchersEntries(
    id: string,
    filter: SlaughterEntryFilter,
    sort: string,
    order: string,
    cursor?: string,
) {
    const pageCall = buildPageCall(sort, order, cursor)
    return apiPost(BUTCHER + `${id}/entries/` + pageCall, filter)
}

export function findButcherEntriesFoot(id: string, filter: SlaughterEntryFilter) {
    return apiPost(BUTCHER + `${id}/entries/page/foot`, filter)
}

export function findGroups(order: string) {
    return apiGet(SLAUGHTER_GROUP + `page?order=${order}`)
}

export function findEntriesByDate(entryDate: Date, sort: string, order: string) {
    return apiGet(SLAUGHTER_GROUP + `${dateToISO(entryDate)}/entries?sort=${sort}&order=${order}`)
}

export function getEntriesByDateFoot(entryDate: Date) {
    return apiGet(SLAUGHTER_GROUP + `${dateToISO(entryDate)}/entries/foot`)
}
