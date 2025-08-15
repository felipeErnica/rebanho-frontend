import { apiGet } from "@/util/ApiRequest";

const DASHBOARD_BASE = "reproduction/pregnancy-test/dashboard/"

export function getPregnancyRate() {
    return apiGet(DASHBOARD_BASE + "pregnancy-rate")
}

export function getBirthRate() {
    return apiGet(DASHBOARD_BASE + "birth-rate")
}

export function getTestHist() {
    return apiGet(DASHBOARD_BASE + "test-hist")
}
