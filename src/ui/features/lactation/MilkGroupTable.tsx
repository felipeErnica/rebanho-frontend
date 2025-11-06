import { RefObject, useCallback, useContext, useEffect, useRef, useState } from "react"
import { LactationGroup, LactationGroupFilter } from "./Entities"
import { findGroupsPage } from "./Controller"
import { useVirtuosoComponents, usePagination } from "@/ui/shared/table/PageTable"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import {
    TableBodyCell,
    TableHeadRow,
    TableLoadingCells,
    TrendValues,
    VirtuosoHeadCell,
    VirtuosoResizeHeadCell
} from "@/ui/shared/table/TableComponents"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { dateTransform, decimalTransform } from "@/util/Transformations"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { MilkGroupFilter } from "./MilkGroupFilter"
import { PageContext } from "@/ui/shared/main-page/PageContext"
import { PageProps } from "@/ui/shared/main-page/PageDisplay"
import { GroupEntriesTablePage } from "./GroupEntriesTable"
import { HomePage } from "../home/HomePage"
import { MilkDashboardPage, MilkGroupsPage } from "./LactationPages"

export const GroupTablePage = () => {

    const [filter, setFilter] = useState<LactationGroupFilter>({ isFiltered: false })
    const [filterOpen, setFilterOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [order, setOrder] = useState("desc")

    const anchorEl = useRef<HTMLButtonElement>(null)

    const fetchPage = useCallback((cursor?: string) => {
        return findGroupsPage(filter, order, cursor)
    }, [filter, order])

    const onReload = useCallback(() => setFilter({ isFiltered: false }), [])

    const { rows, scrollRef, fetchNextPage } = usePagination<LactationGroup>({ setLoading, fetchPage })

    return <div className="w-full h-full flex flex-col">
        <TableTopBar
            reloadProps={{ onReload, loading }}
            orderProps={{ order, setOrder }}
            filterProps={{ setFilterOpen, anchorEl }}
        />
        <GroupsTable {...{ rows, loading, scrollRef, fetchNextPage }} />
        <MilkGroupFilter {...{ setFilter, filter, filterOpen, setFilterOpen, anchorEl }} />
    </div>
}

type GroupTableProps = {
    rows: LactationGroup[]
    loading: boolean
    scrollRef: RefObject<VirtuosoHandle | null>
    fetchNextPage: () => void
}

const GroupsTable = ({ rows, loading, scrollRef, fetchNextPage }: GroupTableProps) => {

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
        components={useVirtuosoComponents(5)}
        endReached={fetchNextPage}
        fixedHeaderContent={() => {

            const unit = tableWidth / 100

            return <TableHeadRow>
                <VirtuosoHeadCell width={unit * 10} />
                <VirtuosoResizeHeadCell width={unit * 20}>Data da Marcação</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 20}>Nº de Animais</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 20}>Produção Total</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 30}>Média de Produção</VirtuosoResizeHeadCell>
            </TableHeadRow>

        }}
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
    const { setPageProps } = useContext(PageContext)

    useEffect(() => setRowData(item), [item])

    if (loading) return <TableLoadingCells colSpan={5} />
    if (editing) return <GroupsRowEditing {...{ rowData, setEditing, setRowData }} />

    return <>
        <TableBodyCell>
            <EditControlButtons
                setEditing={setEditing}
                onShow={() => {
                    const page: PageProps = {
                        title: `Leite - ${dateTransform(rowData.entryDate)}`,
                        page: <GroupEntriesTablePage {...{ entryDate: rowData.entryDate }} />,
                        previousPages: [HomePage, MilkDashboardPage, MilkGroupsPage]
                    }
                    if (setPageProps) setPageProps(page)
                }}
            />
        </TableBodyCell>
        <TableBodyCell>{dateTransform(rowData.entryDate)}</TableBodyCell>
        <TableBodyCell>
            <TrendValues
                value={rowData.animalsNumber}
                trendProps={{ trend: rowData.numberDifference, text: rowData.numberDifference.toString()}}
            />
        </TableBodyCell>
        <TableBodyCell>
            <TrendValues
                value={decimalTransform(rowData.totalMilk)}
                trendProps={{ trend: rowData.totalRate }}
            />
        </TableBodyCell>
        <TableBodyCell>
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

    const { control, handleSubmit } = useForm<LactationGroup>({ defaultValues: rowData })

    const onSubmit: SubmitHandler<LactationGroup> = (data: LactationGroup) => {
        setRowData(data)
        setEditing(false)
    }

    const onSave = handleSubmit(onSubmit)

    return <>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing }} />
        </TableBodyCell>
        <TableBodyCell>
            <FormDatePicker
                formProps={{
                    control,
                    name: 'entryDate'
                }}
            />
        </TableBodyCell>
        <TableBodyCell>
            <TrendValues
                value={rowData.animalsNumber}
                trendProps={{ trend: rowData.numberDifference, text: rowData.numberDifference.toString()}}
            />
        </TableBodyCell>
        <TableBodyCell>
            <TrendValues
                value={decimalTransform(rowData.totalMilk)}
                trendProps={{ trend: rowData.totalRate }}
            />
        </TableBodyCell>
        <TableBodyCell>
            <TrendValues
                value={decimalTransform(rowData.averageMilk)}
                trendProps={{ trend: rowData.averageRate }}
            />
        </TableBodyCell>
    </>
}
