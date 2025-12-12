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
import {
    EmbryoTransfer,
    TransferFoot,
    StatusColorMap,
    StatusMap,
    EmbryoTransferSave
} from "./Entities"
import {
    deleteTransfer,
    findEntriesByGroup,
    getEntriesByGroupFoot,
    searchTransferBulls,
    updateTransfer
} from "./Controller"
import Table from "@mui/material/Table"
import {
    FooterContent,
    ResizableHeadCell,
    StickyTableFooter,
    TableBodyCell,
    TableBodyRow,
    TableFooterRow,
    TableHeadCell,
    TableHeadRow,
    TableLoadingRow
} from "@shared/table/TableComponents"
import TableHead from "@mui/material/TableHead"
import { Button, Chip, TableBody } from "@mui/material"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { percentageTransform } from "@utils/Transformations"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import Add from "@mui/icons-material/Add"
import { AddTransferDialog } from "./AddTransferDialog"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { searchAllMothers } from "@utils/GlobalApiCalls"
import { APIError } from "@utils/ApiRequest"
import { ErrorDialog } from "@shared/dialog/DialogComponents"

type GroupEntriesTablePageProps = {
    transferDate: Date
}

type EditContextProps = {
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setRows: Dispatch<SetStateAction<EmbryoTransfer[]>>
}

const EditContext = createContext<EditContextProps>(undefined!)

export const GroupEntriesTablePage = ({ transferDate }: GroupEntriesTablePageProps) => {

    const defaultValue: TransferFoot = useMemo(() => ({
        totals: 0,
        averageBirthRate: 0,
        averagePregnancyRate: 0
    }), [])

    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState<EmbryoTransfer[]>([])
    const [foot, setFoot] = useState<TransferFoot>(defaultValue)
    const [addTransferOpen, setAddTransferOpen] = useState(false)
    const [error, setError] = useState<APIError>()

    const onReload = useCallback(() => {
        setLoading(true)
        getEntriesByGroupFoot(transferDate)
            .then(response => setFoot(response))
            .catch(() => setFoot(defaultValue))
        findEntriesByGroup(transferDate)
            .then(response => setRows(response))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [defaultValue, transferDate])

    useEffect(onReload, [onReload])

    const closeAddTransfer = (added?: boolean) => {
        if (added) onReload()
        setAddTransferOpen(false)
    }

    return <div className="w-full h-full overflow-hidden flex flex-col">
        <TableTopBar
            reloadProps={{ onReload, loading }}
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
            <GroupEntriesTable {...{ rows, foot, loading }} />
        </EditContext.Provider>
        <AddTransferDialog {...{ addTransferOpen, closeAddTransfer, transferDate }} />
        <ErrorDialog 
            openError={!!error}
            title={error?.title}
            content={error?.message}
            onClose={() => setError(undefined)}
        />
    </div>
}

type GroupEntriesTableProps = {
    rows: EmbryoTransfer[]
    foot: TransferFoot
    loading: boolean
}

const GroupEntriesTable = ({ rows, foot, loading }: GroupEntriesTableProps) => {

    const [tableUnit, setTableUnit] = useState(0)
    const tableRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleResize = () => {
            if (!tableRef.current) return
            const table = tableRef.current
            setTableUnit(table.offsetWidth / 100)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])


    return <div className="h-full w-full overflow-auto" ref={tableRef}>
        <Table stickyHeader className="w-max min-w-full">
            <TableHead>
                <TableHeadRow>
                    <TableHeadCell width={tableUnit * 10} />
                    <ResizableHeadCell width={tableUnit * 20}>Vaca</ResizableHeadCell>
                    <ResizableHeadCell width={tableUnit * 15}>Doadora</ResizableHeadCell>
                    <ResizableHeadCell width={tableUnit * 15}>Touro</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={tableUnit * 10}>Prenhez</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={tableUnit * 10}>Nascimento</ResizableHeadCell>
                    <ResizableHeadCell width={tableUnit * 15}>Informações da Cria</ResizableHeadCell>
                    <ResizableHeadCell width={tableUnit * 15}>Observações</ResizableHeadCell>
                </TableHeadRow>
            </TableHead>
            <TableBody>
                {rows.map(item => <EntriesRow {...{ item, loading }} />)}
            </TableBody>
            <StickyTableFooter>
                <TableFooterRow colSpan={8}>
                    <FooterContent title="Total" content={foot.totals} />
                    <FooterContent title="Taxa de Prenhez" content={percentageTransform(foot.averagePregnancyRate)} />
                    <FooterContent title="Taxa de Nascimento" content={percentageTransform(foot.averageBirthRate)} />
                </TableFooterRow>
            </StickyTableFooter>
        </Table>
    </div>
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


    if (loading) return <TableLoadingRow colSpan={7} />
    if (editing) return <EntriesRowEditing {...{ rowData, setEditing, setRowData }} />

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing, onDelete, loading: loadingControls }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.receiverInfo}</TableBodyCell>
        <TableBodyCell>{rowData.donorInfo}</TableBodyCell>
        <TableBodyCell>{rowData.bullName}</TableBodyCell>
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
    </TableBodyRow>
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

    return <TableBodyRow>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing, loading }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.receiverInfo}</TableBodyCell>
        <TableBodyCell>
            <FormSearchBox
                searchOptions={searchAllMothers}
                formProps={{ control, name: 'donorId' }}
            />
        </TableBodyCell>
        <TableBodyCell>
            <FormSearchBox
                searchOptions={searchTransferBulls}
                formProps={{ control, name: 'bullId' }}
            />
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
    </TableBodyRow>
}

