import { apiPost } from "@/util/ApiRequest"
import { PastureEntriesFilter } from "./Entities"

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
