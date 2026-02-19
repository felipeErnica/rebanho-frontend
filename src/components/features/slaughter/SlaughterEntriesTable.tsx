import {
    FooterContent,
    TableBodyCell,
    TableFooterRow,
    TableHeadControlCell,
    TableHeadRow,
    TablePageContainer,
    VirtuosoHeadCell,
    VirtuosoResizeHeadCell,
    VirtuosoRowRender
} from "@shared/table/TableComponents"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import { Slaughter, SlaughterFilter, SlaughterSave, SlaughterFoot } from "./Entities"
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
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import { useVirtuosoComponents, usePagination } from "@shared/table/PageTable"
import { deleteSlaughter, findEntriesPage, getEntriesPageFoot, updateSlaughter } from "./Service"
import { ComboBoxItem } from "@shared/common/ComboBox"
import { SlaughterFilterPopover } from "./SlaughterFilter"
import { dateTransform, percentageTransform, toPercentage, transformWeight } from "@utils/Transformations"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { EditRowProps } from "@shared/table/Entities"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { APIError } from "@utils/ApiRequest"
import { ErrorDialog, YesNoDialog, YesNoDialogProps } from "@shared/dialog/DialogComponents"
import { getAnimalBirthLabel, getAnimalLabel } from "@features/animals/Entities"
import { DefaultWarning, ERROR_TYPE, WARNING_TYPE } from "@shared/Globals"
import { Butcher } from "@features/butchers/Entities"
import { findButchers } from "@features/butchers/Service"
import { InputAdornment } from "@mui/material"
import { FormPercentageField } from "@shared/form-controls/FormPercentageField"

type EditContextProps = {
    setRows: Dispatch<SetStateAction<Slaughter[]>>
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setWarningDialog: Dispatch<SetStateAction<YesNoDialogProps>>
    loadFoot: () => void
}

const EditContext = createContext<EditContextProps>(undefined!)

export const SlaughterEntriesTable = () => {

    const defaultFoot: SlaughterFoot = useMemo(() => ({
        animalsNumber: 0,
        averageRate: 0,
        averageWeight: 0,
        averageDeadWeight: 0
    }), [])

    const defaultSort = 'entry_date, animal_order, birth_date'

    const [foot, setFoot] = useState<SlaughterFoot>(defaultFoot)
    const [sort, setSort] = useState(defaultSort)
    const [order, setOrder] = useState('desc')
    const [filter, setFilter] = useState<SlaughterFilter>({ isFiltered: false })
    const [loading, setLoading] = useState(false)
    const [warningDialog, setWarningDialog] = useState<YesNoDialogProps>(DefaultWarning)

    const [error, setError] = useState<APIError>()
    const [filterOpen, setFilterOpen] = useState(false)
    const anchorEl = useRef<HTMLButtonElement | null>(null)

    const loadFoot = useCallback(() => {
        getEntriesPageFoot(filter)
            .then(results => setFoot(results))
            .catch(() => setFoot(defaultFoot))
    }, [defaultFoot, filter])

    const fetchPage = useCallback((cursor?: string) => {
        loadFoot()
        return findEntriesPage(filter, sort, order, cursor)
    }, [filter, loadFoot, order, sort])

    const { rows, fetchNextPage, scrollRef, setRows } = usePagination<Slaughter>({ setLoading, fetchPage })
    const onReload = useCallback(() => setFilter({ isFiltered: false }), [])

    const sortColumns: ComboBoxItem[] = [
        { name: 'Data de Abate', value: defaultSort },
        { name: 'Brinco', value: 'animal_order, birth_date, entry_date' },
        { name: 'Nome', value: 'animal_name, animal_order, birth_date, entry_date' },
        { name: 'Data de Nascimento', value: 'birth_date, animal_order, entry_date' },
        { name: 'Peso', value: 'weight, entry_date' },
        { name: 'Peso de Abate', value: 'dead_weight, entry_date' },
        { name: 'Rendimento', value: 'performance_rate, entry_date' },
    ]

    return <TablePageContainer>
        <TableTopBar
            reloadProps={{ onReload }}
            orderProps={{ setOrder, order }}
            sortProps={{ setSort, sort, defaultSort, sortColumns }}
            filterProps={{ setFilterOpen, anchorEl }}
        />
        <EditContext.Provider value={{ setRows, setError, loadFoot, setWarningDialog }}>
            <EntriesTable  {...{ fetchNextPage, rows, scrollRef, loading, foot }} />
        </EditContext.Provider>
        <SlaughterFilterPopover {...{ setFilter, filter, setFilterOpen, filterOpen, anchorEl }} />
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            message={error?.message}
            onClose={() => setError(undefined)}
        />
        <YesNoDialog {...warningDialog} />
    </TablePageContainer>
}

type EntriesTableProps = {
    foot: SlaughterFoot
    fetchNextPage: () => void
    rows: Slaughter[]
    loading: boolean
    scrollRef: RefObject<VirtuosoHandle | null>
}

const COLUMN_COUNT = 11

const EntriesTable = ({ rows, fetchNextPage, loading, scrollRef, foot }: EntriesTableProps) => {

    return <TableVirtuoso
        ref={scrollRef}
        data={rows}
        components={useVirtuosoComponents(COLUMN_COUNT)}
        endReached={fetchNextPage}
        fixedHeaderContent={() => (
            <TableHeadRow>
                <TableHeadControlCell />
                <VirtuosoResizeHeadCell width={300}>Animal</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={200}>Mãe</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={200}>Pai</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={200}>Frigorífico</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={130}>Taxa de Perda</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={200}>Data de Abate</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={150}>Peso</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={180}>Peso (c/ Desconto)</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={150}>Peso de Abate</VirtuosoResizeHeadCell>
                <VirtuosoHeadCell align="center">Rend. Médio</VirtuosoHeadCell>
            </TableHeadRow>

        )}
        fixedFooterContent={() => (
            <TableFooterRow colSpan={COLUMN_COUNT}>
                <FooterContent title="Total" content={foot.animalsNumber} />
                <FooterContent
                    title="Peso Médio"
                    content={transformWeight(foot.averageWeight)}
                />
                <FooterContent
                    title="Peso de Abate Médio"
                    content={transformWeight(foot.averageDeadWeight)} />
                <FooterContent title="Rend. Médio" content={percentageTransform(foot.averageRate)} />
            </TableFooterRow>
        )}
        itemContent={(_, item) => (
            <VirtuosoRowRender
                colSpan={COLUMN_COUNT}
                loading={loading}
                render={() => <EntriesRow {...item as Slaughter} />}
            />
        )}
    />

}

const EntriesRow = (item: Slaughter) => {

    const [editing, setEditing] = useState(false)
    const [rowData, setRowData] = useState<Slaughter>(item)
    const [loadingControls, setLoadingControls] = useState(false)

    const { setError, setRows, loadFoot } = useContext(EditContext)

    useEffect(() => setRowData(item), [item])

    if (editing) return <EntriesEditingRow {...{ setEditing, rowData, setRowData }} />

    const onDelete = () => {
        setLoadingControls(true)
        deleteSlaughter(rowData.id)
            .then(() => {
                setError(undefined)
                setRows(prev => prev.filter(item => item.id != rowData.id))
                loadFoot()
            })
            .catch(err => setError(err))
            .finally(() => setLoadingControls(false))
    }

    return <>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing, onDelete, loading: loadingControls }} />
        </TableBodyCell>
        <TableBodyCell>{getAnimalBirthLabel(rowData.animal)}</TableBodyCell>
        <TableBodyCell>{getAnimalLabel(rowData.animal?.mother)}</TableBodyCell>
        <TableBodyCell>{getAnimalLabel(rowData.animal?.father)}</TableBodyCell>
        <TableBodyCell align="center">{rowData.butcher.name}</TableBodyCell>
        <TableBodyCell align="center">{toPercentage(rowData.discountRate)}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.entryDate)}</TableBodyCell>
        <TableBodyCell align="center"> {transformWeight(rowData.weight)} </TableBodyCell>
        <TableBodyCell align="center"> {transformWeight(rowData.discountWeight)} </TableBodyCell>
        <TableBodyCell align="center"> {transformWeight(rowData.deadWeight)} </TableBodyCell>
        <TableBodyCell align="center">{toPercentage(rowData.performanceRate)}</TableBodyCell>
    </>
}

const EntriesEditingRow = ({ rowData, setRowData, setEditing }: EditRowProps<Slaughter>) => {

    const [loading, setLoading] = useState(false)
    const [loadingSearch, setLoadingSearch] = useState(false)
    const [butchers, setButchers] = useState<Butcher[]>([])

    const { handleSubmit, control, setValue } = useForm<SlaughterSave>({
        defaultValues: {
            ...rowData,
            animalId: rowData.animal?.id,
            butcherId: rowData.butcher.id
        }
    })
    const { setError, loadFoot, setWarningDialog } = useContext(EditContext)

    useEffect(() => {
        setLoadingSearch(true)
        findButchers()
            .then(resp => setButchers(resp))
            .catch(() => setButchers([]))
            .finally(() => setLoadingSearch(false))
    }, [])

    const onSubmit: SubmitHandler<SlaughterSave> = (data: SlaughterSave) => {
        setLoading(true)
        updateSlaughter(data)
            .then(response => {
                setRowData(response)
                setEditing(false)
                loadFoot()
            })
            .catch((err: APIError) => {
                if (err.errType === ERROR_TYPE) setError(err)
                if (err.errType === WARNING_TYPE) {
                    setWarningDialog({
                        openYesNo: true,
                        title: err?.title,
                        message: err?.message,
                        onClose: () => setWarningDialog(DefaultWarning),
                        onYes: () => {
                            setValue('ignoreDeath', true)
                            onSave()
                        }
                    })
                }
            })
            .finally(() => setLoading(false))
    }

    const onSave = handleSubmit(onSubmit)

    return <>
        <TableBodyCell>
            <EditingControlButtons {...{ setEditing, onSave, loading }} />
        </TableBodyCell>
        <TableBodyCell>{getAnimalBirthLabel(rowData.animal)}</TableBodyCell>
        <TableBodyCell>{getAnimalLabel(rowData.animal?.mother)}</TableBodyCell>
        <TableBodyCell>{getAnimalLabel(rowData.animal?.father)}</TableBodyCell>
        <TableBodyCell>
            <FormSearchBox
                options={butchers.map(item => ({
                    id: item.id,
                    label: item.name
                }))}
                loading={loadingSearch}
                formProps={{ control, name: 'butcherId' }}
            />
        </TableBodyCell>
        <TableBodyCell>
            <FormPercentageField formProps={{ control, name: 'discountRate' }} />
        </TableBodyCell>
        <TableBodyCell>
            <FormDatePicker formProps={{ control, name: "entryDate" }} />
        </TableBodyCell>
        <TableBodyCell>
            <FormTextField
                formProps={{ control, name: "weight" }}
                type="number"
                endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
            />
        </TableBodyCell>
        <TableBodyCell align="center">{transformWeight(rowData.discountWeight)}</TableBodyCell>
        <TableBodyCell>
            <FormTextField
                formProps={{ control, name: 'deadWeight' }}
                type="number"
                endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
            />
        </TableBodyCell>
        <TableBodyCell align="center">{percentageTransform(rowData.performanceRate * 100)}</TableBodyCell>
    </>

}
