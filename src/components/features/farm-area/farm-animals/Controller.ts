import { apiPost } from "@utils/ApiRequest";
import { AnimalFilter } from "@features/animals/table/api/AnimalInfo";

const BASE_URL = "farm-area/farms/"

export async function findAnimalsByFarm(
    farmId: string,
    filter: AnimalFilter,
    sort: string,
    order: string,
    cursor?: string
) {
    const cursorQuery = cursor ? `&cursor=${cursor}` : ''
    const query = BASE_URL + farmId + `/animals?order=${order}&sort=${sort}` + cursorQuery
    return apiPost(query, filter)
}

export async function findFarmAnimalsTotal(farmId: string, filter: AnimalFilter) {
    const query = BASE_URL + farmId + `/animals/total`
    return apiPost(query, filter)
}
