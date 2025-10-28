import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { EmbryoTransfer, TransferFoot, StatusColorMap, StatusMap } from "./Entities"
import { findEntriesByGroup, getEntriesByGroupFoot } from "./Controller"
import Table from "@mui/material/Table"
import {
    FooterContent,
    ResizableHeadCell,
    StickyTableFooter,
    TableBodyCell,
    TableBodyRow,
    TableFooterRow,
    TableHeadCell,
    TableHeadRow,
    TableLoadingRow
} from "@/ui/shared/table/TableComponents"
import TableHead from "@mui/material/TableHead"
import { Button, Chip, TableBody } from "@mui/material"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { percentageTransform } from "@/util/Transformations"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
import Add from "@mui/icons-material/Add"
import { AddTransferDialog } from "./AddTransferDialog"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { searchMother } from "@/shared/GlobalApiCalls"

type GroupEntriesTablePageProps = {
    transferDate: Date
}

export const GroupEntriesTablePage = ({ transferDate }: GroupEntriesTablePageProps) => {

    const defaultValue: TransferFoot = useMemo(() => ({
        totals: 0,
        averageBirthRate: 0,
        averagePregnancyRate: 0
    }), [])

    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState<EmbryoTransfer[]>([])
    const [foot, setFoot] = useState<TransferFoot>(defaultValue)
    const [addTransferOpen, setAddTransferOpen] = useState(false)

    const onReload = useCallback(() => {
        setLoading(true)
        getEntriesByGroupFoot(transferDate)
            .then(response => setFoot(response.json))
            .catch(() => setFoot(defaultValue))
        findEntriesByGroup(transferDate)
            .then(response => setRows(response.json))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [defaultValue, transferDate])

    useEffect(onReload, [onReload])

    return <div className="w-full h-full overflow-hidden flex flex-col">
        <TableTopBar
            reloadProps={{ onReload, loading }}
            otherProps={(
                <Button
                    startIcon={<Add />}
                    onClick={() => setAddTransferOpen(true)}
                >
                    Adicionar Transferência
                </Button>
            )}
        />
        <GroupEntriesTable {...{ rows, foot, loading }} />
        <AddTransferDialog {...{ addTransferOpen, setAddTransferOpen }} />
    </div>
}

type GroupEntriesTableProps = {
    rows: EmbryoTransfer[]
    foot: TransferFoot
    loading: boolean
}

const GroupEntriesTable = ({ rows, foot, loading }: GroupEntriesTableProps) => {

    const [tableUnit, setTableUnit] = useState(0)
    const tableRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleResize = () => {
            if (!tableRef.current) return
            const table = tableRef.current
            setTableUnit(table.offsetWidth / 100)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])


    return <div className="h-full w-full overflow-auto" ref={tableRef}>
        <Table stickyHeader className="w-max min-w-full">
            <TableHead>
                <TableHeadRow>
                    <TableHeadCell width={tableUnit * 10} />
                    <ResizableHeadCell width={tableUnit * 20}>Vaca</ResizableHeadCell>
                    <ResizableHeadCell width={tableUnit * 15}>Doadora</ResizableHeadCell>
                    <ResizableHeadCell width={tableUnit * 15}>Touro</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={tableUnit * 10}>Prenhez</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={tableUnit * 10}>Nascimento</ResizableHeadCell>
                    <ResizableHeadCell width={tableUnit * 15}>Informações da Cria</ResizableHeadCell>
                    <ResizableHeadCell width={tableUnit * 15}>Observações</ResizableHeadCell>
                </TableHeadRow>
            </TableHead>
            <TableBody>
                {rows.map(item => <EntriesRow {...{ item, loading }} />)}
            </TableBody>
            <StickyTableFooter>
                <TableFooterRow colSpan={8}>
                    <FooterContent title="Total" content={foot.totals} />
                    <FooterContent title="Taxa de Prenhez" content={percentageTransform(foot.averagePregnancyRate)} />
                    <FooterContent title="Taxa de Nascimento" content={percentageTransform(foot.averageBirthRate)} />
                </TableFooterRow>
            </StickyTableFooter>
        </Table>
    </div>
}

type EntriesRowProps = {
    item: EmbryoTransfer
    loading: boolean
}

const EntriesRow = ({ item, loading }: EntriesRowProps) => {

    const [rowData, setRowData] = useState<EmbryoTransfer>(item)
    const [editing, setEditing] = useState(false)

    useEffect(() => setRowData(item), [item])

    if (loading) return <TableLoadingRow colSpan={7} />
    if (editing) return <EntriesRowEditing {...{ rowData, setEditing, setRowData }} />

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.receiverName}</TableBodyCell>
        <TableBodyCell>{rowData.donorName}</TableBodyCell>
        <TableBodyCell>{rowData.bullName}</TableBodyCell>
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
    </TableBodyRow>
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

    return <TableBodyRow>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.receiverName}</TableBodyCell>
        <TableBodyCell>
            <FormSearchBox
                searchOptions={searchMother}
                formProps={{ control, name: 'donorId' }}
            />
        </TableBodyCell>
        <TableBodyCell>
            <FormSearchBox
                searchOptions={searchMother}
                formProps={{ control, name: 'bullId' }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">{rowData.pregnancyStatus}</TableBodyCell>
        <TableBodyCell align="center">{rowData.birthStatus}</TableBodyCell>
        <TableBodyCell>{rowData.childInformation}</TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'observation' }} />
        </TableBodyCell>
    </TableBodyRow>
}

