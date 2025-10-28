import { apiGet, apiPost, buildPageCall } from "@/util/ApiRequest"
import { TransferEntryFilter } from "./Entities"

const DASHBOARD_BASE = 'reproduction/embryo-transfer/dashboard/'
const GROUP_BASE = 'reproduction/embryo-transfer/groups/'
const ENTRY_BASE = 'reproduction/embryo-transfer/entries/'
const BULLS_BASE = 'reproduction/embryo-transfer/bulls/'

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

export function findEntriesByGroup(inseminationDate: Date) {
    const query = GROUP_BASE + `${inseminationDate.toISOString()}/entries`
    return apiGet(query)
}

export function getEntriesByGroupFoot(inseminationDate: Date) {
    return apiGet(GROUP_BASE + `${inseminationDate.toISOString()}/entries/foot`)
}

export function searchInseminationBulls(input?: string) {
    return apiGet(BULLS_BASE + `search?input=${input}`)
}
