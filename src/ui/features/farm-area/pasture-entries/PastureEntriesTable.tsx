import {
    TableBodyCell,
    TableHeadCell,
    TableHeadRow,
} from "@/ui/shared/table/TableComponents"
import { PastureEntries } from "./Entities"
import { useEffect, useState } from "react"
import { dateTransformToLocale } from "@/util/Transformations"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { useForm } from "react-hook-form"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { PaginationResponse, VirtuosoTableComponents } from "@/ui/shared/table/PageTable"
import { TableVirtuoso } from 'react-virtuoso'

type PastureEntriesTableProps = {
    pagination: PaginationResponse
    isLoading: boolean
}

export const PastureEntriesTable = ({ pagination: { rows, handleScroll, scrollRef, calculateRef } }: PastureEntriesTableProps) => {

    return <div className="h-full w-full">
        <TableVirtuoso
            onResize={calculateRef}
            onScroll={handleScroll}
            scrollerRef={(ref) => scrollRef.current = ref as HTMLDivElement}
            data={rows}
            components={VirtuosoTableComponents}
            fixedHeaderContent={() => (
                <TableHeadRow>
                    <TableHeadCell />
                    <TableHeadCell>Brinco</TableHeadCell>
                    <TableHeadCell>Nome</TableHeadCell>
                    <TableHeadCell>Data de Nascimento</TableHeadCell>
                    <TableHeadCell>Data de Entrada</TableHeadCell>
                </TableHeadRow>
            )}
            itemContent={(_, row) => <PastureEntriesRow {...row} />}
        />
    </div>
}

const PastureEntriesRow = (row: PastureEntries) => {

    const [isEditing, setEditing] = useState(false)
    const [rowValues, setRowValues] = useState<PastureEntries>(row)

    useEffect(() => setRowValues(row), [row])

    if (isEditing) return <PastureEntriesEditRow {...{ setEditing, setRowValues, rowValues }} />
    return <PastureEntriesNormalRow {...{ rowValues, setEditing }} />
}

type PastureEntriesNormalRowProps = {
    rowValues: PastureEntries
    setEditing: (isEditing: boolean) => void
}

const PastureEntriesNormalRow = ({ rowValues, setEditing }: PastureEntriesNormalRowProps) => {
    return <>
        <TableBodyCell>
            <EditControlButtons {...{
                setEditing,
                onDelete: () => console.log('delete entry: ', rowValues)
            }} />
        </TableBodyCell>
        <TableBodyCell>{rowValues.animalRingNumber}</TableBodyCell>
        <TableBodyCell>{rowValues.animalName}</TableBodyCell>
        <TableBodyCell>{dateTransformToLocale(rowValues.animalBirthDate)}</TableBodyCell>
        <TableBodyCell>{dateTransformToLocale(rowValues.entryDate)}</TableBodyCell>
    </>
}

type PastureEntriesEditRowProps = {
    rowValues: PastureEntries
    setRowValues: (rowValues: PastureEntries) => void
    setEditing: (isEditing: boolean) => void
}

const PastureEntriesEditRow = ({ rowValues, setRowValues, setEditing }: PastureEntriesEditRowProps) => {

    const { handleSubmit, control } = useForm<PastureEntries>({ defaultValues: rowValues })
    const onSubmit = (data: PastureEntries) => {
        setRowValues(data)
        console.log("entry save: ", data)
    }

    return <>
        <TableBodyCell>
            <EditingControlButtons {...{ setEditing, onSave: handleSubmit(onSubmit) }} />
        </TableBodyCell>
        <TableBodyCell>{rowValues.animalRingNumber}</TableBodyCell>
        <TableBodyCell>{rowValues.animalName}</TableBodyCell>
        <TableBodyCell>{dateTransformToLocale(rowValues.animalBirthDate)}</TableBodyCell>
        <TableBodyCell>
            <FormDatePicker
                formProps={{
                    control,
                    name: 'entryDate'
                }}
            />
        </TableBodyCell>
    </>
}
