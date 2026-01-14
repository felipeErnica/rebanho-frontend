import {
    RefObject,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react"
import {
    findDryAnimalsPage,
    getDryAnimalsPageFoot
} from "./Service"
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
import { ComboBoxItem } from "@/components/shared/common/ComboBox"
import { LactationHist, LactationHistFilter, LactationHistFoot } from "./Entities"
import { LacHistFilter } from "./LacHistFilter"

export const DryAnimalsTablePage = () => {

    const defaultFoot: LactationHistFoot = useMemo(() => ({
        totalLacs: 0,
        averagePeriod: 0,
        averageProduction: 0,
        averageTotal: 0,
        averageInterval: 0,
        averagePeak: 0,
    }), [])
    const defaultSort = 'animal_order'

    const [filter, setFilter] = useState<LactationHistFilter>({ isFiltered: false })
    const [filterOpen, setFilterOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [foot, setFoot] = useState(defaultFoot)
    const [sort, setSort] = useState(defaultSort)
    const [order, setOrder] = useState('asc')

    const anchorEl = useRef<HTMLButtonElement>(null)

    const fetchPage = useCallback((cursor?: string) => {
        getDryAnimalsPageFoot(filter)
            .then(response => setFoot(response))
            .catch(() => setFoot(defaultFoot))
        return findDryAnimalsPage(filter, sort, order, cursor)
    }, [defaultFoot, filter, order, sort])

    const onReload = useCallback(() => setFilter({ isFiltered: false }), [])

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

    const { rows, scrollRef, fetchNextPage } = usePagination<LactationHist>({ setLoading, fetchPage })

    return <div className="w-full h-full flex flex-col">
        <TableTopBar
            reloadProps={{ onReload, loading }}
            filterProps={{ setFilterOpen, anchorEl }}
            sortProps={{ sort, setSort, defaultSort, sortColumns }}
            orderProps={{ order, setOrder }}
        />
        <DryAnimalsTable {...{ rows, foot, loading, scrollRef, fetchNextPage }} />
        <LacHistFilter {...{ setFilter: setFilter, filter, filterOpen, setFilterOpen, anchorEl }} />
    </div>
}

const COLUMN_COUNT = 11

type DryAnimalsTableProps = {
    rows: LactationHist[]
    foot: LactationHistFoot
    loading: boolean
    scrollRef: RefObject<VirtuosoHandle | null>
    fetchNextPage: () => void
}

const DryAnimalsTable = ({ rows, loading, scrollRef, fetchNextPage, foot }: DryAnimalsTableProps) => {

    return <TableVirtuoso
        ref={scrollRef}
        data={rows}
        components={useVirtuosoComponents(COLUMN_COUNT)}
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
            <TableFooterRow colSpan={COLUMN_COUNT}>
                <FooterContent title="Total" content={foot.totalLacs} />
                <FooterContent title="Intervalo Médio" content={decimalTransform(foot.averageInterval)} />
                <FooterContent title="Período Médio" content={decimalTransform(foot.averagePeriod)} />
                <FooterContent title="Média Diária Geral" content={decimalTransform(foot.averageProduction)} />
                <FooterContent title="Pico Médio" content={decimalTransform(foot.averagePeak)} />
                <FooterContent title="Produção Média" content={decimalTransform(foot.averageTotal)} />
            </TableFooterRow>
        )}
        itemContent={(_, item) => <DryAnimalRow {...{ item: item as LactationHist, loading }} />}
    />
}

type DryAnimalRowProps = {
    item: LactationHist
    loading: boolean
}

const DryAnimalRow = ({ item, loading }: DryAnimalRowProps) => {

    const [rowData, setRowData] = useState<LactationHist>(item)

    useEffect(() => setRowData(item), [item])

    if (loading) return <TableLoadingCells colSpan={11} />

    const lacInterval = () => {
        if (!rowData.startDate) return '-'
        if (!rowData.lacInterval) return '1ª Lactação'
        return rowData.lacInterval
    }

    return <>
        <TableBodyCell>
            <div />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalName}</TableBodyCell>
        <TableBodyCell>{rowData.calfInfo}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.startDate)}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.endDate)}</TableBodyCell>
        <TableBodyCell align="center">{lacInterval()}</TableBodyCell>
        <TableBodyCell align="center">{rowData.lacPeriod ?? '-'}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.averageProduction ?? 0)}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.peak ?? 0, 1)}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.totalProduction ?? 0)}</TableBodyCell>
        <TableBodyCell>{rowData.observation}</TableBodyCell>
    </>
}
