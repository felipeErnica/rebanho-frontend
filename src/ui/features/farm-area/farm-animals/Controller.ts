import { apiGet } from "@/util/ApiRequest";

const BASE_URL = "farm-area/farm/"

export async function findAnimalsByFarm(farmId: string) {
    return apiGet(BASE_URL + farmId + "/animals")
}
