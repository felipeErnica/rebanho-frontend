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
import { BreedingEntry, BreedingEntryDelete, BreedingEntrySave, BreedingFoot, StatusColorMap, StatusMap } from "./Entities"
import {
    deleteBreeding,
    findEntriesByGroup,
    getEntriesByGroupFoot,
    updateBreeding,
} from "./Service"
import Table from "@mui/material/Table"
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
import TableHead from "@mui/material/TableHead"
import { Button, Chip } from "@mui/material"
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
            message={error?.message}
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

const COLUMN_COUNT = 7

const GroupEntriesTable = ({ rows, foot, loading }: GroupEntriesTableProps) => {

    return <div className="h-full w-full overflow-auto">
        <Table stickyHeader className="w-max min-w-full">
            <TableHead>
                <TableHeadRow>
                    <TableHeadControlCell />
                    <ResizableHeadCell>Vaca</ResizableHeadCell>
                    <ResizableHeadCell width={200}>Touro</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={150}>Prenhez</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={150}>Nascimento</ResizableHeadCell>
                    <ResizableHeadCell width={300}>Informações da Cria</ResizableHeadCell>
                    <ResizableHeadCell width={400}>Observações</ResizableHeadCell>
                </TableHeadRow>
            </TableHead>
            <TablePageBody
                colSpan={COLUMN_COUNT}
                dataset={rows}
                loading={loading}
                render={item => <EntriesRow {...{ item }} />}
            />
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

const EntriesRow = ({ item }) => {

    const [rowData, setRowData] = useState<BreedingEntry>(item)
    const [editing, setEditing] = useState(false)
    const [params, setParams] = useState<BreedingEntryDelete>({
        id: item.id,
        ignorePregnancy: false,
        changeFather: false
    })

    const { setError, setWarningProps, loadFoot, setRows } = useContext(EditContext)
    
    useEffect(() => setRowData(item), [item])


    const onDelete = useCallback(() => {
        deleteBreeding(params)
            .then(() => {
                setWarningProps(DefaultWarning)
                setError(undefined)
                setRows(prev => prev.filter(item => item.id != params.id))
                loadFoot()
            })
            .catch((error: APIError) => {
                if (error.errType === ERROR_TYPE) {
                    setError(error)
                    return
                }

                const warning: YesNoDialogProps = {
                    ...error,
                    openYesNo: true,
                    onClose: () => setWarningProps(DefaultWarning),
                    onYes: undefined
                }

                if (error.kind == "ChildrenWarning") {
                    setWarningProps({
                        ...warning,
                        onYes: () => {
                            setParams(params => ({ ...params, changeFather: true }))
                            onDelete()
                        },
                    })
                }

                if (error.kind == "PregnancyWarning") {
                    setWarningProps({
                        ...warning,
                        onYes: () => {
                            setParams(params => ({ ...params, ignorePregnancy: true }))
                            onDelete()
                        },
                    })
                }

            })
    }, [loadFoot, params, setError, setRows, setWarningProps])

    if (editing) return <EntriesRowEditing {...{ rowData, setEditing, setRowData }} />

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons 
                setEditing={setEditing}
                onDelete={() => onDelete()}
            />
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

    const { control, handleSubmit, setValue } = useForm<BreedingEntrySave>({ defaultValues: rowData })
    const { setError, setWarningProps, loadFoot } = useContext(EditContext)

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
                    message: err.message,
                    onClose: () => setWarningProps(DefaultWarning),
                    onYes: () => {
                        setValue('skipValidation', true)
                        handleSubmit(onSubmit)
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
        <TableBodyCell>{rowData.bullName}</TableBodyCell>
        <TableBodyCell align="center">{rowData.pregnancyStatus}</TableBodyCell>
        <TableBodyCell align="center">{rowData.birthStatus}</TableBodyCell>
        <TableBodyCell>{rowData.childInformation}</TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'observation' }} />
        </TableBodyCell>
    </TableBodyRow>
}
