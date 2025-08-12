import { ApiResponse } from "@/shared/entities/ApiResponse";
import { apiGet, apiPost } from "@/util/ApiRequest";
import { BirthEntryFilter } from "./Entities";

const BIRTH_DASHBOARD_BASE = "reproduction/births/dashboard/"
const BIRTH_TABLE_BASE = "reproduction/births/table/"

export function getBirthsBySex(): Promise<ApiResponse> {
    return apiGet(BIRTH_DASHBOARD_BASE + "total-sex")
}

export function getBirthStats(): Promise<ApiResponse> {
    return apiGet(BIRTH_DASHBOARD_BASE + "birth-stats")
}

export function getBestIntervals(): Promise<ApiResponse> {
    return apiGet(BIRTH_DASHBOARD_BASE + "best-intervals")
}

export function findBirthsPage(
    sort: string, 
    order: string, 
    filter: BirthEntryFilter, 
    cursor?: string
): Promise<ApiResponse> {
    const cursorQuery = cursor ? `&cursor=${cursor}` : ''
    const query = BIRTH_TABLE_BASE + `page?sort=${sort}&order=${order}` + cursorQuery
    console.log('query: ', query)
    console.log('filter: ', filter)
    return apiPost(query, filter)
}

export function findBirthsPageFooter(filter: BirthEntryFilter): Promise<ApiResponse> {
    return apiPost(BIRTH_TABLE_BASE + "page/footer", filter)
}
