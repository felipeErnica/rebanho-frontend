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
    BirthStatusMap,
    PregnancyStatusItems,
    PregnancyStatusMap,
    TestEntry,
    TestEntryFilter,
    TestEntryFoot,
    TestEntrySave
} from "./Entities"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import { useVirtuosoComponents, usePagination } from "@shared/table/PageTable"
import {
    FooterContent,
    TableBodyCell,
    TableFooterRow,
    TableHeadControlCell,
    TableHeadRow,
    TableLoadingCells,
    VirtuosoResizeHeadCell
} from "@shared/table/TableComponents"
import { dateTransform, percentageTransform } from "@utils/Transformations"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import Chip from "@mui/material/Chip"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import { ComboBoxItem } from "@shared/common/ComboBox"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { deleteTest, findEntriesPage, getEntriesFoot, updateTest } from "./Service"
import { BirthTestFilter } from "./BirthTestFilter"
import { ChipColorScheme } from "@shared/Globals"
import { FormComboBox } from "@shared/form-controls/FormComboBox"
import { APIError } from "@utils/ApiRequest"
import { ErrorDialog } from "@shared/dialog/DialogComponents"
import { Button } from "@mui/material"
import Add from "@mui/icons-material/Add"
import { AddTestDialog } from "./AddTestDialog"
import dayjs from "dayjs"

type ErrorContextProps = {
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setRows: Dispatch<SetStateAction<TestEntry[]>>
}

const ErrorContext = createContext<ErrorContextProps>(undefined!)

export const EntriesTablePage = () => {

    const defaultSort = 'test_date, animal_order'

    const defaultFoot: TestEntryFoot = useMemo(() => ({
        totals: 0,
        pregnancyRate: 0,
        birthRate: 0
    }), [])

    const [filter, setFilter] = useState<TestEntryFilter>({ isFiltered: false })
    const [filterOpen, setFilterOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sort, setSort] = useState(defaultSort)
    const [order, setOrder] = useState('desc')
    const [foot, setFoot] = useState(defaultFoot)

    const [error, setError] = useState<APIError>()
    const [addTestOpen, setAddTestOpen] = useState(false)

    const anchorEl = useRef<HTMLButtonElement>(null)

    const fetchPage = useCallback((cursor?: string) => {
        getEntriesFoot(filter)
            .then(response => setFoot(response))
            .catch(() => setFoot(defaultFoot))
        return findEntriesPage(filter, sort, order, cursor)
    }, [defaultFoot, filter, order, sort])

    const onReload = useCallback(() => setFilter({ isFiltered: false }), [])

    const sortColumns: ComboBoxItem[] = [
        { name: 'Data de Exame', value: defaultSort },
        { name: 'Brinco da Vaca', value: 'animal_order, test_date' },
        { name: 'Nome da Vaca', value: 'animal_name, test_date' },
        { name: 'Data de Previsão', value: "birth_forecast, animal_order" }
    ]

    const { rows, scrollRef, fetchNextPage, setRows } = usePagination<TestEntry>({ setLoading, fetchPage })

    const closeAddTest = (added?: boolean) => {
        setAddTestOpen(false)
        if (added) onReload()
    }

    return <div className="w-full h-full flex flex-col">
        <TableTopBar
            reloadProps={{ onReload, loading }}
            filterProps={{ setFilterOpen, anchorEl }}
            orderProps={{ order, setOrder }}
            sortProps={{ sort, sortColumns, setSort, defaultSort }}
            otherProps={(
                <Button
                    onClick={() => setAddTestOpen(true)}
                    startIcon={<Add />}
                >
                    Adicionar Toque
                </Button>
            )}
        />
        <ErrorContext.Provider value={{ setRows, setError }}>
            <EntriesTable {...{ rows, foot, loading, scrollRef, fetchNextPage }} />
        </ErrorContext.Provider>
        <BirthTestFilter {...{ setFilter: setFilter, filter, filterOpen, setFilterOpen, anchorEl }} />
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            message={error?.message}
            onClose={() => setError(undefined)}
        />
        <AddTestDialog {...{ addTestOpen, closeAddTest }} />

    </div>
}

type EntriesTableProps = {
    rows: TestEntry[]
    foot: TestEntryFoot
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
                <VirtuosoResizeHeadCell align="center" width={150}>Data do Exame</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={150}>Prenhez</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={150}>Nascimento</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={150}>Data de Previsão</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={300}>Informações de Cria</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={600}>Observações</VirtuosoResizeHeadCell>
            </TableHeadRow>
        )}
        fixedFooterContent={() => (
            <TableFooterRow colSpan={COLUMN_COUNT}>
                <FooterContent title="Total" content={foot.totals} />
                <FooterContent title="Taxa de Prenhez" content={percentageTransform(foot.pregnancyRate)} />
                <FooterContent title="Taxa de Natalidade" content={percentageTransform(foot.birthRate)} />
            </TableFooterRow>
        )}
        itemContent={(_, item) => <EntriesRow {...{ item: item as TestEntry, loading }} />}
    />

}

type EntriesRowProps = {
    item: TestEntry
    loading: boolean
}

const EntriesRow = ({ item, loading }: EntriesRowProps) => {

    const [rowData, setRowData] = useState<TestEntry>(item)
    const [editing, setEditing] = useState(false)
    const [loadingButton, setLoading] = useState(false)

    const { setError, setRows } = useContext(ErrorContext)

    useEffect(() => setRowData(item), [item])

    if (loading) return <TableLoadingCells colSpan={COLUMN_COUNT} />
    if (editing) return <EntriesRowEditing {...{ rowData, setEditing, setRowData }} />

    const onDelete = () => {
        setLoading(true)
        deleteTest(rowData.id)
            .then(() => {
                setError(undefined)
                setRows(prev => prev.filter(item => item.id != rowData.id))
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }

    return <>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing, onDelete, loading: loadingButton }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.testDate)}</TableBodyCell>
        <TableBodyCell align="center">
            <Chip
                label={PregnancyStatusMap.get(rowData.pregnancyStatus)}
                color={ChipColorScheme.get(rowData.pregnancyStatus)}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <Chip
                label={BirthStatusMap.get(rowData.birthStatus)}
                color={ChipColorScheme.get(rowData.birthStatus)}
            />
        </TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.birthForecast)}</TableBodyCell>
        <TableBodyCell>{rowData.childInformation}</TableBodyCell>
        <TableBodyCell>{rowData.observation}</TableBodyCell>
    </>
}

const EntriesRowEditing = ({ rowData, setRowData, setEditing }) => {

    const [showForecast, setShowForecast] = useState(rowData.pregnancyStatus === 'SUCCESS')
    const [loading, setLoading] = useState(false)

    const { control, handleSubmit, setValue, getValues } = useForm<TestEntrySave>({ defaultValues: rowData })
    const { setError } = useContext(ErrorContext)

    useEffect(() => setShowForecast(rowData.pregnancyStatus === 'SUCCESS'), [rowData])

    const onSubmit: SubmitHandler<TestEntrySave> = (data: TestEntrySave) => {
        setLoading(true)
        updateTest(data)
            .then(response => {
                setRowData(response)
                setEditing(false)
                setError(undefined)
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }

    const onSave = handleSubmit(onSubmit)

    return <>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing, loading }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell align="center">
            <FormDatePicker formProps={{ control, name: 'testDate' }} />
        </TableBodyCell>
        <TableBodyCell align="center">
            <FormComboBox
                items={PregnancyStatusItems}
                formProps={{ control, name: 'pregnancyStatus' }}
                onChange={(value) => {
                    setShowForecast(value === 'SUCCESS')
                    if (value === 'FAILED') setValue('pregnancyTime', undefined)
                }}
                renderOption={(props, option) => (
                    <li {...props}>
                        <Chip
                            label={PregnancyStatusMap.get(option.value)}
                            color={ChipColorScheme.get(option.value)}
                        />
                    </li>
                )}
                renderValue={value => (
                    <Chip
                        label={PregnancyStatusMap.get(value.value)}
                        color={ChipColorScheme.get(value.value)}
                    />
                )}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <Chip
                label={BirthStatusMap.get(rowData.birthStatus)}
                color={ChipColorScheme.get(rowData.birthStatus)}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            {showForecast &&
                <FormDatePicker
                    formProps={{ control, name: 'birthForecast' }}
                    onChange={(value) => {

                        const PREGNANCY_DURATION_EST = 310

                        if (!value) {
                            setValue('pregnancyTime', undefined)
                            return
                        }

                        const testDate = dayjs(getValues('testDate'))
                        const dateDiff = value.diff(testDate, 'days')
                        const daysTobirth = PREGNANCY_DURATION_EST - dateDiff
                        setValue('pregnancyTime', daysTobirth)
                    }}
                />
            }
        </TableBodyCell>
        <TableBodyCell>{rowData.childInformation}</TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'observation' }} />
        </TableBodyCell>
    </>
}
