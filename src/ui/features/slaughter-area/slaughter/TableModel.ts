import { ColumnProps, TableProps } from "@/ui/components/table/Table";
import { ApiResponse } from "@/types/ApiResponse";
import { TableModelProps } from "@/ui/components/display/Display";

export const buildSlaughterTable = ({ filter, sort, order }: TableModelProps): TableProps => {

    const columns: ColumnProps[] = [
        { title: "Brinco", name: "animalNumber", type: 'text', isEditable: false },
        { title: "Nome da Vaca", name: "animalName", type: 'text', isEditable: false },
        { title: "Sexo", name: "animalSex", type: 'text', isEditable: false },
        { title: "Data de Nascimento", name: "animalBirthDate", type: 'date', isEditable: false },
        { title: "Frigorífico", name: "slaughterhouse", type: 'text', isEditable: false },
        { title: "Data de Abate", name: "slaughterDate", type: 'date', isEditable: false },
        { title: "Última Pesagem", name: "weight", type: 'number', isEditable: true },
        { title: "Peso Morto", name: "deadWeight", type: 'number', isEditable: true },
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
