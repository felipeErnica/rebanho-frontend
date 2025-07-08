import { ApiResponse } from "@/shared/entities/ApiResponse";
import { IData } from "@/shared/interfaces/Filter";
import { TableModelProps } from "@/ui/shared/display/Display";
import { ColumnProps } from "@/ui/shared/table/TableCustom";

export function buildInseminationTable({ filter, order, sort }: TableModelProps) {

    const columns: ColumnProps[] = [
        { title: "Brinco", name: "animalNumber", type: 'text', isEditable: true},
        { title: "Nome da Vaca", name: "animalName", type: 'text', isEditable: true },
        { title: "Data de Inseminação", name: "groupDate", type: 'date', isEditable: true },
        { title: "Touro", name: "bullName", type: 'text', isEditable: true },
        { title: "Status", name: "status", type: 'text', isEditable: true },
        { title: "Observações", name: "observation", type: 'text', isEditable: true, width: 500 }
    ]

    const onDeleteRow = (id: string) => {
        console.log(`Deleted Row: ${id}`)
    }

    const onSaveRow = (data: IData) => {
        console.log(`Save Row: ${data}`)
    }

    const fetchNextPage = async (cursor: string): Promise<ApiResponse> => {
        console.log(cursor)
        return {
            error: 'error',
            json: '[]',
            status: 200
        }
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
