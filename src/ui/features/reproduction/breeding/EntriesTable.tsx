import { useVirtuosoComponents, usePagination } from "@/ui/shared/table/PageTable"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
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
    deleteBreeding,
    deleteChangeFather,
    deleteNoValidation,
    findEntriesPage,
    getEntriesFoot,
    searchBreedingBulls,
    updateBreeding,
    updateNoValidation
} from "./Controller"
import { BreedingEntry, BreedingEntryFilter, BreedingEntrySave, BreedingFoot, StatusColorMap, StatusMap } from "./Entities"
import { ComboBoxItem } from "@/ui/shared/common/ComboBox"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import {
    FooterContent,
    TableBodyCell,
    TableFooterRow,
    TableHeadRow,
    TableLoadingCells,
    VirtuosoHeadCell,
    VirtuosoResizeHeadCell
} from "@/ui/shared/table/TableComponents"
import { Button, Chip } from "@mui/material"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { dateTransform, percentageTransform } from "@/util/Transformations"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import Add from "@mui/icons-material/Add"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { AddBreedingDialog } from "./AddBreedingDialog"
import { BreedingFilter } from "./BreedingFilter"
import { APIError } from "@/util/ApiRequest"
import { ErrorDialog, YesNoDialog, YesNoDialogProps } from "@/ui/shared/dialog/DialogComponents"
import { DefaultWarning, ERROR_TYPE, REQUIRED_FIELD_MSG } from "@/ui/shared/Globals"

type EditContextProps = {
    setRows: Dispatch<SetStateAction<BreedingEntry[]>>
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setWarningProps: Dispatch<SetStateAction<YesNoDialogProps>>
    loadFoot: () => void
}

const EditContext = createContext<EditContextProps>(undefined!)

export const EntriesTablePage = () => {

    const defaultSort = 'breeding_date,animal_order'

    const defaultFoot: BreedingFoot = useMemo(() => ({
        totals: 0,
        averageBirthRate: 0,
        averagePregnancyRate: 0
    }), [])

    const [filter, setFilter] = useState<BreedingEntryFilter>({ isFiltered: false })
    const [filterOpen, setFilterOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sort, setSort] = useState(defaultSort)
    const [order, setOrder] = useState('desc')
    const [foot, setFoot] = useState(defaultFoot)
    const [addBreedingOpen, setAddBreedingOpen] = useState(false)

    const [error, setError] = useState<APIError>()
    const [warningProps, setWarningProps] = useState(DefaultWarning)

    const anchorEl = useRef<HTMLButtonElement>(null)

    const loadFoot = useCallback(() => {
        getEntriesFoot(filter)
            .then(response => setFoot(response.json))
            .catch(() => setFoot(defaultFoot))
    }, [defaultFoot, filter])

    const fetchPage = useCallback((cursor?: string) => {
        loadFoot()
        return findEntriesPage(filter, sort, order, cursor)
    }, [filter, loadFoot, order, sort])

    const onReload = useCallback(() => setFilter({ isFiltered: false }), [])

    const closeAddBreeding = useCallback((added?: boolean) => {
        if (added) onReload()
        setAddBreedingOpen(false)
    }, [onReload])

    const sortColumns: ComboBoxItem[] = [
        { name: 'Brinco da Vaca', value: 'animal_order,breeding_date' },
        { name: 'Nome da Vaca', value: 'name,breeding_date' },
        { name: 'Data de Monta', value: defaultSort }
    ]

    const { rows, scrollRef, fetchNextPage, setRows } = usePagination<BreedingEntry>({ setLoading, fetchPage })

    return <div className="w-full h-full flex flex-col">
        <TableTopBar
            reloadProps={{ onReload, loading }}
            sortProps={{ sort, setSort, sortColumns, defaultSort }}
            orderProps={{ order, setOrder }}
            filterProps={{ setFilterOpen, anchorEl }}
            otherProps={(
                <Button
                    startIcon={<Add />}
                    onClick={() => setAddBreedingOpen(true)}
                >
                    Adicionar Monta
                </Button>
            )}
        />
        <EditContext value={{ setError, setRows, loadFoot, setWarningProps }}>
            <EntriesTable {...{ rows, loading, scrollRef, fetchNextPage, foot }} />
        </EditContext>
        <BreedingFilter {...{ filter, setFilter, filterOpen, setFilterOpen, anchorEl }} />
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

type EntriesTableProps = {
    rows: BreedingEntry[]
    foot: BreedingFoot
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
                <VirtuosoResizeHeadCell width={unit * 15}>Data de Inseminação</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 10}>Touro</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Prenhez</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Nascimento</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Informações de Cria</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 20}>Observações</VirtuosoResizeHeadCell>
            </TableHeadRow>
        }}
        fixedFooterContent={() => (
            <TableFooterRow colSpan={8}>
                <FooterContent title="Total" content={foot.totals} />
                <FooterContent title="Taxa de Prenhez" content={percentageTransform(foot.averagePregnancyRate)} />
                <FooterContent title="Taxa de Natalidade" content={percentageTransform(foot.averageBirthRate)} />
            </TableFooterRow>
        )}
        itemContent={(_, item) => <EntriesRow {...{ item: item as BreedingEntry, loading }} />}
    />

}

type EntriesRowProps = {
    item: BreedingEntry
    loading: boolean
}

const EntriesRow = ({ item, loading }: EntriesRowProps) => {

    const [rowData, setRowData] = useState<BreedingEntry>(item)
    const [editing, setEditing] = useState(false)

    const { setError, setWarningProps, setRows, loadFoot } = useContext(EditContext)

    useEffect(() => setRowData(item), [item])

    if (loading) return <TableLoadingCells colSpan={8} />
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

    return <>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing, onDelete }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.breedingDate)}</TableBodyCell>
        <TableBodyCell>{rowData.bullName}</TableBodyCell>
        <TableBodyCell>
            {rowData.pregnancyStatus &&
                <Chip
                    label={StatusMap.get(rowData.pregnancyStatus)}
                    color={StatusColorMap.get(rowData.pregnancyStatus)}
                />
            }
        </TableBodyCell>
        <TableBodyCell>
            {rowData.birthStatus &&
                <Chip
                    label={StatusMap.get(rowData.birthStatus)}
                    color={StatusColorMap.get(rowData.birthStatus)}
                />
            }
        </TableBodyCell>
        <TableBodyCell>{rowData.childInformation}</TableBodyCell>
        <TableBodyCell>{rowData.observation}</TableBodyCell>
    </>
}

type EntriesRowEditingProps = {
    rowData: BreedingEntry
    setRowData: (rowData: BreedingEntry) => void
    setEditing: (editing: boolean) => void
}

const EntriesRowEditing = ({ rowData, setRowData, setEditing }: EntriesRowEditingProps) => {

    const [loading, setLoading] = useState(false)

    const { control, handleSubmit } = useForm<BreedingEntrySave>({ defaultValues: rowData })
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

    return <>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing, loading }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell align="center">
            <FormDatePicker
                formProps={{
                    control,
                    name: 'breedingDate',
                    rules: { required: REQUIRED_FIELD_MSG }
                }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <FormSearchBox
                formProps={{ control, name: 'bullId' }}
                searchOptions={searchBreedingBulls}
            />
        </TableBodyCell>
        <TableBodyCell align="center">{rowData.pregnancyStatus}</TableBodyCell>
        <TableBodyCell align="center">{rowData.birthStatus}</TableBodyCell>
        <TableBodyCell>{rowData.childInformation}</TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'observation' }} />
        </TableBodyCell>
    </>
}
