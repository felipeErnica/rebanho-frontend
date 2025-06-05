import { ApiResponse } from "@/types/ApiResponse";
import { apiPost, basePageCall } from "@/util/ApiRequest";
import { AnimalFilter } from "./AnimalInfo";
import { AnimalDashboardFilter } from "./AnimalDashboard";

const BASE_INFO = 'animals/info/'
const BASE_DASHBOARD = 'animals/dashboard/'

export async function findPage(sort: string, order: string, cursor: string, filter: AnimalFilter): Promise<ApiResponse> {
    const apiCall = `${BASE_INFO}` + basePageCall(sort, order, cursor)
    const response = await apiPost<AnimalFilter>(apiCall, filter)
    return response;
}

export async function getTotalAnimals(filter: AnimalDashboardFilter): Promise<ApiResponse> {
    const apiCall = BASE_DASHBOARD + "total-general"
    const response = await apiPost(apiCall, filter)
    return response
}

export async function getGroupByAgeFarm(filter: AnimalDashboardFilter): Promise<ApiResponse> {
    filter = {...filter, isFiltered: true, isActive: true}
    const apiCall = BASE_DASHBOARD + "group-age-farm"
    const response = await apiPost(apiCall, filter)
    return response
}

export async function getGroupByAge(filter: AnimalDashboardFilter): Promise<ApiResponse> {
    filter = {...filter, isFiltered: true, isActive: true}
    const apiCall = BASE_DASHBOARD + "group-age"
    const response = await apiPost(apiCall, filter)
    return response
}

export async function getTotalByType(filter: AnimalDashboardFilter): Promise<ApiResponse> {
    filter = {...filter, isFiltered: true, isActive: true}
    const apiCall = BASE_DASHBOARD + "types"
    const response = await apiPost(apiCall, filter)
    return response
}
