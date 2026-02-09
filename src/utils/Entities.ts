export type Page<T> = {
    hasNextPage: boolean;
    nextCursor: string;
    list: T[];
}

export type CardEntry = {
    current: number
    trend: number
    hist: GraphData[]
}

export type GraphData = {
    date: Date
    value: number
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

export const DefaultCard: CardEntry = {
    hist: [],
    trend: 0,
    current: 0
}
