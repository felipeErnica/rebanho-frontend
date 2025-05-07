import { Animal, AnimalFilter } from "@/types/Animal";
import { Page } from "@/types/Page";
import { CellProps, ColumnProps, Table } from "@/ui/components/table/Table";
import { HTMLInputTypeAttribute, JSX, useCallback } from "react";
import { findPage } from "./api/AnimalController";

const getCellValues = (row: Animal, columnName: string): CellProps => {
    let value: any = null
    let type: HTMLInputTypeAttribute = 'text'
    let isEditable: boolean = false
    let step: string | undefined

    switch (columnName) {
        case "ringNumber":
            value = row.ringNumber
            isEditable = true
            break
        case "name":
            value = row.name
            isEditable = true
            break
        case "birthDate":
            value = !row.birthDate ? null : row.birthDate.toString().substring(0,10)
            type = 'date'
            isEditable = true
            break
        case "deathDate":
            value = !row.deathDate ? null : row.deathDate.toString().substring(0,10)
            type = 'date'
            isEditable = true
            break
        case "averageBirthInterval":
            value = row.averageBirthInterval
            type = 'number'
            isEditable = true
            step = ".5"
            break
    }
    return { columnName: columnName, value: value, isEditable: isEditable, type: type, step: step}
}

export const TableAnimal = (props: TableAnimalProps): JSX.Element => {
    const columns: ColumnProps[] = [
        { title: "Brinco", name: "ringNumber" },
        { title: "Nome", name: "name" },
        { title: "Data de Nascimento", name: "birthDate" },
        { title: "Data de Morte", name: "deathDate" },
        { title: "Intervalo de Parição Médio", name: "averageBirthInterval" }
    ]

    const onDeleteRow = (id: string) => {
        console.log(`Deleted Row: ${id}`)
    }

    const onSaveRow = (id: string) => {
        console.log(`Save Row: ${id}`)
    }

    const fetchNextPage = useCallback(async (cursor: string): Promise<Page<Animal>> => {
        return findPage(props.sort, props.order, cursor, props.filter)
    }, [props])

    return(
        <Table
            order={props.order}
            sort={props.sort}
            columns={columns} 
            filter={props.filter}
            getCellValue={getCellValues} 
            fetchPage={fetchNextPage}
            onDeleteRow={onDeleteRow}
            onSaveRow={onSaveRow}
        />
    )    
}

interface TableAnimalProps {
    filter: AnimalFilter
    sort: string
    order: string
}
