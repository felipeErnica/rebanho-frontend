import { usePagination, useVirtuosoComponents } from "@shared/table/PageTable"
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
    deleteBreeding,
    findEntriesPage,
    getEntriesFoot,
    searchBreedingBulls,
    updateBreeding
} from "./Service"
import { BreedingEntry, BreedingEntryDelete, BreedingEntryFilter, BreedingEntrySave, BreedingFoot, StatusColorMap, StatusMap } from "./Entities"
import { ComboBoxItem } from "@shared/common/ComboBox"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import {
    FooterContent,
    TableBodyCell,
    TableFooterRow,
    TableHeadControlCell,
    TableHeadRow,
    VirtuosoResizeHeadCell,
    VirtuosoRowRender
} from "@shared/table/TableComponents"
import { Button, Chip } from "@mui/material"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { dateTransform, percentageTransform } from "@utils/Transformations"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@shared/form-controls/FormTextField"
import Add from "@mui/icons-material/Add"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { AddBreedingDialog } from "./AddBreedingDialog"
import { BreedingFilter } from "./BreedingFilter"
import { APIError } from "@utils/ApiRequest"
import { ErrorDialog, YesNoDialog, YesNoDialogProps } from "@shared/dialog/DialogComponents"
import { DefaultWarning, ERROR_TYPE, REQUIRED_FIELD_MSG } from "@shared/Globals"
import { Animal, getAnimalLabel } from "@features/animals/Entities"

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
            .then(response => setFoot(response))
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
                    Adicionar Cobertura
                </Button>
            )}
        />
        <EditContext.Provider value={{ setError, setRows, loadFoot, setWarningProps }}>
            <EntriesTable {...{ rows, loading, scrollRef, fetchNextPage, foot }} />
        </EditContext.Provider>
        <BreedingFilter {...{ filter, setFilter: setFilter, filterOpen, setFilterOpen, anchorEl }} />
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

type EntriesTableProps = {
    rows: BreedingEntry[]
    foot: BreedingFoot
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
                <VirtuosoResizeHeadCell align="center" width={150}>Data de Cobertura</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={200}>Touro</VirtuosoResizeHeadCell>
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
                loading={loading}
                render={() => <EntriesRow {...item as BreedingEntry} />}
            />
        )}
    />

}

const EntriesRow = (item: BreedingEntry) => {

    const [rowData, setRowData] = useState<BreedingEntry>(item)
    const [editing, setEditing] = useState(false)
    const [params, setParams] = useState<BreedingEntryDelete>({
        id: item.id,
        ignorePregnancy: false,
        changeFather: false
    })

    const { setError, setWarningProps, setRows, loadFoot } = useContext(EditContext)

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

    return <>
        <TableBodyCell>
            <EditControlButtons
                setEditing={setEditing}
                onDelete={() => onDelete()}
            />
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
    const [loadingControls, setLoadingControls] = useState(false)
    const [bulls, setBulls] = useState<Animal[]>([])

    const { control, handleSubmit, setValue } = useForm<BreedingEntrySave>({ defaultValues: rowData })
    const { setError, setWarningProps, loadFoot } = useContext(EditContext)

    useEffect(() => {
        setLoadingControls(true)
        searchBreedingBulls()
            .then(response => setBulls(response))
            .catch(() => setBulls([]))
            .finally(() => setLoadingControls(false))
    }, [])

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
                        setValue('overwrite', true)
                        handleSubmit(onSubmit)
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
                loading={loadingControls}
                options={bulls.map(item => ({
                    id: item.id,
                    label: getAnimalLabel(item)
                }))}
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
