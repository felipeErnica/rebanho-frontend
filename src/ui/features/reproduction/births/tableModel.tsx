import { ColumnProps, TableProps } from "@/ui/components/table/Table";
import { ApiResponse } from "@/types/ApiResponse";
import { TableModelProps } from "@/ui/components/display/Display";

export const buildTable = ({ filter, sort, order }: TableModelProps): TableProps => {

    const columns: ColumnProps[] = [
        { title: "Brinco", name: "ringNumber", type: 'text', isEditable: true},
        { title: "Nome da Vaca", name: "motherName", type: 'text', isEditable: true },
        { title: "Data de Nascimento", name: "birthDate", type: 'date', isEditable: true },
        { title: "Sexo", name: "sex", type: 'text', isEditable: true },
        { title: "Nome do Pai", name: "fatherName", type: 'text', isEditable: true },
        { title: "Peso de Nascimento", name: "birthWeight", type: 'number', step:'.5', isEditable: true },
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
