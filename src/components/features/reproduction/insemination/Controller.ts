import { apiDelete, apiGet, apiPost, apiPut, buildPageCall } from "@utils/ApiRequest"
import { InseminationEntryFilter, InseminationEntrySave, InseminationGroup } from "./Entities"
import { dateToISO } from "@utils/Transformations"

const DASHBOARD_BASE = 'reproduction/insemination/dashboard/'
const GROUP_BASE = 'reproduction/insemination/groups/'
const ENTRY_BASE = 'reproduction/insemination/entries/'
const BULLS_BASE = 'reproduction/insemination/bulls/'

export function getBirthRateStats() {
    return apiGet(DASHBOARD_BASE + 'birth-rate')
}

export function getPregnancyRateStats() {
    return apiGet(DASHBOARD_BASE + 'pregnancy-rate')
}

export function getAnimalsNumber() {
    return apiGet(DASHBOARD_BASE + 'animals-number')
}

export function getFutureBirths() {
    return apiGet(DASHBOARD_BASE + 'future-births')
}

export function getInseminationHist() {
    return apiGet(DASHBOARD_BASE + 'insemination-hist')
}

export function getBestBulls() {
    return apiGet(DASHBOARD_BASE + 'best-bull')
}

export function getLastGroups() {
    return apiGet(DASHBOARD_BASE + 'last-groups')
}

export function getLastEntries() {
    return apiGet(DASHBOARD_BASE + 'last-entries')
}

export function findEntriesPage(
    filter: InseminationEntryFilter,
    sort: string,
    order: string,
    cursor?: string,
) {
    const pageQuery = buildPageCall(sort, order, cursor)
    return apiPost(ENTRY_BASE + pageQuery, filter)
}

export function getEntriesFoot(filter: InseminationEntryFilter) {
    return apiPost(ENTRY_BASE + "page/foot", filter)
}

export function findGroups() {
    return apiGet(GROUP_BASE + "page")
}

    export function findEntriesByGroup(inseminationDate: Date) {
    const query = GROUP_BASE  + `${inseminationDate.toISOString()}/entries`
    return apiGet(query)
}

export function getEntriesByGroupFoot(inseminationDate: Date) {
    return apiGet(GROUP_BASE  + `${inseminationDate.toISOString()}/entries/foot`)
}

export function searchInseminationBulls() {
    return apiGet(BULLS_BASE  + "search")
}

export function addInsemination(entry: InseminationEntrySave) {
    return apiPut(ENTRY_BASE + "add", entry)
}

export function deleteInsemination(id: string) {
    return apiDelete(ENTRY_BASE + `${id}/delete`)
}

export function deleteNoValidate(id: string) {
    return apiDelete(ENTRY_BASE + `${id}/delete-no-validation`)
}

export function deleteAndChangeFather(id: string) {
    return apiDelete(ENTRY_BASE + `${id}/delete-change-father`)
}

export function replaceInsemination(entry: InseminationEntrySave) {
    return apiPut(ENTRY_BASE + "replace", entry)
}

export function updateInsemination(entry: InseminationEntrySave) {
    return apiPut(ENTRY_BASE + "update", entry)
}

export function updateNoValidation(entry: InseminationEntrySave) {
    return apiPut(ENTRY_BASE + "update-no-validation", entry)
}

export function updateBatch(inseminationDate: Date, group: InseminationGroup) {
    return apiPut(GROUP_BASE + dateToISO(inseminationDate) + "/update", group)
}

export function deleteBatch(inseminationDate: Date) {
    return apiDelete(GROUP_BASE + dateToISO(inseminationDate) + "delete")
}

export function searchNonInseminationBulls() {
    return apiGet(BULLS_BASE + "search-non-insemination")
}

export function setAsInseminationBull(id: string) {
    return apiGet(BULLS_BASE + `add/${id}`)
}
