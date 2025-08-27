export type Page<T> = {
    hasNextPage: boolean;
    nextCursor: string;
    list: T[];
}
