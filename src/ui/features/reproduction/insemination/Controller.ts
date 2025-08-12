import { apiGet, apiPost, buildPageCall } from "@/util/ApiRequest"
import { InseminationEntryFilter } from "./Entities"

const DASHBOARD_BASE = 'reproduction/insemination/dashboard/'
const GROUP_BASE = 'reproduction/insemination/groups/'
const ENTRY_BASE = 'reproduction/insemination/entries/'

export function getBirthRateStats() {
    return apiGet(DASHBOARD_BASE + 'birth-rate')
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

export function findGroups() {
    return apiGet(GROUP_BASE + "page")
}

export function getGroupsFooter() {
    return apiGet(GROUP_BASE + "page/foot")
}

export function findEntriesByGroup(groupId: string) {
    return apiGet(GROUP_BASE  + `${groupId}/entries`)
}

export function getEntriesByGroupFoot(groupId: string) {
    return apiGet(GROUP_BASE  + `${groupId}/entries/foot`)
}
