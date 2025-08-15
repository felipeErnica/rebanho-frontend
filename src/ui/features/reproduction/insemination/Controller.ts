import { apiGet, apiPost, buildPageCall } from "@/util/ApiRequest"
import { InseminationEntryFilter } from "./Entities"

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

export function getPregnantsNumber() {
    return apiGet(DASHBOARD_BASE + 'pregnants-number')
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

export function getEntriesPage(filter: InseminationEntryFilter) {
    return apiPost(ENTRY_BASE + "page/foot", filter)
}

export function findGroups() {
    return apiGet(GROUP_BASE + "page")
}

export function getGroupsFooter() {
    return apiGet(GROUP_BASE + "page/foot")
}

export function findEntriesByGroup(bullId: string, inseminationDate: Date) {
    const query = GROUP_BASE  + `entries?bullId=${bullId}&inseminationDate=${inseminationDate.toISOString()}`
    return apiGet(query)
}

export function getEntriesByGroupFoot(bullId: string, inseminationDate: Date) {
    return apiGet(GROUP_BASE  + `entries/foot?bullId=${bullId}&inseminationDate=${inseminationDate.toISOString()}`)
}

export function searchInseminationBulls(input?: string) {
    return apiGet(BULLS_BASE  + `search?input=${input}`)
}

export function searchInseminationBullsById(id?: string | string[]) {
    return apiGet(BULLS_BASE  + `ids/${id}`)
}
