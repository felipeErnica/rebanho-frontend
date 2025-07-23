import { apiGet } from "@/util/ApiRequest"
import { ApiResponse } from "./entities/ApiResponse"

const FARM_BASE = 'farm-area/farms/'
const ANIMAL_BASE = 'animals/info/'
const PASTURE_BASE = 'farm-area/pastures/'
const ANIMAL_SEARCH_BASE = ANIMAL_BASE + 'search/'

export function findAnimalById(id: string): Promise<ApiResponse> {
    return apiGet(ANIMAL_BASE + `id/${id}`)
}

export function searchFarm(input?: string): Promise<ApiResponse> {
    return apiGet(FARM_BASE + `search?input=${input}`)
}

export function searchFather(input?: string): Promise<ApiResponse> {
    return apiGet(ANIMAL_SEARCH_BASE + `father?input=${input}`)
}

export function searchMother(input?: string): Promise<ApiResponse> {
    return apiGet(ANIMAL_SEARCH_BASE + `mother?input=${input}`)
}

export async function searchAnimal(input: string) {
    return apiGet(ANIMAL_SEARCH_BASE + `animal?input=${input}`)
}

export function searchPasture(input?: string, farmIds?: string | string[]): Promise<ApiResponse> {
    const farmKey = farmIds ? `&farmsId=${farmIds}` : ''
    return apiGet(PASTURE_BASE + `search?input=${input}` + farmKey)
}
