import { apiDelete, apiGet, apiPost, apiPut } from "@utils/ApiRequest";
import { BirthEntry, BirthEntryFilter, BirthEntrySave, BirthFooter } from "./Entities";
import { Page } from "@utils/Entities";

const BIRTH_DASHBOARD_BASE = "reproduction/births/dashboard/"
const BIRTH_TABLE_BASE = "reproduction/births/table/"
const BIRTH_BASE = "reproduction/births/"

export function getBirthsBySex() {
    return apiGet(BIRTH_DASHBOARD_BASE + "total-sex")
}

export function getBirthStats() {
    return apiGet(BIRTH_DASHBOARD_BASE + "birth-stats")
}

export function getDeathIndex() {
    return apiGet(BIRTH_DASHBOARD_BASE + "death-index")
}

export function getBirthIntervalStats() {
    return apiGet(BIRTH_DASHBOARD_BASE + "interval-stats")
}

export function getLastBirths() {
    return apiGet(BIRTH_DASHBOARD_BASE + "last-births")
}

export function getLastBirthsNumber() {
    return apiGet(BIRTH_DASHBOARD_BASE + "births-number")
}

export function getYearBirthsNumber() {
    return apiGet(BIRTH_DASHBOARD_BASE + "year-births")
}

export function getYearDeathsNumber() {
    return apiGet(BIRTH_DASHBOARD_BASE + "year-deaths")
}

export function getYearBirthsSex() {
    return apiGet(BIRTH_DASHBOARD_BASE + "year-sex")
}

export function getIntervalsRanking(rankBy: string) {
    return apiGet(BIRTH_DASHBOARD_BASE + rankBy)
}

export function getBirthHistory() {
    return apiGet(BIRTH_DASHBOARD_BASE + "birth-history")
}

export function getBirthFather(entry: BirthEntrySave) {
    return apiPost(BIRTH_BASE + "add/get-father", entry)
}


export function findBirthsPage(
    sort: string, 
    order: string, 
    filter: BirthEntryFilter, 
    cursor?: string
): Promise<Page<BirthEntry>> {
    const cursorQuery = cursor ? `&cursor=${cursor}` : ''
    const query = BIRTH_TABLE_BASE + `page?sort=${sort}&order=${order}` + cursorQuery
    return apiPost(query, filter)
}

export function findBirthsPageFooter(filter: BirthEntryFilter): Promise<BirthFooter> {
    return apiPost(BIRTH_TABLE_BASE + "page/footer", filter)
}

export function addBirth(entry: BirthEntrySave) {
    return apiPut(BIRTH_BASE + "add", entry)
}

export function addBirthNoValidation(entry: BirthEntrySave) {
    return apiPut(BIRTH_BASE + "add-no-validation", entry)
}

export function replaceBirth(entry: BirthEntrySave) {
    return apiPut(BIRTH_BASE + "replace", entry)
}

export function updateBirth(entry: BirthEntrySave) {
    return apiPut(BIRTH_BASE + "update", entry)
}

export function deleteBirth(id: string) {
    return apiDelete(`animals/delete/${id}`)
}
export function deleteBirthNoValidation(id: string) {
    return apiDelete(`animals/delete-no-validation/${id}`)
}
