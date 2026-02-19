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
import {
    createContext,
    Dispatch,
    RefObject,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react"
import { Slaughter, SlaughterFilter, SlaughterSave, SlaughterFoot } from "../slaughter/Entities"
import { APIError } from "@utils/ApiRequest"
import { Button } from "@mui/material"
import { ErrorDialog, YesNoDialog, YesNoDialogProps } from "@shared/dialog/DialogComponents"
import { EditRowProps } from "@shared/table/Entities"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { dateTransform, percentageTransform, transformWeight } from "@utils/Transformations"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@shared/form-controls/FormTextField"
import Add from "@mui/icons-material/Add"
import { usePagination, useVirtuosoComponents } from "@shared/table/PageTable"
import { ComboBoxItem } from "@shared/common/ComboBox"
import { AddSlaughterDialog } from "../slaughter/AddSlaughterDialog"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { deleteSlaughter, findButcherEntriesFoot, findButchersEntries, updateSlaughter } from "@features/slaughter/Service"
import { getAnimalLabel } from "@features/animals/Entities"
import { DefaultWarning, ERROR_TYPE, WARNING_TYPE } from "@shared/Globals"

type EditContextProps = {
    setRows: Dispatch<SetStateAction<Slaughter[]>>
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setWarning: Dispatch<SetStateAction<YesNoDialogProps>>
    loadFoot: () => void
}

const EditContext = createContext<EditContextProps>(undefined!)

type ButcherEntriesTableProps = {
    butcherId: string
}

export const ButcherEntriesTable = ({ butcherId }: ButcherEntriesTableProps) => {

    const defaultSort = 'entry_date, animal_order'
    const defaultFoot: SlaughterFoot = useMemo(() => ({
        animalsNumber: 0,
        averageDeadWeight: 0,
        averageRate: 0,
        averageWeight: 0
    }), [])

    const [loading, setLoading] = useState(false)
    const [addSlaughterOpen, setAddSlaughterOpen] = useState(false)
    const [error, setError] = useState<APIError>()
    const [warning, setWarning] = useState<YesNoDialogProps>(DefaultWarning)

    const [sort, setSort] = useState(defaultSort)
    const [order, setOrder] = useState('desc')
    const [filter, setFilter] = useState<SlaughterFilter>({ isFiltered: false })
    const [foot, setFoot] = useState(defaultFoot)

    const loadFoot = useCallback(() => {
        findButcherEntriesFoot(butcherId, filter)
            .then(response => setFoot(response))
            .catch(() => setFoot(defaultFoot))
    }, [butcherId, defaultFoot, filter])

    const fetchPage = useCallback((cursor?: string) => {
        loadFoot()
        return findButchersEntries(butcherId, filter, sort, order, cursor)
    }, [butcherId, filter, loadFoot, order, sort])

    const onReload = useCallback(() => setFilter({ isFiltered: false }), [])

    const { rows, setRows, fetchNextPage, scrollRef } = usePagination<Slaughter>({ fetchPage, setLoading })

    const sortColumns: ComboBoxItem[] = [
        { name: 'Data de Abate', value: defaultSort },
        { name: 'Brinco', value: 'animal_order, birth_date, entry_date' },
        { name: 'Nome', value: 'animal_name, animal_order, birth_date, entry_date' },
        { name: 'Data de Nascimento', value: 'birth_date, animal_order, entry_date' },
        { name: 'Peso', value: 'weight, entry_date' },
        { name: 'Peso de Abate', value: 'dead_weight, entry_date' },
        { name: 'Rendimento', value: 'performance_rate, entry_date' },
    ]

    const closeAddSlaughter = (added?: boolean) => {
        if (added) onReload()
        setAddSlaughterOpen(false)
    }

    return <TablePageContainer>
        <TableTopBar
            reloadProps={{ loading, onReload }}
            sortProps={{ sort, setSort, sortColumns, defaultSort }}
            orderProps={{ order, setOrder }}
            otherProps={(
                <Button
                    onClick={() => setAddSlaughterOpen(true)}
                    startIcon={<Add />}
                >
                    Adicionar Abate
                </Button>
            )}
        />
        <EditContext.Provider value={{ setError, setRows, loadFoot, setWarning }}>
            <ButcherTableBody {...{ rows, loading, fetchNextPage, scrollRef, foot }} />
        </EditContext.Provider>
        <AddSlaughterDialog {...{ addSlaughterOpen, closeAddSlaughter, butcherId }} />
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            message={error?.message}
            onClose={() => setError(undefined)}
        />
        <YesNoDialog {...warning} />
    </TablePageContainer>

}

type ButcherTableProps = {
    rows: Slaughter[]
    foot: SlaughterFoot
    loading: boolean
    fetchNextPage: () => void
    scrollRef: RefObject<VirtuosoHandle | null>
}

const COLUMN_COUNT = 10

const ButcherTableBody = ({
    rows,
    loading,
    scrollRef,
    fetchNextPage,
    foot,
}: ButcherTableProps) => {

    return <TableVirtuoso
        ref={scrollRef}
        data={rows}
        components={useVirtuosoComponents(COLUMN_COUNT)}
        endReached={fetchNextPage}
        fixedHeaderContent={() => (
            <TableHeadRow>
                <TableHeadControlCell />
                <VirtuosoResizeHeadCell>Animal</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={250}>Mãe</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={180}>Pai</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={150}>Taxa de Perda</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={150}>Data de Abate</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={150}>Peso</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={180}>Peso (c/ Desconto)</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={150}>Peso de Abate</VirtuosoResizeHeadCell>
                <VirtuosoHeadCell align="center" width={150}>Rend. Médio</VirtuosoHeadCell>
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
    const [loading, setLoading] = useState(false)

    const { setError, setRows, loadFoot } = useContext(EditContext)

    useEffect(() => setRowData(item), [item])

    if (editing) return <EntriesEditingRow {...{ setEditing, rowData, setRowData }} />

    const onDelete = useCallback(() => {
        setLoading(true)
        deleteSlaughter(rowData.id)
            .then(() => {
                setError(undefined)
                setRows(prev => prev.filter(item => item.id != rowData.id))
                loadFoot()
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }, [rowData])

    return <>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing, onDelete, loading }} />
        </TableBodyCell>
        <TableBodyCell>{getAnimalLabel(rowData.animal)}</TableBodyCell>
        <TableBodyCell>{getAnimalLabel(rowData.animal?.mother)}</TableBodyCell>
        <TableBodyCell>{getAnimalLabel(rowData.animal?.father)}</TableBodyCell>
        <TableBodyCell align="center">{percentageTransform(rowData.discountRate)}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.entryDate)}</TableBodyCell>
        <TableBodyCell align="center"> {transformWeight(rowData.weight)} </TableBodyCell>
        <TableBodyCell align="center"> {transformWeight(rowData.discountWeight)} </TableBodyCell>
        <TableBodyCell align="center"> {transformWeight(rowData.deadWeight)} </TableBodyCell>
        <TableBodyCell align="center">{percentageTransform(rowData.performanceRate)}</TableBodyCell>
    </>
}

const EntriesEditingRow = ({ rowData, setRowData, setEditing }: EditRowProps<Slaughter>) => {

    const [loading, setLoading] = useState(false)

    const { handleSubmit, control, setValue } = useForm<SlaughterSave>({ defaultValues: rowData })
    const { setError, loadFoot, setWarning } = useContext(EditContext)

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
                    setWarning({
                        openYesNo: true,
                        title: err.title,
                        message: err.message,
                        onClose: () => setWarning(DefaultWarning),
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
        <TableBodyCell>{getAnimalLabel(rowData.animal)}</TableBodyCell>
        <TableBodyCell>{getAnimalLabel(rowData.animal?.mother)}</TableBodyCell>
        <TableBodyCell>{getAnimalLabel(rowData.animal?.father)}</TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'discountRate' }} type="number" />
        </TableBodyCell>
        <TableBodyCell>
            <FormDatePicker formProps={{ control, name: "entryDate" }} />
        </TableBodyCell>
        <TableBodyCell align="center">
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
