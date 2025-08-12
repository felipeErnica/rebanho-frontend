import { ApiResponse } from "@/shared/entities/ApiResponse"
import { User } from "@/shared/entities/User"

const BASE_URL = "http://localhost:8080/"

async function generateRequest(): Promise<RequestInit> {
    const authToken = await window.electronEvents.getAuthToken()
    const commonRequest: RequestInit = {
        signal: AbortSignal.timeout(5000),
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        },
    }
    return commonRequest
}

function buildErrorMsg(status: number): string {
    if (status == 500) return 'Houve um erro no servidor!'
    return 'Erro desconhecido!'
}

async function buildResponse(response: Response): Promise<ApiResponse> {
    const json = await response.json()
    if (response.ok) {
        return {
            status: response.status,
            json: json
        }
    }

    return {
        status: response.status,
        error: buildErrorMsg(response.status),
        json: json
    }
}

export async function authUser(user: User): Promise<ApiResponse> {
    const request: RequestInit = {
        method: 'POST',
        signal: AbortSignal.timeout(5000),
        body: JSON.stringify(user),
        headers: { 'Content-Type': 'application/json'}
    }
    const url = BASE_URL + "login"
    const response = await fetch(url, request)
    return buildResponse(response)
}

export async function apiPost<D>(apiCall: string, object: D): Promise<ApiResponse> {
    const request = await generateRequest()
    request.method = 'POST'
    request.body = JSON.stringify(object)
    const url = BASE_URL + apiCall
    const response = await fetch(url, request)
    return buildResponse(response)
}

export async function apiGet(apiCall: string): Promise<ApiResponse> {
    const request = await generateRequest()
    request.method = 'GET'
    const url = BASE_URL + apiCall
    const response = await fetch(url, request)
    return buildResponse(response)
}

export async function apiDelete(apiCall: string): Promise<ApiResponse> {
    const request = await generateRequest()
    request.method = 'DELETE'
    const url = BASE_URL + "/" + apiCall
    const response = await fetch(url, request)
    return buildResponse(response)
}

export function buildPageCall(sort: string, order: string, cursor?: string): string {
    return `page?sort=${sort}&order=${order}${cursor ? `&cursor=${cursor}` : ''}`
}
