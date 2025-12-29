import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { MilkEntry, MilkEntryFoot, MilkEntrySave } from "./Entities"
import { deleteMilkEntry, getLactationEntries, getLactationEntriesFoot, updateMilkEntry } from "./Controller"
import Table from "@mui/material/Table"
import { TableBody, TableHead } from "@mui/material"
import {
    FooterContent,
    StickyTableFooter,
    TableBodyCell,
    TableBodyContainer,
    TableBodyRow,
    TableFooterRow,
    TableHeadCell,
    TableHeadControlCell,
    TableHeadRow,
} from "@shared/table/TableComponents"
import { dateTransform, decimalTransform } from "@utils/Transformations"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { APIError } from "@/utils/ApiRequest"
import { ErrorDialog } from "@/components/shared/dialog/DialogComponents"
import { useParams } from "react-router"

type ErrorContextProps = {
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setRows: Dispatch<SetStateAction<MilkEntry[]>>
    loadFoot: () => void
}

const EditContext = createContext<ErrorContextProps>(undefined!)

export const LactationEntriesTablePage = () => {

    const defaultFoot: MilkEntryFoot = useMemo(() => ({
        animalsNumber: 0,
        totalMilk: 0,
        averageMilk: 0
    }), [])

    const [foot, setFoot] = useState<MilkEntryFoot>(defaultFoot)
    const [rows, setRows] = useState<MilkEntry[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<APIError>(undefined)

    const { lactationId } = useParams<{ lactationId: string }>()

    const loadFoot = useCallback(() => {
        getLactationEntriesFoot(lactationId)
            .then(response => setFoot(response))
            .catch(() => setFoot(defaultFoot))
    }, [defaultFoot, lactationId])

    const onReload = useCallback(() => {
        setLoading(true)
        loadFoot()
        getLactationEntries(lactationId)
            .then(response => setRows(response))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [lactationId, loadFoot])

    useEffect(onReload, [onReload])

    return <div className="w-full h-full overflow-hidden flex flex-col">
        <TableTopBar reloadProps={{ onReload }} />
        <EditContext.Provider value={{ setError, setRows, loadFoot }}>
            <EntriesTable {...{ rows, loading, foot }} />
        </EditContext.Provider>
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            content={error?.message}
            onClose={() => setError(undefined)}
        />
    </div>
}

type EntriesTableProps = {
    rows: MilkEntry[]
    foot: MilkEntryFoot
    loading: boolean
}

const EntriesTable = ({ rows, loading, foot }: EntriesTableProps) => {

    return <div className="overflow-auto">
        <Table stickyHeader>
            <TableHead>
                <TableHeadRow>
                    <TableHeadControlCell />
                    <TableHeadCell>Pasto</TableHeadCell>
                    <TableHeadCell align="center">Data da Marcação</TableHeadCell>
                    <TableHeadCell align="center">Quantidade</TableHeadCell>
                </TableHeadRow>
            </TableHead>
            <TableBody>
                <TableBodyContainer
                    dataset={rows}
                    colSpan={4}
                    loading={loading}
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
    const [loading, setLoading] = useState(false)

    const { setError, setRows, loadFoot } = useContext(EditContext)

    useEffect(() => setRowData(item), [item])

    if (editing) return <EntriesRowEditing {...{ rowData, setEditing, setRowData }} />

    const onDelete = () => {
        setLoading(true)
        deleteMilkEntry(rowData.id)
            .then(() => {
                setRows(rows => rows.filter(item => item.id != rowData.id))
                loadFoot()
                setError(undefined)
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing, onDelete, loading }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.pastureName}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.entryDate)}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.quantity ?? 0, 1)}</TableBodyCell>
    </TableBodyRow>
}

type EntriesRowEditingProps = {
    rowData: MilkEntry
    setRowData: (rowData: MilkEntry) => void
    setEditing: (editing: boolean) => void
}

const EntriesRowEditing = ({ rowData, setRowData, setEditing }: EntriesRowEditingProps) => {

    const [loading, setLoading] = useState(false)

    const { control, handleSubmit } = useForm<MilkEntrySave>({ defaultValues: rowData })
    const { setError } = useContext(EditContext)

    const onSubmit: SubmitHandler<MilkEntrySave> = (data: MilkEntrySave) => {
        setLoading(true)
        updateMilkEntry(data)
            .then(response => {
                setRowData(response)
                setEditing(false)
            })
            .catch((error) => setError(error))
            .finally(() => setLoading(false))
    }


    const onSave = handleSubmit(onSubmit)

    return <TableBodyRow>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing, loading }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.pastureName}</TableBodyCell>
        <TableBodyCell align="center">
            <FormDatePicker formProps={{ name: 'entryDate', control }} />
        </TableBodyCell>
        <TableBodyCell align="center">
            <FormTextField
                className="w-[80px]"
                type="number"
                formProps={{ control, name: 'quantity' }}
            />
        </TableBodyCell>
    </TableBodyRow>
}
