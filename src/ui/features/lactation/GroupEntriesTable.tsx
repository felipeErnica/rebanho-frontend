import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { MilkEntry, MilkEntryFoot } from "./Entities"
import { getGroupEntries, getGroupEntriesFoot } from "./Controller"
import Table from "@mui/material/Table"
import { Button, TableBody, TableHead } from "@mui/material"
import {
    FooterContent,
    StickyTableFooter,
    TableBodyCell,
    TableBodyContainer,
    TableBodyRow,
    TableFooterRow,
    TableHeadCell,
    TableHeadRow,
} from "@/ui/shared/table/TableComponents"
import { decimalTransform } from "@/util/Transformations"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
import { AddMilkEntryDialog } from "./AddMilkEntryDialog"
import Add from "@mui/icons-material/Add"

type GroupEntriesTableProps = {
    entryDate: Date
}

export const GroupEntriesTablePage = ({ entryDate }: GroupEntriesTableProps) => {

    const defaultFoot: MilkEntryFoot = useMemo(() => ({
        animalsNumber: 0,
        totalMilk: 0,
        averageMilk: 0
    }), [])

    const [foot, setFoot] = useState<MilkEntryFoot>(defaultFoot)
    const [rows, setRows] = useState<MilkEntry[]>([])
    const [loading, setLoading] = useState(false)
    const [addMilkEntryOpen, setAddMilkEntryOpen] = useState(false)

    const onReload = useCallback(() => {
        setLoading(true)
        getGroupEntriesFoot(new Date(entryDate))
            .then(response => setFoot(response.json))
            .catch(() => setFoot(defaultFoot))
        getGroupEntries(new Date(entryDate))
            .then(response => setRows(response.json))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [])

    useEffect(onReload, [onReload])

    return <div className="w-full h-full overflow-hidden flex flex-col">
        <TableTopBar
            reloadProps={{ onReload }}
            otherProps={(
                <Button
                    variant="outlined"
                    onClick={() => setAddMilkEntryOpen(true)}
                    startIcon={<Add />}
                >
                    Marcar Leite
                </Button>
            )}
        />
        <EntriesTable {...{ rows, loading, foot }} />
        <AddMilkEntryDialog {...{ addMilkEntryOpen, setAddMilkEntryOpen, entryDate }} />
    </div>
}

type EntriesTableProps = {
    rows: MilkEntry[]
    foot: MilkEntryFoot
    loading: boolean
}

const EntriesTable = ({ rows, loading, foot }: EntriesTableProps) => {

    const [unit, setUnit] = useState(0)
    const tableRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleResize = () => {
            if (!tableRef.current) return
            const table = tableRef.current
            setUnit(table.offsetWidth / 100)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return <div
        className="overflow-auto"
        ref={tableRef}
    >
        <Table stickyHeader>
            <TableHead>
                <TableHeadRow>
                    <TableHeadCell width={unit * 10} />
                    <TableHeadCell width={unit * 40}>Vaca</TableHeadCell>
                    <TableHeadCell width={unit * 40}>Pasto</TableHeadCell>
                    <TableHeadCell width={unit * 10}>Quantidade</TableHeadCell>
                </TableHeadRow>
            </TableHead>
            <TableBody>
                <TableBodyContainer
                    dataset={rows}
                    colSpan={4}
                    loadingProps={{ loading, rowSpan: 20 }}
                    render={item => <EntriesRow {...{ item }} />}
                />
            </TableBody>
            <StickyTableFooter>
                <TableFooterRow colSpan={4}>
                    <FooterContent title="Total" content={foot.animalsNumber} />
                    <FooterContent title="Produção Média" content={decimalTransform(foot.averageMilk)} />
                    <FooterContent title="Produção Total" content={decimalTransform(foot.totalMilk)} />
                </TableFooterRow>
            </StickyTableFooter>
        </Table>
    </div>
}

type EntriesRowProps = {
    item: MilkEntry
}

const EntriesRow = ({ item }: EntriesRowProps) => {

    const [rowData, setRowData] = useState<MilkEntry>(item)
    const [editing, setEditing] = useState(false)

    useEffect(() => setRowData(item), [item])

    if (editing) return <EntriesRowEditing {...{ rowData, setEditing, setRowData }} />

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalName}</TableBodyCell>
        <TableBodyCell>{rowData.pastureName}</TableBodyCell>
        <TableBodyCell>{decimalTransform(rowData.quantity ?? 0, 1)}</TableBodyCell>
    </TableBodyRow>
}

type EntriesRowEditingProps = {
    rowData: MilkEntry
    setRowData: (rowData: MilkEntry) => void
    setEditing: (editing: boolean) => void
}

const EntriesRowEditing = ({ rowData, setRowData, setEditing }: EntriesRowEditingProps) => {

    const { control, handleSubmit } = useForm<MilkEntry>({ defaultValues: rowData })

    const onSubmit: SubmitHandler<MilkEntry> = (data: MilkEntry) => {
        setRowData(data)
        setEditing(false)
    }

    const onSave = handleSubmit(onSubmit)

    return <TableBodyRow>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalName}</TableBodyCell>
        <TableBodyCell>{rowData.pastureName}</TableBodyCell>
        <TableBodyCell>
            <FormTextField type="number" formProps={{ control, name: 'quantity' }} /> 
        </TableBodyCell>
    </TableBodyRow>
}
