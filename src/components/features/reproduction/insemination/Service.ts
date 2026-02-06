import { Animal, AnimalSave } from "@features/animals/Entities"
import { searchAnimal, updateAnimal } from "@features/animals/Service"
import { apiDelete, apiGet, apiPost, apiPut, buildFilterParams, buildPageParams, buildParams } from "@utils/ApiRequest"
import {
    InseminationEntryDelete,
    InseminationEntryFilter,
    InseminationEntrySave,
    InseminationGroupDelete,
    InseminationGroupSave
} from "./Entities"

const STATS_BASE = 'insemination/stats/'
const GROUP_BASE = 'insemination/groups/'
const ENTRY_BASE = 'insemination/'

export function getBirthRateStats() {
    return apiGet(STATS_BASE + 'birth-rate')
}

export function getPregnancyRateStats() {
    return apiGet(STATS_BASE + 'pregnancy-rate')
}

export function getAnimalsNumber() {
    return apiGet(STATS_BASE + 'animals-number')
}

export function getFutureBirths() {
    return apiGet(STATS_BASE + 'future-births')
}

export function getInseminationHist() {
    return apiGet(STATS_BASE + 'insemination-hist')
}

export function getBestBulls() {
    return apiGet(STATS_BASE + 'best-bull')
}

export function getLastGroups() {
    return apiGet(STATS_BASE + 'last-groups')
}

export function getLastEntries() {
    return apiGet(STATS_BASE + 'last-entries')
}

export function findEntriesPage(
    filter: InseminationEntryFilter,
    sort: string,
    order: string,
    cursor?: string,
) {
    const params = buildPageParams("?", sort, order, filter, cursor)
    return apiGet(ENTRY_BASE + "page" + params)
}

export function getEntriesFoot(filter: InseminationEntryFilter) {
    const params = buildFilterParams(filter, "?")
    return apiGet(ENTRY_BASE + "page/foot" + params)
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

export function addInsemination(entry: InseminationEntrySave) {
    return apiPost(ENTRY_BASE, entry)
}

export function deleteInsemination(paramsObj: InseminationEntryDelete) {
    const params = buildParams(paramsObj, "?")
    return apiDelete(ENTRY_BASE + params)
}

export function updateInsemination(entry: InseminationEntrySave) {
    return apiPut(ENTRY_BASE, entry)
}

export function updateBatch(entry: InseminationGroupSave) {
    return apiPut(GROUP_BASE , entry)
}

export function deleteBatch(paramsObj: InseminationGroupDelete) {
    const params = buildParams(paramsObj, "?")
    return apiDelete(GROUP_BASE + params)
}

export function setAsInseminationBull(animal: Animal) {
    const bull: AnimalSave = { ...animal, isInseminationBull: true, ignoreDead: true }
    return updateAnimal(bull)
}

export function searchNonInseminationBulls() {
    return searchAnimal({
        isFiltered: true,
        sex: 'M',
        hasName: true,
        isInseminationBull: false
    })
}

export function searchInseminationBulls() {
    return searchAnimal({
        isFiltered: true,
        isInseminationBull: true
    })
}
