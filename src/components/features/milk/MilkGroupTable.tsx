import {
    createContext,
    Dispatch,
    RefObject,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from "react"
import { LactationGroup, LactationGroupFilter, LactationGroupSave } from "./Entities"
import { deleteMilkGroup, findGroupsPage, updateMilkGroup } from "./Service"
import { useVirtuosoComponents, usePagination } from "@shared/table/PageTable"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import {
    TableBodyCell,
    TableHeadControlCell,
    TableHeadRow,
    TableLoadingCells,
    TrendValues,
    VirtuosoHeadCell,
    VirtuosoResizeHeadCell
} from "@shared/table/TableComponents"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { dateTransform, decimalTransform } from "@utils/Transformations"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { MilkGroupFilter } from "./MilkGroupFilter"
import { APIError } from "@/utils/ApiRequest"
import { ErrorDialog, TimerYesNoDialog, TimerYesNoDialogProps } from "@/components/shared/dialog/DialogComponents"
import { DefaultTimerWarning, GROUP_DELETE_TITLE, GROUP_UPDATE_TITLE } from "@/components/shared/Globals"
import { Link } from "react-router"

type EditContextProps = {
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setWarning: Dispatch<SetStateAction<TimerYesNoDialogProps>>
    setRows: Dispatch<SetStateAction<LactationGroup[]>>
}

const EditContext = createContext<EditContextProps>(undefined!)

export const GroupTablePage = () => {

    const [filter, setFilter] = useState<LactationGroupFilter>({ isFiltered: false })
    const [filterOpen, setFilterOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [order, setOrder] = useState("desc")
    const [error, setError] = useState<APIError>()
    const [warning, setWarning] = useState(DefaultTimerWarning)

    const anchorEl = useRef<HTMLButtonElement>(null)

    const fetchPage = useCallback((cursor?: string) => {
        return findGroupsPage(filter, order, cursor)
    }, [filter, order])

    const onReload = useCallback(() => setFilter({ isFiltered: false }), [])

    const { rows, scrollRef, fetchNextPage, setRows } = usePagination<LactationGroup>({ setLoading, fetchPage })

    return <div className="w-full h-full flex flex-col">
        <TableTopBar
            reloadProps={{ onReload, loading }}
            orderProps={{ order, setOrder }}
            filterProps={{ setFilterOpen, anchorEl }}
        />
        <EditContext.Provider value={{ setWarning, setError, setRows }}>
            <GroupsTable {...{ rows, loading, scrollRef, fetchNextPage }} />
        </EditContext.Provider>
        <MilkGroupFilter {...{ setFilter: setFilter, filter, filterOpen, setFilterOpen, anchorEl }} />
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            message={error?.message}
            onClose={() => setError(undefined)}
        />
        <TimerYesNoDialog {...warning} />
    </div>
}

type GroupTableProps = {
    rows: LactationGroup[]
    loading: boolean
    scrollRef: RefObject<VirtuosoHandle | null>
    fetchNextPage: () => void
}

const COLUMN_COUNT = 5

const GroupsTable = ({ rows, loading, scrollRef, fetchNextPage }: GroupTableProps) => {

    return <TableVirtuoso
        ref={scrollRef}
        data={rows}
        components={useVirtuosoComponents(COLUMN_COUNT)}
        endReached={fetchNextPage}
        fixedHeaderContent={() => (
            <TableHeadRow>
                <TableHeadControlCell />
                <VirtuosoResizeHeadCell align="center">Data da Marcação</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={420}>Nº de Animais</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={420}>Produção Total</VirtuosoResizeHeadCell>
                <VirtuosoHeadCell align="center" width={420}>Média de Produção</VirtuosoHeadCell>
            </TableHeadRow>
        )}
        itemContent={(_, item) => <GroupsRow {...{ item: item as LactationGroup, loading }} />}
    />

}

type GroupsRowProps = {
    item: LactationGroup
    loading: boolean
}

const GroupsRow = ({ item, loading }: GroupsRowProps) => {

    const [rowData, setRowData] = useState<LactationGroup>(item)
    const [editing, setEditing] = useState(false)
    const [loadingControls, setLoadingControls] = useState(false)

    const { setError, setWarning, setRows } = useContext(EditContext)

    useEffect(() => setRowData(item), [item])

    if (loading) return <TableLoadingCells colSpan={COLUMN_COUNT} />
    if (editing) return <GroupsRowEditing {...{ rowData, setEditing, setRowData }} />

    const deleteGroup = () => {
        setLoadingControls(true)
        deleteMilkGroup(rowData.entryDate)
            .then(() => {
                setRows(rows => rows.filter(item => item.entryDate != rowData.entryDate))
                setError(undefined)
            })
            .catch(err => setError(err))
            .finally(() => {
                setLoadingControls(false)
                setWarning(DefaultTimerWarning)
            })
    }

    const onDelete = () => {
        setWarning({
            openYesNo: true,
            waitTime: 10,
            title: GROUP_DELETE_TITLE,
            message: `Ao confirmar, ${rowData.animalsNumber} registros de leite serão excluídos!`,
            onClose: () => setWarning(DefaultTimerWarning),
            onYes: () => deleteGroup()
        })
    }

    return <>
        <TableBodyCell>
            <EditControlButtons
                setEditing={setEditing}
                onDelete={onDelete}
                loading={loadingControls}
                onShow={() => <Link to={`lactation/milk/${rowData.entryDate}`} />}
            />
        </TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.entryDate)}</TableBodyCell>
        <TableBodyCell align="center">
            <TrendValues
                value={rowData.animalsNumber}
                trendProps={{ trend: rowData.numberDifference, text: rowData.numberDifference.toString() }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <TrendValues
                value={decimalTransform(rowData.totalMilk)}
                trendProps={{ trend: rowData.totalRate }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <TrendValues
                value={decimalTransform(rowData.averageMilk)}
                trendProps={{ trend: rowData.averageRate }}
            />
        </TableBodyCell>
    </>
}

type GroupsRowEditingProps = {
    rowData: LactationGroup
    setRowData: (rowData: LactationGroup) => void
    setEditing: (editing: boolean) => void
}

const GroupsRowEditing = ({ rowData, setRowData, setEditing }: GroupsRowEditingProps) => {

    const [loading, setLoading] = useState(false)

    const { control, handleSubmit } = useForm<LactationGroupSave>({
        defaultValues: {
            oldEntry: rowData.entryDate
        }
    })
    const { setError, setWarning } = useContext(EditContext)

    const onSubmit: SubmitHandler<LactationGroupSave> = (data: LactationGroupSave) => {
        setLoading(true)
        updateMilkGroup(data)
            .then(response => {
                setRowData(response)
                setEditing(false)
            })
            .catch(err => setError(err))
            .finally(() => {
                setLoading(false)
                setWarning(DefaultTimerWarning)
            })
    }

    const onSave = () => {
        setWarning({
            openYesNo: true,
            title: GROUP_UPDATE_TITLE,
            message: `Ao confirmar, ${rowData.animalsNumber} registros terão a data modificada! Deseja continuar?`,
            waitTime: 10,
            onYes: handleSubmit(onSubmit),
            onClose: () => setWarning(DefaultTimerWarning),
        })
    }

    return <>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing, loading }} />
        </TableBodyCell>
        <TableBodyCell>
            <FormDatePicker formProps={{ control, name: 'entryDate' }} />
        </TableBodyCell>
        <TableBodyCell align="center">
            <TrendValues
                value={rowData.animalsNumber}
                trendProps={{ trend: rowData.numberDifference }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <TrendValues
                value={decimalTransform(rowData.totalMilk)}
                trendProps={{ trend: rowData.totalRate }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <TrendValues
                value={decimalTransform(rowData.averageMilk)}
                trendProps={{ trend: rowData.averageRate }}
            />
        </TableBodyCell>
    </>
}
