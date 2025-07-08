import { TableProps } from "@/ui/shared/table/TableCustom";
import { findPage } from "./api/AnimalController";
import { ApiResponse } from "@/shared/entities/ApiResponse";
import { TableModelProps } from "@/ui/shared/display/Display";
import { useColumnsAnimals } from "./api/AnimalInfo";
import { IData } from "@/shared/interfaces/Filter";

export const useTableAnimals = ({ filter, sort, order }: TableModelProps): TableProps => {

    const onDeleteRow = (id: string) => {
        console.log(`Deleted Row: ${id}`)
    }

    const onSaveRow = (data: IData) => {
        console.log(`Save Row: `, data)
    }

    const fetchNextPage = async (cursor: string): Promise<ApiResponse> => {
        const resp = await findPage(sort, order, cursor, filter)
        return resp
    }

    const columns = useColumnsAnimals()

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
