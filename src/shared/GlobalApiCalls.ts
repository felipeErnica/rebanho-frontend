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
    const inputQuery = input ? `search?input=${input}` : 'search'
    return apiGet(FARM_BASE + inputQuery)
}

export function searchFarmById(id?: string | string[]): Promise<ApiResponse> {
    const inputQuery = id ? `search?id=${id}` : 'search'
    return apiGet(FARM_BASE + inputQuery)
}

export function searchFather(input?: string): Promise<ApiResponse> {
    const inputString = input ? `father?input=${input}` : "father"
    const query = ANIMAL_SEARCH_BASE + inputString
    return apiGet(query)
}

export function searchFatherById(id?: string | string[]): Promise<ApiResponse> {
    const inputString = id ? `father?id=${id}` : "father"
    const query = ANIMAL_SEARCH_BASE + inputString
    return apiGet(query)
}

export function searchMother(input?: string): Promise<ApiResponse> {
    const inputQuery = input ? `mother?input=${input}` : 'mother'
    return apiGet(ANIMAL_SEARCH_BASE + inputQuery)
}

export function searchMotherById(id?: string | string[]): Promise<ApiResponse> {
    const inputString = id ? `mother?id=${id}` : "mother"
    const query = ANIMAL_SEARCH_BASE + inputString
    return apiGet(query)
}

export async function searchAnimal(input: string) {
    const inputQuery = input ? `animal?input=${input}` : 'animal'
    return apiGet(ANIMAL_SEARCH_BASE + inputQuery)
}

export async function searchAnimalById(id?: string | string[]) {
    const inputQuery = id ? `animal?id=${id}` : 'animal'
    return apiGet(ANIMAL_SEARCH_BASE + inputQuery)
}

export function searchPasture(input?: string, farmIds?: string | string[]): Promise<ApiResponse> {
    let apiQuery = input ? `search?input=${input}` : 'search'
    if (!farmIds) {
        apiQuery += input ? `&farmId=${farmIds}` : `?farmId=${farmIds}` 
    }
    return apiGet(PASTURE_BASE + apiQuery)
}

export function searchPastureById(id?: string | string[], farmIds?: string | string[]): Promise<ApiResponse> {
    let apiQuery = id ? `search?id=${id}` : 'search'
    if (!farmIds) {
        apiQuery += apiQuery ? `&farmId=${farmIds}` : `&farmId=${farmIds}` 
    }
    return apiGet(PASTURE_BASE + apiQuery)
}
