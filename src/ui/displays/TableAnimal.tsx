import { JSX, useCallback, useEffect, useState } from "react";
import { Table } from "../components/table/Table";
import { Animal, AnimalFilter } from "../../types/Animal";
import { Page } from "../../types/Page";
import { findPage } from "../../controllers/AnimalController";

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

    const [page, setPage] = useState<Page<Animal> | null>(null)

    useEffect(() => {
        console.log(props.filter)
        findPage(props.sort, props.order, '', props.filter).
            then(response => {
                setPage(response)
            }).
            catch(() => setPage(null))
    }, [props, props.filter])

    const fetchNextPage = useCallback(async (cursor: string): Promise<Page<Animal>> => {
        return findPage(props.sort, props.order, cursor, props.filter)
    }, [props])

    return(
        <Table
            columns={columns} 
            page={page} 
            getCellValue={getCellValues} 
            fetchNextPage={fetchNextPage}
        />
    )    
}

interface TableAnimalProps {
    filter: AnimalFilter
    sort: string
    order: string
}
