import { apiDelete, apiGet, apiPost, apiPut, buildFilterParams, buildPageCall, buildPageParams } from "@utils/ApiRequest"
import { BreedingEntryDelete, BreedingEntryFilter, BreedingEntrySave, BreedingGroup } from "./Entities"
import { dateToISO } from "@utils/Transformations"
import { searchAnimal } from "@features/animals/Service"

const STATS_BASE = 'breeding/stats/'
const GROUP_BASE = 'breeding/groups/'
const BREEDING_BASE = 'breeding/'

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
    filter: BreedingEntryFilter,
    sort: string,
    order: string,
    cursor?: string,
) {
    const params = buildPageParams("?", sort, order, filter, cursor)
    return apiGet(BREEDING_BASE + "page" + params)
}

export function getEntriesFoot(filter: BreedingEntryFilter) {
    const params = buildFilterParams(filter, "?")
    return apiGet(BREEDING_BASE + "page/foot" + params)
}

export function deleteBreeding({ id, ignorePregnancy, changeFather }: BreedingEntryDelete) {
    return apiDelete(BREEDING_BASE + `${id}?ignorePregnancy=${ignorePregnancy}&changeFather=${changeFather}`)
}

export function updateBreeding(entry: BreedingEntrySave) {
    return apiPut(BREEDING_BASE, entry)
}

export function addBreeding(entry: BreedingEntrySave) {
    return apiPost(BREEDING_BASE, entry)
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
    return searchAnimal({
        isFiltered: true,
        isBreedingBull: true,
        sex: 'M',
        hasName: true
    })
}

export function searchNonBreedingBulls() {
    return searchAnimal({
        isFiltered: true,
        isBreedingBull: false,
        sex: 'M',
        hasName: true
    })
}
