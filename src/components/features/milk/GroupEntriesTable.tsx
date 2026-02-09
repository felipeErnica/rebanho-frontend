import {
    createContext,
    Dispatch,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useMemo,
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
    TableHeadControlCell,
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
import { getAnimalLabel } from "@features/animals/Entities"
import { getPastureLabel } from "@features/farm-area/Entities"
import { ErrorDialog } from "@shared/dialog/DialogComponents"

type ErrorContextProps = {
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setRows: Dispatch<SetStateAction<MilkEntry[]>>
    getFoot: () => void
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
    const [error, setError] = useState<APIError>()

    const getFoot = useCallback(() => {
        getGroupEntriesFoot(entryDate)
            .then(response => setFoot(response))
            .catch(() => setFoot(defaultFoot))
    }, [defaultFoot, entryDate])

    const onReload = useCallback(() => {
        setLoading(true)
        getFoot()
        getGroupEntries(entryDate)
            .then(response => {
                setRows(response)
                console.log(response)
            })
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [entryDate, getFoot])

    useEffect(onReload, [onReload])

    const onClose = useCallback((added: boolean) => {
        setAddMilkEntryOpen(false)
        if (added) onReload()
    }, [onReload])


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
        <ErrorContext.Provider value={{ setError, setRows, getFoot }}>
            <EntriesTable {...{ rows, loading, foot }} />
        </ErrorContext.Provider>
        <AddMilkEntryDialog {...{ addMilkEntryOpen, onClose, entryDate }} />
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            message={error?.message}
            onClose={() => setError(undefined)}
        />
    </div>
}

type EntriesTableProps = {
    rows: MilkEntry[]
    foot: MilkEntryFoot
    loading: boolean
}

const COLUMN_COUNT = 4

const EntriesTable = ({ rows, loading, foot }: EntriesTableProps) => {

    return <div className="overflow-auto">
        <Table stickyHeader>
            <TableHead>
                <TableHeadRow>
                    <TableHeadControlCell />
                    <TableHeadCell>Vaca</TableHeadCell>
                    <TableHeadCell width={700}>Pasto</TableHeadCell>
                    <TableHeadCell width={400}>Quantidade</TableHeadCell>
                </TableHeadRow>
            </TableHead>
            <TableBody>
                <TableBodyContainer
                    dataset={rows}
                    colSpan={COLUMN_COUNT}
                    loading={loading}
                    render={item => <EntriesRow {...item} />}
                />
            </TableBody>
            <StickyTableFooter>
                <TableFooterRow colSpan={COLUMN_COUNT}>
                    <FooterContent title="Total" content={foot.animalsNumber} />
                    <FooterContent title="Produção Média" content={decimalTransform(foot.averageMilk)} />
                    <FooterContent title="Produção Total" content={decimalTransform(foot.totalMilk)} />
                </TableFooterRow>
            </StickyTableFooter>
        </Table>
    </div>
}

const EntriesRow = (item: MilkEntry) => {

    const [rowData, setRowData] = useState<MilkEntry>(item)
    const [editing, setEditing] = useState(false)

    const { getFoot, setRows, setError } = useContext(ErrorContext)

    useEffect(() => setRowData(item), [item])

    const onDelete = useCallback((id: string) => {
        deleteMilkEntry(id)
            .then(() => {
                setRows(prev => prev.filter(item => item.id != id))
                getFoot()
            })
            .catch(err => setError(err))
    }, [getFoot, setRows])

    if (editing) return <EntriesRowEditing {...{ rowData, setEditing, setRowData }} />

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons
                setEditing={setEditing}
                onDelete={() => onDelete(item.id)}
            />
        </TableBodyCell>
        <TableBodyCell>{getAnimalLabel(rowData.cow)}</TableBodyCell>
        <TableBodyCell>{getPastureLabel(rowData.pasture)}</TableBodyCell>
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
    const { setError } = useContext(ErrorContext)

    const onSubmit: SubmitHandler<MilkEntrySave> = (data: MilkEntrySave) => {
        setLoading(true)
        updateMilkEntry(data)
            .then(response => {
                setError(undefined)
                setRowData(response)
                setEditing(false)
            })
            .catch(error => setError(error))
            .finally(() => setLoading(false))
    }

    const onSave = handleSubmit(onSubmit)

    return <TableBodyRow>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing, loading }} />
        </TableBodyCell>
        <TableBodyCell>{getAnimalLabel(rowData.cow)}</TableBodyCell>
        <TableBodyCell>{getPastureLabel(rowData.pasture)}</TableBodyCell>
        <TableBodyCell>
            <FormTextField
                className="w-[90px]"
                formProps={{ control, name: 'quantity' }}
                type="number"
            />
        </TableBodyCell>
    </TableBodyRow>
}
