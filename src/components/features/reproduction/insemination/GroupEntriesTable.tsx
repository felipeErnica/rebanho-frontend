import Add from "@mui/icons-material/Add"
import { Button, Chip, TableBody } from "@mui/material"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import { ErrorDialog, YesNoDialog, YesNoDialogProps } from "@shared/dialog/DialogComponents"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { DefaultWarning, ERROR_TYPE } from "@shared/Globals"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import {
    FooterContent,
    ResizableHeadCell,
    StickyTableFooter,
    TableBodyCell,
    TableBodyRow,
    TableFooterRow,
    TableHeadControlCell,
    TableHeadRow,
    TablePageBody
} from "@shared/table/TableComponents"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import { APIError } from "@utils/ApiRequest"
import { percentageTransform } from "@utils/Transformations"
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
import { SubmitHandler, useForm } from "react-hook-form"
import { AddInseminationDialog } from "./AddInseminationDialog"
import {
    InseminationEntry,
    InseminationEntryDelete,
    InseminationEntrySave,
    InseminationFooter,
    InseminationStatusColorMap,
    InseminationStatusMap,
} from "./Entities"
import {
    deleteInsemination,
    findEntriesByGroup,
    getEntriesByGroupFoot,
    searchInseminationBulls,
    updateInsemination,
} from "./Service"
import { Animal, getAnimalLabel } from "@features/animals/Entities"

type GroupEntriesTablePageProps = { inseminationDate: Date }

type DeleteContextProps = {
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setWarningProps: Dispatch<SetStateAction<YesNoDialogProps>>
    setRows: Dispatch<SetStateAction<InseminationEntry[]>>
    loadFoot: () => void
}

const DeleteContext = createContext<DeleteContextProps>(undefined!)

export const GroupEntriesTablePage = ({ inseminationDate }: GroupEntriesTablePageProps) => {

    const defaultValue: InseminationFooter = useMemo(() => ({
        totals: 0,
        averageBirthRate: 0,
        averagePregnancyRate: 0
    }), [])

    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState<InseminationEntry[]>([])
    const [foot, setFoot] = useState<InseminationFooter>(defaultValue)
    const [addInseminationOpen, setAddInseminationOpen] = useState(false)

    const [warningProps, setWarningProps] = useState(DefaultWarning)
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
        <DeleteContext.Provider value={{ setWarningProps, setError, setRows, loadFoot }}>
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

const COLUMN_COUNT = 7

const GroupEntriesTable = ({ rows, foot, loading }: GroupEntriesTableProps) => {

    return <div className="h-full w-full overflow-auto">
        <Table stickyHeader className="w-max min-w-full">
            <TableHead>
                <TableHeadRow>
                    <TableHeadControlCell />
                    <ResizableHeadCell>Vaca</ResizableHeadCell>
                    <ResizableHeadCell width={250}>Touro</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={150}>Prenhez</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={150}>Nascimento</ResizableHeadCell>
                    <ResizableHeadCell width={300}>Informações da Cria</ResizableHeadCell>
                    <ResizableHeadCell width={400}>Observações</ResizableHeadCell>
                </TableHeadRow>
            </TableHead>
            <TableBody>
                <TablePageBody
                    dataset={rows}
                    colSpan={COLUMN_COUNT}
                    loading={loading}
                    render={(item) => <EntriesRow {...{ item }} />}
                />
            </TableBody>
            <StickyTableFooter>
                <TableFooterRow colSpan={COLUMN_COUNT}>
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
}

const EntriesRow = ({ item }: EntriesRowProps) => {

    const [rowData, setRowData] = useState<InseminationEntry>(item)
    const [editing, setEditing] = useState(false)
    const [params, setParams] = useState<InseminationEntryDelete>({
        id: item.id,
        ignorePregnancy: false,
        changeFather: false
    })

    const { setError, setWarningProps, setRows, loadFoot } = useContext(DeleteContext)

    useEffect(() => setRowData(item), [item])

    const onDelete = useCallback(() => {
        deleteInsemination(params)
            .then(() => {
                setWarningProps(DefaultWarning)
                setError(undefined)
                loadFoot()
                setRows(prev => prev.filter(item => item.id != rowData.id))
            })
            .catch((error: APIError) => {
                if (error.errType === ERROR_TYPE) {
                    setError(error)
                    return
                }

                const warn: YesNoDialogProps = {
                    openYesNo: true,
                    title: error.title,
                    message: error.message,
                    onClose: () => setWarningProps(DefaultWarning),
                    onYes: undefined
                }

                if (error.kind == "ChildrenWarning") {
                    setWarningProps({
                        ...warn,
                        onYes: () => {
                            setParams(params => ({ ...params, changeFather: true }))
                            onDelete()
                        }
                    })
                    return
                }

                setWarningProps({
                    ...warn,
                    onYes: () => {
                        setParams(params => ({ ...params, ignorePregnancy: true }))
                        onDelete()
                    }
                })
            })
    }, [params])

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
    const [bulls, setBulls] = useState<Animal[]>([])

    const { control, handleSubmit, setValue } = useForm<InseminationEntrySave>({ defaultValues: rowData })
    const { setError, setWarningProps, loadFoot } = useContext(DeleteContext)

    useEffect(() => {
        searchInseminationBulls()
            .then(resp => setBulls(resp))
            .catch(() => setBulls([]))
    }, [])

    const onSubmit: SubmitHandler<InseminationEntrySave> = (data: InseminationEntrySave) => {
        setLoading(true)
        updateInsemination(data)
            .then((result: InseminationEntry) => {
                setRowData(result)
                setWarningProps(DefaultWarning)
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
                    onClose: () => setWarningProps(DefaultWarning),
                    onYes: () => {
                        setValue('ignoreWarnings', true)
                        onSave()
                    }
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
                options={bulls.map(item => ({
                    id: item.id,
                    label: getAnimalLabel(item)
                }))}
                formProps={{ control, name: 'bullId' }}
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

