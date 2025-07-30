import { ApiResponse } from "@/shared/entities/ApiResponse";
import { apiGet } from "@/util/ApiRequest";

const BIRTH_INFO_BASE = "/reproduction/births/info/"

export function getTotalBySex(): Promise<ApiResponse> {
    return apiGet(BIRTH_INFO_BASE + "total-sex")
}
