import {
    createContext,
    Dispatch,
    RefObject,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react"
import { useVirtuosoComponents, usePagination } from "@shared/table/PageTable"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import {
    FooterContent,
    TableBodyCell,
    TableFooterRow,
    TableHeadControlCell,
    TableHeadRow,
    VirtuosoHeadCell,
    VirtuosoResizeHeadCell,
    VirtuosoRowRender
} from "@shared/table/TableComponents"
import { dateTransform, decimalTransform } from "@utils/Transformations"
import { ComboBoxItem } from "@/components/shared/common/ComboBox"
import { LactationAnimalFilter, Lactation, LactationHistFoot, LactationAnimal } from "./Entities"
import { useNavigate } from "react-router"
import { APIError } from "@/utils/ApiRequest"
import { ErrorDialog, TimerYesNoDialog, TimerYesNoDialogProps } from "@/components/shared/dialog/DialogComponents"
import { DefaultTimerWarning } from "@/components/shared/Globals"
import { EditControlButtons } from "@/components/shared/table/ControlButtons"
import { findLactationsAnimalsPage, getLactationsAnimalsPageFoot } from "./Service"
import { LactationAnimalsFilter } from "./LactationAnimalsFilter"
import { getAnimalBirthLabel } from "@features/animals/Entities"

type EditContextProps = {
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setRows: Dispatch<SetStateAction<Lactation[]>>
    setWarning: Dispatch<SetStateAction<TimerYesNoDialogProps>>
}

const ErrorContext = createContext<EditContextProps>(undefined!)

export const LacAnimalsTablePage = (defaultFilter: LactationAnimalFilter) => {

    const defaultFoot: LactationHistFoot = useMemo(() => ({
        totalLacs: 0,
        averagePeriod: 0,
        averageProduction: 0,
        averageTotal: 0,
        averageInterval: 0,
        averagePeak: 0,
    }), [])

    const defaultSort = 'tag_order'
    const [filter, setFilter] = useState<LactationAnimalFilter>(defaultFilter)
    const [filterOpen, setFilterOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [foot, setFoot] = useState(defaultFoot)
    const [sort, setSort] = useState(defaultSort)
    const [order, setOrder] = useState('asc')

    const anchorEl = useRef<HTMLButtonElement>(null)

    const [error, setError] = useState<APIError>()
    const [warning, setWarning] = useState(DefaultTimerWarning)

    const fetchPage = useCallback((cursor?: string) => {
        getLactationsAnimalsPageFoot(filter)
            .then(response => setFoot(response))
            .catch(() => setFoot(defaultFoot))
        return findLactationsAnimalsPage(filter, sort, order, cursor)
    }, [defaultFoot, filter, order, sort])

    const onReload = useCallback(() => setFilter(defaultFilter), [])

    const sortColumns: ComboBoxItem[] = [
        { name: 'Brinco da Vaca', value: defaultSort },
        { name: 'Nome da Vaca', value: 'name, lac_start' },
        { name: 'Início de Lactação', value: 'lac_start, tag_order' },
        { name: 'Fim de Lactação', value: 'lac_end, tag_order' },
        { name: 'Nascimento do Bezerro', value: 'calf_birth_date, lac_start, tag_order' },
        { name: 'Produção Média', value: 'lac_average' },
        { name: 'Período em Lactação', value: 'lac_period, lac_start, tag_order' },
        { name: 'Produção Total', value: 'lac_total' },
        { name: 'Intervalo de Lactação', value: 'lac_interval, lac_start, tag_order' },
    ]

    const { rows, scrollRef, fetchNextPage, setRows } = usePagination<LactationAnimal>({ setLoading, fetchPage })

    return <div className="w-full h-full flex flex-col">
        <TableTopBar
            reloadProps={{ onReload, loading }}
            filterProps={{ setFilterOpen, anchorEl }}
            sortProps={{ sort, setSort, defaultSort, sortColumns }}
            orderProps={{ order, setOrder }}
        />
        <ErrorContext.Provider value={{ setError, setRows, setWarning }}>
            <LacAnimalsTable {...{ rows, foot, loading, scrollRef, fetchNextPage }} />
        </ErrorContext.Provider>
        <LactationAnimalsFilter {...{ setFilter, filter, filterOpen, setFilterOpen, anchorEl }} />
        <ErrorDialog
            title={error?.title}
            message={error?.message}
            onClose={() => setError(undefined)}
            openError={!!error}
        />
        <TimerYesNoDialog {...warning} />
    </div>
}

const COLUMN_COUNT = 12

type LacAnimalsTableProps = {
    rows: LactationAnimal[]
    foot: LactationHistFoot
    loading: boolean
    scrollRef: RefObject<VirtuosoHandle | null>
    fetchNextPage: () => void
}

const LacAnimalsTable = ({ rows, loading, scrollRef, fetchNextPage, foot }: LacAnimalsTableProps) => {

    return <TableVirtuoso
        ref={scrollRef}
        data={rows}
        components={useVirtuosoComponents(COLUMN_COUNT)}
        endReached={fetchNextPage}
        fixedHeaderContent={() => (
            <TableHeadRow>
                <TableHeadControlCell />
                <VirtuosoResizeHeadCell align="center" width={120}>Brinco</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={300}>Nome</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={180}>Data de Nascimento</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={300}>Bezerro</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={150}>Início de Lactação</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={200}>Intervalo entre Lactações</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={180}>Período em Lactação</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={180}>Média de Produção</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={80}>Pico</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={150}>Total Produzido</VirtuosoResizeHeadCell>
                <VirtuosoHeadCell width={600}>Observações</VirtuosoHeadCell>
            </TableHeadRow>
        )}
        fixedFooterContent={() => (
            <TableFooterRow colSpan={COLUMN_COUNT}>
                <FooterContent title="Total" content={foot.totalLacs} />
                <FooterContent title="Intervalo Médio" content={decimalTransform(foot.averageInterval)} />
                <FooterContent title="Período Médio" content={decimalTransform(foot.averagePeriod)} />
                <FooterContent title="Média Diária Geral" content={decimalTransform(foot.averageProduction)} />
                <FooterContent title="Pico Médio" content={decimalTransform(foot.averagePeak)} />
                <FooterContent title="Produção Média" content={decimalTransform(foot.averageTotal)} />
            </TableFooterRow>
        )}
        itemContent={(_, item) => (
            <VirtuosoRowRender
                colSpan={COLUMN_COUNT}
                loading={loading}
                render={() => <LacAnimalRow {...item} />}
            />
        )}
    />
}

const LacAnimalRow = (item: LactationAnimal) => {

    const [rowData, setRowData] = useState<LactationAnimal>(item)
    const navigate = useNavigate()

    useEffect(() => setRowData(item), [item])

    return <>
        <TableBodyCell>
            <EditControlButtons onShow={() => navigate(rowData.id)} />
        </TableBodyCell>
        <TableBodyCell>{rowData.tag}</TableBodyCell>
        <TableBodyCell>{rowData.name}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.birthDate)}</TableBodyCell>
        <TableBodyCell>{getAnimalBirthLabel(rowData.lactation?.calf)}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.lactation?.startDate)}</TableBodyCell>
        <TableBodyCell align="center">{rowData.lactation?.lacInterval ?? "1ª Lactação"}</TableBodyCell>
        <TableBodyCell align="center">{rowData.lactation?.lacPeriod ?? "-"}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.lactation?.averageProduction)}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.lactation?.peak, 1)}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.lactation?.totalProduction)}</TableBodyCell>
        <TableBodyCell>{rowData.lactation?.observation ?? '-'}</TableBodyCell>
    </>
}
