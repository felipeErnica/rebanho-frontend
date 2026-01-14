import {
    createContext,
    Dispatch,
    RefObject,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react"
import { MilkEntry, MilkEntryFilter, MilkEntryFoot, MilkEntrySave } from "./Entities"
import { deleteMilkEntry, findEntriesPage, getEntriesPageFoot, updateMilkEntry } from "./Service"
import { ComboBoxItem } from "@shared/common/ComboBox"
import { useVirtuosoComponents, usePagination } from "@shared/table/PageTable"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import {
    FooterContent,
    TableBodyCell,
    TableFooterRow,
    TableHeadControlCell,
    TableHeadRow,
    TableLoadingCells,
    VirtuosoHeadCell
} from "@shared/table/TableComponents"
import { dateTransform, decimalTransform } from "@utils/Transformations"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { MilkEntriesFilter } from "./MilkEntriesFilter"
import { AddMilkEntryDialog } from "./AddMilkEntryDialog"
import { Button } from "@mui/material"
import Add from "@mui/icons-material/Add"
import { ErrorDialog } from "@shared/dialog/DialogComponents"
import { APIError } from "@utils/ApiRequest"

type ErrorContextProps = {
    setError: Dispatch<SetStateAction<APIError | undefined>>
}

const ErrorContext = createContext<ErrorContextProps>(undefined!)

export const MilkEntriesTablePage = () => {

    const defaultSort = "entry_date, animal_order"

    const defaultFoot: MilkEntryFoot = useMemo(() => ({
        animalsNumber: 0,
        totalMilk: 0,
        averageMilk: 0
    }), [])

    const [filter, setFilter] = useState<MilkEntryFilter>({ isFiltered: false })
    const [filterOpen, setFilterOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sort, setSort] = useState(defaultSort)
    const [order, setOrder] = useState('desc')
    const [foot, setFoot] = useState(defaultFoot)
    const [addMilkEntryOpen, setAddMilkEntryOpen] = useState(false)
    const [error, setError] = useState<APIError>()

    const anchorEl = useRef<HTMLButtonElement>(null)

    const getFoot = useCallback(() => {
        getEntriesPageFoot(filter)
            .then(response => setFoot(response))
            .catch(() => setFoot(defaultFoot))
    }, [defaultFoot, filter])

    const fetchPage = useCallback((cursor?: string) => {
        getFoot()
        return findEntriesPage(filter, sort, order, cursor)
    }, [filter, getFoot, order, sort])

    const onReload = useCallback(() => setFilter({ isFiltered: false }), [])

    const sortColumns: ComboBoxItem[] = [
        { name: 'Brinco da Vaca', value: 'animal_order, entry_date' },
        { name: 'Nome da Vaca', value: 'name, entry_date' },
        { name: 'Data da Marcação', value: defaultSort }
    ]

    const { rows, scrollRef, fetchNextPage, setRows } = usePagination<MilkEntry>({ setLoading, fetchPage })

    const onDelete = useCallback((id: string) => {
        deleteMilkEntry(id)
            .then(() => {
                setRows(prev => prev.filter(item => item.id != id))
                getFoot()
            })
    }, [getFoot, setRows])

    return <div className="w-full h-full flex flex-col">
        <TableTopBar
            reloadProps={{ onReload, loading }}
            filterProps={{ setFilterOpen, anchorEl }}
            orderProps={{ order, setOrder }}
            sortProps={{ sort, sortColumns, setSort, defaultSort }}
            otherProps={(
                <Button
                    onClick={() => setAddMilkEntryOpen(true)}
                    startIcon={<Add />}
                >
                    Marcar Leite
                </Button>
            )}
        />
        <ErrorContext.Provider value={{ setError }}>
            <EntriesTable {...{ rows, foot, loading, scrollRef, fetchNextPage, onDelete }} />
        </ErrorContext.Provider>
        <MilkEntriesFilter {...{ setFilter, filter, filterOpen, setFilterOpen, anchorEl }} />
        <AddMilkEntryDialog
            addMilkEntryOpen={addMilkEntryOpen}
            onClose={(added: boolean) => {
                setAddMilkEntryOpen(false)
                if (added) onReload()
            }}
        />
        <ErrorDialog
            openError={!!error}
            onClose={() => setError(undefined)}
            title={error?.title}
            content={error?.message}
        />
    </div>
}

type EntriesTableProps = {
    onDelete: (id: string) => void
    rows: MilkEntry[]
    foot: MilkEntryFoot
    loading: boolean
    scrollRef: RefObject<VirtuosoHandle | null>
    fetchNextPage: () => void
}

const EntriesTable = ({ rows, loading, scrollRef, fetchNextPage, foot, onDelete }: EntriesTableProps) => {

    return <TableVirtuoso
        ref={scrollRef}
        data={rows}
        components={useVirtuosoComponents(5)}
        endReached={fetchNextPage}
        fixedHeaderContent={() => (
            <TableHeadRow>
                <TableHeadControlCell />
                <VirtuosoHeadCell>Vaca</VirtuosoHeadCell>
                <VirtuosoHeadCell align="center" width={400}>Data da Marcação</VirtuosoHeadCell>
                <VirtuosoHeadCell width={500}>Pasto</VirtuosoHeadCell>
                <VirtuosoHeadCell align="center" width={200}>Quantidade</VirtuosoHeadCell>
            </TableHeadRow>
        )}
        fixedFooterContent={() => (
            <TableFooterRow colSpan={5}>
                <FooterContent title="Total" content={foot.animalsNumber} />
                <FooterContent title="Produção Média" content={decimalTransform(foot.averageMilk)} />
                <FooterContent title="Produção Total" content={decimalTransform(foot.totalMilk)} />
            </TableFooterRow>
        )}
        itemContent={(_, item) => <EntriesRow {...{ item, loading, onDelete }} />}
    />

}

type EntriesRowProps = {
    onDelete: (id: string) => void
    item: MilkEntry
    loading: boolean
}

const EntriesRow = ({ item, loading, onDelete }: EntriesRowProps) => {

    const [rowData, setRowData] = useState<MilkEntry>(item)
    const [editing, setEditing] = useState(false)

    useEffect(() => setRowData(item), [item])

    if (loading) return <TableLoadingCells colSpan={5} />
    if (editing) return <EntriesRowEditing {...{ rowData, setEditing, setRowData }} />

    return <>
        <TableBodyCell>
            <EditControlButtons
                setEditing={setEditing}
                onDelete={() => onDelete(item.id)}
            />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.entryDate)}</TableBodyCell>
        <TableBodyCell>{rowData.pastureName}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.quantity ?? 0, 1)}</TableBodyCell>
    </>
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
                setRowData(response)
                setEditing(false)
            })
            .catch((error) => setError(error))
            .finally(() => setLoading(false))
    }

    const onSave = handleSubmit(onSubmit)

    return <>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing, loading }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell align="center">
            <FormDatePicker formProps={{ control, name: 'entryDate' }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.pastureName}</TableBodyCell>
        <TableBodyCell align="center">
            <FormTextField
                type="number"
                formProps={{ control, name: 'quantity' }}
            />
        </TableBodyCell>
    </>
}
