import { Animal, AnimalFilter } from "../types/Animal"
import { Page } from "../types/Page"
import { apiPost, basePageCall } from "../util/ApiRequest"

const BASE = 'animals/'

export async function findPage(sort: string, order: string, cursor: string, filter: AnimalFilter): Promise<Page<Animal>> {
    const apiCall = `${BASE}` + basePageCall(sort, order, cursor)
    const response = await apiPost<AnimalFilter>(apiCall, filter)
    const json = await response.json()
    return json;
}
