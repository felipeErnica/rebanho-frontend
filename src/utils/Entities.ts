export type Page<T> = {
    hasNextPage: boolean;
    nextCursor: string;
    list: T[];
}

export type CardEntry<T> = {
    current: number
    trend: number
    hist: T[]
}

export type User = {
    id: string
    name: string
    emailAddress: string
    phoneNumber: string
    password: string
}

export type JwtToken = {
    token: string
}

export interface IData {
    id: string
    [key: string]: any
}

export interface IDashboardData {
    [key: string]: any
}
