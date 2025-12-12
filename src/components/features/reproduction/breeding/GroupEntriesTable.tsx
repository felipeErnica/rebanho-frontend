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
import { BreedingEntry, BreedingEntrySave, BreedingFoot, StatusColorMap, StatusMap } from "./Entities"
import { 
    deleteBreeding, 
    deleteChangeFather, 
    deleteNoValidation, 
    findEntriesByGroup, 
    getEntriesByGroupFoot, 
    updateBreeding, 
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
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import Add from "@mui/icons-material/Add"
import { AddBreedingDialog } from "./AddBreedingDialog"
import { APIError } from "@utils/ApiRequest"
import { ErrorDialog, YesNoDialog, YesNoDialogProps } from "@shared/dialog/DialogComponents"
import { DefaultWarning, ERROR_TYPE } from "@shared/Globals"

type GroupEntriesTablePageProps = {
    breedingDate: Date
}

type EditContextProps = {
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setWarningProps: Dispatch<SetStateAction<YesNoDialogProps>>
    setRows: Dispatch<SetStateAction<BreedingEntry[]>>
    loadFoot: () => void
}

const EditContext = createContext<EditContextProps>(undefined!)

export const GroupEntriesTablePage = ({ breedingDate }: GroupEntriesTablePageProps) => {

    const defaultValue: BreedingFoot = useMemo(() => ({
        totals: 0,
        averageBirthRate: 0,
        averagePregnancyRate: 0
    }), [])

    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState<BreedingEntry[]>([])
    const [foot, setFoot] = useState<BreedingFoot>(defaultValue)
    const [addBreedingOpen, setAddBreedingOpen] = useState(false)

    const [error, setError] = useState<APIError>()
    const [warningProps, setWarningProps] = useState(DefaultWarning)

    const loadFoot = useCallback(() => {
        getEntriesByGroupFoot(breedingDate)
            .then(response => setFoot(response))
            .catch(() => setFoot(defaultValue))
    }, [breedingDate, defaultValue])

    const onReload = useCallback(() => {
        setLoading(true)
        loadFoot()
        findEntriesByGroup(breedingDate)
            .then(response => setRows(response))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [loadFoot, breedingDate])

    useEffect(onReload, [onReload])

    const closeAddBreeding = useCallback((added?: boolean) => {
        if (added) onReload()
        setAddBreedingOpen(false)
    }, [onReload])

    return <div className="w-full h-full overflow-hidden flex flex-col">
        <TableTopBar
            reloadProps={{ onReload, loading }}
            otherProps={(
                <Button
                    startIcon={<Add />}
                    onClick={() => setAddBreedingOpen(true)}
                >
                    Adicionar Cobertura
                </Button>
            )}
        />
        <EditContext.Provider value={{ setWarningProps, setError, loadFoot, setRows }}>
            <GroupEntriesTable {...{ rows, foot, loading }} />
        </EditContext.Provider>
        <AddBreedingDialog {...{ addBreedingOpen, closeAddBreeding }} />
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            content={error?.message}
            onClose={() => setError(undefined)}
        />
        <YesNoDialog {...warningProps} />
    </div>
}

type GroupEntriesTableProps = {
    rows: BreedingEntry[]
    foot: BreedingFoot
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
    item: BreedingEntry
    loading: boolean
}

const EntriesRow = ({ item, loading }: EntriesRowProps) => {

    const [rowData, setRowData] = useState<BreedingEntry>(item)
    const [editing, setEditing] = useState(false)

    const { setError, setWarningProps, loadFoot, setRows } = useContext(EditContext)

    useEffect(() => setRowData(item), [item])

    if (loading) return <TableLoadingRow colSpan={7} />
    if (editing) return <EntriesRowEditing {...{ rowData, setEditing, setRowData }} />

    const onDeleteNoValidation = () => {
        deleteNoValidation(rowData.id)
            .then(() => {
                setError(undefined)
                setWarningProps(DefaultWarning)
                setRows(prev => prev.filter(item => item.id != rowData.id))
                loadFoot()
            })
            .catch((error: APIError) => setError(error))
            .finally(() => setWarningProps(DefaultWarning))
    }

    const onDeleteAndChangeFather = () => {
        deleteChangeFather(rowData.id)
            .then(() => {
                setError(undefined)
                setRows(prev => prev.filter(item => item.id != rowData.id))
                loadFoot()
            })
            .catch((error: APIError) => setError(error))
            .finally(() => setWarningProps(DefaultWarning))
    }

    const onDelete = () => {
        deleteBreeding(rowData.id)
            .then(() => {
                setWarningProps(DefaultWarning)
                setError(undefined)
                setRows(prev => prev.filter(item => item.id != rowData.id))
                loadFoot()
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
                        content: error.message,
                        onYes: onDeleteAndChangeFather,
                        onClose: () => setWarningProps(DefaultWarning)
                    })
                    return
                }
                setWarningProps({
                    openYesNo: true,
                    title: error.title,
                    content: error.message,
                    onYes: onDeleteNoValidation,
                    onClose: () => setWarningProps(DefaultWarning)
                })
            })
    }

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing, onDelete }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell>{rowData.bullName}</TableBodyCell>
        <TableBodyCell align="center">
            {rowData.pregnancyStatus &&
                <Chip
                    label={StatusMap.get(rowData.pregnancyStatus)}
                    color={StatusColorMap.get(rowData.pregnancyStatus)}
                />
            }
        </TableBodyCell>
        <TableBodyCell align="center">
            {rowData.birthStatus &&
                <Chip
                    label={StatusMap.get(rowData.birthStatus)}
                    color={StatusColorMap.get(rowData.birthStatus)}
                />
            }
        </TableBodyCell>
        <TableBodyCell>{rowData.childInformation}</TableBodyCell>
        <TableBodyCell>{rowData.observation}</TableBodyCell>
    </TableBodyRow>
}

type EntriesRowEditingProps = {
    rowData: BreedingEntry
    setRowData: (rowData: BreedingEntry) => void
    setEditing: (editing: boolean) => void
}

const EntriesRowEditing = ({ rowData, setRowData, setEditing }: EntriesRowEditingProps) => {

    const [loading, setLoading] = useState(false)

    const { control, handleSubmit } = useForm<BreedingEntry>({ defaultValues: rowData })
    const { setError, setWarningProps, loadFoot } = useContext(EditContext)

    const onNoValidation: SubmitHandler<BreedingEntrySave> = (data: BreedingEntrySave) => {
        setLoading(true)
        updateNoValidation(data)
            .then((result: BreedingEntry) => {
                setRowData(result)
                loadFoot()
                setEditing(false)
            })
            .catch(err => setError(err))
            .finally(() => {
                setLoading(false)
                setWarningProps(DefaultWarning)
            })
    }

    const onSubmit: SubmitHandler<BreedingEntrySave> = (data: BreedingEntrySave) => {
        setLoading(true)
        updateBreeding(data)
            .then((result: BreedingEntry) => {
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
                    content: err.message,
                    onClose: () => setWarningProps(DefaultWarning),
                    onYes: handleSubmit(onNoValidation)
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
        <TableBodyCell>{rowData.bullName}</TableBodyCell>
        <TableBodyCell align="center">{rowData.pregnancyStatus}</TableBodyCell>
        <TableBodyCell align="center">{rowData.birthStatus}</TableBodyCell>
        <TableBodyCell>{rowData.childInformation}</TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'observation' }} />
        </TableBodyCell>
    </TableBodyRow>
}
