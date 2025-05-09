import {  AnimalFilter } from "@/types/Animal";
import { ApiResponse } from "@/types/ApiResponse";
import { apiPost, basePageCall } from "@/util/ApiRequest";

const BASE = 'animals/'

export async function findPage(sort: string, order: string, cursor: string, filter: AnimalFilter): Promise<ApiResponse> {
    const apiCall = `${BASE}` + basePageCall(sort, order, cursor)
    const response = await apiPost<AnimalFilter>(apiCall, filter)
    return response;
}
