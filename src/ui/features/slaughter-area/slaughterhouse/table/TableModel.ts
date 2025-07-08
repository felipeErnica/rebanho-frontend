import { ColumnProps, TableProps } from "@/ui/shared/table/TableCustom";
import { ApiResponse } from "@/shared/entities/ApiResponse";
import { TableModelProps } from "@/ui/shared/display/Display";
import { IData } from "@/shared/interfaces/Filter";

export const buildSlaughterhouseTable = ({ filter, sort, order }: TableModelProps): TableProps => {

    const columns: ColumnProps[] = [
        { title: "Nome da Frigorífico", name: "name", type: 'text', isEditable: true },
        { title: "CNPJ", name: "taxNumber", type: 'text', isEditable: true },
        { title: "Cidade", name: "city", type: 'text', isEditable: true },
        { title: "Estado", name: "state", type: 'text', isEditable: true },
        { title: "Taxa de Desconto de Peso Padrão", name: "weightDiscount", type: 'number', isEditable: true },
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
