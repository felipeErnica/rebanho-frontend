import { apiGet } from "@/util/ApiRequest"

const BASE_URL = "farm-area/dashboard/"

export async function getFarmsInfo() {
    const url = BASE_URL + "/farm-info"
    return apiGet(url)
}   

export async function getPasturesInfo(farmId: string) {
    const url = BASE_URL + `/pasture-info?farmId=${farmId}`
    return apiGet(url)
}   

export async function searchBull() {
    return apiGet("animals/info/search/bull")
}
