import { useVirtuosoComponents, usePagination } from "@shared/table/PageTable"
import {
    FooterContent,
    TableBodyCell,
    TableFooterRow,
    TableHeadRow,
    TableLoadingCells,
    TablePageContainer,
    VirtuosoHeadCell,
    VirtuosoResizeHeadCell
} from "@shared/table/TableComponents"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import { RefObject, useCallback, useEffect, useRef, useState } from "react"
import { findEntriesPage, getEntriesPageFoot } from "./Controller"
import { WeightEntry, WeightFilter, WeightFoot } from "./Entities"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import { ComboBoxItem } from "@shared/common/ComboBox"
import { WeightFilterPopover } from "./WeightFilter"
import { dateTransform, decimalTransform, positiveTransform } from "@utils/Transformations"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { EditRowProps } from "@shared/table/Entities"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { TrendComponent } from "@shared/dashboard/DashboardComponents"

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

    const fetchPage = useCallback((cursor?: string) => {
        setLoading(true)
        getEntriesPageFoot(filter)
            .then(results => setFoot(results.json))
            .catch(() => setFoot)
        return findEntriesPage(filter, sort, order, cursor)
    }, [filter, sort, order])

    const { rows, fetchNextPage, scrollRef } = usePagination<WeightEntry>({ fetchPage, setLoading })

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
        <EntriesTable {...{ rows, loading, fetchNextPage, scrollRef, foot }} />
        <WeightFilterPopover {...{ setFilter, setFilterOpen, filter, filterOpen, anchorEl }} />
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
        components={useVirtuosoComponents(8)}
        endReached={fetchNextPage}
        fixedHeaderContent={() => {

            const unit = tableWidth / 100

            return <TableHeadRow>
                <VirtuosoHeadCell width={unit * 10} />
                <VirtuosoResizeHeadCell width={unit * 15}>Animal</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Mãe</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Pai</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 10}>Data da Pesagem</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 10}>Peso</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 15}>Ganho de Peso Diário (kg/dia)</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 10}>Varição de Peso</VirtuosoResizeHeadCell>
            </TableHeadRow>

        }}
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

    useEffect(() => setRowData(item), [item])

    if (loading) return <TableLoadingCells colSpan={8} />
    if (editing) return <EntriesEditingRow {...{ setEditing, rowData, setRowData }} />

    const onDelete = () => {
        console.log(rowData.id)
    }

    return <>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing, onDelete }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell>{rowData.motherName}</TableBodyCell>
        <TableBodyCell>{rowData.fatherName}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.entryDate)}</TableBodyCell>
        <TableBodyCell align="center">
            {`${decimalTransform(rowData.weight)} (${decimalTransform(rowData.weight / 15)}@)`}
        </TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.weightGain)}</TableBodyCell>
        <TableBodyCell>
            <TrendComponent
                trend={rowData.weightVariation}
                text={positiveTransform(rowData.weightVariation)}
            />
        </TableBodyCell>
    </>
}

const EntriesEditingRow = ({ rowData, setRowData, setEditing }: EditRowProps<WeightEntry>) => {

    const { handleSubmit, control } = useForm<WeightEntry>({ defaultValues: rowData })

    const onSubmit: SubmitHandler<WeightEntry> = (data: WeightEntry) => {
        setRowData(data)
        setEditing(false)
    }

    const onSave = handleSubmit(onSubmit)

    return <>
        <TableBodyCell>
            <EditingControlButtons {...{ setEditing, onSave }} />
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
        <TableBodyCell>
            <TrendComponent
                trend={rowData.weightVariation}
                text={positiveTransform(rowData.weightVariation)}
            />
        </TableBodyCell>
    </>

}
