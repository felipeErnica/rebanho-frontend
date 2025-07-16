import { Skeleton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import { useEffect, useState } from "react"
import { AnimalFarm } from "./Entities"
import { TableHeadCell } from "@/ui/shared/table/TableHeadComponent"
import { EditRow, NormalRow } from "@/ui/shared/table/Entities"
import { dateTransform } from "@/util/Transformations"
import { ControlButtonContainer, DeleteControlButton, EditControlButton, EditingButtonControls } from "@/ui/shared/table/ControlButtons"
import { useForm } from "react-hook-form"
import { findAnimalsByFarm } from "./Controller"

type FarmAnimalsTableProps = {
    farmId: string
}

export const FarmAnimalsTable = ({ farmId }: FarmAnimalsTableProps) => {
    return <div className="h-full w-full flex flex-col">
        <MainTable {...{ farmId }} />
    </div>
}

const MainTable = ({ farmId }: FarmAnimalsTableProps) => {

    const [isLoading, setLoading] = useState(false)
    const [rows, setRows] = useState<AnimalFarm[]>([])

    useEffect(() => {
        setLoading(true)
        findAnimalsByFarm(farmId)
            .then(response => setRows(response.json))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [farmId])

    return <div className="h-full w-full overflow-auto">
        <Table>
            <TableHead>
                <TableHeadCell colSpan={2}>Brinco</TableHeadCell>
                <TableHeadCell>Nome</TableHeadCell>
                <TableHeadCell>Sexo</TableHeadCell>
                <TableHeadCell>Data de Nascimento</TableHeadCell>
                <TableHeadCell>Data de Morte</TableHeadCell>
                <TableHeadCell>Mãe</TableHeadCell>
                <TableHeadCell>Pai</TableHeadCell>
                <TableHeadCell>Tipo de Animal</TableHeadCell>
                <TableHeadCell>Pasto</TableHeadCell>
            </TableHead>
            <TableBody>
                {isLoading && 
                    <TableCell colSpan={10}>
                        <Skeleton animation='pulse' variant="rectangular" />
                    </TableCell>
                }
                {rows.map(row => <AnimalFarmRow {...row} />)}
            </TableBody>
        </Table>
    </div>
}

const AnimalFarmRow = (row: AnimalFarm) => {

    const [isEditing, setEditing] = useState(false)
    const [rowValue, setRowValue] = useState(row)

    if (isEditing) return <AnimalFarmEditRow {...{ setRowValue, setEditing, rowValue }} />
    return <AnimalFarmNormalRow {...{ setEditing, rowValue }} />
}

const AnimalFarmNormalRow = ({ rowValue, setEditing }: NormalRow<AnimalFarm>) => {
    return <TableRow>
        <TableCell>
            <ControlButtonContainer>
                <EditControlButton setEditing={setEditing} />
                <DeleteControlButton onDelete={() => console.log("delete", rowValue.name)} />
            </ControlButtonContainer>
        </TableCell>
        <TableCell>{rowValue.ringNumber}</TableCell>
        <TableCell>{rowValue.name}</TableCell>
        <TableCell>{rowValue.sex}</TableCell>
        <TableCell>{dateTransform(rowValue.birthDate)}</TableCell>
        <TableCell>{dateTransform(rowValue.deathDate)}</TableCell>
        <TableCell>{rowValue.motherName}</TableCell>
        <TableCell>{rowValue.farmName}</TableCell>
        <TableCell>{rowValue.animalType}</TableCell>
        <TableCell>{rowValue.pastureName}</TableCell>
    </TableRow>
}

const AnimalFarmEditRow = ({ rowValue, setEditing, setRowValue }: EditRow<AnimalFarm>) => {

    const { handleSubmit } = useForm({ defaultValues: rowValue })

    const onSubmit = (data: AnimalFarm) => {
        console.log("data", data)
        setRowValue(data)
    }

    return <TableRow>
        <TableCell>
            <EditingButtonControls
                setEditing={setEditing}
                onSave={handleSubmit(onSubmit)}
            />
        </TableCell>
    </TableRow>
}
