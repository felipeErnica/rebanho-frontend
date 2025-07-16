import { apiGet } from "@/util/ApiRequest"
import { ApiResponse } from "./entities/ApiResponse"

const FARM_BASE = 'farm-area/farms/'

export function searchFarm(input?: string): Promise<ApiResponse> {
    return apiGet(FARM_BASE + `search?input=${input}`)
}

