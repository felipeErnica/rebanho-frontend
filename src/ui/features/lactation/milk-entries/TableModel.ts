import { ColumnProps, TableProps } from "@/ui/components/table/Table";
import { ApiResponse } from "@/shared/entities/ApiResponse";
import { TableModelProps } from "@/ui/components/display/Display";

export const buildMilkTable = ({ filter, sort, order }: TableModelProps): TableProps => {

    const columns: ColumnProps[] = [
        { title: "Brinco", name: "animalNumber", type: 'text', isEditable: false },
        { title: "Nome do Animal", name: "animalName", type: 'text', isEditable: false },
        { title: "Pasto", name: "pastureName", type: 'text', isEditable: false },
        { title: "Data da Marcação", name: "entryDate", type: 'date', isEditable: true },
        { title: "Marcação de Leite", name: "milkQuantity", type: 'number', isEditable: true },
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
