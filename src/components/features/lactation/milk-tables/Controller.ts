import { apiDelete, apiGet, apiPost, apiPut, buildPageCall } from "@/utils/ApiRequest"
import { LactationGroupFilter, LactationGroupSave, MilkEntrySave } from "./Entities"
import { dateToISO } from "@/utils/Transformations"

export const GROUP_BASE = "lactation/groups/"
export const ENTRIES_BASE = "lactation/entries/"
export const LAC_BASE = "lactation/lac-hist/"

export function getLactationEntries(lacId: string) {
    return apiGet(LAC_BASE + `${lacId}/entries`)
}

export function getLactationEntriesFoot(lacId: string) {
    return apiGet(LAC_BASE + `${lacId}/entries/foot`)
}

export function findGroupsPage(filter: LactationGroupFilter, order: string, cursor?: string) {
    const pageQuery = `page?order=${order}${cursor ? `&cursor=${cursor}` : ''}`
    return apiPost(GROUP_BASE + pageQuery, filter)
}

export function getGroupEntries(entryDate: Date) {
    const pageQuery = `${dateToISO(entryDate)}/entries`
    return apiGet(GROUP_BASE + pageQuery)
}

export function getGroupEntriesFoot(entryDate: Date) {
    const pageQuery = `${dateToISO(entryDate)}/entries/foot`
    return apiGet(GROUP_BASE + pageQuery)
}

export function updateMilkGroup(entryDate: Date, group: LactationGroupSave) {
    const pageQuery = `${dateToISO(entryDate)}/update`
    return apiPut(GROUP_BASE + pageQuery, group)
}

export function deleteMilkGroup(entryDate: Date) {
    return apiDelete(GROUP_BASE + `${dateToISO(entryDate)}/delete`)
}

export function findEntriesPage(
    filter: LactationGroupFilter,
    sort: string,
    order: string,
    cursor?: string,
) {
    const pageQuery = buildPageCall(sort, order, cursor)
    return apiPost(ENTRIES_BASE + pageQuery, filter)
}

export function getEntriesPageFoot(filter: LactationGroupFilter) {
    return apiPost(ENTRIES_BASE + "page/foot", filter)
}

export function updateMilkEntry(entry: MilkEntrySave) {
    return apiPut(ENTRIES_BASE + `update`, entry)
}

export function replaceMilkEntry(entry: MilkEntrySave) {
    return apiPut(ENTRIES_BASE + "replace", entry)
}

export function addMilkEntry(entry: MilkEntrySave) {
    return apiPut(ENTRIES_BASE + "add", entry)
}

export function addMilkAndTransferPasture(entry: MilkEntrySave) {
    return apiPut(ENTRIES_BASE + "add-and-transfer", entry)
}

export function addMilkNoTransfer(entry: MilkEntrySave) {
    return apiPut(ENTRIES_BASE + "add-no-transfer", entry)
}

export function deleteMilkEntry(id: string) {
    return apiDelete(ENTRIES_BASE + `${id}/delete`)
}

export function searchAllPastures() {
    return apiGet("farm-area/pastures/search-all")
}
