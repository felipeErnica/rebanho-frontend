import {
    VirtuosoHeadCell,
    TableBodyCell,
    TableHeadRow,
    TableLoadingCells,
} from "@/ui/shared/table/TableComponents"
import { PastureEntries } from "./Entities"
import { RefObject, useEffect, useRef, useState } from "react"
import { dateTransformToLocale } from "@/util/Transformations"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { useForm } from "react-hook-form"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { VirtuosoTableComponents } from "@/ui/shared/table/PageTable"
import { TableVirtuoso, VirtuosoHandle } from 'react-virtuoso'

type PastureEntriesTableProps = {
    scrollRef: RefObject<VirtuosoHandle | null>
    fetchNextPage: () => void
    rows: PastureEntries[]
    isLoading: boolean
}

export const PastureEntriesTable = ({ fetchNextPage, rows, isLoading, scrollRef }: PastureEntriesTableProps) => {

    const tableRef = useRef<HTMLDivElement>(null)

    return <div className="h-full w-full">
        <TableVirtuoso
            ref={scrollRef}
            scrollerRef={(ref) => tableRef.current = ref as HTMLDivElement}
            data={rows}
            components={VirtuosoTableComponents}
            endReached={fetchNextPage}
            fixedHeaderContent={() => {
                const table = tableRef.current
                if (!table) return
                const tableWidth = table.offsetWidth / 100

                return <TableHeadRow>
                    <VirtuosoHeadCell width={tableWidth * 10} />
                    <VirtuosoHeadCell width={tableWidth * 10}>Brinco</VirtuosoHeadCell>
                    <VirtuosoHeadCell width={tableWidth * 20}>Nome</VirtuosoHeadCell>
                    <VirtuosoHeadCell width={tableWidth * 10}>Mãe</VirtuosoHeadCell>
                    <VirtuosoHeadCell width={tableWidth * 10}>Pai</VirtuosoHeadCell>
                    <VirtuosoHeadCell width={tableWidth * 20}>Data de Nascimento</VirtuosoHeadCell>
                    <VirtuosoHeadCell width={tableWidth * 20}>Data de Entrada</VirtuosoHeadCell>
                </TableHeadRow>
            }}
            itemContent={(_, row) => isLoading ? <TableLoadingCells colSpan={7} /> : <PastureEntriesRow {...row} />}
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
        <TableBodyCell>{rowValues.animalMother}</TableBodyCell>
        <TableBodyCell>{rowValues.animalFather}</TableBodyCell>
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
        <TableBodyCell>{rowValues.animalMother}</TableBodyCell>
        <TableBodyCell>{rowValues.animalFather}</TableBodyCell>
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
