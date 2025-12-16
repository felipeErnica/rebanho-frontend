import {
    FooterContent,
    TableBodyCell,
    TableFooterRow,
    TableHeadControlCell,
    TableHeadRow,
    TableLoadingCells,
    TablePageContainer,
    VirtuosoHeadCell,
    VirtuosoResizeHeadCell
} from "@shared/table/TableComponents"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import { SlaughterEntry, SlaughterEntryFilter, SlaughterEntrySave, SlaughterFoot } from "./Entities"
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
import { deleteSlaughter, findEntriesPage, getEntriesPageFoot, searchButcher, updateSlaughter } from "./Controller"
import { ComboBoxItem } from "@shared/common/ComboBox"
import { SlaughterFilterPopover } from "./SlaughterFilterPopover"
import { dateTransform, percentageTransform, transformWeight } from "@utils/Transformations"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { EditRowProps } from "@shared/table/Entities"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { APIError } from "@utils/ApiRequest"
import { ErrorDialog } from "@shared/dialog/DialogComponents"

type EditContextProps = {
    setRows: Dispatch<SetStateAction<SlaughterEntry[]>>
    setError: Dispatch<SetStateAction<APIError | undefined>>
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
    const [filter, setFilter] = useState<SlaughterEntryFilter>({ isFiltered: false })
    const [loading, setLoading] = useState(false)

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

    const { rows, fetchNextPage, scrollRef, setRows } = usePagination<SlaughterEntry>({ setLoading, fetchPage })
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
        <EditContext.Provider value={{ setRows, setError, loadFoot }}>
            <EntriesTable  {...{ fetchNextPage, rows, scrollRef, loading, foot }} />
        </EditContext.Provider>
        <SlaughterFilterPopover {...{ setFilter, filter, setFilterOpen, filterOpen, anchorEl }} />
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            content={error?.message}
            onClose={() => setError(undefined)}
        />
    </TablePageContainer>
}

type EntriesTableProps = {
    foot: SlaughterFoot
    fetchNextPage: () => void
    rows: SlaughterEntry[]
    loading: boolean
    scrollRef: RefObject<VirtuosoHandle | null>
}

const EntriesTable = ({ rows, fetchNextPage, loading, scrollRef, foot }: EntriesTableProps) => {

    return <TableVirtuoso
        ref={scrollRef}
        data={rows}
        components={useVirtuosoComponents(11)}
        endReached={fetchNextPage}
        fixedHeaderContent={() => (
            <TableHeadRow>
                <TableHeadControlCell />
                <VirtuosoResizeHeadCell width={220}>Animal</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={200}>Mãe</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={200}>Pai</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={200}>Frigorífico</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={150}>Taxa de Perda</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={150}>Data de Abate</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={150}>Peso</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={180}>Peso (c/ Desconto)</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={150}>Peso de Abate</VirtuosoResizeHeadCell>
                <VirtuosoHeadCell align="center">Rend. Médio</VirtuosoHeadCell>
            </TableHeadRow>

        )}
        fixedFooterContent={() => (
            <TableFooterRow colSpan={11}>
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
        itemContent={(_, item) => <EntriesRow {...{ item: item as SlaughterEntry, loading }} />}
    />

}

type EntriesRowProps = {
    loading: boolean
    item: SlaughterEntry
}

const EntriesRow = ({ loading, item }: EntriesRowProps) => {

    const [editing, setEditing] = useState(false)
    const [rowData, setRowData] = useState<SlaughterEntry>(item)
    const [loadingControls, setLoadingControls] = useState(false)

    const { setError, setRows, loadFoot } = useContext(EditContext)

    useEffect(() => setRowData(item), [item])

    if (loading) return <TableLoadingCells colSpan={11} />
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
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell>{rowData.motherName}</TableBodyCell>
        <TableBodyCell>{rowData.fatherName}</TableBodyCell>
        <TableBodyCell align="center">{rowData.butcher}</TableBodyCell>
        <TableBodyCell align="center">{percentageTransform(rowData.discountRate)}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.entryDate)}</TableBodyCell>
        <TableBodyCell align="center"> {transformWeight(rowData.weight)} </TableBodyCell>
        <TableBodyCell align="center"> {transformWeight(rowData.discountWeight)} </TableBodyCell>
        <TableBodyCell align="center"> {transformWeight(rowData.deadWeight)} </TableBodyCell>
        <TableBodyCell align="center">{percentageTransform(rowData.performanceRate)}</TableBodyCell>
    </>
}

const EntriesEditingRow = ({ rowData, setRowData, setEditing }: EditRowProps<SlaughterEntry>) => {

    const [loading, setLoading] = useState(false)

    const { handleSubmit, control } = useForm<SlaughterEntrySave>({ defaultValues: rowData })
    const { setError, loadFoot } = useContext(EditContext)

    const onSubmit: SubmitHandler<SlaughterEntrySave> = (data: SlaughterEntrySave) => {
        setLoading(true)
        updateSlaughter(data)
            .then(response => {
                setRowData(response)
                setEditing(false)
                loadFoot()
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }

    const onSave = handleSubmit(onSubmit)

    return <>
        <TableBodyCell>
            <EditingControlButtons {...{ setEditing, onSave, loading }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell>{rowData.motherName}</TableBodyCell>
        <TableBodyCell>{rowData.fatherName}</TableBodyCell>
        <TableBodyCell>
            <FormSearchBox
                formProps={{ control, name: 'butcherId' }}
                searchOptions={searchButcher}
            />
        </TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'discountRate' }} type="number" />
        </TableBodyCell>
        <TableBodyCell>
            <FormDatePicker formProps={{ control, name: "entryDate" }} />
        </TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: "weight" }} type="number" />
        </TableBodyCell>
        <TableBodyCell align="center"> {transformWeight(rowData.weight)} </TableBodyCell>
        <TableBodyCell align="center"> {transformWeight(rowData.discountWeight)} </TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'deadWeight' }} type="number" />
        </TableBodyCell>
        <TableBodyCell align="center">{percentageTransform(rowData.performanceRate)}</TableBodyCell>
    </>

}
