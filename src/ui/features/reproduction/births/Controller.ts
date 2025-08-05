import { ApiResponse } from "@/shared/entities/ApiResponse";
import { apiGet } from "@/util/ApiRequest";

const BIRTH_INFO_BASE = "/reproduction/births/info/"

export function getBirthsBySex(): Promise<ApiResponse> {
    return apiGet(BIRTH_INFO_BASE + "total-sex")
}

export function getBirthStats(): Promise<ApiResponse> {
    return apiGet(BIRTH_INFO_BASE + "birth-stats")
}

export function getBestIntervals(): Promise<ApiResponse> {
    return apiGet(BIRTH_INFO_BASE + "best-intervals")
}
