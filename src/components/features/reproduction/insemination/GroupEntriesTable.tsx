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
    InseminationEntry,
    InseminationEntrySave,
    InseminationFooter,
    InseminationStatusColorMap,
    InseminationStatusMap,
} from "./Entities"
import {
    deleteAndChangeFather,
    deleteInsemination,
    deleteNoValidate,
    findEntriesByGroup,
    getEntriesByGroupFoot,
    searchInseminationBulls,
    updateInsemination,
    updateNoValidation
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
import { AddInseminationDialog } from "./AddInseminationDialog"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import Add from "@mui/icons-material/Add"
import { APIError } from "@utils/ApiRequest"
import { ErrorDialog, YesNoDialog, YesNoDialogProps } from "@shared/dialog/DialogComponents"
import { ERROR_TYPE } from "@shared/Globals"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"

type GroupEntriesTablePageProps = {
    inseminationDate: Date
}

type DeleteContextProps = {
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setWarningProps: Dispatch<SetStateAction<YesNoDialogProps>>
    setRows: Dispatch<SetStateAction<InseminationEntry[]>>
    defaultWarning: YesNoDialogProps
    loadFoot: () => void
}

const DeleteContext = createContext<DeleteContextProps>(undefined!)

export const GroupEntriesTablePage = ({ inseminationDate }: GroupEntriesTablePageProps) => {

    const defaultValue: InseminationFooter = useMemo(() => ({
        totals: 0,
        averageBirthRate: 0,
        averagePregnancyRate: 0
    }), [])

    const defaultWarning: YesNoDialogProps = {
        openYesNo: false,
        title: undefined,
        message: undefined,
        onYes: undefined,
        onClose: undefined
    }

    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState<InseminationEntry[]>([])
    const [foot, setFoot] = useState<InseminationFooter>(defaultValue)
    const [addInseminationOpen, setAddInseminationOpen] = useState(false)

    const [warningProps, setWarningProps] = useState(defaultWarning)
    const [error, setError] = useState<APIError>()

    const loadFoot = useCallback(() => {
        getEntriesByGroupFoot(inseminationDate)
            .then(response => setFoot(response))
            .catch(() => setFoot(defaultValue))
    }, [defaultValue, inseminationDate])

    const onReload = useCallback(() => {
        setLoading(true)
        loadFoot()
        findEntriesByGroup(inseminationDate)
            .then(response => setRows(response))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [inseminationDate, loadFoot])

    useEffect(onReload, [onReload])

    const closeAddInsemination = useCallback((added?: boolean) => {
        setAddInseminationOpen(false)
        if (added) onReload()
    }, [onReload])


    return <div className="w-full h-full overflow-hidden flex flex-col">
        <AddInseminationDialog {...{ addInseminationOpen, closeAddInsemination, inseminationDate }} />
        <TableTopBar
            reloadProps={{ onReload, loading }}
            otherProps={(
                <Button
                    startIcon={<Add />}
                    onClick={() => setAddInseminationOpen(true)}
                >
                    Adicionar Inseminação
                </Button>
            )}
        />
        <DeleteContext.Provider value={{ setWarningProps, setError, setRows, defaultWarning, loadFoot }}>
            <GroupEntriesTable {...{ rows, foot, loading }} />
        </DeleteContext.Provider>
        <YesNoDialog {...warningProps} />
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            message={error?.message}
            onClose={() => setError(undefined)}
        />
    </div>
}

type GroupEntriesTableProps = {
    rows: InseminationEntry[]
    foot: InseminationFooter
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
                    <ResizableHeadCell width={tableUnit * 10}>Touro</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={tableUnit * 15}>Prenhez</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={tableUnit * 15}>Nascimento</ResizableHeadCell>
                    <ResizableHeadCell width={tableUnit * 15}>Informações da Cria</ResizableHeadCell>
                    <ResizableHeadCell width={tableUnit * 15}>Observações</ResizableHeadCell>
                </TableHeadRow>
            </TableHead>
            <TableBody>
                {rows.map(item => <EntriesRow {...{ item, loading }} />)}
            </TableBody>
            <StickyTableFooter>
                <TableFooterRow colSpan={7}>
                    <FooterContent title="Total" content={foot.totals} />
                    <FooterContent title="Taxa de Prenhez" content={percentageTransform(foot.averagePregnancyRate)} />
                    <FooterContent title="Taxa de Nascimento" content={percentageTransform(foot.averageBirthRate)} />
                </TableFooterRow>
            </StickyTableFooter>
        </Table>
    </div>
}

type EntriesRowProps = {
    item: InseminationEntry
    loading: boolean
}

const EntriesRow = ({ item, loading }: EntriesRowProps) => {

    const [rowData, setRowData] = useState<InseminationEntry>(item)
    const [editing, setEditing] = useState(false)

    const { setError, setWarningProps, setRows, defaultWarning, loadFoot } = useContext(DeleteContext)

    useEffect(() => setRowData(item), [item])

    const onDeleteNoValidation = () => {
        deleteNoValidate(rowData.id)
            .then(() => {
                setError(undefined)
                loadFoot()
                setRows(prev => prev.filter(item => item.id != rowData.id))
            })
            .catch((error: APIError) => setError(error))
    }

    const onDeleteAndChangeFather = () => {
        deleteAndChangeFather(rowData.id)
            .then(() => {
                setError(undefined)
                loadFoot()
                setRows(prev => prev.filter(item => item.id != rowData.id))
            })
            .catch((error: APIError) => setError(error))
    }

    const onDelete = () => {
        deleteInsemination(rowData.id)
            .then(() => {
                setWarningProps(defaultWarning)
                setError(undefined)
                loadFoot()
                setRows(prev => prev.filter(item => item.id != rowData.id))
            })
            .catch((error: APIError) => {
                if (error.errType === ERROR_TYPE) {
                    setError(error)
                    return
                }
                if (error.kind == "ChildrenWarning") {
                    setWarningProps({
                        openYesNo: true,
                        title: error.title,
                        message: error.message,
                        onYes: onDeleteAndChangeFather,
                        onClose: () => setWarningProps(defaultWarning)
                    })
                    return
                }
                setWarningProps({
                    openYesNo: true,
                    title: error.title,
                    message: error.message,
                    onYes: onDeleteNoValidation,
                    onClose: () => setWarningProps(defaultWarning)
                })
            })
    }

    if (loading) return <TableLoadingRow colSpan={7} />
    if (editing) return <EntriesRowEditing {...{ rowData, setEditing, setRowData }} />

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing, onDelete }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell>{rowData.bullName}</TableBodyCell>
        <TableBodyCell align="center">
            {rowData.pregnancyStatus &&
                <Chip
                    label={InseminationStatusMap.get(rowData.pregnancyStatus)}
                    color={InseminationStatusColorMap.get(rowData.pregnancyStatus)}
                />
            }
        </TableBodyCell>
        <TableBodyCell align="center">
            {rowData.birthStatus &&
                <Chip
                    label={InseminationStatusMap.get(rowData.birthStatus)}
                    color={InseminationStatusColorMap.get(rowData.birthStatus)}
                />
            }
        </TableBodyCell>
        <TableBodyCell>{rowData.childInformation}</TableBodyCell>
        <TableBodyCell>{rowData.observation}</TableBodyCell>
    </TableBodyRow>
}

type EntriesRowEditingProps = {
    rowData: InseminationEntry
    setRowData: (rowData: InseminationEntry) => void
    setEditing: (editing: boolean) => void
}

const EntriesRowEditing = ({ rowData, setRowData, setEditing }: EntriesRowEditingProps) => {

    const [loading, setLoading] = useState(false)

    const { control, handleSubmit } = useForm<InseminationEntry>({ defaultValues: rowData })
    const { setError, setWarningProps, defaultWarning, loadFoot } = useContext(DeleteContext)

    const onNoValidation: SubmitHandler<InseminationEntrySave> = (data: InseminationEntrySave) => {
        setLoading(true)
        updateNoValidation(data)
            .then((result: InseminationEntry) => {
                setRowData(result)
                loadFoot()
                setEditing(false)
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }

    const onSubmit: SubmitHandler<InseminationEntrySave> = (data: InseminationEntrySave) => {
        setLoading(true)
        updateInsemination(data)
            .then((result: InseminationEntry) => {
                setRowData(result)
                loadFoot()
                setEditing(false)
            })
            .catch((err: APIError) => {
                if (err.errType === ERROR_TYPE) {
                    setError(err)
                    return
                }
                setWarningProps({
                    openYesNo: true,
                    title: err.title,
                    message: err.message,
                    onClose: () => setWarningProps(defaultWarning),
                    onYes: () => handleSubmit(onNoValidation)
                })
            })
            .finally(() => setLoading(false))
    }

    const onSave = handleSubmit(onSubmit)

    return <TableBodyRow>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing, loading }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell>
            <FormSearchBox
                formProps={{ control, name: 'bullId' }}
                searchOptions={searchInseminationBulls}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <Chip
                color={InseminationStatusColorMap.get(rowData.pregnancyStatus)}
                label={InseminationStatusMap.get(rowData.pregnancyStatus)}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <Chip
                color={InseminationStatusColorMap.get(rowData.pregnancyStatus)}
                label={InseminationStatusMap.get(rowData.pregnancyStatus)}
            />
        </TableBodyCell>
        <TableBodyCell>{rowData.childInformation}</TableBodyCell>
        <TableBodyCell>
            <FormTextField
                formProps={{
                    control,
                    name: 'observation'
                }}
            />
        </TableBodyCell>
    </TableBodyRow>
}

