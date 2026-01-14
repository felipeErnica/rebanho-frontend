import {
    createContext,
    Dispatch,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react"
import { MilkEntry, MilkEntryFoot, MilkEntrySave } from "./Entities"
import { deleteMilkEntry, getGroupEntries, getGroupEntriesFoot, updateMilkEntry } from "./Service"
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
} from "@shared/table/TableComponents"
import { decimalTransform } from "@utils/Transformations"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import { AddMilkEntryDialog } from "./AddMilkEntryDialog"
import Add from "@mui/icons-material/Add"
import { APIError } from "@utils/ApiRequest"

type ErrorContextProps = {
    setApiError: Dispatch<SetStateAction<APIError | undefined>>
}

const ErrorContext = createContext<ErrorContextProps>(undefined!)

type GroupEntriesTablePageProps = {
    entryDate: Date
}

export const GroupEntriesTablePage = ({ entryDate }: GroupEntriesTablePageProps) => {

    const defaultFoot: MilkEntryFoot = useMemo(() => ({
        animalsNumber: 0,
        totalMilk: 0,
        averageMilk: 0
    }), [])

    const [foot, setFoot] = useState<MilkEntryFoot>(defaultFoot)
    const [rows, setRows] = useState<MilkEntry[]>([])
    const [loading, setLoading] = useState(false)
    const [addMilkEntryOpen, setAddMilkEntryOpen] = useState(false)

    const getFoot = useCallback(() => {
        getGroupEntriesFoot(entryDate)
            .then(response => setFoot(response))
            .catch(() => setFoot(defaultFoot))
    }, [defaultFoot, entryDate])

    const onReload = useCallback(() => {
        setLoading(true)
        getFoot()
        getGroupEntries(entryDate)
            .then(response => setRows(response))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [entryDate, getFoot])

    useEffect(onReload, [onReload])

    const onClose = useCallback((added: boolean) => {
        setAddMilkEntryOpen(false)
        if (added) onReload()
    }, [onReload])

    const onDelete = useCallback((id: string) => {
        deleteMilkEntry(id)
            .then(response => {
                if (response.error) return
                setRows(prev => prev.filter(item => item.id != id))
                getFoot()
            })
    }, [getFoot, setRows])

    return <div className="w-full h-full overflow-hidden flex flex-col">
        <TableTopBar
            reloadProps={{ onReload }}
            otherProps={(
                <Button
                    onClick={() => setAddMilkEntryOpen(true)}
                    startIcon={<Add />}
                >
                    Marcar Leite
                </Button>
            )}
        />
        <EntriesTable {...{ rows, loading, foot, onDelete }} />
        <AddMilkEntryDialog {...{ addMilkEntryOpen, onClose, entryDate }} />
    </div>
}

type EntriesTableProps = {
    onDelete: (id: string) => void
    rows: MilkEntry[]
    foot: MilkEntryFoot
    loading: boolean
}

const EntriesTable = ({ rows, loading, foot, onDelete }: EntriesTableProps) => {

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
                    loading={loading}
                    render={item => <EntriesRow {...{ item, onDelete }} />}
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
    onDelete: (id: string) => void
    item: MilkEntry
}

const EntriesRow = ({ item, onDelete }: EntriesRowProps) => {

    const [rowData, setRowData] = useState<MilkEntry>(item)
    const [editing, setEditing] = useState(false)

    useEffect(() => setRowData(item), [item])

    if (editing) return <EntriesRowEditing {...{ rowData, setEditing, setRowData }} />

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons
                setEditing={setEditing}
                onDelete={() => onDelete(item.id)}
            />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
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

    const [loading, setLoading] = useState(false)

    const { control, handleSubmit } = useForm<MilkEntrySave>({ defaultValues: rowData })
    const { setApiError } = useContext(ErrorContext)

    const onSubmit: SubmitHandler<MilkEntrySave> = (data: MilkEntrySave) => {
        setLoading(true)
        updateMilkEntry(data)
            .then(response => {
                setApiError(undefined)
                setRowData(response)
                setEditing(false)
            })
            .catch((error) => setApiError(error))
            .finally(() => setLoading(false))
    }

    const onSave = handleSubmit(onSubmit)

    return <TableBodyRow>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing, loading }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell>{rowData.pastureName}</TableBodyCell>
        <TableBodyCell>
            <FormTextField type="number" formProps={{ control, name: 'quantity' }} />
        </TableBodyCell>
    </TableBodyRow>
}
