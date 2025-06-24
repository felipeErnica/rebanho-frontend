import { ColumnProps, TableProps } from "@/ui/shared/table/Table";
import { ApiResponse } from "@/shared/entities/ApiResponse";
import { TableModelProps } from "@/ui/shared/display/Display";

export type Lactation = {
    id: string
    cowId: string
    cowName: string
    cowNumber: string
    cowPasture: string
    cowOrder: number
    calfId: string
    calfBirthDate: Date
    calfSex: string
    calfFather: string
    startDate: Date
    endDate: Date
    productionPeriod: number
    productionTotal: number
    averageProduction: number
    peakProduction: number
    isr: number
    observation: string
}

export const buildLactationTable = ({ filter, sort, order }: TableModelProps): TableProps => {

    const columns: ColumnProps[] = [
        { title: "Brinco", name: "cowNumber", type: 'text', isEditable: false },
        { title: "Nome do Animal", name: "cowName", type: 'text', isEditable: false },
        { title: "Pasto", name: "cowPasture", type: 'text', isEditable: false },
        { title: "Data de Parição", name: "calfBirthDate", type: 'date', isEditable: false },
        { title: "Sexo do Bezerro", name: "calfSex", type: 'text', isEditable: false },
        { title: "Pai do Bezerro", name: "calfFather", type: 'text', isEditable: false },
        { title: "Data de Início", name: "startDate", type: 'date', isEditable: true },
        { title: "Data de Fim", name: "endDate", type: 'date', isEditable: true },
        { title: "Período de Produção (dias)", name: "productionPeriod", type: 'number', isEditable: false },
        { title: "Produção Total", name: "productionTotal", type: 'number', isEditable: false },
        { title: "Produção Média", name: "averageProduction", type: 'number', isEditable: false },
        { title: "Pico de Produção", name: "peakProduction", type: 'number', isEditable: false },
        { title: "I.S.R.", name: "isr", type: 'number', isEditable: false },
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
