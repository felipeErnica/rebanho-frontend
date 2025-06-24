import { apiPost } from "@/util/ApiRequest"
import { AnimalDashboardFilter } from "./DashboardEntities"
import { ApiResponse } from "@/shared/entities/ApiResponse"

const BASE_DASHBOARD = 'animals/dashboard/'

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

export async function getGroupByAgePasture(filter: AnimalDashboardFilter, farmId: string): Promise<ApiResponse> {
    filter = {...filter, farmId, isFiltered: true, isActive: true}
    console.log(filter)
    const apiCall = BASE_DASHBOARD + "group-pasture"
    const response = await apiPost(apiCall, filter)
    return response
}

export async function getGroupByAge(filter: AnimalDashboardFilter): Promise<ApiResponse> {
    filter = {...filter, isFiltered: true, isActive: true}
    const apiCall = BASE_DASHBOARD + "group-age"
    const response = await apiPost(apiCall, filter)
    return response
}

export async function getGroupByYear(filter: AnimalDashboardFilter, minYear: number, maxYear: number): Promise<ApiResponse> {
    filter = {...filter, maxBirthDate: undefined, minBirthDate: undefined, animalType: undefined}
    const apiCall = BASE_DASHBOARD + `group-year?from=${minYear}&to=${maxYear}`
    const response = await apiPost(apiCall, filter)
    return response
}

export async function getTotalByType(filter: AnimalDashboardFilter): Promise<ApiResponse> {
    filter = {...filter, isFiltered: true, isActive: true}
    const apiCall = BASE_DASHBOARD + "types"
    const response = await apiPost(apiCall, filter)
    return response
}
