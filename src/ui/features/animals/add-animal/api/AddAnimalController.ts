import { apiGet } from "@/util/ApiRequest";
import { ApiResponse } from "@/types/ApiResponse";


const BASE = 'animals/info/search/'

export function searchFather(input?: string): Promise<ApiResponse> {
    return apiGet(BASE + `father?input=${input}`)
}

export function searchMother(input?: string): Promise<ApiResponse> {
    return apiGet(BASE + `mother?input=${input}`)
}
