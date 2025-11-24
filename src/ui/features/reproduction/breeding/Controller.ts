import { apiDelete, apiGet, apiPost, apiPut, buildPageCall } from "@/util/ApiRequest"
import { BreedingEntryFilter, BreedingEntrySave, BreedingGroup } from "./Entities"
import { dateToISO } from "@/util/Transformations"

const DASHBOARD_BASE = 'reproduction/breeding/dashboard/'
const GROUP_BASE = 'reproduction/breeding/groups/'
const ENTRY_BASE = 'reproduction/breeding/entries/'
const BULLS_BASE = 'reproduction/breeding/bulls/'

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
    filter: BreedingEntryFilter,
    sort: string,
    order: string,
    cursor?: string,
) {
    const pageQuery = buildPageCall(sort, order, cursor)
    return apiPost(ENTRY_BASE + pageQuery, filter)
}

export function getEntriesFoot(filter: BreedingEntryFilter) {
    return apiPost(ENTRY_BASE + "page/foot", filter)
}

export function deleteBreeding(id: string) {
    return apiDelete(ENTRY_BASE + `${id}/delete`)
}

export function deleteChangeFather(id: string) {
    return apiDelete(ENTRY_BASE + `${id}/delete-change-father`)
}

export function deleteNoValidation(id: string) {
    return apiDelete(ENTRY_BASE + `${id}/delete-no-validation`)
}

export function updateBreeding(entry: BreedingEntrySave) {
    return apiPut(ENTRY_BASE + "update", entry)
}

export function updateNoValidation(entry: BreedingEntrySave) {
    return apiPut(ENTRY_BASE + "update-no-validation", entry)
}

export function addBreeding(entry: BreedingEntrySave) {
    return apiPut(ENTRY_BASE + "update-no-validation", entry)
}

export function replaceBreeding(entry: BreedingEntrySave) {
    return apiPut(ENTRY_BASE + "replace", entry)
}

export function updateBatch(breedingDate: Date, group: BreedingGroup) {
    return apiPut(GROUP_BASE + `${dateToISO(breedingDate)}/update`, group)
}

export function deleteBatch(breedingDate: Date) {
    return apiDelete(GROUP_BASE + `${dateToISO(breedingDate)}/delete`)
}

export function findGroups() {
    return apiGet(GROUP_BASE + "page")
}

export function findEntriesByGroup(inseminationDate: Date) {
    const query = GROUP_BASE + `${inseminationDate.toISOString()}/entries`
    return apiGet(query)
}

export function getEntriesByGroupFoot(inseminationDate: Date) {
    return apiGet(GROUP_BASE + `${inseminationDate.toISOString()}/entries/foot`)
}

export function searchBreedingBulls() {
    return apiGet(BULLS_BASE + "search")
}
