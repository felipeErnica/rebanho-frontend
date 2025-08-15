/* eslint-disable react-hooks/exhaustive-deps */
import { usePagination, VirtuosoTableComponents } from "@/ui/shared/table/PageTable"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
import { RefObject, useCallback, useEffect, useRef, useState } from "react"
import { findEntriesPage, getEntriesPage } from "./Controller"
import { 
    InseminationFooter, 
    InseminationEntry, 
    InseminationEntryFilter, 
    InseminationStatusColorMap, 
    InseminationStatusMap, 
    statusMapToComboBox 
} from "./Entities"
import { ComboBoxItem } from "@/ui/shared/common/ComboBox"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
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
import { Button, Chip } from "@mui/material"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { dateTransformToLocale, percentageTransform } from "@/util/Transformations"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormComboBox } from "@/ui/shared/form-controls/FormComboBox"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { InseminationFilter } from "./InseminationFilter"
import Add from "@mui/icons-material/Add"
import { AddInseminationDialog } from "./AddInseminationDialog"

export const EntriesTablePage = () => {

    const defaultSort = 'insemination_date,animal_order'

    const defaultFoot: InseminationFooter = {
        totals: 0,
        averageBirthRate: 0,
        averagePregnancyRate: 0
    }

    const [filter, setFilter] = useState<InseminationEntryFilter>({ isFiltered: false })
    const [filterOpen, setFilterOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sort, setSort] = useState(defaultSort)
    const [order, setOrder] = useState('asc')
    const [foot, setFoot] = useState(defaultFoot)
    const [addInseminationOpen, setAddInseminationOpen] = useState(false)

    const anchorEl = useRef<HTMLButtonElement>(null)

    const fetchPage = useCallback((cursor?: string) => {
        getEntriesPage(filter)
            .then(response => setFoot(response.json))
            .catch(() => setFoot(defaultFoot))
        return findEntriesPage(filter, sort, order, cursor)
    }, [filter, order, sort])

    const onReload = useCallback(() => setFilter({ isFiltered: false }), [])

    const sortColumns: ComboBoxItem[] = [
        { name: 'Brinco da Vaca', value: 'animal_order,insemination_date' },
        { name: 'Nome da Vaca', value: 'name,insemination_date' },
        { name: 'Data de Inseminação', value: defaultSort }
    ]

    const { rows, scrollRef, fetchNextPage } = usePagination({ setLoading, fetchPage })

    return <div className="w-full h-full flex flex-col">
        <TableTopBar
            reloadProps={{ onReload, loading }}
            sortProps={{ sort, setSort, sortColumns, defaultSort }}
            orderProps={{ order, setOrder }}
            filterProps={{ setFilterOpen, anchorEl }}
            otherProps={(
                <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => setAddInseminationOpen(true)}
                >
                    Adicionar Inseminação
                </Button>
            )}
        />
        <EntriesTable {...{ rows, loading, scrollRef, fetchNextPage, foot }} />
        <InseminationFilter {...{ filter, setFilter, filterOpen, setFilterOpen, anchorEl }} />
        <AddInseminationDialog {...{ addInseminationOpen, setAddInseminationOpen }} />
    </div>
}

type EntriesTableProps = {
    rows: InseminationEntry[]
    foot: InseminationFooter
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
                <VirtuosoResizeHeadCell width={unit * 15}>Data de Inseminação</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 10}>Touro</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Prenhez</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Nascimento</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 25}>Observações</VirtuosoResizeHeadCell>
            </TableHeadRow>
        }}
        fixedFooterContent={() => (
            <TableFooterRow>
                <TableFooterCell colSpan={4}>
                    <FooterContent title="Total" content={foot.totals} />
                </TableFooterCell>
                <TableFooterCell colSpan={1}>
                    <FooterContent title="Taxa de Prenhez" content={percentageTransform(foot.averagePregnancyRate)} />
                </TableFooterCell>
                <TableFooterCell colSpan={2}>
                    <FooterContent title="Taxa de Natalidade" content={percentageTransform(foot.averageBirthRate)} />
                </TableFooterCell>
            </TableFooterRow>
        )}
        itemContent={(_, item) => <EntriesRow {...{ item, loading }} />}
    />

}

type EntriesRowProps = {
    item: InseminationEntry
    loading: boolean
}

const EntriesRow = ({ item, loading }: EntriesRowProps) => {

    const [rowData, setRowData] = useState<InseminationEntry>(item)
    const [editing, setEditing] = useState(false)

    useEffect(() => setRowData(item), [item])

    if (loading) return <TableLoadingCells colSpan={6} />
    if (editing) return <EntriesRowEditing {...{ rowData, setEditing, setRowData }} />

    return <>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalName}</TableBodyCell>
        <TableBodyCell align="center">{dateTransformToLocale(rowData.inseminationDate?.toString())}</TableBodyCell>
        <TableBodyCell>{rowData.bullName}</TableBodyCell>
        <TableBodyCell>
            {rowData.pregnancyStatus &&
                <Chip
                    label={InseminationStatusMap.get(rowData.pregnancyStatus)}
                    color={InseminationStatusColorMap.get(rowData.pregnancyStatus)}
                />
            }
        </TableBodyCell>
        <TableBodyCell>
            {rowData.status &&
                <Chip
                    label={InseminationStatusMap.get(rowData.status)}
                    color={InseminationStatusColorMap.get(rowData.status)}
                />
            }
        </TableBodyCell>
        <TableBodyCell>{rowData.observation}</TableBodyCell>
    </>
}

type EntriesRowEditingProps = {
    rowData: InseminationEntry
    setRowData: (rowData: InseminationEntry) => void
    setEditing: (editing: boolean) => void
}

const EntriesRowEditing = ({ rowData, setRowData, setEditing }: EntriesRowEditingProps) => {

    const { control, handleSubmit } = useForm<InseminationEntry>({ defaultValues: rowData })

    const onSubmit: SubmitHandler<InseminationEntry> = (data: InseminationEntry) => {
        setRowData(data)
        setEditing(false)
    }

    const onSave = handleSubmit(onSubmit)

    return <>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalName}</TableBodyCell>
        <TableBodyCell align="center">{dateTransformToLocale(rowData.inseminationDate?.toString())}</TableBodyCell>
        <TableBodyCell align="center">{rowData.bullName}</TableBodyCell>
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
                    name: 'status'
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

