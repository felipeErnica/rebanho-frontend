import { apiGet, apiPost, buildPageCall } from "@utils/ApiRequest";
import { AnimalFilter } from "./AnimalInfo";

const BASE_INFO = 'animals/info/'

export async function findPage(sort: string, order: string, cursor: string, filter: AnimalFilter): Promise<any> {
    const apiCall = `${BASE_INFO}` + buildPageCall(sort, order, cursor)
    const response = await apiPost<AnimalFilter>(apiCall, filter)
    return response;
}

export async function findById(id: string): Promise<any> {
    const apiCall = `${BASE_INFO}/id/${id}` 
    return await apiGet(apiCall)
}
