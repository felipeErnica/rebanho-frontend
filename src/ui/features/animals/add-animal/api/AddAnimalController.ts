import { apiGet } from "@/util/ApiRequest";
import { ApiResponse } from "@/shared/entities/ApiResponse";

const ANIMAL_BASE = 'animals/info/search/'

export function searchFather(input?: string): Promise<ApiResponse> {
    return apiGet(ANIMAL_BASE + `father?input=${input}`)
}

export function searchMother(input?: string): Promise<ApiResponse> {
    return apiGet(ANIMAL_BASE + `mother?input=${input}`)
}

export function searchFarm(input?: string): Promise<ApiResponse> {
    return apiGet(`farm-area/farms/search?input=${input}`)
}

export function searchPasture(farmId?: string, input?: string): Promise<ApiResponse> {
    return apiGet(`farm-area/pastures/search?input=${input}&farmId=${farmId}`)
}
