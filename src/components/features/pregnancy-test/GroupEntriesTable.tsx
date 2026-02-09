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
import {
    BirthStatusMap,
    PregnancyStatusMap,
    Test,
    TestEntryFoot,
    TestSave
} from "./Entities"
import { deleteTest, findEntriesByGroup, getEntriesByGroupFoot, updateTest } from "./Service"
import Table from "@mui/material/Table"
import { Button, Chip, TableHead } from "@mui/material"
import {
    FooterContent,
    ResizableHeadCell,
    StickyTableFooter,
    TableBodyCell,
    TableBodyContainer,
    TableBodyRow,
    TableFooterRow,
    TableHeadControlCell,
    TableHeadRow,
} from "@shared/table/TableComponents"
import { dateTransform, percentageTransform } from "@utils/Transformations"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import Add from "@mui/icons-material/Add"
import { AddTestDialog } from "./AddTestDialog"
import { ComboBoxItem } from "@shared/common/ComboBox"
import { ChipColorScheme } from "@shared/Globals"
import dayjs from "dayjs"
import { APIError } from "@utils/ApiRequest"
import { ErrorDialog } from "@shared/dialog/DialogComponents"
import { getAnimalBirthLabel, getAnimalLabel } from "@features/animals/Entities"
import { EditRowProps } from "@shared/table/Entities"

type GroupEntriesTablePageProps = {
    testDate: Date
}

type EditContextProps = {
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setRows: Dispatch<SetStateAction<Test[]>>
    loadFoot: () => void
}

const EditContext = createContext<EditContextProps>(undefined!)

export const GroupEntriesTablePage = ({ testDate }: GroupEntriesTablePageProps) => {

    const defaultSort = 'animal_order'

    const defaultFoot: TestEntryFoot = useMemo(() => ({
        pregnancyRate: 0,
        birthRate: 0,
        totals: 0
    }), [])

    const [rows, setRows] = useState<Test[]>([])
    const [foot, setFoot] = useState<TestEntryFoot>(defaultFoot)
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
        <EditContext.Provider value={{ setError, setRows, loadFoot }}>
            <EntriesTable {...{ rows, loading, foot }} />
        </EditContext.Provider>
        <AddTestDialog {...{ addTestOpen, closeAddTest, testDate }} />
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            message={error?.message}
            onClose={() => setError(undefined)}
        />
    </div>
}

type EntriesTableProps = {
    rows: Test[]
    foot: TestEntryFoot
    loading: boolean
}

const COLUMN_COUNT = 7

const EntriesTable = ({ rows, loading, foot }: EntriesTableProps) => {

    return <div className="overflow-auto" >
        <Table className="min-w-full w-max" stickyHeader>
            <TableHead>
                <TableHeadRow>
                    <TableHeadControlCell />
                    <ResizableHeadCell width={250}>Vaca</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={150}>Prenhez</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={150}>Nascimento</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={150}>Data de Previsão</ResizableHeadCell>
                    <ResizableHeadCell width={300}>Informações de Cria</ResizableHeadCell>
                    <ResizableHeadCell>Observações</ResizableHeadCell>
                </TableHeadRow>
            </TableHead>
            <TableBodyContainer
                dataset={rows}
                colSpan={COLUMN_COUNT}
                loading={loading}
                render={(item) => <EntriesRow {...item} />}
            />
            <StickyTableFooter>
                <TableFooterRow colSpan={COLUMN_COUNT}>
                    <FooterContent title="Total" content={foot.totals} />
                    <FooterContent title="Taxa de Prenhez" content={percentageTransform(foot.pregnancyRate)} />
                    <FooterContent title="Taxa de Natalidade" content={percentageTransform(foot.birthRate)} />
                </TableFooterRow>
            </StickyTableFooter>
        </Table>
    </div>
}

const EntriesRow = (item: Test) => {

    const [rowData, setRowData] = useState<Test>(item)
    const [editing, setEditing] = useState(false)
    const [loadingControls, setLoadingControls] = useState(false)

    const { setError, setRows, loadFoot } = useContext(EditContext)

    useEffect(() => setRowData(item), [item])

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
        <TableBodyCell>{getAnimalLabel(rowData.cow)}</TableBodyCell>
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
        <TableBodyCell>{getAnimalBirthLabel(rowData.calf)}</TableBodyCell>
        <TableBodyCell>{rowData.observation}</TableBodyCell>
    </TableBodyRow>
}

const EntriesRowEditing = ({ rowData, setRowData, setEditing }: EditRowProps<Test>) => {

    const { control, handleSubmit, setValue, getValues } = useForm<TestSave>({ defaultValues: rowData })
    const { setError, loadFoot } = useContext(EditContext)

    const [loading, setLoading] = useState(false)

    const onSubmit: SubmitHandler<TestSave> = (data: TestSave) => {
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
        <TableBodyCell>{getAnimalLabel(rowData.cow)}</TableBodyCell>
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
        <TableBodyCell>{getAnimalBirthLabel(rowData.calf)}</TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'observation' }} />
        </TableBodyCell>
    </TableBodyRow>
}
