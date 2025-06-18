import { ApiResponse } from "@/shared/entities/ApiResponse";
import { TableModelProps } from "@/ui/components/display/Display";
import { ColumnProps } from "@/ui/components/table/Table";

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

    const onSaveRow = (id: string) => {
        console.log(`Save Row: ${id}`)
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
