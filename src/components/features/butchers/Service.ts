import { apiDelete, apiGet, apiPost, apiPut, buildFilterParams, buildPageParams, buildParams } from "@utils/ApiRequest"
import { ButcherDelete, ButcherSave } from "./Entities"
import { SlaughterFilter } from "@features/slaughter/Entities"

const BUTCHER = "butchers"

export function deleteButcher(obj: ButcherDelete) {
    const params = buildParams(obj, "?")
    return apiDelete(BUTCHER + params)
}

export function updateButcher(entry: ButcherSave) {
    return apiPut(BUTCHER, entry)
}

export function addButcher(entry: ButcherSave) {
    return apiPost(BUTCHER, entry)
}

export function findButchers() {
    return apiGet(BUTCHER)
}

export function findButcherById(id: string) {
    return apiGet(BUTCHER + id)
}

