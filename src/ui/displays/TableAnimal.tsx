import { JSX, useEffect, useState } from "react";
import { DataRow, Table } from "../components/table/Table";
import { Animal } from "../../types/Animal";

function fetchData(data: string): DataRow[] {
    const animals: Animal[] = JSON.parse(data)
    let rows: DataRow[] = []
    animals.map((animal) => {
        const row: DataRow = {
            items: [
                animal.ringNumber,
                animal.name,
                animal.birthDate,
                animal.deathDate,
                animal.averageBirthInterval
            ]
        }

    })
}


export const TableAnimal = ():JSX.Element => {
    const columns: string[] = [
        "Brinco",
        "Nome",
        "Data de Nascimento",
        "Data de Morte",
        "Intervalo de Parição Médio"
    ]


    const [animals, setAnimals] = useState<DataRow[]>([])

    useEffect(() => {
        const requestOptions = {
            method: "POST",
            body: JSON.stringify({ isFiltered: false}),
        }

        fetch("localhost:8080/animals/", requestOptions)
            .then(response => response.json())
            .then(data => {
                const rowData: DataRow[] = fetchData(JSON.stringify(data))
                setAnimals(rowData)
            })
    })


    return (
        <Table columns={columns} rows={animals}/>
    )
}
