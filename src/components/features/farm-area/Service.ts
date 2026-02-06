import { apiGet, apiPost, apiPut, buildFilterParams } from "@utils/ApiRequest"
import { 
    PastureEntriesFilter, 
    PastureEntrySave, 
    PastureFilter, 
    PastureOccupancy, 
    PastureStats 
} from "./Entities"

const ENTRIES_BASE = `pastures/entries/`
const PASTURE_BASE = `pastures/`

export function findPastureEntries(
    pastureId: string,
    filter: PastureEntriesFilter,
    sort: string,
    order: string,
    cursor?: string,
) {
    const cursorQuery = `${cursor ? `&cursor=${cursor}` : ''}`
    const query = `farm-area/pastures/${pastureId}/entries?sort=${sort}&order=${order}` + cursorQuery
    return apiPost(query, filter)
}

export function findPastureEntriesTotal(pastureId: string, filter: PastureEntriesFilter) {
    const query = `farm-area/pastures/${pastureId}/entries/total`
    return apiPost(query, filter)
}

export function addPastureEntry(entry: PastureEntrySave) {
    return apiPut(ENTRIES_BASE + "add", entry)
}

export function transferPastureEntry(entry: PastureEntrySave) {
    return apiPut(ENTRIES_BASE + "transfer", entry)
}

export function getPastureDashboardStats(): Promise<PastureStats> {
    // Mock data
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                totalAnimals: {
                    current: 1245,
                    trend: 5.2,
                    history: Array.from({ length: 10 }, (_, i) => ({
                        date: new Date(Date.now() - (9 - i) * 24 * 60 * 60 * 1000).toISOString(),
                        value: 1200 + Math.floor(Math.random() * 100)
                    }))
                },
                occupiedPastures: {
                    current: 12,
                    total: 15
                },
                recentMoves: {
                    current: 28,
                    trend: -12.5,
                    history: Array.from({ length: 10 }, (_, i) => ({
                        date: new Date(Date.now() - (9 - i) * 24 * 60 * 60 * 1000).toISOString(),
                        value: Math.floor(Math.random() * 10)
                    }))
                }
            })
        }, 800)
    })
}

export function getPastureOccupancy(): Promise<PastureOccupancy[]> {
    // Mock data
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: '1', name: 'Pasto 01', animalCount: 45, maxCapacity: 50, usagePercentage: 90 },
                { id: '2', name: 'Pasto 02 - Maternidade', animalCount: 12, maxCapacity: 20, usagePercentage: 60 },
                { id: '3', name: 'Pasto 03', animalCount: 55, maxCapacity: 60, usagePercentage: 91.6 },
                { id: '4', name: 'Pasto 04', animalCount: 30, maxCapacity: 40, usagePercentage: 75 },
                { id: '5', name: 'Confinamento A', animalCount: 120, maxCapacity: 150, usagePercentage: 80 },
                { id: '6', name: 'Pasto 05', animalCount: 0, maxCapacity: 40, usagePercentage: 0 },
            ])
        }, 800)
    })
}

export function searchPastures( filter: PastureFilter = { isFiltered: false }) {
    const params = buildFilterParams(filter, "?")
    return apiGet(PASTURE_BASE + "search" + params)
}
