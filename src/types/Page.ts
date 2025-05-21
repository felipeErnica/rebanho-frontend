import { IData } from "@/interfaces/Filter";

export type Page = {
    hasNextPage: boolean;
    nextCursor: string;
    list: IData[];
}
