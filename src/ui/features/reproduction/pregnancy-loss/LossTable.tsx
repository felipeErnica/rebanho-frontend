import { RefObject, useCallback, useEffect, useRef, useState } from "react"
import { Loss, LossFilter, LossFooter } from "./Entities"
import { findPage, getPageFoot } from "./Controller"
import { ComboBoxItem } from "@/ui/shared/common/ComboBox"
import { usePagination, VirtuosoTableComponents } from "@/ui/shared/table/PageTable"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import {
    FooterContent,
    TableBodyCell,
    TableFooterCell,
    TableFooterRow,
    TableHeadRow,
    TableLoadingCells,
    VirtuosoHeadCell
} from "@/ui/shared/table/TableComponents"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { dateTransform } from "@/util/Transformations"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { LossFilterPopover } from "./LossFilter"
import { Button } from "@mui/material"
import { AddLossDialog } from "./AddLossDialog"
import Add from "@mui/icons-material/Add"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"

export const LossTablePage = () => {

    const defaultSort = 'animal_order,loss_date'

    const [filter, setFilter] = useState<LossFilter>({ isFiltered: false })
    const [foot, setFoot] = useState<LossFooter>({ totals: 0 })
    const [filterOpen, setFilterOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sort, setSort] = useState(defaultSort)
    const [order, setOrder] = useState('asc')
    const [addLossOpen, setAddLossOpen] = useState(false)

    const anchorEl = useRef<HTMLButtonElement>(null)

    const fetchPage = useCallback((cursor?: string) => {
        setLoading(true)
        getPageFoot(filter)
            .then(response => setFoot(response.json))
            .catch(() => setFoot({ totals: 0 }))
        return findPage(filter, sort, order, cursor)
    }, [filter, order, sort])

    const onReload = useCallback(() => setFilter({ isFiltered: false }), [])

    const sortColumns: ComboBoxItem[] = [
        { name: 'Brinco da Vaca', value: 'animal_order,loss_date' },
        { name: 'Nome da Vaca', value: 'animal_name,loss_date' },
        { name: 'Data da Perda', value: "loss_date,animal_order" }
    ]

    const { rows, scrollRef, fetchNextPage } = usePagination<Loss>({ setLoading, fetchPage })

    return <div className="w-full h-full flex flex-col">
        <TableTopBar
            reloadProps={{ onReload, loading }}
            filterProps={{ setFilterOpen, anchorEl }}
            orderProps={{ order, setOrder }}
            sortProps={{ sort, sortColumns, setSort, defaultSort }}
            otherProps={(
                <Button
                    variant="outlined"
                    onClick={() => setAddLossOpen(true)}
                    startIcon={<Add />}
                >
                    Adicionar Registro de Perda
                </Button>
            )}
        />
        <LossTable {...{ rows, loading, scrollRef, fetchNextPage, foot }} />
        <LossFilterPopover {...{ filter, setFilter, filterOpen, setFilterOpen, anchorEl }} />
        <AddLossDialog {...{ addLossOpen, setAddLossOpen }} />
    </div>
}

type LossTableProps = {
    rows: Loss[]
    foot: LossFooter
    loading: boolean
    scrollRef: RefObject<VirtuosoHandle | null>
    fetchNextPage: () => void
}

const LossTable = ({ rows, loading, scrollRef, fetchNextPage, foot }: LossTableProps) => {

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
                <VirtuosoHeadCell width={unit * 20}>Vaca</VirtuosoHeadCell>
                <VirtuosoHeadCell width={unit * 15}>Data de Perda</VirtuosoHeadCell>
                <VirtuosoHeadCell width={unit * 55}>Observações</VirtuosoHeadCell>
            </TableHeadRow>

        }}
        fixedFooterContent={() => (
            <TableFooterRow>
                <TableFooterCell colSpan={4}>
                    <FooterContent title="Total" content={foot.totals} />
                </TableFooterCell>
            </TableFooterRow>
        )}
        itemContent={(_, item) => <LossesRow {...{ item, loading }} />}
    />

}

type LossRowProps = {
    item: Loss
    loading: boolean
}

const LossesRow = ({ item, loading }: LossRowProps) => {

    const [rowData, setRowData] = useState<Loss>(item)
    const [editing, setEditing] = useState(false)

    useEffect(() => setRowData(item), [item])

    if (loading) return <TableLoadingCells colSpan={6} />
    if (editing) return <LossesRowEditing {...{ rowData, setEditing, setRowData }} />

    return <>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalName}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.lossDate)}</TableBodyCell>
        <TableBodyCell>{rowData.observation}</TableBodyCell>
    </>
}

type LossesRowEditingProps = {
    rowData: Loss
    setRowData: (rowData: Loss) => void
    setEditing: (editing: boolean) => void
}

const LossesRowEditing = ({ rowData, setRowData, setEditing }: LossesRowEditingProps) => {

    const { control, handleSubmit } = useForm<Loss>({ defaultValues: rowData })

    const onSubmit: SubmitHandler<Loss> = (data: Loss) => {
        setRowData(data)
        setEditing(false)
    }

    const onSave = handleSubmit(onSubmit)

    return <>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalName}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.lossDate)}</TableBodyCell>
        <TableBodyCell>
            <FormDatePicker 
                formProps={{
                    control,
                    name: 'lossDate'
                }}
            />
            <FormTextField
                formProps={{
                    control,
                    name: 'observation'
                }}
            />
        </TableBodyCell>
    </>
}
