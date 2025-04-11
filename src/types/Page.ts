export type Page<D> = {
    hasNextPage: boolean;
    nextCursor: string;
    list: D[];
}
