import { TableProps } from "@/ui/shared/table/TableCustom";
import { findPage } from "./api/AnimalController";
import { ApiResponse } from "@/shared/entities/ApiResponse";
import { TableModelProps } from "@/ui/shared/display/Display";
import { columns } from "./api/AnimalInfo";

export const buildTable = ({ filter, sort, order }: TableModelProps): TableProps => {

    const onDeleteRow = (id: string) => {
        console.log(`Deleted Row: ${id}`)
    }

    const onSaveRow = (id: string) => {
        console.log(`Save Row: ${id}`)
    }

    const fetchNextPage = async (cursor: string): Promise<ApiResponse> => {
        const resp = await findPage(sort, order, cursor, filter)
        return resp
    }

    return {
        filter: filter,
        order: order,
        sort: sort,
        columns: columns,
        fetchPage: fetchNextPage,
        onSaveRow: onSaveRow,
        onDeleteRow: onDeleteRow,
    }
}
