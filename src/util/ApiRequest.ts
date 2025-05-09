import { User } from "@/types/User"

const BASE_URL = "http://localhost:8080"
var authToken: string

export function setAuthToken(token: string) {
    authToken = token
}

const generateRequest = (): RequestInit => {
    const commonRequest: RequestInit = {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        },
    }
    return commonRequest
}

export async function authUser(user: User): Promise<Response> {
    const request: RequestInit = {
        method: 'POST',
        body: JSON.stringify(user),
        headers: { 'Content-Type': 'application/json'}
    }
    const url = BASE_URL + "/login"
    const response = await fetch(url, request)
    return response
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
