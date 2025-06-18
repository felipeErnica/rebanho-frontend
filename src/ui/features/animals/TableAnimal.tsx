import { ColumnProps, TableProps } from "@/ui/components/table/Table";
import { findPage } from "./api/AnimalController";
import { ApiResponse } from "@/shared/entities/ApiResponse";
import { TableModelProps } from "@/ui/components/display/Display";

export const buildTable = ({ filter, sort, order }: TableModelProps): TableProps => {
    const columns: ColumnProps[] = [
        { title: "Brinco", name: "ringNumber", type: 'text', isEditable: true },
        { title: "Nome", name: "name", type: 'text', isEditable: true },
        { title: "Data de Nascimento", name: "birthDate", type: 'date', isEditable: true },
        { title: "Data de Morte", name: "deathDate", type: 'date', isEditable: true },
        { title: "Intervalo de Parição Médio", name: "averageBirthInterval", type: 'number', isEditable: false }
    ]

    const onDeleteRow = (id: string) => {
        console.log(`Deleted Row: ${id}`)
    }

    const onSaveRow = (id: string) => {
        console.log(`Save Row: ${id}`)
    }

    const fetchNextPage = async (cursor: string): Promise<ApiResponse> => {
        return findPage(sort, order, cursor, filter)
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
