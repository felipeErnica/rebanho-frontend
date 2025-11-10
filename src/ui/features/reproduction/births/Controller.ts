import { ApiResponse } from "@/shared/entities/ApiResponse";
import { apiGet, apiPost } from "@/util/ApiRequest";
import { BirthEntry, BirthEntryFilter } from "./Entities";
import { Page } from "@/shared/entities/Page";

const BIRTH_DASHBOARD_BASE = "reproduction/births/dashboard/"
const BIRTH_TABLE_BASE = "reproduction/births/table/"

export function getBirthsBySex(): Promise<ApiResponse> {
    return apiGet(BIRTH_DASHBOARD_BASE + "total-sex")
}

export function getBirthStats(): Promise<ApiResponse> {
    return apiGet(BIRTH_DASHBOARD_BASE + "birth-stats")
}

export function getDeathIndex(): Promise<ApiResponse> {
    return apiGet(BIRTH_DASHBOARD_BASE + "death-index")
}

export function getBirthIntervalStats(): Promise<ApiResponse> {
    return apiGet(BIRTH_DASHBOARD_BASE + "interval-stats")
}

export function getLastBirths(): Promise<ApiResponse> {
    return apiGet(BIRTH_DASHBOARD_BASE + "last-births")
}

export function getLastBirthsNumber(): Promise<ApiResponse> {
    return apiGet(BIRTH_DASHBOARD_BASE + "births-number")
}

export function getYearBirthsNumber(): Promise<ApiResponse> {
    return apiGet(BIRTH_DASHBOARD_BASE + "year-births")
}

export function getYearDeathsNumber(): Promise<ApiResponse> {
    return apiGet(BIRTH_DASHBOARD_BASE + "year-deaths")
}

export function getYearBirthsSex(): Promise<ApiResponse> {
    return apiGet(BIRTH_DASHBOARD_BASE + "year-sex")
}

export function getIntervalsRanking(rankBy: string): Promise<ApiResponse> {
    return apiGet(BIRTH_DASHBOARD_BASE + rankBy)
}

export function getBirthHistory(): Promise<ApiResponse> {
    return apiGet(BIRTH_DASHBOARD_BASE + "birth-history")
}

export function findBirthsPage(
    sort: string, 
    order: string, 
    filter: BirthEntryFilter, 
    cursor?: string
): Promise<Page<BirthEntry>> {
    const cursorQuery = cursor ? `&cursor=${cursor}` : ''
    const query = BIRTH_TABLE_BASE + `page?sort=${sort}&order=${order}` + cursorQuery
    return apiPost(query, filter)
}

export function findBirthsPageFooter(filter: BirthEntryFilter): Promise<ApiResponse> {
    return apiPost(BIRTH_TABLE_BASE + "page/footer", filter)
}
