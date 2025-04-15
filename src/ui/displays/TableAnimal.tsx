import { JSX, useEffect, useState } from "react";
import { Table } from "../components/table/Table";
import { Animal, AnimalFilter } from "../../types/Animal";
import { Page } from "../../types/Page";

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

const auth = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDQ3NjcxMjgsInVzZXJfaWQiOiIxMDAyNjdjMC1hZWE5LTRlZjItOThhMC00MWM0ODU3MDYyZDIifQ.Y-1CNW63uj8F72QVh2twhZV77DHOdPeEiNmvBV4Yyhs'
const fixedUrl = "http://localhost:8080/animals/page?sort=name&order=asc"

export const TableAnimal = function (filter: AnimalFilter): JSX.Element {
    const columns: string[] = [
        "Brinco",
        "Nome",
        "Data de Nascimento",
        "Data de Morte",
        "Intervalo de Parição Médio"
    ]

    const [page, setPage] = useState<Page<Animal> | null>(null)

    useEffect(() => {
        const requestOptions: RequestInit = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${auth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filter),
        }

        fetch(fixedUrl, requestOptions)
            .then(response => response.json())
            .then(page => {
                setPage(page)
            })
            .catch(() => setPage(null))
    }, [filter])

    const fetchNextPage = async (cursor: string): Promise<Page<Animal>> => {
        const requestOptions: RequestInit = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${auth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filter),
        }

        const response = await fetch(`${fixedUrl}&cursor=${cursor}`, requestOptions);
        return await response.json();
    }

    return(
        <Table 
            columns={columns} 
            page={page} 
            getCellValue={getCellValues} 
            fetchNextPage={fetchNextPage}
        />
    )    
}
