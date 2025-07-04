import { IData } from "@/shared/interfaces/Filter";

export type Page = {
    hasNextPage: boolean;
    nextCursor: string;
    total: number
    list: IData[];
}
