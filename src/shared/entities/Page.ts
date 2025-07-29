import { IData } from "@/shared/interfaces/Filter";

export type Page = {
    hasNextPage: boolean;
    nextCursor: string;
    list: IData[];
}
