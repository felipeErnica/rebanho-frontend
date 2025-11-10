import { User } from "@/shared/entities/User"
import { ERROR_TYPE } from "@/ui/shared/Globals"

const BASE_URL = "http://localhost:8080/"

export type APIError = {
    kind: string
    errType: string
    title: string
    message: string
}

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


async function buildResponse(response: Response): Promise<any> {
    let json: any

    const CONNECTION_ERROR: APIError = {
        errType: ERROR_TYPE,
        kind: 'ConnectionError',
        title: 'Erro de Conexão',
        message: 'Não foi possível conectar com o servidor!'
    }

    try {
        json = await response.json()
    } catch {
        throw CONNECTION_ERROR
    }

    if (!response.ok) {
        throw (json as APIError)
    }

    return json
}

export async function authUser(user: User): Promise<any> {
    const request: RequestInit = {
        method: 'POST',
        signal: AbortSignal.timeout(5000),
        body: JSON.stringify(user),
        headers: { 'Content-Type': 'application/json' }
    }
    const url = BASE_URL + "login"
    const response = await fetch(url, request)
    return buildResponse(response)
}

export async function apiPost<D>(apiCall: string, object: D): Promise<any> {
    const request = await generateRequest()
    request.method = 'POST'
    request.body = JSON.stringify(object)
    const url = BASE_URL + apiCall
    const response = await fetch(url, request)
    return buildResponse(response)
}

export async function apiPut<D>(apiCall: string, object: D): Promise<any> {
    const request = await generateRequest()
    request.method = 'PUT'
    request.body = JSON.stringify(object)
    const url = BASE_URL + apiCall
    const response = await fetch(url, request)
    return buildResponse(response)
}

export async function apiGet(apiCall: string): Promise<any> {
    const request = await generateRequest()
    request.method = 'GET'
    const url = BASE_URL + apiCall
    const response = await fetch(url, request)
    return buildResponse(response)
}

export async function apiDelete(apiCall: string): Promise<any> {
    const request = await generateRequest()
    request.method = 'DELETE'
    const url = BASE_URL + "/" + apiCall
    const response = await fetch(url, request)
    return buildResponse(response)
}

export function buildPageCall(sort: string, order: string, cursor?: string): string {
    return `page?sort=${sort}&order=${order}${cursor ? `&cursor=${cursor}` : ''}`
}
