import { apiDelete, apiGet, apiPost, apiPut, buildPageCall } from "@utils/ApiRequest"
import { EmbryoTransferSave, TransferEntryFilter, TransferGroup } from "./Entities"
import { dateToISO } from "@utils/Transformations"

const DASHBOARD_BASE = 'reproduction/embryo-transfer/dashboard/'
const GROUP_BASE = 'reproduction/embryo-transfer/groups/'
const ENTRY_BASE = 'reproduction/embryo-transfer/entries/'
const BULLS_BASE = 'reproduction/embryo-transfer/bulls/'
const DONORS_BASE = 'reproduction/embryo-transfer/donors/'

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

export function getBestRanking(ranking: string) {
    return apiGet(DASHBOARD_BASE + ranking)
}

export function getLastGroups() {
    return apiGet(DASHBOARD_BASE + 'last-groups')
}

export function getLastEntries() {
    return apiGet(DASHBOARD_BASE + 'last-entries')
}

export function findEntriesPage(
    filter: TransferEntryFilter,
    sort: string,
    order: string,
    cursor?: string,
) {
    const pageQuery = buildPageCall(sort, order, cursor)
    return apiPost(ENTRY_BASE + pageQuery, filter)
}

export function getEntriesPage(filter: TransferEntryFilter) {
    return apiPost(ENTRY_BASE + "page/foot", filter)
}

export function findGroups() {
    return apiGet(GROUP_BASE + "page")
}

export function findEntriesByGroup(transferDate: Date) {
    const query = GROUP_BASE + `${transferDate.toISOString()}/entries`
    return apiGet(query)
}

export function getEntriesByGroupFoot(transferDate: Date) {
    return apiGet(GROUP_BASE + `${transferDate.toISOString()}/entries/foot`)
}

export function updateGroup(transferDate: Date, entry: TransferGroup) {
    return apiPut(GROUP_BASE + `${dateToISO(transferDate)}/update`, entry)
}

export function deleteGroup(transferDate: Date) {
    return apiDelete(GROUP_BASE + `${dateToISO(transferDate)}/delete`)
}

export function searchTransferBulls() {
    return apiGet(BULLS_BASE + "search")
}

export function searchNonTransferBulls() {
    return apiGet(BULLS_BASE + "search-non-transfer")
}

export function updateAsTransferBull(id: string) {
    return apiPut(BULLS_BASE + `${id}/add`)
}

export function searchEmbryoDonors() {
    return apiGet(DONORS_BASE + "search")
}

export function searchNonEmbryoDonors() {
    return apiGet(DONORS_BASE + "search-non-donors")
}

export function updateAsEmbryoDonor(id: string) {
    return apiGet(DONORS_BASE + `${id}/add`)
}

export function addTransfer(entry: EmbryoTransferSave) {
    return apiPut(ENTRY_BASE + "add", entry)
}

export function replace(entry: EmbryoTransferSave) {
    return apiPut(ENTRY_BASE + "replace", entry)
}

export function updateTransfer(entry: EmbryoTransferSave) {
    return apiPut(ENTRY_BASE + "update", entry)
}

export function deleteTransfer(id: string) {
    return apiDelete(ENTRY_BASE + `${id}/delete`)
}

