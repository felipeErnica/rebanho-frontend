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
