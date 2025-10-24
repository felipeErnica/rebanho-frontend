import { RefObject, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { LactationHist, LactationHistFilter, LactationHistFoot } from "./Entities"
import { findLactationsPage, getLactationsPageFoot } from "./Controller"
import { ComboBoxItem } from "@/ui/shared/common/ComboBox"
import { useVirtuosoComponents, usePagination } from "@/ui/shared/table/PageTable"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import {
    FooterContent,
    TableBodyCell,
    TableFooterRow,
    TableHeadRow,
    TableLoadingCells,
    VirtuosoHeadCell,
    VirtuosoResizeHeadCell
} from "@/ui/shared/table/TableComponents"
import { dateTransform, decimalTransform } from "@/util/Transformations"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { LacHistFilter } from "./LacHistFilter"
import { PageProps } from "@/ui/shared/main-page/PageDisplay"
import { LactationEntriesTablePage } from "./LactationEntriesTable"
import { HomePage } from "../home/HomePage"
import { LactationHistPage, MilkDashboardPage } from "./LactationPages"
import { PageContext } from "@/ui/shared/main-page/PageContext"

export const LactationHistTablePage = () => {

    const defaultSort = "animal_order, start_date"

    const defaultFoot: LactationHistFoot = useMemo(() => ({
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
    const [foot, setFoot] = useState(defaultFoot)

    const anchorEl = useRef<HTMLButtonElement>(null)

    const fetchPage = useCallback((cursor?: string) => {
        getLactationsPageFoot(filter)
            .then(response => setFoot(response.json))
            .catch(() => setFoot(defaultFoot))
        return findLactationsPage(filter, sort, order, cursor)
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
            orderProps={{ order, setOrder }}
            sortProps={{ sort, sortColumns, setSort, defaultSort }}
        />
        <LacTable {...{ rows, foot, loading, scrollRef, fetchNextPage }} />
        <LacHistFilter {...{ setFilter, filter, filterOpen, setFilterOpen, anchorEl }} />
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

    const [tableWidth, setTableWidth] = useState(0)
    const tableRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleResize = () => {
            if (!tableRef.current) return
            const table = tableRef.current
            setTableWidth(table.offsetWidth)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return <TableVirtuoso
        scrollerRef={(ref) => tableRef.current = ref as HTMLDivElement}
        ref={scrollRef}
        data={rows}
        components={useVirtuosoComponents(10)}
        endReached={fetchNextPage}
        fixedHeaderContent={() => {

            const unit = tableWidth / 100

            return <TableHeadRow>
                <VirtuosoHeadCell width={unit * 10} />
                <VirtuosoResizeHeadCell width={unit * 15}>Vaca</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Bezerro</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 10}>Início de Lactação</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 10}>Fim de Lactação</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 18}>Intervalo entre Lactações (dias)</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 15}>Período em Lactação (dias)</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 15}>Média de Produção Diária</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 10}>Pico de Produção</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 10}>Total Produzido</VirtuosoResizeHeadCell>
            </TableHeadRow>

        }}
        fixedFooterContent={() => (
            <TableFooterRow colSpan={10}>
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
    const { setPageProps } = useContext(PageContext)

    useEffect(() => setRowData(item), [item])

    if (loading) return <TableLoadingCells colSpan={10} />
    if (editing) return <LacRowEditing {...{ rowData, setEditing, setRowData }} />

    return <>
        <TableBodyCell>
            <EditControlButtons
                setEditing={setEditing}
                onShow={() => {
                    const startDate = dateTransform(rowData.startDate)
                    const endDate = rowData.endDate ? ` Fim: ${dateTransform(rowData.endDate)}` : ""
                    const page: PageProps = {
                        title: `Leite - ${rowData.animalName} - (Início: ${startDate}${endDate})`,
                        page: <LactationEntriesTablePage {...{ lacId: rowData.id }} />,
                        previousPages: [HomePage, MilkDashboardPage, LactationHistPage]
                    }
                    if (setPageProps) setPageProps(page)
                }}
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
    </>
}

type LacRowEditingProps = {
    rowData: LactationHist
    setRowData: (rowData: LactationHist) => void
    setEditing: (editing: boolean) => void
}

const LacRowEditing = ({ rowData, setRowData, setEditing }: LacRowEditingProps) => {

    const { control, handleSubmit } = useForm<LactationHist>({ defaultValues: rowData })

    const onSubmit: SubmitHandler<LactationHist> = (data: LactationHist) => {
        setRowData(data)
        setEditing(false)
    }

    const onSave = handleSubmit(onSubmit)

    return <>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalName}</TableBodyCell>
        <TableBodyCell>{rowData.calfInfo}</TableBodyCell>
        <TableBodyCell align="center">
            <FormDatePicker
                formProps={{
                    control,
                    name: 'startDate'
                }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <FormDatePicker
                formProps={{
                    control,
                    name: 'endDate'
                }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">{rowData.lacInterval ?? "1ª Lactação"}</TableBodyCell>
        <TableBodyCell align="center">{rowData.lacPeriod}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.averageProduction ?? 0)}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.peak ?? 0, 1)}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.totalProduction ?? 0)}</TableBodyCell>
    </>
}
