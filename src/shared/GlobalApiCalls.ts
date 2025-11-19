import { apiGet } from "@/util/ApiRequest"
import { SearchBoxItem } from "@/ui/shared/form-controls/FormSearchBox"

const FARM_BASE = 'farm-area/farms/'
const ANIMAL_BASE = 'animals/info/'
const PASTURE_BASE = 'farm-area/pastures/'
const ANIMAL_SEARCH_BASE = ANIMAL_BASE + 'search/'

export function findAnimalById(id: string): Promise<SearchBoxItem[]> {
    return apiGet(ANIMAL_BASE + `id/${id}`)
}

export function searchFarm(): Promise<SearchBoxItem[]> {
    return apiGet(FARM_BASE + "search")
}

export function searchFather(): Promise<SearchBoxItem[]> {
    return apiGet(ANIMAL_SEARCH_BASE + 'father')
}

export function searchAllMothers(): Promise<SearchBoxItem[]> {
    return apiGet(ANIMAL_SEARCH_BASE + "mother-all")
}

export function searchOwnedMothers() {
    return apiGet(ANIMAL_SEARCH_BASE + "mother")
}
export function searchDairyAnimal(): Promise<SearchBoxItem[]> {
    return apiGet(ANIMAL_SEARCH_BASE + "dairy-animal")
}

export async function searchAnimal() {
    return apiGet(ANIMAL_SEARCH_BASE + "animal")
}

export function searchPastureByFarm(farmIds?: string | string[]): Promise<SearchBoxItem[]> {
    const apiQuery = `search?farmId=${farmIds}` 
    return apiGet(PASTURE_BASE + apiQuery)
}

export function searchPastures(): Promise<SearchBoxItem[]> {
    return apiGet(PASTURE_BASE + "search-all")
}
