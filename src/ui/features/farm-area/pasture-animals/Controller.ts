import { apiGet } from "@/util/ApiRequest"

export async function findAnimalsByPasture(pastureId: string, sort: string, order: string) {
    const query = `farm-area/pastures/${pastureId}/animals?sort=${sort}&order=${order}`
    console.log("url query: ", query)
    return apiGet(query)
}

export async function searchAnimalsByPasture(pastureId: string, input?: string) {
    const query = `farm-area/pastures/${pastureId}/search/animals${input ? `?input=${input}` : ''}`
    console.log("url query: ", query)
    return apiGet(query)
}
