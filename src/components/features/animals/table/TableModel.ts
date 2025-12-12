import { TableProps } from "@shared/table/TableCustom";
import { findPage } from "./api/AnimalController";
    import { TableModelProps } from "@shared/display/Display";
    import { useColumnsAnimals } from "./api/AnimalInfo";
import { IData } from "@utils/Entities";

export const useTableAnimals = ({ filter, sort, order }: TableModelProps): TableProps => {

    const onDeleteRow = (id: string) => {
        console.log(`Deleted Row: ${id}`)
    }

    const onSaveRow = (data: IData) => {
        console.log(`Save Row: `, data)
    }

    const fetchNextPage = async (cursor: string): Promise<any> => {
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
