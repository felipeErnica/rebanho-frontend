import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { BirthStatusMap, PregnancyStatusMap, TestEntry, TestEntryFooter, TestEntryForm } from "./Entities"
import { deleteTest, findEntriesByGroup, getEntriesByGroupFoot, updateTest } from "./Controller"
import Table from "@mui/material/Table"
import { Button, Chip, TableBody, TableHead } from "@mui/material"
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
} from "@/ui/shared/table/TableComponents"
import { dateTransform, percentageTransform } from "@/util/Transformations"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
import Add from "@mui/icons-material/Add"
import { AddTestDialog } from "./AddTestDialog"
import { ComboBoxItem } from "@/ui/shared/common/ComboBox"
import { ChipColorScheme } from "@/ui/shared/Globals"
import dayjs from "dayjs"
import { APIError } from "@/util/ApiRequest"
import { ErrorDialog } from "@/ui/shared/dialog/DialogComponents"

type GroupEntriesTablePageProps = {
    testDate: Date
}

type EditContextProps = {
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setRows: Dispatch<SetStateAction<TestEntry[]>>
    loadFoot: () => void
}

const EditContext = createContext<EditContextProps>(undefined!)

export const GroupEntriesTablePage = ({ testDate }: GroupEntriesTablePageProps) => {

    const defaultSort = 'animal_order'

    const defaultFoot: TestEntryFooter = useMemo(() => ({
        pregnancyRate: 0,
        birthRate: 0,
        totals: 0
    }), [])

    const [rows, setRows] = useState<TestEntry[]>([])
    const [foot, setFoot] = useState<TestEntryFooter>(defaultFoot)
    const [loading, setLoading] = useState(false)
    const [addTestOpen, setAddTestOpen] = useState(false)
    const [sort, setSort] = useState(defaultSort)
    const [order, setOrder] = useState('asc')

    const [error, setError] = useState<APIError>()

    const sortColumns: ComboBoxItem[] = [
        { name: 'Brinco da Vaca', value: 'animal_order' },
        { name: 'Nome da Vaca', value: 'animal_name' },
        { name: 'Data de Previsão', value: "birth_forecast, animal_order" }
    ]

    const loadFoot = useCallback(() => {
        getEntriesByGroupFoot(testDate)
            .then(response => setFoot(response))
            .catch(() => setFoot(defaultFoot))
    }, [defaultFoot, testDate])

    const onReload = useCallback(() => {
        setLoading(true)
        loadFoot()
        findEntriesByGroup(testDate, sort, order)
            .then(response => setRows(response))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [loadFoot, order, sort, testDate])

    useEffect(onReload, [onReload])

    const closeAddTest = (added?: boolean) => {
        setAddTestOpen(false)
        if (added) onReload()
    }

    const otherProps = (
        <Button
            startIcon={<Add />}
            onClick={() => setAddTestOpen(true)}
        >
            Adicionar Toque
        </Button>
    )

    return <div className="h-full w-full overflow-hidden flex flex-col">
        <TableTopBar
            sortProps={{ setSort, sort, sortColumns, defaultSort }}
            orderProps={{ setOrder, order }}
            reloadProps={{ onReload }}
            otherProps={otherProps}
        />
        <EditContext value={{ setError, setRows, loadFoot }}>
            <EntriesTable {...{ rows, loading, foot }} />
        </EditContext>
        <AddTestDialog {...{ addTestOpen, closeAddTest, testDate }} />
        <ErrorDialog 
            openError={!!error}
            title={error?.title}
            content={error?.message}
            onClose={() => setError(undefined)}
        />
    </div>
}

type EntriesTableProps = {
    rows: TestEntry[]
    foot: TestEntryFooter
    loading: boolean
}

const EntriesTable = ({ rows, loading, foot }: EntriesTableProps) => {

    const [unit, setUnit] = useState(0)
    const tableRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleResize = () => {
            if (!tableRef.current) return
            const table = tableRef.current
            setUnit(table.offsetWidth / 100)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return <div
        className="overflow-auto"
        ref={tableRef}
    >
        <Table className="min-w-full w-max" stickyHeader>
            <TableHead>
                <TableHeadRow>
                    <TableHeadCell width={unit * 10} />
                    <ResizableHeadCell width={unit * 15}>Vaca</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={unit * 15}>Prenhez</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={unit * 15}>Nascimento</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={unit * 15}>Data de Previsão</ResizableHeadCell>
                    <ResizableHeadCell width={unit * 15}>Informações de Cria</ResizableHeadCell>
                    <ResizableHeadCell width={unit * 30}>Observações</ResizableHeadCell>
                </TableHeadRow>
            </TableHead>
            <TableBody>
                {rows.map((item) => <EntriesRow {...{ item, loading }} />)}
            </TableBody>
            <StickyTableFooter>
                <TableFooterRow colSpan={7}>
                    <FooterContent title="Total" content={foot.totals} />
                    <FooterContent title="Taxa de Prenhez" content={percentageTransform(foot.pregnancyRate)} />
                    <FooterContent title="Taxa de Natalidade" content={percentageTransform(foot.birthRate)} />
                </TableFooterRow>
            </StickyTableFooter>
        </Table>
    </div>
}

type EntriesRowProps = {
    item: TestEntry
    loading: boolean
}

const EntriesRow = ({ item, loading }: EntriesRowProps) => {

    const [rowData, setRowData] = useState<TestEntry>(item)
    const [editing, setEditing] = useState(false)
    const [loadingControls, setLoadingControls] = useState(false)

    const { setError, setRows, loadFoot } = useContext(EditContext)

    useEffect(() => setRowData(item), [item])

    if (loading) return <TableLoadingRow colSpan={7} />
    if (editing) return <EntriesRowEditing {...{ rowData, setEditing, setRowData }} />

    const onDelete = () => {
        setLoadingControls(false)
        deleteTest(rowData.id)
            .then(() => {
                setError(undefined)
                setRows(prev => prev.filter(item => item.id != rowData.id))
                loadFoot()
            })
            .catch(err => setError(err))
            .finally(() => setLoadingControls(false))
    }

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing, onDelete, loading: loadingControls }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell align="center">
            {rowData.pregnancyStatus &&
                <Chip
                    label={PregnancyStatusMap.get(rowData.pregnancyStatus)}
                    color={ChipColorScheme.get(rowData.pregnancyStatus)}
                />
            }
        </TableBodyCell>
        <TableBodyCell align="center">
            {rowData.birthStatus &&
                <Chip
                    label={BirthStatusMap.get(rowData.birthStatus)}
                    color={ChipColorScheme.get(rowData.birthStatus)}
                />
            }
        </TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.birthForecast)}</TableBodyCell>
        <TableBodyCell>{rowData.childInformation}</TableBodyCell>
        <TableBodyCell>{rowData.observation}</TableBodyCell>
    </TableBodyRow>
}

type EntriesRowEditingProps = {
    rowData: TestEntry
    setRowData: (rowData: TestEntry) => void
    setEditing: (editing: boolean) => void
}

const EntriesRowEditing = ({ rowData, setRowData, setEditing }: EntriesRowEditingProps) => {

    const { control, handleSubmit, setValue, getValues } = useForm<TestEntryForm>({ defaultValues: rowData })
    const { setError, loadFoot } = useContext(EditContext)

    const [loading, setLoading] = useState(false)

    const onSubmit: SubmitHandler<TestEntryForm> = (data: TestEntryForm) => {
        setLoading(true)
        updateTest(data)
            .then(response => {
                setError(undefined)
                setRowData(response)
                loadFoot()
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
        setEditing(false)
    }

    const onSave = handleSubmit(onSubmit)

    return <TableBodyRow>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing, loading }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
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
        <TableBodyCell>
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
        </TableBodyCell>
        <TableBodyCell>{rowData.childInformation}</TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'observation' }} />
        </TableBodyCell>
    </TableBodyRow>
}

