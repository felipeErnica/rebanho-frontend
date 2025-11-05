/* eslint-disable react-hooks/exhaustive-deps */
import { useVirtuosoComponents, usePagination } from "@/ui/shared/table/PageTable"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
import { RefObject, useCallback, useEffect, useRef, useState } from "react"
import { findEntriesPage, getEntriesPage } from "./Controller"
import {
    TransferFoot,
    EmbryoTransfer,
    TransferEntryFilter,
    StatusColorMap,
    StatusMap,
} from "./Entities"
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
import { AddTransferDialog } from "./AddTransferDialog"
import { TransferFilter } from "./TransferFilter"
import { searchMother } from "@/shared/GlobalApiCalls"

export const EntriesTablePage = () => {

    const defaultSort = 'transfer_date,receiver_order'

    const defaultFoot: TransferFoot = {
        totals: 0,
        averageBirthRate: 0,
        averagePregnancyRate: 0
    }

    const [filter, setFilter] = useState<TransferEntryFilter>({ isFiltered: false })
    const [filterOpen, setFilterOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sort, setSort] = useState(defaultSort)
    const [order, setOrder] = useState('desc')
    const [foot, setFoot] = useState(defaultFoot)
    const [addTransferOpen, setAddTransferOpen] = useState(false)

    const anchorEl = useRef<HTMLButtonElement>(null)

    const fetchPage = useCallback((cursor?: string) => {
        getEntriesPage(filter)
            .then(response => setFoot(response.json))
            .catch(() => setFoot(defaultFoot))
        return findEntriesPage(filter, sort, order, cursor)
    }, [filter, order, sort])

    const onReload = useCallback(() => setFilter({ isFiltered: false }), [])

    const sortColumns: ComboBoxItem[] = [
        { name: 'Brinco da Receptora', value: 'receiver_order,transfer_date' },
        { name: 'Nome da Receptora', value: 'receiver_name,transfer_date' },
        { name: 'Brinco da Doadora', value: 'donor_order,transfer_date' },
        { name: 'Nome da Doadora', value: 'donor_name,transfer_date' },
        { name: 'Data de Transferência', value: defaultSort }
    ]

    const { rows, scrollRef, fetchNextPage } = usePagination<EmbryoTransfer>({ setLoading, fetchPage })

    return <div className="w-full h-full flex flex-col">
        <TableTopBar
            reloadProps={{ onReload, loading }}
            sortProps={{ sort, setSort, sortColumns, defaultSort }}
            orderProps={{ order, setOrder }}
            filterProps={{ setFilterOpen, anchorEl }}
            otherProps={(
                <Button
                    startIcon={<Add />}
                    onClick={() => setAddTransferOpen(true)}
                >
                    Adicionar Transferência
                </Button>
            )}
        />
        <EntriesTable {...{ rows, loading, scrollRef, fetchNextPage, foot }} />
        <TransferFilter {...{ filter, setFilter, filterOpen, setFilterOpen, anchorEl }} />
        <AddTransferDialog {...{ addTransferOpen, setAddTransferOpen }} />
    </div>
}

type EntriesTableProps = {
    rows: EmbryoTransfer[]
    foot: TransferFoot
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
                <VirtuosoResizeHeadCell width={unit * 15}>Receptora</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Doadora</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 10}>Touro</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 15}>Data de Transferência</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 10}>Prenhez</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 10}>Nascimento</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Informações de Cria</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 20}>Observações</VirtuosoResizeHeadCell>
            </TableHeadRow>
        }}
        fixedFooterContent={() => (
            <TableFooterRow colSpan={9}>
                <FooterContent title="Total" content={foot.totals} />
                <FooterContent title="Taxa de Prenhez" content={percentageTransform(foot.averagePregnancyRate)} />
                <FooterContent title="Taxa de Natalidade" content={percentageTransform(foot.averageBirthRate)} />
            </TableFooterRow>
        )}
        itemContent={(_, item) => <EntriesRow {...{ item: item as EmbryoTransfer, loading }} />}
    />

}

type EntriesRowProps = {
    item: EmbryoTransfer
    loading: boolean
}

const EntriesRow = ({ item, loading }: EntriesRowProps) => {

    const [rowData, setRowData] = useState<EmbryoTransfer>(item)
    const [editing, setEditing] = useState(false)

    useEffect(() => setRowData(item), [item])

    if (loading) return <TableLoadingCells colSpan={8} />
    if (editing) return <EntriesRowEditing {...{ rowData, setEditing, setRowData }} />

    return <>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.receiverInfo}</TableBodyCell>
        <TableBodyCell>{rowData.donorInfo}</TableBodyCell>
        <TableBodyCell>{rowData.bullName}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.transferDate)}</TableBodyCell>
        <TableBodyCell align="center">
            <Chip
                label={StatusMap.get(rowData.pregnancyStatus)}
                color={StatusColorMap.get(rowData.pregnancyStatus)}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <Chip
                label={StatusMap.get(rowData.birthStatus)}
                color={StatusColorMap.get(rowData.birthStatus)}
            />
        </TableBodyCell>
        <TableBodyCell>{rowData.childInformation}</TableBodyCell>
        <TableBodyCell>{rowData.observation}</TableBodyCell>
    </>
}

type EntriesRowEditingProps = {
    rowData: EmbryoTransfer
    setRowData: (rowData: EmbryoTransfer) => void
    setEditing: (editing: boolean) => void
}

const EntriesRowEditing = ({ rowData, setRowData, setEditing }: EntriesRowEditingProps) => {

    const { control, handleSubmit } = useForm<EmbryoTransfer>({ defaultValues: rowData })

    const onSubmit: SubmitHandler<EmbryoTransfer> = (data: EmbryoTransfer) => {
        setRowData(data)
        setEditing(false)
    }

    const onSave = handleSubmit(onSubmit)

    return <>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.receiverInfo}</TableBodyCell>
        <TableBodyCell align="center">
            <FormSearchBox
                formProps={{ control, name: 'donorId' }}
                searchOptions={searchMother}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <FormSearchBox
                formProps={{ control, name: 'bullId' }}
                searchOptions={searchBull}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <FormDatePicker formProps={{ control, name: 'transferDate' }} />
        </TableBodyCell>
        <TableBodyCell align="center">{rowData.pregnancyStatus}</TableBodyCell>
        <TableBodyCell align="center">{rowData.birthStatus}</TableBodyCell>
        <TableBodyCell>{rowData.childInformation}</TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'observation' }} />
        </TableBodyCell>
    </>
}
