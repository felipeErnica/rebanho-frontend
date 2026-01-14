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
import { LactationHist, LactationHistFilter, LactationHistFoot } from "./Entities"
import {
    deleteLactation,
    findLongLactationsPage,
    getLongLactationsPageFoot,
    updateLactation
} from "./Service"
import { ComboBoxItem } from "@shared/common/ComboBox"
import { useVirtuosoComponents, usePagination } from "@shared/table/PageTable"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import {
    FooterContent,
    TableBodyCell,
    TableFooterRow,
    TableHeadControlCell,
    TableHeadRow,
    TableLoadingCells,
    VirtuosoHeadCell,
    VirtuosoResizeHeadCell
} from "@shared/table/TableComponents"
import { dateTransform, decimalTransform } from "@utils/Transformations"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { LacHistFilter } from "./LacHistFilter"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { APIError } from "@utils/ApiRequest"
import { ErrorDialog, TimerYesNoDialog, TimerYesNoDialogProps } from "@shared/dialog/DialogComponents"
import { Button } from "@mui/material"
import BackHand from '@mui/icons-material/BackHand';
import { EndLactationDialog } from "./EndLactationDialog"
import { DefaultTimerWarning, GROUP_DELETE_TITLE } from "@/components/shared/Globals"
import { useNavigate } from "react-router"
import { searchAnimal } from "@features/animals/Service"
import { Animal, getAnimalFullLabel } from "@features/animals/Entities"

type EditContextProps = {
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setRows: Dispatch<SetStateAction<LactationHist[]>>
    setWarning: Dispatch<SetStateAction<TimerYesNoDialogProps>>
}

const ErrorContext = createContext<EditContextProps>(undefined!)

export const LongLactationsTablePage = () => {

    const defaultSort = "animal_order, start_date"

    const DEFAULT_FOOT: LactationHistFoot = useMemo(() => ({
        totalLacs: 0,
        averageTotal: 0,
        averageInterval: 0,
        averagePeriod: 0,
        averagePeak: 0,
        averageProduction: 0,
    }), [])

    const [filter, setFilter] = useState<LactationHistFilter>({ isFiltered: false })
    const [filterOpen, setFilterOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sort, setSort] = useState(defaultSort)
    const [order, setOrder] = useState('asc')
    const [foot, setFoot] = useState(DEFAULT_FOOT)

    const [error, setError] = useState<APIError>()
    const [warning, setWarning] = useState(DefaultTimerWarning)
    const [reloadFlag, setReloadFlag] = useState(0)
    const [openEndLactation, setOpenEndLactation] = useState(false)

    const anchorEl = useRef<HTMLButtonElement>(null)
    const menuAnchor = useRef<HTMLButtonElement>(null)

    const fetchPage = useCallback((cursor?: string) => {
        getLongLactationsPageFoot(filter)
            .then(response => setFoot(response))
            .catch(() => setFoot(DEFAULT_FOOT))
        return findLongLactationsPage(filter, sort, order, cursor)
    }, [DEFAULT_FOOT, filter, order, sort])

    const onReload = useCallback(() => setFilter({ isFiltered: false }), [])
    const { rows, scrollRef, fetchNextPage, setRows } = usePagination<LactationHist>({ setLoading, fetchPage })

    const closeEndLactation = useCallback((changed?: boolean) => {
        if (changed) setReloadFlag(prev => prev + 1)
        setOpenEndLactation(false)
    }, [])

    useEffect(() => onReload(), [onReload, reloadFlag])

    const sortColumns: ComboBoxItem[] = [
        { name: 'Brinco da Vaca', value: defaultSort },
        { name: 'Nome da Vaca', value: 'name, start_date' },
        { name: 'Início de Lactação', value: 'start_date, animal_order' },
        { name: 'Fim de Lactação', value: 'end_date, animal_order' },
        { name: 'Nascimento do Bezerro', value: 'calf_birth_date, start_date, animal_order' },
        { name: 'Produção Média', value: 'avg_production, start_date, animal_order' },
        { name: 'Período em Lactação', value: 'lac_period, start_date, animal_order' },
        { name: 'Produção Total', value: 'total_production, start_date, animal_order' },
        { name: 'Intervalo de Lactação', value: 'lac_interval, start_date, animal_order' },
    ]

    return <div className="w-full h-full flex flex-col">
        <TableTopBar
            reloadProps={{ onReload, loading }}
            filterProps={{ setFilterOpen, anchorEl }}
            orderProps={{ order, setOrder }}
            sortProps={{ sort, sortColumns, setSort, defaultSort }}
            otherProps={(
                <Button
                    onClick={() => setOpenEndLactation(prev => !prev)}
                    startIcon={<BackHand />}
                    ref={menuAnchor}
                >
                    Encerrar Lactações
                </Button>
            )}
        />
        <ErrorContext.Provider value={{ setError, setRows, setWarning }}>
            <LacTable {...{ rows, foot, loading, scrollRef, fetchNextPage }} />
        </ErrorContext.Provider>
        <LacHistFilter {...{ setFilter: setFilter, filter, filterOpen, setFilterOpen, anchorEl }} />
        <ErrorDialog
            title={error?.title}
            content={error?.message}
            onClose={() => setError(undefined)}
            openError={!!error}
        />
        <TimerYesNoDialog {...warning} />
        <EndLactationDialog {...{ openEndLactation, closeEndLactation }} />
    </div>
}

type EntriesTableProps = {
    rows: LactationHist[]
    foot: LactationHistFoot
    loading: boolean
    scrollRef: RefObject<VirtuosoHandle | null>
    fetchNextPage: () => void
}

const LacTable = ({ rows, loading, scrollRef, fetchNextPage, foot }: EntriesTableProps) => {

    return <TableVirtuoso
        ref={scrollRef}
        data={rows}
        components={useVirtuosoComponents(11)}
        endReached={fetchNextPage}
        fixedHeaderContent={() => (
            <TableHeadRow>
                <TableHeadControlCell />
                <VirtuosoResizeHeadCell width={220}>Vaca</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={300}>Bezerro</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={150}>Início de Lactação</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={150}>Fim de Lactação</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={200}>Intervalo entre Lactações</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={180}>Período em Lactação</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={180}>Média de Produção</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={80}>Pico</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={150}>Total Produzido</VirtuosoResizeHeadCell>
                <VirtuosoHeadCell width={600}>Observações</VirtuosoHeadCell>
            </TableHeadRow>
        )}
        fixedFooterContent={() => (
            <TableFooterRow colSpan={11}>
                <FooterContent title="Total" content={foot.totalLacs} />
                <FooterContent title="Intervalo Médio" content={decimalTransform(foot.averageInterval)} />
                <FooterContent title="Período Médio" content={decimalTransform(foot.averagePeriod)} />
                <FooterContent title="Média Diária Geral" content={decimalTransform(foot.averageProduction)} />
                <FooterContent title="Pico Médio" content={decimalTransform(foot.averagePeak)} />
                <FooterContent title="Produção Média" content={decimalTransform(foot.averageTotal)} />
            </TableFooterRow>
        )}
        itemContent={(_, item) => <LacRow {...{ item: item as LactationHist, loading }} />}
    />

}

type LacRowProps = {
    item: LactationHist
    loading: boolean
}

const LacRow = ({ item, loading }: LacRowProps) => {

    const [rowData, setRowData] = useState<LactationHist>(item)
    const [editing, setEditing] = useState(false)
    const [loadingControls, setLoadingControls] = useState(false)
    const navigate = useNavigate()

    const { setRows, setError, setWarning } = useContext(ErrorContext)

    useEffect(() => setRowData(item), [item])

    if (loading) return <TableLoadingCells colSpan={11} />
    if (editing) return <LacRowEditing {...{ rowData, setEditing, setRowData }} />

    const deleteLac = () => {
        setLoadingControls(true)
        deleteLactation(rowData.id)
            .then(() => {
                setRows(rows => rows.filter(item => item.id != rowData.id))
                setError(undefined)
            })
            .catch(err => setError(err))
            .finally(() => setLoadingControls(false))
    }

    const onDelete = () => setWarning({
        openYesNo: true,
        waitTime: 10,
        title: GROUP_DELETE_TITLE,
        content: `Ao confirmar, todas as marcações da ${rowData.animalName}, dos dias ${dateTransform(rowData.startDate)} ` +
            `até ${rowData.endDate ? dateTransform(rowData.endDate) : 'hoje'}, serão excluídas. Deseja continuar?`,
        onClose: () => setWarning(DefaultTimerWarning),
        onYes: deleteLac
    })

    return <>
        <TableBodyCell>
            <EditControlButtons
                setEditing={setEditing}
                onDelete={onDelete}
                loading={loadingControls}
                onShow={() => navigate(rowData.id)}
            />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalName}</TableBodyCell>
        <TableBodyCell>{rowData.calfInfo}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.startDate)}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.endDate)}</TableBodyCell>
        <TableBodyCell align="center">{rowData.lacInterval ?? "1ª Lactação"}</TableBodyCell>
        <TableBodyCell align="center">{rowData.lacPeriod}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.averageProduction ?? 0)}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.peak ?? 0, 1)}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.totalProduction ?? 0)}</TableBodyCell>
        <TableBodyCell>{rowData.observation}</TableBodyCell>
    </>
}

type LacRowEditingProps = {
    rowData: LactationHist
    setRowData: (rowData: LactationHist) => void
    setEditing: (editing: boolean) => void
}

const LacRowEditing = ({ rowData, setRowData, setEditing }: LacRowEditingProps) => {

    const [loading, setLoading] = useState(false)
    const { control, handleSubmit } = useForm<LactationHist>({ defaultValues: rowData })
    const { setError } = useContext(ErrorContext)

    const [loadingSearch, setLoadingSearch] = useState(false)
    const [calves, setCalfs] = useState<Animal[]>([])

    useEffect(() => {
        setLoadingSearch(true)
        searchAnimal({ isFiltered: true, isOutsideAnimal: false })
            .then(res => setCalfs(res))
            .catch(() => setCalfs([]))
            .finally(() => setLoadingSearch(false))
    }, [])

    const onSubmit: SubmitHandler<LactationHist> = (data: LactationHist) => {
        setLoading(true)
        updateLactation(data)
            .then(res => {
                setRowData(res)
                setEditing(false)
            })
            .catch((error) => setError(error))
            .finally(() => setLoading(false))
    }

    const onSave = handleSubmit(onSubmit)

    return <>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing, loading }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalName}</TableBodyCell>
        <TableBodyCell>
            <FormSearchBox
                formProps={{ control, name: 'calfId' }}
                loading={loadingSearch}
                options={calves.map(item => ({
                    id: item.id, 
                    label: getAnimalFullLabel(item)
                }))}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <FormDatePicker formProps={{ control, name: 'startDate' }} />
        </TableBodyCell>
        <TableBodyCell align="center">
            <FormDatePicker formProps={{ control, name: 'endDate' }} />
        </TableBodyCell>
        <TableBodyCell align="center">{rowData.lacInterval ?? "1ª Lactação"}</TableBodyCell>
        <TableBodyCell align="center">{rowData.lacPeriod}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.averageProduction ?? 0)}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.peak ?? 0, 1)}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.totalProduction ?? 0)}</TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'observation' }} />
        </TableBodyCell>
    </>
}
