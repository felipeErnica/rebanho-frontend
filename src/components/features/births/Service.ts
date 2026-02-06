import { apiDelete, apiGet, apiPost, apiPut, buildFilterParams, buildParams, buildPageParams } from "@utils/ApiRequest";
import { BirthEntry, BirthEntryFilter, BirthEntrySave, BirthFooter } from "./Entities";
import { Page } from "@utils/Entities";

const BIRTH_STATS_BASE = "births/stats/"
const BIRTH_BASE = "births/"

export function getBirthsBySex() {
    return apiGet(BIRTH_STATS_BASE + "total-sex")
}

export function getBirthStats() {
    return apiGet(BIRTH_STATS_BASE + "birth-stats")
}

export function getDeathIndex() {
    return apiGet(BIRTH_STATS_BASE + "death-index")
}

export function getBirthIntervalStats() {
    return apiGet(BIRTH_STATS_BASE + "interval-stats")
}

export function getLastBirths() {
    return apiGet(BIRTH_STATS_BASE + "last-births")
}

export function getLastBirthsNumber() {
    return apiGet(BIRTH_STATS_BASE + "births-number")
}

export function getYearBirthsNumber() {
    return apiGet(BIRTH_STATS_BASE + "year-births")
}

export function getYearDeathsNumber() {
    return apiGet(BIRTH_STATS_BASE + "year-deaths")
}

export function getYearBirthsSex() {
    return apiGet(BIRTH_STATS_BASE + "year-sex")
}

export function getIntervalsRanking(rankBy: string) {
    return apiGet(BIRTH_STATS_BASE + rankBy)
}

export function getBirthHistory() {
    return apiGet(BIRTH_STATS_BASE + "birth-history")
}

export function getPotentialFather(motherId: string, birthDate: Date) {
    const params = buildParams({ motherId, birthDate }, "?")
    return apiGet(BIRTH_BASE + "potential-father" + params)
}

export function findBirthsPage(
    sort: string,
    order: string,
    filter: BirthEntryFilter,
    cursor?: string
): Promise<Page<BirthEntry>> {
    const params = buildPageParams("?", sort, order, filter, cursor)
    return apiGet(BIRTH_BASE + "page" + params)
}

export function findBirthsPageFooter(filter: BirthEntryFilter): Promise<BirthFooter> {
    const params = buildFilterParams(filter, "?")
    return apiGet(BIRTH_BASE + "page/foot" + params)
}

export function addBirth(entry: BirthEntrySave) {
    return apiPost(BIRTH_BASE, entry)
}

export function updateBirth(entry: BirthEntrySave) {
    return apiPut(BIRTH_BASE, entry)
}

export function deleteBirth(id: string, skipValidation: boolean) {
    return apiDelete(`animals?id=${id}&skipValidation=${skipValidation}`)
}
