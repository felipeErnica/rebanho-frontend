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

export async function searchBull(input?: string) {
    const apiQuery = input ? `bull?input=${input}` : 'bull'
    return apiGet("animals/info/search/" + apiQuery)
}

export async function searchBullById(id?: string | string[]) {
    const apiQuery = id ? `bull?id=${id}` : 'bull'
    return apiGet("animals/info/search/" + apiQuery)
}
