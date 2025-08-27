import {
    VirtuosoResizeHeadCell,
    TableBodyCell,
    TableHeadRow,
    TableLoadingCells,
    TableFooterRow,
    VirtuosoHeadCell,
    TableFooterTitleCell,
    TableFooterCell,
} from "@/ui/shared/table/TableComponents"
import { PastureEntry } from "./Entities"
import { RefObject, useEffect, useRef, useState } from "react"
import { dateTransform } from "@/util/Transformations"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { useForm } from "react-hook-form"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { VirtuosoTableComponents } from "@/ui/shared/table/PageTable"
import { TableVirtuoso, VirtuosoHandle } from 'react-virtuoso'

type PastureEntriesTableProps = {
    scrollRef: RefObject<VirtuosoHandle | null>
    fetchNextPage: () => void
    rows: PastureEntry[]
    total: number
    isLoading: boolean
}

export const PastureEntriesTable = ({ fetchNextPage, rows, isLoading, scrollRef, total }: PastureEntriesTableProps) => {

    const [tableWidth, setTableWidth] = useState(0)
    const tableRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleResize = () => {
            if (!tableRef.current) return
            const table = tableRef.current
            setTableWidth(table.offsetWidth)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return <div className="h-full w-full">
        <TableVirtuoso
            ref={scrollRef}
            scrollerRef={(ref) => tableRef.current = ref as HTMLDivElement}
            data={rows}
            components={VirtuosoTableComponents}
            endReached={fetchNextPage}
            fixedHeaderContent={() => {
                const unit = tableWidth/100
                return <TableHeadRow>
                    <VirtuosoHeadCell width={unit * 10} />
                    <VirtuosoResizeHeadCell width={unit * 5}>Brinco</VirtuosoResizeHeadCell>
                    <VirtuosoResizeHeadCell width={unit * 20}>Nome</VirtuosoResizeHeadCell>
                    <VirtuosoResizeHeadCell width={unit * 15}>Mãe</VirtuosoResizeHeadCell>
                    <VirtuosoResizeHeadCell width={unit * 10}>Pai</VirtuosoResizeHeadCell>
                    <VirtuosoResizeHeadCell width={unit * 20}>Data de Nascimento</VirtuosoResizeHeadCell>
                    <VirtuosoResizeHeadCell width={unit * 20}>Data de Entrada</VirtuosoResizeHeadCell>
                </TableHeadRow>
            }}
            fixedFooterContent={() => (
                <TableFooterRow>
                    <TableFooterTitleCell colSpan={2}>Total de Entradas</TableFooterTitleCell>
                    <TableFooterCell colSpan={7}>{total}</TableFooterCell>
                </TableFooterRow>
            )}
            itemContent={(_, row) => isLoading ? <TableLoadingCells colSpan={7} /> : <PastureEntriesRow {...row} />}
        />
    </div>
}

const PastureEntriesRow = (row: PastureEntry) => {

    const [isEditing, setEditing] = useState(false)
    const [rowValues, setRowValues] = useState<PastureEntry>(row)

    useEffect(() => setRowValues(row), [row])

    if (isEditing) return <PastureEntriesEditRow {...{ setEditing, setRowValues, rowValues }} />
    return <PastureEntriesNormalRow {...{ rowValues, setEditing }} />
}

type PastureEntriesNormalRowProps = {
    rowValues: PastureEntry
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
        <TableBodyCell>{dateTransform(rowValues.animalBirthDate)}</TableBodyCell>
        <TableBodyCell>{dateTransform(rowValues.entryDate)}</TableBodyCell>
    </>
}

type PastureEntriesEditRowProps = {
    rowValues: PastureEntry
    setRowValues: (rowValues: PastureEntry) => void
    setEditing: (isEditing: boolean) => void
}

const PastureEntriesEditRow = ({ rowValues, setRowValues, setEditing }: PastureEntriesEditRowProps) => {

    const { handleSubmit, control } = useForm<PastureEntry>({ defaultValues: rowValues })
    const onSubmit = (data: PastureEntry) => {
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
        <TableBodyCell>{dateTransform(rowValues.animalBirthDate)}</TableBodyCell>
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
