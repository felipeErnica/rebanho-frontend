import { Animal, AnimalFilter } from "@/types/Animal";
import { Page } from "@/types/Page";
import { ControlButton } from "@/ui/components/common/ControlButtons";
import { DetailsIcon, EditIcon, TrashIcon } from "@/ui/components/common/SvgIcons";
import { Table } from "@/ui/components/table/Table";
import { JSX, useCallback } from "react";
import { findPage } from "./api/AnimalController";

const getCellValues = (row: Animal, columnIndex: number) => {
    let value: any = null
    switch (columnIndex) {
        case 0:
            value = row.ringNumber
            break
        case 1:
            value = row.name
            break
        case 2:
            value = !row.birthDate ? null : row.birthDate.toString().substring(0,10)
            break
        case 3:
            value = !row.deathDate ? null : row.deathDate.toString().substring(0,10)
            break
        case 4:
            value = row.averageBirthInterval
            break
    }
    return value
}

export const TableAnimal = (props: TableAnimalProps): JSX.Element => {
    const columns: string[] = [
        "Brinco",
        "Nome",
        "Data de Nascimento",
        "Data de Morte",
        "Intervalo de Parição Médio"
    ]

    const controlButtons = [
        <ControlButton icon={TrashIcon} />,
        <ControlButton icon={EditIcon} />,
        <ControlButton icon={DetailsIcon} />,
    ]


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
            controlButtons={controlButtons}
        />
    )    
}

interface TableAnimalProps {
    filter: AnimalFilter
    sort: string
    order: string
}
