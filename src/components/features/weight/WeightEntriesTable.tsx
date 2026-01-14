import { useVirtuosoComponents, usePagination } from "@shared/table/PageTable"
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
import { createContext, Dispatch, RefObject, SetStateAction, useCallback, useContext, useEffect, useRef, useState } from "react"
import { deleteWeight, findEntriesPage, getEntriesPageFoot, updateWeight } from "./Controller"
import { WeightEntry, WeightEntrySave, WeightFilter, WeightFoot } from "./Entities"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import { ComboBoxItem } from "@shared/common/ComboBox"
import { WeightFilterPopover } from "./WeightFilter"
import { dateTransform, decimalTransform, positiveTransform, transformWeight } from "@utils/Transformations"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { EditRowProps } from "@shared/table/Entities"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { TrendComponent } from "@shared/dashboard/DashboardComponents"
import { APIError } from "@/utils/ApiRequest"
import { ErrorDialog } from "@/components/shared/dialog/DialogComponents"

type EditContextProps = {
    setRows: Dispatch<SetStateAction<WeightEntry[]>>
    setError: Dispatch<SetStateAction<APIError | undefined>>
    loadFoot: () => void
}

const EditContext = createContext<EditContextProps>(undefined!)

export const WeightEntriesTable = () => {

    const defaultSort = 'entry_date, animal_order'
    const defaultFoot: WeightFoot = {
        animalsNumber: 0,
        averageGain: 0,
        averageWeight: 0
    }

    const [foot, setFoot] = useState<WeightFoot>(defaultFoot)

    const [filterOpen, setFilterOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState<WeightFilter>({ isFiltered: false })
    const [sort, setSort] = useState(defaultSort)
    const [order, setOrder] = useState('desc')
    const anchorEl = useRef<HTMLButtonElement | null>(null)

    const [error, setError] = useState<APIError>()

    const loadFoot = useCallback(() => {
        getEntriesPageFoot(filter)
            .then(results => setFoot(results))
            .catch(() => setFoot)
    }, [filter])

    const fetchPage = useCallback((cursor?: string) => {
        setLoading(true)
        loadFoot()
        return findEntriesPage(filter, sort, order, cursor)
    }, [loadFoot, filter, sort, order])

    const { rows, fetchNextPage, scrollRef, setRows } = usePagination<WeightEntry>({ fetchPage, setLoading })

    const onReload = useCallback(() => setFilter({ isFiltered: false }), [])

    const sortColumns: ComboBoxItem[] = [
        { name: "Data de Pesagem", value: defaultSort },
        { name: "Brinco", value: 'animal_order, entry_date' },
        { name: "Nome", value: 'animal_name, animal_order, birth_date, entry_date' },
        { name: "Data de Nascimento", value: 'birth_date, animal_order, entry_date' },
    ]

    return <TablePageContainer>
        <TableTopBar
            reloadProps={{ loading, onReload }}
            orderProps={{ order, setOrder }}
            filterProps={{ setFilterOpen, anchorEl }}
            sortProps={{ sort, setSort, defaultSort, sortColumns }}
        />
        <EditContext.Provider value={{ setRows, setError, loadFoot }}>
            <EntriesTable {...{ rows, loading, fetchNextPage, scrollRef, foot }} />
        </EditContext.Provider>
        <WeightFilterPopover {...{ setFilter: setFilter, setFilterOpen, filter, filterOpen, anchorEl }} />
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            content={error?.message}
            onClose={() => setError(undefined)}
        />
    </TablePageContainer>
}

type EntriesTableProps = {
    foot: WeightFoot
    fetchNextPage: () => void
    rows: WeightEntry[]
    loading: boolean
    scrollRef: RefObject<VirtuosoHandle | null>
}

const EntriesTable = ({ rows, fetchNextPage, loading, scrollRef, foot }: EntriesTableProps) => {

    return <TableVirtuoso
        ref={scrollRef}
        data={rows}
        components={useVirtuosoComponents(8)}
        endReached={fetchNextPage}
        fixedHeaderContent={() => (
            <TableHeadRow>
                <TableHeadControlCell />
                <VirtuosoResizeHeadCell>Animal</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={300}>Mãe</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={300}>Pai</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={150}>Data da Pesagem</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={150}>Peso</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={250}>Ganho de Peso Diário (kg/dia)</VirtuosoResizeHeadCell>
                <VirtuosoHeadCell align="center" width={200}>Varição de Peso</VirtuosoHeadCell>
            </TableHeadRow>

        )}
        fixedFooterContent={() => (
            <TableFooterRow colSpan={8}>
                <FooterContent
                    title="Total"
                    content={foot.animalsNumber}
                />
                <FooterContent
                    title="Peso Médio"
                    content={`${decimalTransform(foot.averageWeight)} (${decimalTransform(foot.averageWeight / 15)}@)`}
                />
                <FooterContent
                    title="Ganho de Peso Diário Médio"
                    content={decimalTransform(foot.averageGain)}
                />
            </TableFooterRow>
        )}
        itemContent={(_, item) => <EntriesRow {...{ item: item as WeightEntry, loading }} />}
    />

}

type EntriesRowProps = {
    loading: boolean
    item: WeightEntry
}

const EntriesRow = ({ loading, item }: EntriesRowProps) => {

    const [editing, setEditing] = useState(false)
    const [rowData, setRowData] = useState<WeightEntry>(item)
    const [loadingControls, setLoadingControls] = useState(false)

    const { setError, setRows, loadFoot } = useContext(EditContext)

    useEffect(() => setRowData(item), [item])

    if (loading) return <TableLoadingCells colSpan={8} />
    if (editing) return <EntriesEditingRow {...{ setEditing, rowData, setRowData }} />

    const onDelete = () => {
        setLoadingControls(true)
        deleteWeight(rowData.id)
            .then(() => {
                setRows(rows => rows.filter(item => item.id != rowData.id))
                loadFoot()
                setError(undefined)
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
        <TableBodyCell align="center">{dateTransform(rowData.entryDate)}</TableBodyCell>
        <TableBodyCell align="center">{transformWeight(rowData.weight)}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.weightGain)}</TableBodyCell>
        <TableBodyCell align="center">
            <TrendComponent
                trend={rowData.weightVariation}
                text={positiveTransform(rowData.weightVariation)}
            />
        </TableBodyCell>
    </>
}

const EntriesEditingRow = ({ rowData, setRowData, setEditing }: EditRowProps<WeightEntry>) => {

    const [loading, setLoading] = useState(false)

    const { handleSubmit, control } = useForm<WeightEntrySave>({ defaultValues: rowData })
    const { setError, loadFoot } = useContext(EditContext)

    const onSubmit: SubmitHandler<WeightEntrySave> = (data: WeightEntrySave) => {
        setLoading(true)
        updateWeight(data)
            .then(result => {
                setRowData(result)
                loadFoot()
                setEditing(false)
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
            <FormDatePicker formProps={{ control, name: "entryDate" }} />
        </TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: "weight" }} type="number" />
        </TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.weightGain)}</TableBodyCell>
        <TableBodyCell align="center">
            <TrendComponent
                trend={rowData.weightVariation}
                text={positiveTransform(rowData.weightVariation)}
            />
        </TableBodyCell>
    </>

}
