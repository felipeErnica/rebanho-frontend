import { apiGet } from "@/util/ApiRequest";
import { ApiResponse } from "@/shared/entities/ApiResponse";

const ANIMAL_BASE = 'animals/info/'
const PASTURE_BASE = 'farm-area/pastures/'
const ANIMAL_SEARCH_BASE = ANIMAL_BASE + 'search/'

export function searchFather(input?: string): Promise<ApiResponse> {
    return apiGet(ANIMAL_SEARCH_BASE + `father?input=${input}`)
}

export function searchMother(input?: string): Promise<ApiResponse> {
    return apiGet(ANIMAL_SEARCH_BASE + `mother?input=${input}`)
}

export function searchPasture(input?: string, farmIds?: string[]): Promise<ApiResponse> {
    const farmKey = farmIds ? `&farmsId=${farmIds}` : ''
    return apiGet(PASTURE_BASE + `search?input=${input}` + farmKey)
}
