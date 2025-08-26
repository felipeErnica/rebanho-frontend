import { apiGet, apiPost, buildPageCall } from "@/util/ApiRequest"
import { LossFilter } from "./Entities"

const DASHBOARD_BASE = "reproduction/losses/dashboard/"
const ENTRIES_BASE = "reproduction/losses/entries/"

export function getLossRate() {
    return apiGet(DASHBOARD_BASE + "loss-rate")
}

export function getLossesHist() {
    return apiGet(DASHBOARD_BASE + "losses-hist")
}

export function getMostLossesAnimals() {
    return apiGet(DASHBOARD_BASE + "losses-animals")
}

export function findPage(
    filter: LossFilter,
    sort: string,
    order: string,
    cursor?: string
) {
    const pageQuery = buildPageCall(sort, order, cursor)
    return apiPost(ENTRIES_BASE + pageQuery, filter)
}

export function getPageFoot(filter: LossFilter) {
    return apiPost(ENTRIES_BASE + "page/foot", filter)
}
