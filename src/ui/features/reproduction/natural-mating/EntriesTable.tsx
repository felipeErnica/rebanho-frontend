/* eslint-disable react-hooks/exhaustive-deps */
import { useVirtuosoComponents, usePagination } from "@/ui/shared/table/PageTable"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
import { RefObject, useCallback, useEffect, useRef, useState } from "react"
import { findEntriesPage, getEntriesPage } from "./Controller"
import { MatingEntry, MatingEntryFilter, MatingFoot, StatusColorMap, StatusMap } from "./Entities"
import { ComboBoxItem } from "@/ui/shared/common/ComboBox"
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
import { Button, Chip } from "@mui/material"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { dateTransform, percentageTransform } from "@/util/Transformations"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import Add from "@mui/icons-material/Add"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { searchBull } from "../../farm-area/main-table/api/DashboardController"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { AddMatingDialog } from "./AddMatingDialog"
import { MatingFilter } from "./MatingFilter"

export const EntriesTablePage = () => {

    const defaultSort = 'mating_date,animal_order'

    const defaultFoot: MatingFoot = {
        totals: 0,
        averageBirthRate: 0,
        averagePregnancyRate: 0
    }

    const [filter, setFilter] = useState<MatingEntryFilter>({ isFiltered: false })
    const [filterOpen, setFilterOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sort, setSort] = useState(defaultSort)
    const [order, setOrder] = useState('desc')
    const [foot, setFoot] = useState(defaultFoot)
    const [addMatingOpen, setAddMatingOpen] = useState(false)

    const anchorEl = useRef<HTMLButtonElement>(null)

    const fetchPage = useCallback((cursor?: string) => {
        getEntriesPage(filter)
            .then(response => setFoot(response.json))
            .catch(() => setFoot(defaultFoot))
        return findEntriesPage(filter, sort, order, cursor)
    }, [filter, order, sort])

    const onReload = useCallback(() => setFilter({ isFiltered: false }), [])

    const sortColumns: ComboBoxItem[] = [
        { name: 'Brinco da Vaca', value: 'animal_order,mating_date' },
        { name: 'Nome da Vaca', value: 'name,mating_date' },
        { name: 'Data de Monta', value: defaultSort }
    ]

    const { rows, scrollRef, fetchNextPage } = usePagination<MatingEntry>({ setLoading, fetchPage })

    return <div className="w-full h-full flex flex-col">
        <TableTopBar
            reloadProps={{ onReload, loading }}
            sortProps={{ sort, setSort, sortColumns, defaultSort }}
            orderProps={{ order, setOrder }}
            filterProps={{ setFilterOpen, anchorEl }}
            otherProps={(
                <Button
                    startIcon={<Add />}
                    onClick={() => setAddMatingOpen(true)}
                >
                    Adicionar Monta
                </Button>
            )}
        />
        <EntriesTable {...{ rows, loading, scrollRef, fetchNextPage, foot }} />
        <MatingFilter {...{ filter, setFilter, filterOpen, setFilterOpen, anchorEl }} />
        <AddMatingDialog {...{ addMatingOpen, setAddMatingOpen }} />
    </div>
}

type EntriesTableProps = {
    rows: MatingEntry[]
    foot: MatingFoot
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
                <VirtuosoResizeHeadCell width={unit * 10}>Vaca</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Data de Inseminação</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 10}>Touro</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Prenhez</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Nascimento</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Informações de Cria</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 20}>Observações</VirtuosoResizeHeadCell>
            </TableHeadRow>
        }}
        fixedFooterContent={() => (
            <TableFooterRow colSpan={8}>
                <FooterContent title="Total" content={foot.totals} />
                <FooterContent title="Taxa de Prenhez" content={percentageTransform(foot.averagePregnancyRate)} />
                <FooterContent title="Taxa de Natalidade" content={percentageTransform(foot.averageBirthRate)} />
            </TableFooterRow>
        )}
        itemContent={(_, item) => <EntriesRow {...{ item: item as MatingEntry, loading }} />}
    />

}

type EntriesRowProps = {
    item: MatingEntry
    loading: boolean
}

const EntriesRow = ({ item, loading }: EntriesRowProps) => {

    const [rowData, setRowData] = useState<MatingEntry>(item)
    const [editing, setEditing] = useState(false)

    useEffect(() => setRowData(item), [item])

    if (loading) return <TableLoadingCells colSpan={8} />
    if (editing) return <EntriesRowEditing {...{ rowData, setEditing, setRowData }} />

    return <>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.matingDate)}</TableBodyCell>
        <TableBodyCell>{rowData.bullName}</TableBodyCell>
        <TableBodyCell>
            {rowData.pregnancyStatus &&
                <Chip
                    label={StatusMap.get(rowData.pregnancyStatus)}
                    color={StatusColorMap.get(rowData.pregnancyStatus)}
                />
            }
        </TableBodyCell>
        <TableBodyCell>
            {rowData.birthStatus &&
                <Chip
                    label={StatusMap.get(rowData.birthStatus)}
                    color={StatusColorMap.get(rowData.birthStatus)}
                />
            }
        </TableBodyCell>
        <TableBodyCell>{rowData.childInformation}</TableBodyCell>
        <TableBodyCell>{rowData.observation}</TableBodyCell>
    </>
}

type EntriesRowEditingProps = {
    rowData: MatingEntry
    setRowData: (rowData: MatingEntry) => void
    setEditing: (editing: boolean) => void
}

const EntriesRowEditing = ({ rowData, setRowData, setEditing }: EntriesRowEditingProps) => {

    const { control, handleSubmit } = useForm<MatingEntry>({ defaultValues: rowData })

    const onSubmit: SubmitHandler<MatingEntry> = (data: MatingEntry) => {
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
            <FormDatePicker formProps={{ control, name: 'matingDate' }} />
        </TableBodyCell>
        <TableBodyCell align="center">
            <FormSearchBox
                formProps={{ control, name: 'bullId' }}
                searchOptions={searchBull}
            />
        </TableBodyCell>
        <TableBodyCell align="center">{rowData.pregnancyStatus}</TableBodyCell>
        <TableBodyCell align="center">{rowData.birthStatus}</TableBodyCell>
        <TableBodyCell>{rowData.childInformation}</TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'observation' }} />
        </TableBodyCell>
    </>
}
