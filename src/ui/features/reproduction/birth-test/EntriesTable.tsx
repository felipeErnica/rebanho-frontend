import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { TestEntry, TestEntryFilter, TestEntryFooter } from "./Entities"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import { usePagination, VirtuosoTableComponents } from "@/ui/shared/table/PageTable"
import {
    FooterContent,
    TableBodyCell,
    TableFooterCell,
    TableFooterRow,
    TableHeadRow,
    TableLoadingCells,
    VirtuosoHeadCell,
    VirtuosoResizeHeadCell
} from "@/ui/shared/table/TableComponents"
import { dateTransform, percentageTransform } from "@/util/Transformations"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import Chip from "@mui/material/Chip"
import { InseminationStatusColorMap, InseminationStatusMap, statusMapToComboBox } from "../insemination/Entities"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormComboBox } from "@/ui/shared/form-controls/FormComboBox"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
import { ComboBoxItem } from "@/ui/shared/common/ComboBox"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { findEntriesPage, getEntriesFoot } from "./Controller"
import { BirthTestFilter } from "./BirthTestFilter"

export const EntriesTablePage = () => {

    const defaultSort = 'animal_order,test_date'

    const defaultFoot: TestEntryFooter = useMemo(() => ({
        totals: 0,
        pregnancyRate: 0,
        birthRate: 0
    }), [])

    const [filter, setFilter] = useState<TestEntryFilter>({ isFiltered: false })
    const [filterOpen, setFilterOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sort, setSort] = useState(defaultSort)
    const [order, setOrder] = useState('asc')
    const [foot, setFoot] = useState(defaultFoot)

    const anchorEl = useRef<HTMLButtonElement>(null)

    const fetchPage = useCallback((cursor?: string) => {
        getEntriesFoot(filter)
            .then(response => setFoot(response.json))
            .catch(() => setFoot(defaultFoot))
        return findEntriesPage(filter, sort, order, cursor)
    }, [defaultFoot, filter, order, sort])

    const onReload = useCallback(() => setFilter({ isFiltered: false }), [])

    const sortColumns: ComboBoxItem[] = [
        { name: 'Brinco da Vaca', value: 'animal_order,test_date' },
        { name: 'Nome da Vaca', value: 'name,test_date' },
        { name: 'Data de Previsão', value: "birth_forecast,animal_order" }
    ]

    const { rows, scrollRef, fetchNextPage } = usePagination({ setLoading, fetchPage })

    return <div className="w-full h-full flex flex-col">
        <TableTopBar
            reloadProps={{ onReload, loading }}
            filterProps={{ setFilterOpen, anchorEl }}
            orderProps={{ order, setOrder }}
            sortProps={{ sort, sortColumns, setSort, defaultSort }}
        />
        <EntriesTable {...{ rows, foot, loading, scrollRef, fetchNextPage }} />
        <BirthTestFilter {...{ setFilter, filter, filterOpen, setFilterOpen, anchorEl }} />
    </div>
}

type EntriesTableProps = {
    rows: TestEntry[]
    foot: TestEntryFooter
    loading: boolean
    scrollRef: RefObject<VirtuosoHandle | null>
    fetchNextPage: () => void
}

const EntriesTable = ({ rows, loading, scrollRef, fetchNextPage, foot }: EntriesTableProps) => {

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
                <VirtuosoResizeHeadCell width={unit * 10}>Vaca</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Data do Exame</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Prenhez</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Nascimento</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 10}>Data de Previsão</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 25}>Observações</VirtuosoResizeHeadCell>
            </TableHeadRow>

        }}
        fixedFooterContent={() => (
            <TableFooterRow>
                <TableFooterCell colSpan={4}>
                    <FooterContent title="Total" content={foot.totals} />
                </TableFooterCell>
                <TableFooterCell colSpan={1}>
                    <FooterContent title="Taxa de Prenhez" content={percentageTransform(foot.pregnancyRate)} />
                </TableFooterCell>
                <TableFooterCell colSpan={2}>
                    <FooterContent title="Taxa de Natalidade" content={percentageTransform(foot.birthRate)} />
                </TableFooterCell>
            </TableFooterRow>
        )}
        itemContent={(_, item) => <EntriesRow {...{ item, loading }} />}
    />

}

type EntriesRowProps = {
    item: TestEntry
    loading: boolean
}

const EntriesRow = ({ item, loading }: EntriesRowProps) => {

    const [rowData, setRowData] = useState<TestEntry>(item)
    const [editing, setEditing] = useState(false)

    useEffect(() => setRowData(item), [item])

    if (loading) return <TableLoadingCells colSpan={6} />
    if (editing) return <EntriesRowEditing {...{ rowData, setEditing, setRowData }} />

    return <>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalName}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.testDate)}</TableBodyCell>
        <TableBodyCell>
            {rowData.pregnancyStatus &&
                <Chip
                    label={InseminationStatusMap.get(rowData.pregnancyStatus)}
                    color={InseminationStatusColorMap.get(rowData.pregnancyStatus)}
                />
            }
        </TableBodyCell>
        <TableBodyCell>
            {rowData.birthStatus &&
                <Chip
                    label={InseminationStatusMap.get(rowData.birthStatus)}
                    color={InseminationStatusColorMap.get(rowData.birthStatus)}
                />
            }
        </TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.birthForecast)}</TableBodyCell>
        <TableBodyCell>{rowData.observation}</TableBodyCell>
    </>
}

type EntriesRowEditingProps = {
    rowData: TestEntry
    setRowData: (rowData: TestEntry) => void
    setEditing: (editing: boolean) => void
}

const EntriesRowEditing = ({ rowData, setRowData, setEditing }: EntriesRowEditingProps) => {

    const { control, handleSubmit } = useForm<TestEntry>({ defaultValues: rowData })

    const onSubmit: SubmitHandler<TestEntry> = (data: TestEntry) => {
        setRowData(data)
        setEditing(false)
    }

    const onSave = handleSubmit(onSubmit)

    return <>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalName}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.testDate)}</TableBodyCell>
        <TableBodyCell align="center">
            <FormComboBox
                items={statusMapToComboBox()}
                formProps={{
                    control,
                    name: 'pregnancyStatus'
                }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <FormComboBox
                items={statusMapToComboBox()}
                formProps={{
                    control,
                    name: 'birthStatus'
                }}
            />
        </TableBodyCell>
        <TableBodyCell>
            <FormDatePicker
                formProps={{
                    control,
                    name: 'birthForecast'
                }}
            />
        </TableBodyCell>
        <TableBodyCell>
            <FormTextField
                formProps={{
                    control,
                    name: 'observation'
                }}
            />
        </TableBodyCell>
    </>
}

