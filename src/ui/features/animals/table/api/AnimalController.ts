import { ApiResponse } from "@/shared/entities/ApiResponse";
import { apiPost, basePageCall } from "@/util/ApiRequest";
import { AnimalFilter } from "./AnimalInfo";

const BASE_INFO = 'animals/info/'

export async function findPage(sort: string, order: string, cursor: string, filter: AnimalFilter): Promise<ApiResponse> {
    const apiCall = `${BASE_INFO}` + basePageCall(sort, order, cursor)
    const response = await apiPost<AnimalFilter>(apiCall, filter)
    return response;
}
