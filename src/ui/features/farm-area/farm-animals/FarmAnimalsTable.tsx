import { Ref, useState } from "react"
import { AnimalFarm } from "./Entities"
import { EditRow, NormalRow } from "@/ui/shared/table/Entities"
import { dateTransformToLocale } from "@/util/Transformations"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { useForm } from "react-hook-form"
import {
    VirtuosoHeadCell,
    TableBodyCell,
    TableHeadCell,
    TableHeadRow,
    TableLoadingCells
} from "@/ui/shared/table/TableComponents"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { searchPasture, searchPastureById } from "@/shared/GlobalApiCalls"
import { transformAnimalType } from "../../animals/shared/AnimalEntities"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import { VirtuosoTableComponents } from "@/ui/shared/table/PageTable"

type FarmAnimalsTableProps = {
    rows: AnimalFarm[]
    isLoading: boolean
    scrollRef: Ref<VirtuosoHandle>
    fetchNextPage: () => void
}

export const FarmAnimalsTable = ({ rows, isLoading, scrollRef, fetchNextPage }: FarmAnimalsTableProps) => {
    return <TableVirtuoso
        components={VirtuosoTableComponents}
        ref={scrollRef}
        data={rows}
        endReached={fetchNextPage}
        fixedHeaderContent={() => (
            <TableHeadRow>
                <TableHeadCell />
                <VirtuosoHeadCell>Brinco</VirtuosoHeadCell>
                <VirtuosoHeadCell>Nome</VirtuosoHeadCell>
                <VirtuosoHeadCell>Sexo</VirtuosoHeadCell>
                <VirtuosoHeadCell>Data de Nascimento</VirtuosoHeadCell>
                <VirtuosoHeadCell>Mãe</VirtuosoHeadCell>
                <VirtuosoHeadCell>Pai</VirtuosoHeadCell>
                <VirtuosoHeadCell>Tipo de Animal</VirtuosoHeadCell>
                <VirtuosoHeadCell>Pasto</VirtuosoHeadCell>
            </TableHeadRow>
        )}
        itemContent={(_, row) => isLoading ? <TableLoadingCells colSpan={9} /> : <AnimalFarmRow {...row} />}
    />
}

const AnimalFarmRow = (row: AnimalFarm) => {

    const [isEditing, setEditing] = useState(false)
    const [rowValue, setRowValue] = useState(row)

    if (isEditing) return <AnimalFarmEditRow {...{ setRowValue, setEditing, rowValue }} />
    return <AnimalFarmNormalRow {...{ setEditing, rowValue }} />
}

const AnimalFarmNormalRow = ({ rowValue, setEditing }: NormalRow<AnimalFarm>) => {
    return <>
        <TableBodyCell>
            <EditControlButtons
                setEditing={setEditing}
                onDelete={() => console.log("delete", rowValue.name)}
            />
        </TableBodyCell>
        <TableBodyCell>{rowValue.ringNumber}</TableBodyCell>
        <TableBodyCell>{rowValue.name}</TableBodyCell>
        <TableBodyCell>{rowValue.sex}</TableBodyCell>
        <TableBodyCell>{dateTransformToLocale(rowValue.birthDate)}</TableBodyCell>
        <TableBodyCell>{rowValue.motherName}</TableBodyCell>
        <TableBodyCell>{rowValue.fatherName}</TableBodyCell>
        <TableBodyCell>{transformAnimalType(rowValue.animalType, rowValue.sex)}</TableBodyCell>
        <TableBodyCell>{rowValue.pastureName}</TableBodyCell>
    </>
}

const AnimalFarmEditRow = ({ rowValue, setEditing, setRowValue }: EditRow<AnimalFarm>) => {

    const { handleSubmit, control, setValue } = useForm({ defaultValues: rowValue })

    const onSubmit = (data: AnimalFarm) => {
        console.log("data", data)
        setRowValue(data)
    }

    const handlePastureSearch = (input?: string) => searchPasture(input, rowValue.farmId)
    const handlePastureSearchById = (id?: string) => searchPastureById(id, rowValue.farmId)

    return <>
        <TableBodyCell>
            <EditingControlButtons
                setEditing={setEditing}
                onSave={handleSubmit(onSubmit)}
            />
        </TableBodyCell>
        <TableBodyCell>{rowValue.ringNumber}</TableBodyCell>
        <TableBodyCell>{rowValue.name}</TableBodyCell>
        <TableBodyCell>{rowValue.sex}</TableBodyCell>
        <TableBodyCell>{dateTransformToLocale(rowValue.birthDate)}</TableBodyCell>
        <TableBodyCell>{rowValue.motherName}</TableBodyCell>
        <TableBodyCell>{rowValue.fatherName}</TableBodyCell>
        <TableBodyCell>{transformAnimalType(rowValue.animalType, rowValue.sex)}</TableBodyCell>
        <TableBodyCell>
            <FormSearchBox
                searchByInput={handlePastureSearch}
                searchById={handlePastureSearchById}
                onChange={(_, label) => setValue('pastureName', label)}
                formProps={{
                    control,
                    name: 'pastureId'
                }}
            />
        </TableBodyCell>
    </>
}
