import { useEffect, useRef, useState } from "react"
import { EntriesFooter, InseminationEntry, InseminationStatusColorMap, InseminationStatusMap, statusMapToComboBox } from "./Entities"
import { findEntriesByGroup, getEntriesByGroupFoot } from "./Controller"
import Table from "@mui/material/Table"
import { 
    FooterContent, 
    ResizableHeadCell, 
    StickyTableFooter, 
    TableBodyCell, 
    TableBodyRow, 
    TableFooterCell, 
    TableFooterRow, 
    TableHeadCell, 
    TableHeadRow, 
    TableLoadingRow 
} from "@/ui/shared/table/TableComponents"
import TableHead from "@mui/material/TableHead"
import { Chip, TableBody } from "@mui/material"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormComboBox } from "@/ui/shared/form-controls/FormComboBox"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { percentageTransform } from "@/util/Transformations"

type GroupEntriesTablePageProps = {
    groupId: string
}

export const GroupEntriesTablePage = ({ groupId }: GroupEntriesTablePageProps) => {
    return <div className="w-full h-full overflow-hidden flex flex-col">
        <GroupEntriesTable {...{ groupId }} />
    </div>
}

const GroupEntriesTable = ({ groupId }: GroupEntriesTablePageProps) => {

    const [rows, setRows] = useState<InseminationEntry[]>([])
    const [foot, setFoot] = useState<EntriesFooter>({ totals: 0, birthRate: 0 })
    const [loading, setLoading] = useState(false)
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

    useEffect(() => {
        setLoading(true)
        getEntriesByGroupFoot(groupId)
            .then(response => setFoot(response.json))
            .catch(() => setFoot({ totals: 0, birthRate: 0 }))
        findEntriesByGroup(groupId)
            .then(response => setRows(response.json))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [groupId])

    return <div className="h-full w-full overflow-auto" ref={tableRef}>
        <Table stickyHeader className="w-max min-w-full">
            <TableHead>
                <TableHeadRow>
                    <TableHeadCell width={tableUnit * 10} />
                    <ResizableHeadCell width={tableUnit * 20}>Vaca</ResizableHeadCell>
                    <ResizableHeadCell width={tableUnit * 20}>Status</ResizableHeadCell>
                    <ResizableHeadCell width={tableUnit * 50}>Observações</ResizableHeadCell>
                </TableHeadRow>
            </TableHead>
            <TableBody>
                {rows.map(item => <EntriesRow {...{ item, loading }} />)}
            </TableBody>
            <StickyTableFooter>
                <TableFooterRow>
                    <TableFooterCell colSpan={2}>
                        <FooterContent title="Total" content={foot.totals} />
                    </TableFooterCell>
                    <TableFooterCell colSpan={2}>
                        <FooterContent title="Taxa de Nascimento" content={percentageTransform(foot.birthRate)} />
                    </TableFooterCell>
                </TableFooterRow>
            </StickyTableFooter>
        </Table>
    </div>
}

type EntriesRowProps = {
    item: InseminationEntry
    loading: boolean
}

const EntriesRow = ({ item, loading }: EntriesRowProps) => {

    const [rowData, setRowData] = useState<InseminationEntry>(item)
    const [editing, setEditing] = useState(false)

    useEffect(() => setRowData(item), [item])

    if (loading) return <TableLoadingRow colSpan={6} />
    if (editing) return <EntriesRowEditing {...{ rowData, setEditing, setRowData }} />

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalName}</TableBodyCell>
        <TableBodyCell>
            {rowData.status &&
                <Chip
                    label={InseminationStatusMap.get(rowData.status)}
                    color={InseminationStatusColorMap.get(rowData.status)}
                />
            }
        </TableBodyCell>
        <TableBodyCell>{rowData.observation}</TableBodyCell>
    </TableBodyRow>
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

    return <TableBodyRow>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalName}</TableBodyCell>
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
    </TableBodyRow>
}

