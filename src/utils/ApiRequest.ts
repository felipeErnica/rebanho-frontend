import { ERROR_TYPE } from "@shared/Globals"
import { User } from "./Entities"
import { IFilters } from "./Filter"
import { dateToISO } from "./Transformations"

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

export async function apiPut<D>(apiCall: string, object?: D): Promise<any> {
    const request = await generateRequest()
    request.method = 'PUT'

    if (object) {
        request.body = JSON.stringify(object)
    }

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
    const url = BASE_URL + apiCall
    const response = await fetch(url, request)
    return buildResponse(response)
}

export function buildPageCall(sort: string, order: string, cursor?: string): string {
    return `page?sort=${sort}&order=${order}${cursor ? `&cursor=${cursor}` : ''}`
}

export function buildPageParams(
    symbol: URLSymbol,
    sort: string,
    order: string,
    filter: IFilters,
    cursor?: string,
): string {
    sort = sort.replace(/\s/g, "");
    let query = `sort=${sort}&order=${order}`
    if (cursor) query += `&cursor=${cursor}`
    const filterParams = buildFilterParams(filter, '&')
    return symbol + query + filterParams
}

type URLSymbol = "?" | "&"

export function buildFilterParams(filter: IFilters | undefined, symbol: URLSymbol): string {
    if (!filter || !filter.isFiltered) return ""
    const filterMap: Record<string, any> = {}

    for (const key of Object.keys(filter)) {
        if (key == "isFiltered") continue
        const value = filter[key]
        if (value == undefined) continue
        if (value instanceof Date) {
            filterMap[key] = dateToISO(value)
            continue
        }
        filterMap[key] = value
    }

    const searchParams = new URLSearchParams(filterMap)
    return symbol + searchParams.toString()
}

export function getFilterFromParams<T extends IFilters>(params: URLSearchParams): T {
    if (params.size == 0) return { isFiltered: false } as T
    const entries = Object.fromEntries(params.entries())
    return { isFiltered: true, ...entries } as T
}

export function getObjectFromParams<T>(params: URLSearchParams): T | undefined {
    if (params.size == 0) return 
    return Object.fromEntries(params.entries()) as T
}

export function buildParams(obj: any | undefined, symbol: URLSymbol): string {
    if (!obj) return ""
    const objMap: Record<string, any> = {}

    for (const key of Object.keys(obj)) {
        const value = obj[key]
        if (value == undefined) continue
        if (value instanceof Date) {
            objMap[key] = dateToISO(value)
            continue
        }
        objMap[key] = value
    }

    const searchParams = new URLSearchParams(objMap)
    return symbol + searchParams.toString()
}

