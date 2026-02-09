import { apiDelete, apiGet, apiPost, apiPut, buildFilterParams, buildPageParams } from "@/utils/ApiRequest"
import { LactationGroupFilter, LactationGroupSave, MilkEntrySave } from "./Entities"
import { dateToISO } from "@/utils/Transformations"

export const STATS_BASE = "milk/stats/"
export const GROUP_BASE = "milk/groups/"
export const MILK_BASE = "milk/"

export function getLastEntries() {
    return apiGet(STATS_BASE + "last-entries")
}

export function getLastGroups() {
    return apiGet(STATS_BASE + "last-groups")
}

export function getMilkProduction() {
    return apiGet(STATS_BASE + "milk-production")
}

export function getYearProduction() {
    return apiGet(STATS_BASE + "year-milk")
}

export function getYearAverage() {
    return apiGet(STATS_BASE + "year-avg-milk")
}

export function getLastMilk() {
    return apiGet(STATS_BASE + "last-milk")
}

export function getLastAverageMilk() {
    return apiGet(STATS_BASE + "last-avg-milk")
}

export function findGroupsPage(filter: LactationGroupFilter, order: string, cursor?: string) {
    const params = buildPageParams("?", "entry_date", order, filter, cursor)
    return apiGet(GROUP_BASE + "page" + params)
}

export function getGroupEntries(entryDate: Date) {
    const pageQuery = `${dateToISO(entryDate)}/entries`
    return apiGet(GROUP_BASE + pageQuery)
}

export function getGroupEntriesFoot(entryDate: Date) {
    const pageQuery = `${dateToISO(entryDate)}/entries/foot`
    return apiGet(GROUP_BASE + pageQuery)
}

export function updateMilkGroup(group: LactationGroupSave) {
    return apiPut(GROUP_BASE, group)
}

export function deleteMilkGroup(entryDate: Date) {
    return apiDelete(GROUP_BASE + `${dateToISO(entryDate)}`)
}

export function findEntriesPage(
    filter: LactationGroupFilter,
    sort: string,
    order: string,
    cursor?: string,
) {
    const params = buildPageParams("?", sort, order, filter, cursor)
    return apiGet(MILK_BASE + "page" + params)
}

export function getEntriesPageFoot(filter: LactationGroupFilter) {
    const params = buildFilterParams(filter, '?')
    return apiGet(MILK_BASE + "page/foot" + params)
}

export function updateMilkEntry(entry: MilkEntrySave) {
    return apiPut(MILK_BASE, entry)
}

export function addMilkEntry(entry: MilkEntrySave) {
    return apiPost(MILK_BASE, entry)
}

export function deleteMilkEntry(id: string) {
    return apiDelete(MILK_BASE + id)
}
