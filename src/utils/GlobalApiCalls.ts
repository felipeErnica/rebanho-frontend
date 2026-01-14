import { SearchBoxItem } from "@shared/dialog/SearchBox"
import { apiGet } from "./ApiRequest"

const FARM_BASE = 'farm-area/farms/'
const ANIMAL_BASE = 'animals/info/'
const PASTURE_BASE = 'farm-area/pastures/'

export function findAnimalById(id: string): Promise<SearchBoxItem[]> {
    return apiGet(ANIMAL_BASE + `id/${id}`)
}

export function searchFarm(): Promise<SearchBoxItem[]> {
    return apiGet(FARM_BASE + "search")
}

export function searchPastureByFarm(farmIds?: string | string[]): Promise<SearchBoxItem[]> {
    const apiQuery = `search?farmId=${farmIds}` 
    return apiGet(PASTURE_BASE + apiQuery)
}
