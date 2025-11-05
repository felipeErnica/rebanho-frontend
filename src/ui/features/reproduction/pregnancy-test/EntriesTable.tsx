import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { 
    BirthStatusMap, 
    PregnancyStatusItems, 
    PregnancyStatusMap, 
    TestEntry, 
    TestEntryFilter, 
    TestEntryFooter 
} from "./Entities"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import { useVirtuosoComponents, usePagination } from "@/ui/shared/table/PageTable"
import {
    FooterContent,
    TableBodyCell,
    TableFooterRow,
    TableHeadRow,
    TableLoadingCells,
    VirtuosoHeadCell,
    VirtuosoResizeHeadCell
} from "@/ui/shared/table/TableComponents"
import { dateTransform, percentageTransform } from "@/util/Transformations"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import Chip from "@mui/material/Chip"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
import { ComboBoxItem } from "@/ui/shared/common/ComboBox"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { findEntriesPage, getEntriesFoot } from "./Controller"
import { BirthTestFilter } from "./BirthTestFilter"
import { ChipColorScheme } from "@/ui/shared/Globals"
import { FormComboBox } from "@/ui/shared/form-controls/FormComboBox"

export const EntriesTablePage = () => {

    const defaultSort = 'test_date, animal_order'

    const defaultFoot: TestEntryFooter = useMemo(() => ({
        totals: 0,
        pregnancyRate: 0,
        birthRate: 0
    }), [])

    const [filter, setFilter] = useState<TestEntryFilter>({ isFiltered: false })
    const [filterOpen, setFilterOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sort, setSort] = useState(defaultSort)
    const [order, setOrder] = useState('desc')
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
        { name: 'Data de Exame', value: defaultSort },
        { name: 'Brinco da Vaca', value: 'animal_order, test_date' },
        { name: 'Nome da Vaca', value: 'animal_name, test_date' },
        { name: 'Data de Previsão', value: "birth_forecast, animal_order" }
    ]

    const { rows, scrollRef, fetchNextPage } = usePagination<TestEntry>({ setLoading, fetchPage })

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
        components={useVirtuosoComponents(8)}
        endReached={fetchNextPage}
        fixedHeaderContent={() => {

            const unit = tableWidth / 100

            return <TableHeadRow>
                <VirtuosoHeadCell width={unit * 10} />
                <VirtuosoResizeHeadCell width={unit * 15}>Vaca</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 15}>Data do Exame</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 10}>Prenhez</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 10}>Nascimento</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 15}>Data de Previsão</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Informações de Cria</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 25}>Observações</VirtuosoResizeHeadCell>
            </TableHeadRow>

        }}
        fixedFooterContent={() => (
            <TableFooterRow colSpan={8}>
                <FooterContent title="Total" content={foot.totals} />
                <FooterContent title="Taxa de Prenhez" content={percentageTransform(foot.pregnancyRate)} />
                <FooterContent title="Taxa de Natalidade" content={percentageTransform(foot.birthRate)} />
            </TableFooterRow>
        )}
        itemContent={(_, item) => <EntriesRow {...{ item: item as TestEntry, loading }} />}
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

    if (loading) return <TableLoadingCells colSpan={8} />
    if (editing) return <EntriesRowEditing {...{ rowData, setEditing, setRowData }} />

    return <>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.testDate)}</TableBodyCell>
        <TableBodyCell align="center">
            <Chip
                label={PregnancyStatusMap.get(rowData.pregnancyStatus)}
                color={ChipColorScheme.get(rowData.pregnancyStatus)}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <Chip
                label={BirthStatusMap.get(rowData.birthStatus)}
                color={ChipColorScheme.get(rowData.birthStatus)}
            />
        </TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.birthForecast)}</TableBodyCell>
        <TableBodyCell>{rowData.childInformation}</TableBodyCell>
        <TableBodyCell>{rowData.observation}</TableBodyCell>
    </>
}

type EntriesRowEditingProps = {
    rowData: TestEntry
    setRowData: (rowData: TestEntry) => void
    setEditing: (editing: boolean) => void
}

const EntriesRowEditing = ({ rowData, setRowData, setEditing }: EntriesRowEditingProps) => {

    const [showForecast, setShowForecast] = useState(rowData.pregnancyStatus === 'SUCCESS')
    const { control, handleSubmit, setValue } = useForm<TestEntry>({ defaultValues: rowData })

    useEffect(() => setShowForecast(rowData.pregnancyStatus === 'SUCCESS'), [rowData])

    const onSubmit: SubmitHandler<TestEntry> = (data: TestEntry) => {
        setRowData(data)
        setEditing(false)
    }

    const onSave = handleSubmit(onSubmit)

    return <>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell align="center">
            <FormDatePicker formProps={{ control, name: 'testDate' }} />
        </TableBodyCell>
        <TableBodyCell align="center">
            <FormComboBox
                items={PregnancyStatusItems}
                formProps={{ control, name: 'pregnancyStatus' }}
                onChange={(value) => {
                    setShowForecast(value === 'SUCCESS')
                    if (value === 'FAILED') {
                        setValue('birthStatus', 'FAILED')
                        setValue('birthForecast', undefined)
                    }
                }}
                renderOption={(props, option) => (
                    <li {...props}>
                        <Chip
                            label={PregnancyStatusMap.get(option.value)}
                            color={ChipColorScheme.get(option.value)}
                        />
                    </li>
                )}
                renderValue={value => (
                    <Chip
                        label={PregnancyStatusMap.get(value.value)}
                        color={ChipColorScheme.get(value.value)}
                    />
                )}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <Chip
                label={BirthStatusMap.get(rowData.birthStatus)}
                color={ChipColorScheme.get(rowData.birthStatus)}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            {showForecast && <FormDatePicker formProps={{ control, name: 'birthForecast' }} />}
        </TableBodyCell>
        <TableBodyCell>{rowData.childInformation}</TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'observation' }} />
        </TableBodyCell>
    </>
}
