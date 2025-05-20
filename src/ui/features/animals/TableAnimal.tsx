import { AnimalFilter } from "@/types/Animal";
import { ColumnProps, TableCustom } from "@/ui/components/table/Table";
import { JSX, useCallback } from "react";
import { findPage } from "./api/AnimalController";
import { ApiResponse } from "@/types/ApiResponse";

type TableAnimalProps = {
    filter: AnimalFilter
    sort: string
    order: string
}

export const TableAnimal = (props: TableAnimalProps): JSX.Element => {
    const columns: ColumnProps[] = [
        { title: "Brinco", name: "ringNumber", type: 'text', isEditable: true, width: 500 },
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

    const fetchNextPage = useCallback(async (cursor: string): Promise<ApiResponse> => {
        return findPage(props.sort, props.order, cursor, props.filter)
    }, [props])

    return <TableCustom
        order={props.order}
        sort={props.sort}
        columns={columns}
        filter={props.filter}
        fetchPage={fetchNextPage}
        onDeleteRow={onDeleteRow}
        onSaveRow={onSaveRow}
    />
}
