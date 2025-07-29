import { apiPost } from "@/util/ApiRequest";
import { AnimalFilter } from "../../animals/table/api/AnimalInfo";

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
