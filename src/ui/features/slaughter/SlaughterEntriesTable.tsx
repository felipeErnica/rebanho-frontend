import {
    FooterContent,
    TableBodyCell,
    TableFooterCell,
    TableFooterRow,
    TableHeadRow,
    TableLoadingCells,
    TablePageContainer,
    VirtuosoHeadCell,
    VirtuosoResizeHeadCell
} from "@/ui/shared/table/TableComponents"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
import { SlaughterEntry, SlaughterEntryFilter, SlaughterFoot } from "./Entities"
import { RefObject, useCallback, useEffect, useRef, useState } from "react"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import { usePagination, VirtuosoTableComponents } from "@/ui/shared/table/PageTable"
import { findEntriesPage, getEntriesPageFoot } from "./Controller"
import { ComboBoxItem } from "@/ui/shared/common/ComboBox"
import { SlaughterFilterPopover } from "./SlaughterFilterPopover"
import { dateTransform, decimalTransform, percentageTransform } from "@/util/Transformations"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { EditRow } from "@/ui/shared/table/Entities"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"

export const SlaughterEntriesTable = () => {

    const defaultFoot: SlaughterFoot = {
        animalsNumber: 0,
        averageRate: 0,
        averageWeight: 0,
        averageDeadWeight: 0
    }

    const defaultSort = 'entry_date, animal_order, birth_date'

    const [foot, setFoot] = useState<SlaughterFoot>(defaultFoot)
    const [sort, setSort] = useState(defaultSort)
    const [order, setOrder] = useState('desc')
    const [filter, setFilter] = useState<SlaughterEntryFilter>({ isFiltered: false })
    const [loading, setLoading] = useState(false)

    const [filterOpen, setFilterOpen] = useState(false)
    const anchorEl = useRef<HTMLButtonElement | null>(null)

    const fetchPage = useCallback((cursor?: string) => {
        setLoading(true)
        getEntriesPageFoot(filter)
            .then(results => setFoot(results.json))
            .catch(() => setFoot(defaultFoot))
        return findEntriesPage(filter, sort, order, cursor)
    }, [filter, order, sort])

    const { rows, fetchNextPage, scrollRef } = usePagination<SlaughterEntry>({ setLoading, fetchPage })
    const onReload = useCallback(() => setFilter({ isFiltered: false }), [filter])

    const sortColumns: ComboBoxItem[] = [
        { name: 'Data de Abate', value: defaultSort },
        { name: 'Brinco', value: 'animal_order, birth_date, entry_date' },
        { name: 'Nome', value: 'animal_name, birth_date, entry_date' },
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
        <EntriesTable  {...{ fetchNextPage, rows, scrollRef, loading, foot }} />
        <SlaughterFilterPopover {...{ setFilter, filter, setFilterOpen, filterOpen, anchorEl }} />
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
        components={VirtuosoTableComponents}
        endReached={fetchNextPage}
        fixedHeaderContent={() => {

            const unit = tableWidth / 100

            return <TableHeadRow>
                <VirtuosoHeadCell width={unit * 10} />
                <VirtuosoResizeHeadCell width={unit * 15}>Animal</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Mãe</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Pai</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 10}>Frigorífico</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 10}>Taxa de Desconto</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 10}>Data de Abate</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 10}>Peso</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 15}>Peso (c/ Desconto)</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 10}>Peso de Abate</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 10}>Rend. Médio</VirtuosoResizeHeadCell>
            </TableHeadRow>

        }}
        fixedFooterContent={() => (
            <TableFooterRow>
                <TableFooterCell colSpan={2}>
                    <FooterContent title="Total" content={foot.animalsNumber} />
                </TableFooterCell>
                <TableFooterCell colSpan={2}>
                    <FooterContent
                        title="Peso Médio"
                        content={`${decimalTransform(foot.averageWeight)} (${decimalTransform(foot.averageWeight / 15)}@)`}
                    />
                </TableFooterCell>
                <TableFooterCell colSpan={2}>
                    <FooterContent
                        title="Peso de Abate Médio"
                        content={`${decimalTransform(foot.averageDeadWeight)} (${decimalTransform(foot.averageDeadWeight / 15)}@)`} />
                </TableFooterCell>
                <TableFooterCell colSpan={5}>
                    <FooterContent title="Rend. Médio" content={percentageTransform(foot.averageRate)} />
                </TableFooterCell>
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

    useEffect(() => setRowData(item), [item])

    if (loading) return <TableLoadingCells colSpan={11} />
    if (editing) return <EntriesEditingRow {...{ setEditing, rowData, setRowData }} />

    const onDelete = () => {
        console.log(rowData.id)
    }

    return <>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing, onDelete }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalName}</TableBodyCell>
        <TableBodyCell>{rowData.motherName}</TableBodyCell>
        <TableBodyCell>{rowData.fatherName}</TableBodyCell>
        <TableBodyCell align="center">{rowData.slaughterhouse}</TableBodyCell>
        <TableBodyCell align="center">{percentageTransform(rowData.performanceRate)}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.entryDate)}</TableBodyCell>
        <TableBodyCell align="center">
            {`${decimalTransform(rowData.weight)} (${decimalTransform(rowData.weight / 15)}@)`}
        </TableBodyCell>
        <TableBodyCell align="center">
            {`${decimalTransform(rowData.discountWeight)} (${decimalTransform(rowData.discountWeight / 15)}@)`}
        </TableBodyCell>
        <TableBodyCell align="center">
            {`${decimalTransform(rowData.deadWeight)} (${decimalTransform(rowData.deadWeight / 15)}@)`}
        </TableBodyCell>
        <TableBodyCell align="center">{percentageTransform(rowData.performanceRate)}</TableBodyCell>
    </>
}

const EntriesEditingRow = ({ rowData, setRowData, setEditing }: EditRow<SlaughterEntry>) => {

    const { handleSubmit, control } = useForm<SlaughterEntry>({ defaultValues: rowData })

    const onSubmit: SubmitHandler<SlaughterEntry> = (data: SlaughterEntry) => {
        setRowData(data)
        setEditing(false)
    }

    const onSave = handleSubmit(onSubmit)

    return <>
        <TableBodyCell>
            <EditingControlButtons {...{ setEditing, onSave }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalName}</TableBodyCell>
        <TableBodyCell>{rowData.motherName}</TableBodyCell>
        <TableBodyCell>{rowData.fatherName}</TableBodyCell>
        <TableBodyCell>{rowData.slaughterhouse}</TableBodyCell>
        <TableBodyCell>{rowData.discountRate}</TableBodyCell>
        <TableBodyCell>
            <FormDatePicker formProps={{ control, name: "entryDate" }} />
        </TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: "weight" }} type="number" />
        </TableBodyCell>
        <TableBodyCell align="center">
            {`${decimalTransform(rowData.discountWeight)} (${decimalTransform(rowData.discountWeight / 15)}@)`}
        </TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'deadWeight' }} type="number" />
        </TableBodyCell>
        <TableBodyCell align="center">{percentageTransform(rowData.performanceRate)}</TableBodyCell>
    </>

}
