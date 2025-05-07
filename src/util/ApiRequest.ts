const BASE_URL = "http://localhost:8080"
const auth = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYzdkYjE3ZjQtZGFjYS00N2JlLThlNzAtNGNkMDRjZjkzM2ZjIn0.VKpoz_9QHcPNwqg7oJEWrY9cZ5yIlM-M25Mc5DdUe1E'

const generateRequest = (): RequestInit => {
    const commonRequest: RequestInit = {
        headers: {
            'Authorization': `Bearer ${auth}`,
            'Content-Type': 'application/json'
        },
    }
    return commonRequest
}

export async function apiPost<D>(apiCall: string, object: D): Promise<Response> {
    const request = generateRequest()
    request.method = 'POST'
    request.body = JSON.stringify(object)
    const url = BASE_URL + "/" + apiCall
    const response = await fetch(url, request)
    return response
}

export async function apiGet(apiCall: string): Promise<Response> {
    const request = generateRequest()
    request.method = 'GET'
    const url = BASE_URL + "/" + apiCall
    const response = await fetch(url, request)
    return response
}

export async function apiDelete(apiCall: string): Promise<Response> {
    const request = generateRequest()
    request.method = 'DELETE'
    const url = BASE_URL + "/" + apiCall
    const response = await fetch(url, request)
    return response
}

export function basePageCall(sort: string, order: string, cursor: string): string {
    return `page?sort=${sort}&order=${order}${cursor ? `&cursor=${cursor}` : ''}`
}
