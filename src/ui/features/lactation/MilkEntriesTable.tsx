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
import { MilkEntry, MilkEntryFilter, MilkEntryFoot } from "./Entities"
import { deleteMilkEntry, findEntriesPage, getEntriesPageFoot, updateMilkEntry } from "./Controller"
import { ComboBoxItem } from "@/ui/shared/common/ComboBox"
import { useVirtuosoComponents, usePagination } from "@/ui/shared/table/PageTable"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import {
    FooterContent,
    TableBodyCell,
    TableFooterRow,
    TableHeadRow,
    TableLoadingCells,
    VirtuosoHeadCell
} from "@/ui/shared/table/TableComponents"
import { dateTransform, decimalTransform } from "@/util/Transformations"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { MilkEntriesFilter } from "./MilkEntriesFilter"
import { AddMilkEntryDialog } from "./AddMilkEntryDialog"
import { Button } from "@mui/material"
import Add from "@mui/icons-material/Add"
import { ErrorDialog } from "@/ui/shared/dialog/DialogComponents"
import { APIError } from "@/util/ApiRequest"
import { ConnectionError } from "@/ui/shared/Globals"

type ErrorContextProps = {
    setApiError: Dispatch<SetStateAction<APIError | undefined>>
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
    const [apiError, setApiError] = useState<APIError>()

    const anchorEl = useRef<HTMLButtonElement>(null)

    const getFoot = useCallback(() => {
        getEntriesPageFoot(filter)
            .then(response => setFoot(response.json))
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
            .then(response => {
                if (response.status != 200) return
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
        <ErrorContext value={{ setApiError }}>
            <EntriesTable {...{ rows, foot, loading, scrollRef, fetchNextPage, onDelete }} />
        </ErrorContext>
        <MilkEntriesFilter {...{ setFilter, filter, filterOpen, setFilterOpen, anchorEl }} />
        <AddMilkEntryDialog 
            addMilkEntryOpen={addMilkEntryOpen}
            onClose={(added: boolean) => {
                setAddMilkEntryOpen(false)
                if (added) onReload()
            }}
        />
        <ErrorDialog
            openError={!!apiError}
            onClose={() => setApiError(undefined)}
            title={apiError?.title}
            content={apiError?.message}
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

    return <TableVirtuoso
        scrollerRef={(ref) => tableRef.current = ref as HTMLDivElement}
        ref={scrollRef}
        data={rows}
        components={useVirtuosoComponents(5)}
        endReached={fetchNextPage}
        fixedHeaderContent={() => {

            const unit = tableWidth / 100

            return <TableHeadRow>
                <VirtuosoHeadCell width={unit * 10} />
                <VirtuosoHeadCell width={unit * 20}>Vaca</VirtuosoHeadCell>
                <VirtuosoHeadCell width={unit * 20}>Data da Marcação</VirtuosoHeadCell>
                <VirtuosoHeadCell width={unit * 30}>Pasto</VirtuosoHeadCell>
                <VirtuosoHeadCell width={unit * 20}>Quantidade</VirtuosoHeadCell>
            </TableHeadRow>

        }}
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
        <TableBodyCell>{dateTransform(rowData.entryDate)}</TableBodyCell>
        <TableBodyCell>{rowData.pastureName}</TableBodyCell>
        <TableBodyCell>{decimalTransform(rowData.quantity ?? 0, 1)}</TableBodyCell>
    </>
}

type EntriesRowEditingProps = {
    rowData: MilkEntry
    setRowData: (rowData: MilkEntry) => void
    setEditing: (editing: boolean) => void
}

const EntriesRowEditing = ({ rowData, setRowData, setEditing }: EntriesRowEditingProps) => {

    const [loading, setLoading] = useState(false)

    const { control, handleSubmit } = useForm<MilkEntry>({ defaultValues: rowData })
    const { setApiError } = useContext(ErrorContext)

    const onSubmit: SubmitHandler<MilkEntry> = (data: MilkEntry) => {
        setLoading(true)
        data.quantity = Number(data.quantity)
        updateMilkEntry(data)
            .then(response => {
                if (response.status !== 200) {
                    setApiError(response.json)
                    return
                }
                setRowData(response.json)
                setEditing(false)
            })
            .catch(() => setApiError(ConnectionError))
            .finally(() => setLoading(false))
    }

    const onSave = handleSubmit(onSubmit)

    return <>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing, loading }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell>
            <FormDatePicker formProps={{ control, name: 'entryDate' }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.pastureName}</TableBodyCell>
        <TableBodyCell>
            <FormTextField
                type="number"
                formProps={{ control, name: 'quantity' }}
            />
        </TableBodyCell>
    </>
}
