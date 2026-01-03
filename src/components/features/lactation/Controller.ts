import { apiDelete, apiGet, apiPost, apiPut, buildPageCall } from "@utils/ApiRequest"
import { 
    AddLactationStruct,  
    LactationGroupFilter, 
    LactationHist, 
    MilkEntrySave, 
    LactationGroupSave
} from "./Entities";
import { dateToISO } from "@/utils/Transformations";

export const DASHBOARD_BASE = "lactation/dashboard/"
export const GROUP_BASE = "lactation/groups/"
export const ENTRIES_BASE = "lactation/entries/"
export const LAC_BASE = "lactation/lac-hist/"

export function getLastMilk() {
    return apiGet(DASHBOARD_BASE + "last-milk")
}

export function getLastAverageMilk() {
    return apiGet(DASHBOARD_BASE + "last-avg-milk")
}

export function getLastCount() {
    return apiGet(DASHBOARD_BASE + "last-count")
}

export function getRankedAnimals(rankBy: string) {
    return apiGet(DASHBOARD_BASE + rankBy)
}

export function getLastLac() {
    return apiGet(DASHBOARD_BASE + "last-entries")
}

export function getMilkProduction() {
    return apiGet(DASHBOARD_BASE + "milk-production")
}

export function getYearProduction() {
    return apiGet(DASHBOARD_BASE + "year-milk")
}

export function getYearAverage() {
    return apiGet(DASHBOARD_BASE + "year-avg-milk")
}

export function getParentRatings(ratingOption: string) {
    return apiGet(DASHBOARD_BASE + ratingOption)
}

export function getLastGroups() {
    return apiGet(DASHBOARD_BASE + "last-groups")
}

export function findLactationsPage(
    filter: LactationGroupFilter,
    sort: string,
    order: string,
    cursor?: string,
) {
    const pageQuery = `page?order=${order}&sort=${sort}${cursor ? `&cursor=${cursor}` : ''}`
    return apiPost(LAC_BASE + pageQuery, filter)
}

export function findLactationById(id: string) {
    return apiGet(LAC_BASE + id)
}

export function getLactationsPageFoot(filter: LactationGroupFilter) {
    return apiPost(LAC_BASE + "page/foot", filter)
}

export function getLactationEntries(lacId: string) {
    return apiGet(LAC_BASE + `${lacId}/entries`)
}

export function getLactationEntriesFoot(lacId: string) {
    return apiGet(LAC_BASE + `${lacId}/entries/foot`)
}

export function searchAllPastures() {
    return apiGet("farm-area/pastures/search-all")
}

export function searchLactating() {
    return apiGet(LAC_BASE + "search-lactating")
}

export function searchDryAnimals() {
    return apiGet(LAC_BASE + "search-dry")
}

export function searchCalfs() {
    return apiGet(LAC_BASE + "search-calfs")
}

export function updateEndDate(data: AddLactationStruct) {
    return apiPut(LAC_BASE + `end-lac`, data)
}

export function updateLactation(data: LactationHist) {
    return apiPut(LAC_BASE + "update", data)
}

export function deleteLactation(id: string) {
    return apiDelete(LAC_BASE + `delete/${id}`)
}

export function addLactation(entry: AddLactationStruct) {
    return apiPut(LAC_BASE + "add", entry)
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
