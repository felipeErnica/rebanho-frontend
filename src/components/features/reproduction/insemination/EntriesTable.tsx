import { Animal, getAnimalLabel } from "@features/animals/Entities"
import Add from "@mui/icons-material/Add"
import { Button, Chip } from "@mui/material"
import { ComboBoxItem } from "@shared/common/ComboBox"
import { ErrorDialog, YesNoDialog, YesNoDialogProps } from "@shared/dialog/DialogComponents"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { DefaultWarning, ERROR_TYPE } from "@shared/Globals"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { usePagination, useVirtuosoComponents } from "@shared/table/PageTable"
import {
    FooterContent,
    TableBodyCell,
    TableFooterRow,
    TableHeadControlCell,
    TableHeadRow,
    VirtuosoResizeHeadCell,
    VirtuosoRowRender
} from "@shared/table/TableComponents"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import { APIError } from "@utils/ApiRequest"
import { dateTransform, percentageTransform } from "@utils/Transformations"
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
import { SubmitHandler, useForm } from "react-hook-form"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import { AddInseminationDialog } from "./AddInseminationDialog"
import {
    InseminationEntry,
    InseminationEntryDelete,
    InseminationEntryFilter,
    InseminationEntrySave,
    InseminationFooter,
    InseminationStatusColorMap,
    InseminationStatusMap,
} from "./Entities"
import { InseminationFilter } from "./InseminationFilter"
import {
    deleteInsemination,
    findEntriesPage,
    getEntriesFoot,
    searchInseminationBulls,
    updateInsemination,
} from "./Service"

type DeleteContextProps = {
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setWarningProps: Dispatch<SetStateAction<YesNoDialogProps>>
    setRows: Dispatch<SetStateAction<InseminationEntry[]>>
    loadFoot: () => void
}

const DeleteContext = createContext<DeleteContextProps>(undefined!)

export const EntriesTablePage = () => {

    const defaultSort = 'insemination_date,animal_order'

    const defaultFoot: InseminationFooter = useMemo(() => ({
        totals: 0,
        averageBirthRate: 0,
        averagePregnancyRate: 0
    }), [])

    const [filter, setFilter] = useState<InseminationEntryFilter>({ isFiltered: false })
    const [filterOpen, setFilterOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sort, setSort] = useState(defaultSort)
    const [order, setOrder] = useState('desc')
    const [foot, setFoot] = useState(defaultFoot)
    const [addInseminationOpen, setAddInseminationOpen] = useState(false)

    const [warningProps, setWarningProps] = useState(DefaultWarning)
    const [error, setError] = useState<APIError>()

    const anchorEl = useRef<HTMLButtonElement>(null)

    const loadFoot = useCallback(() => {
        getEntriesFoot(filter)
            .then(response => setFoot(response))
            .catch(() => setFoot(defaultFoot))
    }, [defaultFoot, filter])

    const fetchPage = useCallback((cursor?: string) => {
        loadFoot()
        return findEntriesPage(filter, sort, order, cursor)
    }, [filter, loadFoot, order, sort])

    const onReload = useCallback(() => setFilter({ isFiltered: false }), [])

    const closeAddInsemination = useCallback((added?: boolean) => {
        setAddInseminationOpen(false)
        if (added) onReload()
    }, [onReload])

    const sortColumns: ComboBoxItem[] = [
        { name: 'Brinco da Vaca', value: 'animal_order, insemination_date' },
        { name: 'Nome da Vaca', value: 'animal_name, insemination_date' },
        { name: 'Data de Inseminação', value: defaultSort }
    ]

    const { rows, scrollRef, fetchNextPage, setRows } = usePagination<InseminationEntry>({ setLoading, fetchPage })

    return <div className="w-full h-full flex flex-col">
        <TableTopBar
            reloadProps={{ onReload, loading }}
            sortProps={{ sort, setSort, sortColumns, defaultSort }}
            orderProps={{ order, setOrder }}
            filterProps={{ setFilterOpen, anchorEl }}
            otherProps={(
                <Button
                    startIcon={<Add />}
                    onClick={() => setAddInseminationOpen(true)}
                >
                    Adicionar Inseminação
                </Button>
            )}
        />
        <DeleteContext.Provider value={{ setWarningProps, setRows, setError, loadFoot }}>
            <EntriesTable {...{ rows, loading, scrollRef, fetchNextPage, foot }} />
        </DeleteContext.Provider>
        <InseminationFilter {...{ filter, setFilter: setFilter, filterOpen, setFilterOpen, anchorEl }} />
        <AddInseminationDialog {...{ addInseminationOpen, closeAddInsemination }} />
        <YesNoDialog {...warningProps} />
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            message={error?.message}
            onClose={() => setError(undefined)}
        />
    </div>
}

type EntriesTableProps = {
    rows: InseminationEntry[]
    foot: InseminationFooter
    loading: boolean
    scrollRef: RefObject<VirtuosoHandle | null>
    fetchNextPage: () => void
}

const COLUMN_COUNT = 8

const EntriesTable = ({ rows, loading, scrollRef, fetchNextPage, foot }: EntriesTableProps) => {

    return <TableVirtuoso
        ref={scrollRef}
        data={rows}
        components={useVirtuosoComponents(COLUMN_COUNT)}
        endReached={fetchNextPage}
        fixedHeaderContent={() => (
            <TableHeadRow>
                <TableHeadControlCell />
                <VirtuosoResizeHeadCell>Vaca</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={180}>Data de Inseminação</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={250}>Touro</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={150}>Prenhez</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={150}>Nascimento</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={300}>Informações de Cria</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={400}>Observações</VirtuosoResizeHeadCell>
            </TableHeadRow>
        )}
        fixedFooterContent={() => (
            <TableFooterRow colSpan={COLUMN_COUNT}>
                <FooterContent title="Total" content={foot.totals} />
                <FooterContent title="Taxa de Prenhez" content={percentageTransform(foot.averagePregnancyRate)} />
                <FooterContent title="Taxa de Natalidade" content={percentageTransform(foot.averageBirthRate)} />
            </TableFooterRow>
        )}
        itemContent={(_, item) => (
            <VirtuosoRowRender
                colSpan={COLUMN_COUNT}
                render={() => <EntriesRow {...{ item: item as InseminationEntry }} />}
                loading={loading}
            />
        )}
    />

}

type EntriesRowProps = {
    item: InseminationEntry
}

const EntriesRow = ({ item }: EntriesRowProps) => {

    const [rowData, setRowData] = useState<InseminationEntry>(item)
    const [editing, setEditing] = useState(false)
    const [params, setParams] = useState<InseminationEntryDelete>({
        id: item.id,
        changeFather: false,
        ignorePregnancy: false
    })

    const { setError, setWarningProps, setRows, loadFoot } = useContext(DeleteContext)

    useEffect(() => setRowData(item), [item])

    if (editing) return <EntriesRowEditing {...{ rowData, setEditing, setRowData }} />

    const onDelete = () => {
        deleteInsemination(params)
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
    }

    return <>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing, onDelete }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.inseminationDate)}</TableBodyCell>
        <TableBodyCell>{rowData.bullName}</TableBodyCell>
        <TableBodyCell align="center">
            <Chip
                label={InseminationStatusMap.get(rowData.pregnancyStatus)}
                color={InseminationStatusColorMap.get(rowData.pregnancyStatus)}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <Chip
                label={InseminationStatusMap.get(rowData.birthStatus)}
                color={InseminationStatusColorMap.get(rowData.birthStatus)}
            />
        </TableBodyCell>
        <TableBodyCell>{rowData.childInformation}</TableBodyCell>
        <TableBodyCell>{rowData.observation}</TableBodyCell>
    </>
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

    return <>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing, loading }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell align="center">
            <FormDatePicker formProps={{ control, name: 'inseminationDate' }} />
        </TableBodyCell>
        <TableBodyCell>
            <FormSearchBox
                formProps={{ control, name: 'bullId' }}
                options={bulls.map(item => ({
                    id: item.id,
                    label: getAnimalLabel(item)
                }))}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <Chip
                label={InseminationStatusMap.get(rowData.pregnancyStatus)}
                color={InseminationStatusColorMap.get(rowData.pregnancyStatus)}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <Chip
                label={InseminationStatusMap.get(rowData.birthStatus)}
                color={InseminationStatusColorMap.get(rowData.birthStatus)}
            />
        </TableBodyCell>
        <TableBodyCell>{rowData.childInformation}</TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'observation' }} />
        </TableBodyCell>
    </>
}
