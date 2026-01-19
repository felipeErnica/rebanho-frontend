import { useVirtuosoComponents, usePagination } from "@shared/table/PageTable"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
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
import {
    deleteTransfer,
    findEntriesPage,
    getEntriesPage,
    searchEmbryoDonors,
    searchTransferBulls,
    updateTransfer
} from "./Controller"
import {
    TransferFoot,
    EmbryoTransfer,
    TransferEntryFilter,
    StatusColorMap,
    StatusMap,
    EmbryoTransferSave,
} from "./Entities"
import { ComboBoxItem } from "@shared/common/ComboBox"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import {
    FooterContent,
    TableBodyCell,
    TableFooterRow,
    TableHeadControlCell,
    TableHeadRow,
    TableLoadingCells,
    VirtuosoHeadCell,
    VirtuosoResizeHeadCell
} from "@shared/table/TableComponents"
import { Button, Chip } from "@mui/material"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { dateTransform, percentageTransform } from "@utils/Transformations"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@shared/form-controls/FormTextField"
import Add from "@mui/icons-material/Add"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { AddTransferDialog } from "./AddTransferDialog"
import { TransferFilter } from "./TransferFilter"
import { APIError } from "@utils/ApiRequest"
import { ErrorDialog } from "@shared/dialog/DialogComponents"

type EditContextProps = {
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setRows: Dispatch<SetStateAction<EmbryoTransfer[]>>
}

const EditContext = createContext<EditContextProps>(undefined!)

export const EntriesTablePage = () => {

    const defaultSort = 'transfer_date,receiver_order'

    const defaultFoot: TransferFoot = useMemo(() => ({
        totals: 0,
        averageBirthRate: 0,
        averagePregnancyRate: 0
    }), [])

    const [filter, setFilter] = useState<TransferEntryFilter>({ isFiltered: false })
    const [filterOpen, setFilterOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sort, setSort] = useState(defaultSort)
    const [order, setOrder] = useState('desc')
    const [foot, setFoot] = useState(defaultFoot)
    const [addTransferOpen, setAddTransferOpen] = useState(false)

    const [error, setError] = useState<APIError>()

    const anchorEl = useRef<HTMLButtonElement>(null)

    const fetchPage = useCallback((cursor?: string) => {
        getEntriesPage(filter)
            .then(response => setFoot(response))
            .catch(() => setFoot(defaultFoot))
        return findEntriesPage(filter, sort, order, cursor)
    }, [defaultFoot, filter, order, sort])

    const onReload = useCallback(() => setFilter({ isFiltered: false }), [])

    const sortColumns: ComboBoxItem[] = [
        { name: 'Brinco da Receptora', value: 'receiver_order,transfer_date' },
        { name: 'Nome da Receptora', value: 'receiver_name,transfer_date' },
        { name: 'Brinco da Doadora', value: 'donor_order,transfer_date' },
        { name: 'Nome da Doadora', value: 'donor_name,transfer_date' },
        { name: 'Data de Transferência', value: defaultSort }
    ]

    const { rows, scrollRef, fetchNextPage, setRows } = usePagination<EmbryoTransfer>({ setLoading, fetchPage })

    const closeAddTransfer = (added?: boolean) => {
        if (added) onReload()
        setAddTransferOpen(false)
    }

    return <div className="w-full h-full flex flex-col">
        <TableTopBar
            reloadProps={{ onReload, loading }}
            sortProps={{ sort, setSort, sortColumns, defaultSort }}
            orderProps={{ order, setOrder }}
            filterProps={{ setFilterOpen, anchorEl }}
            otherProps={(
                <Button
                    startIcon={<Add />}
                    onClick={() => setAddTransferOpen(true)}
                >
                    Adicionar Transferência
                </Button>
            )}
        />
        <EditContext.Provider value={{ setError, setRows }}>
            <EntriesTable {...{ rows, loading, scrollRef, fetchNextPage, foot }} />
        </EditContext.Provider>
        <TransferFilter {...{ filter, setFilter: setFilter, filterOpen, setFilterOpen, anchorEl }} />
        <AddTransferDialog {...{ addTransferOpen, closeAddTransfer }} />
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            message={error?.message}
            onClose={() => setError(undefined)}
        />
    </div>
}

type EntriesTableProps = {
    rows: EmbryoTransfer[]
    foot: TransferFoot
    loading: boolean
    scrollRef: RefObject<VirtuosoHandle | null>
    fetchNextPage: () => void
}

const EntriesTable = ({ rows, loading, scrollRef, fetchNextPage, foot }: EntriesTableProps) => {

    return <TableVirtuoso
        ref={scrollRef}
        data={rows}
        components={useVirtuosoComponents(8)}
        endReached={fetchNextPage}
        fixedHeaderContent={() => (
            <TableHeadRow>
                <TableHeadControlCell />
                <VirtuosoResizeHeadCell width={200}>Receptora</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={200}>Doadora</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={200}>Touro</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={180}>Data de Transferência</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={150}>Prenhez</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={150}>Nascimento</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={200}>Informações de Cria</VirtuosoResizeHeadCell>
                <VirtuosoHeadCell width={250}>Observações</VirtuosoHeadCell>
            </TableHeadRow>
        )}
        fixedFooterContent={() => (
            <TableFooterRow colSpan={9}>
                <FooterContent title="Total" content={foot.totals} />
                <FooterContent title="Taxa de Prenhez" content={percentageTransform(foot.averagePregnancyRate)} />
                <FooterContent title="Taxa de Natalidade" content={percentageTransform(foot.averageBirthRate)} />
            </TableFooterRow>
        )}
        itemContent={(_, item) => <EntriesRow {...{ item: item as EmbryoTransfer, loading }} />}
    />

}

type EntriesRowProps = {
    item: EmbryoTransfer
    loading: boolean
}

const EntriesRow = ({ item, loading }: EntriesRowProps) => {

    const [rowData, setRowData] = useState<EmbryoTransfer>(item)
    const [editing, setEditing] = useState(false)
    const [loadingControls, setLoadingControls] = useState(false)

    const { setRows, setError } = useContext(EditContext)

    useEffect(() => setRowData(item), [item])

    const onDelete = () => {
        setLoadingControls(true)
        deleteTransfer(rowData.id)
            .then(() => {
                setError(undefined)
                setRows(prev => prev.filter(item => item.id != rowData.id))
            })
            .catch(err => setError(err))
            .finally(() => setLoadingControls(false))
    }

    if (loading) return <TableLoadingCells colSpan={8} />
    if (editing) return <EntriesRowEditing {...{ rowData, setEditing, setRowData }} />

    return <>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing, onDelete, loading: loadingControls }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.receiverInfo}</TableBodyCell>
        <TableBodyCell>{rowData.donorInfo}</TableBodyCell>
        <TableBodyCell>{rowData.bullName}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.transferDate)}</TableBodyCell>
        <TableBodyCell align="center">
            <Chip
                label={StatusMap.get(rowData.pregnancyStatus)}
                color={StatusColorMap.get(rowData.pregnancyStatus)}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <Chip
                label={StatusMap.get(rowData.birthStatus)}
                color={StatusColorMap.get(rowData.birthStatus)}
            />
        </TableBodyCell>
        <TableBodyCell>{rowData.childInformation}</TableBodyCell>
        <TableBodyCell>{rowData.observation}</TableBodyCell>
    </>
}

type EntriesRowEditingProps = {
    rowData: EmbryoTransfer
    setRowData: (rowData: EmbryoTransfer) => void
    setEditing: (editing: boolean) => void
}

const EntriesRowEditing = ({ rowData, setRowData, setEditing }: EntriesRowEditingProps) => {

    const [loading, setLoading] = useState(false)

    const { control, handleSubmit } = useForm<EmbryoTransferSave>({ defaultValues: rowData })
    const { setError } = useContext(EditContext)

    const onSubmit: SubmitHandler<EmbryoTransferSave> = (data: EmbryoTransferSave) => {
        setLoading(true)
        updateTransfer(data)
            .then(response => {
                setRowData(response)
                setError(undefined)
                setEditing(false)
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }

    const onSave = handleSubmit(onSubmit)

    return <>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing, loading }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.receiverInfo}</TableBodyCell>
        <TableBodyCell align="center">
            <FormSearchBox
                formProps={{ control, name: 'donorId' }}
                searchOptions={searchEmbryoDonors}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <FormSearchBox
                formProps={{ control, name: 'bullId' }}
                searchOptions={searchTransferBulls}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <FormDatePicker formProps={{ control, name: 'transferDate' }} />
        </TableBodyCell>
        <TableBodyCell align="center">
            <Chip
                label={StatusMap.get(rowData.pregnancyStatus)}
                color={StatusColorMap.get(rowData.pregnancyStatus)}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <Chip
                label={StatusMap.get(rowData.birthStatus)}
                color={StatusColorMap.get(rowData.birthStatus)}
            />
        </TableBodyCell>
        <TableBodyCell>{rowData.childInformation}</TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'observation' }} />
        </TableBodyCell>
    </>
}
