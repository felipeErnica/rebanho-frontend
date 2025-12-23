import { apiPost, apiPut } from "@utils/ApiRequest"
import { PastureEntriesFilter, PastureEntrySave } from "./Entities"

const ENTRIES_BASE = `farm-area/pastures/entries/`

export function findPastureEntries(
    pastureId: string,
    filter: PastureEntriesFilter,
    sort: string,
    order: string,
    cursor?: string,
) {
    const cursorQuery = `${cursor ? `&cursor=${cursor}` : ''}`
    const query = `farm-area/pastures/${pastureId}/entries?sort=${sort}&order=${order}` + cursorQuery
    return apiPost(query, filter)
}

export function findPastureEntriesTotal(pastureId: string, filter: PastureEntriesFilter) {
    const query = `farm-area/pastures/${pastureId}/entries/total`
    return apiPost(query, filter)
}

export function addPastureEntry(entry: PastureEntrySave) {
    return apiPut(ENTRIES_BASE + "add", entry)
}

export function transferPastureEntry(entry: PastureEntrySave) {
    return apiPut(ENTRIES_BASE + "transfer", entry)
}
