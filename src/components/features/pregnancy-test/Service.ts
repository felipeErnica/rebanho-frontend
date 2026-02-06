import { apiDelete, apiGet, apiPost, apiPut, buildFilterParams, buildPageParams } from "@utils/ApiRequest";
import { TestEntryFilter, TestEntrySave, TestGroupSave } from "./Entities";
import { dateToISO } from "@utils/Transformations";

const STATS_BASE = "pregnancy-test/stats/"
const ENTRIES_BASE = "pregnancy-test/"
const GROUP_BASE = "pregnancy-test/group/"

export function getPregnancyRate() {
    return apiGet(STATS_BASE + "pregnancy-rate")
}

export function getAnimalsNumber() {
    return apiGet(STATS_BASE + "animals-number")
}

export function getBirthRate() {
    return apiGet(STATS_BASE + "birth-rate")
}

export function getTestHist() {
    return apiGet(STATS_BASE + "test-hist")
}

export function getLastGroups() {
    return apiGet(STATS_BASE + "last-groups")
}

export function getLastEntries() {
    return apiGet(STATS_BASE + "last-entries")
}

export function getNextBirths() {
    return apiGet(STATS_BASE + "next-births")
}

export function getRankedResults(rankBy: string) {
    return apiGet(STATS_BASE + `ranked-results?rankBy=${rankBy}`)
}

export function findEntriesPage(
    filter: TestEntryFilter,
    sort: string,
    order: string,
    cursor?: string
) {
    const pageQuery = buildPageParams("?", sort, order, filter, cursor)
    return apiGet(ENTRIES_BASE + "page" + pageQuery)
}

export function getEntriesFoot(filter: TestEntryFilter) {
    const params = buildFilterParams(filter, "?")
    return apiGet(ENTRIES_BASE + "page/foot" + params)
}

export function findGroups() {
    return apiGet(GROUP_BASE + "page")
}

export function findEntriesByGroup(testDate: Date, sort: string, order: string) {
    return apiGet(GROUP_BASE + dateToISO(testDate) + `/entries?sort=${sort}&order=${order}`)
}

export function getEntriesByGroupFoot(testDate: Date) {
    return apiGet(GROUP_BASE + dateToISO(testDate) + "/entries/foot")
}

export function addTest(entry: TestEntrySave) {
    return apiPost(ENTRIES_BASE, entry)
}

export function updateTest(entry: TestEntrySave) {
    return apiPut(ENTRIES_BASE, entry)
}

export function deleteTest(id: string) {
    return apiDelete(ENTRIES_BASE + id)
}

export function updateBatch(group: TestGroupSave) {
    return apiPut(GROUP_BASE, group)
}

export function deleteBatch(testDate: Date) {
    return apiDelete(GROUP_BASE + dateToISO(testDate))
}
