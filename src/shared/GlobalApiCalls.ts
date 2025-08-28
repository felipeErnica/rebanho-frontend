import { apiGet } from "@/util/ApiRequest"
import { ApiResponse } from "./entities/ApiResponse"

const FARM_BASE = 'farm-area/farms/'
const ANIMAL_BASE = 'animals/info/'
const PASTURE_BASE = 'farm-area/pastures/'
const ANIMAL_SEARCH_BASE = ANIMAL_BASE + 'search/'

export function findAnimalById(id: string): Promise<ApiResponse> {
    return apiGet(ANIMAL_BASE + `id/${id}`)
}

export function searchFarm(): Promise<ApiResponse> {
    return apiGet(FARM_BASE + "search")
}

export function searchFather(): Promise<ApiResponse> {
    const query = ANIMAL_SEARCH_BASE + 'father'
    return apiGet(query)
}

export function searchMother(): Promise<ApiResponse> {
    return apiGet(ANIMAL_SEARCH_BASE + "mother")
}

export function searchDairyAnimal(): Promise<ApiResponse> {
    return apiGet(ANIMAL_SEARCH_BASE + "dairy-animal")
}

export async function searchAnimal() {
    return apiGet(ANIMAL_SEARCH_BASE + "animal")
}

export function searchPasture(farmIds?: string | string[]): Promise<ApiResponse> {
    const apiQuery = `search?farmId=${farmIds}` 
    return apiGet(PASTURE_BASE + apiQuery)
}
