import { apiGet, apiPost, buildPageCall } from "@/util/ApiRequest";
import { TestEntryFilter } from "./Entities";

const DASHBOARD_BASE = "reproduction/pregnancy-test/dashboard/"
const ENTRIES_BASE = "reproduction/pregnancy-test/entries/"
const GROUP_BASE = "reproduction/pregnancy-test/group/"

export function getPregnancyRate() {
    return apiGet(DASHBOARD_BASE + "pregnancy-rate")
}

export function getAnimalsNumber() {
    return apiGet(DASHBOARD_BASE + "animals-number")
}

export function getBirthRate() {
    return apiGet(DASHBOARD_BASE + "birth-rate")
}

export function getTestHist() {
    return apiGet(DASHBOARD_BASE + "test-hist")
}

export function getLastGroups() {
    return apiGet(DASHBOARD_BASE + "last-groups")
}

export function getLastEntries() {
    return apiGet(DASHBOARD_BASE + "last-entries")
}

export function getNextBirths() {
    return apiGet(DASHBOARD_BASE + "next-births")
}

export function getRankedResults(rankBy: string) {
    return apiGet(DASHBOARD_BASE + `ranked-results?rankBy=${rankBy}`)
}

export function findEntriesPage(
    filter: TestEntryFilter,
    sort: string,
    order: string,
    cursor?: string
) {
    const pageQuery = buildPageCall(sort, order, cursor)
    return apiPost(ENTRIES_BASE + pageQuery, filter)
}

export function getEntriesFoot(filter: TestEntryFilter) {
    return apiPost(ENTRIES_BASE + "page/foot", filter)
}

export function findGroups() {
    return apiGet(GROUP_BASE + "page")
}

export function findEntriesByGroup(testDate: Date, sort: string, order: string) {
    return apiGet(GROUP_BASE + testDate.toISOString() + `/entries?sort=${sort}&order=${order}`)
}

export function getEntriesByGroupFoot(testDate: Date) {
    return apiGet(GROUP_BASE + testDate.toISOString() + "/entries/foot")
}
