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
    deleteAndChangeFather,
    deleteInsemination,
    deleteNoValidate,
    findEntriesPage,
    getEntriesFoot,
    searchInseminationBulls,
    updateInsemination,
    updateNoValidation
} from "./Controller"
import {
    InseminationFooter,
    InseminationEntry,
    InseminationEntryFilter,
    InseminationStatusColorMap,
    InseminationStatusMap,
    InseminationEntrySave,
} from "./Entities"
import { ComboBoxItem } from "@shared/common/ComboBox"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import {
    FooterContent,
    TableBodyCell,
    TableFooterRow,
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
import { InseminationFilter } from "./InseminationFilter"
import Add from "@mui/icons-material/Add"
import { AddInseminationDialog } from "./AddInseminationDialog"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { ErrorDialog, YesNoDialog, YesNoDialogProps } from "@shared/dialog/DialogComponents"
import { APIError } from "@utils/ApiRequest"
import { ERROR_TYPE } from "@shared/Globals"

type DeleteContextProps = {
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setWarningProps: Dispatch<SetStateAction<YesNoDialogProps>>
    setRows: Dispatch<SetStateAction<InseminationEntry[]>>
    defaultWarning: YesNoDialogProps
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

    const defaultWarning: YesNoDialogProps = {
        openYesNo: false,
        title: undefined,
        content: undefined,
        onYes: undefined,
        onClose: undefined
    }

    const [filter, setFilter] = useState<InseminationEntryFilter>({ isFiltered: false })
    const [filterOpen, setFilterOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sort, setSort] = useState(defaultSort)
    const [order, setOrder] = useState('desc')
    const [foot, setFoot] = useState(defaultFoot)
    const [addInseminationOpen, setAddInseminationOpen] = useState(false)

    const [warningProps, setWarningProps] = useState(defaultWarning)
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
        <DeleteContext.Provider value={{ setWarningProps, defaultWarning, setRows, setError, loadFoot }}>
            <EntriesTable {...{ rows, loading, scrollRef, fetchNextPage, foot }} />
        </DeleteContext.Provider>
        <InseminationFilter {...{ filter, setFilter, filterOpen, setFilterOpen, anchorEl }} />
        <AddInseminationDialog {...{ addInseminationOpen, closeAddInsemination }} />
        <YesNoDialog {...warningProps} />
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            content={error?.message}
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

const EntriesTable = ({ rows, loading, scrollRef, fetchNextPage, foot }: EntriesTableProps) => {

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
        components={useVirtuosoComponents(8)}
        endReached={fetchNextPage}
        fixedHeaderContent={() => {

            const unit = tableWidth / 100

            return <TableHeadRow>
                <VirtuosoHeadCell width={unit * 10} />
                <VirtuosoResizeHeadCell width={unit * 10}>Vaca</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 15}>Data de Inseminação</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 10}>Touro</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 10}>Prenhez</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 10}>Nascimento</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 20}>Informações de Cria</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 25}>Observações</VirtuosoResizeHeadCell>
            </TableHeadRow>
        }}
        fixedFooterContent={() => (
            <TableFooterRow colSpan={8}>
                <FooterContent title="Total" content={foot.totals} />
                <FooterContent title="Taxa de Prenhez" content={percentageTransform(foot.averagePregnancyRate)} />
                <FooterContent title="Taxa de Natalidade" content={percentageTransform(foot.averageBirthRate)} />
            </TableFooterRow>
        )}
        itemContent={(_, item) => <EntriesRow {...{ item: item as InseminationEntry, loading }} />}
    />

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

    if (loading) return <TableLoadingCells colSpan={8} />
    if (editing) return <EntriesRowEditing {...{ rowData, setEditing, setRowData }} />

    const onDeleteNoValidation = () => {
        deleteNoValidate(rowData.id)
            .then(() => {
                setError(undefined)
                setWarningProps(defaultWarning)
                setRows(prev => prev.filter(item => item.id != rowData.id))
                loadFoot()
            })
            .catch((error: APIError) => setError(error))
            .finally(() => setWarningProps(defaultWarning))
    }

    const onDeleteAndChangeFather = () => {
        deleteAndChangeFather(rowData.id)
            .then(() => {
                setError(undefined)
                setRows(prev => prev.filter(item => item.id != rowData.id))
                loadFoot()
            })
            .catch((error: APIError) => setError(error))
            .finally(() => setWarningProps(defaultWarning))
    }

    const onDelete = () => {
        deleteInsemination(rowData.id)
            .then(() => {
                setWarningProps(defaultWarning)
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
                        onClose: () => setWarningProps(defaultWarning)
                    })
                    return
                }
                setWarningProps({
                    openYesNo: true,
                    title: error.title,
                    content: error.message,
                    onYes: onDeleteNoValidation,
                    onClose: () => setWarningProps(defaultWarning)
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

    const { control, handleSubmit } = useForm<InseminationEntrySave>({ defaultValues: rowData })
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
            .finally(() => {
                setLoading(false)
                setWarningProps(defaultWarning)
            })
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
                    content: err.message,
                    onClose: () => setWarningProps(defaultWarning),
                    onYes: handleSubmit(onNoValidation)
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
                searchOptions={searchInseminationBulls}
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
