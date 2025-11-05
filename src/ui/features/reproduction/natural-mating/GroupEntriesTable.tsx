import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { MatingEntry, MatingFoot, StatusColorMap, StatusMap } from "./Entities"
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
import { AddMatingDialog } from "./AddMatingDialog"

type GroupEntriesTablePageProps = {
    matingDate: Date
}

export const GroupEntriesTablePage = ({ matingDate }: GroupEntriesTablePageProps) => {

    const defaultValue: MatingFoot = useMemo(() => ({
        totals: 0,
        averageBirthRate: 0,
        averagePregnancyRate: 0
    }), [])

    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState<MatingEntry[]>([])
    const [foot, setFoot] = useState<MatingFoot>(defaultValue)
    const [addMatingOpen, setAddMatingOpen] = useState(false)

    const onReload = useCallback(() => {
        setLoading(true)
        getEntriesByGroupFoot(matingDate)
            .then(response => setFoot(response.json))
            .catch(() => setFoot(defaultValue))
        findEntriesByGroup(matingDate)
            .then(response => setRows(response.json))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [defaultValue, matingDate])

    useEffect(onReload, [onReload])

    return <div className="w-full h-full overflow-hidden flex flex-col">
        <TableTopBar
            reloadProps={{ onReload, loading }}
            otherProps={(
                <Button
                    startIcon={<Add />}
                    onClick={() => setAddMatingOpen(true)}
                >
                    Adicionar Monta
                </Button>
            )}
        />
        <GroupEntriesTable {...{ rows, foot, loading }} />
        <AddMatingDialog {...{ addMatingOpen, setAddMatingOpen }} />
    </div>
}

type GroupEntriesTableProps = {
    rows: MatingEntry[]
    foot: MatingFoot
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
                    <ResizableHeadCell width={tableUnit * 10}>Touro</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={tableUnit * 15}>Prenhez</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={tableUnit * 15}>Nascimento</ResizableHeadCell>
                    <ResizableHeadCell width={tableUnit * 15}>Informações da Cria</ResizableHeadCell>
                    <ResizableHeadCell width={tableUnit * 15}>Observações</ResizableHeadCell>
                </TableHeadRow>
            </TableHead>
            <TableBody>
                {rows.map(item => <EntriesRow {...{ item, loading }} />)}
            </TableBody>
            <StickyTableFooter>
                <TableFooterRow colSpan={7}>
                    <FooterContent title="Total" content={foot.totals} />
                    <FooterContent title="Taxa de Prenhez" content={percentageTransform(foot.averagePregnancyRate)} />
                    <FooterContent title="Taxa de Nascimento" content={percentageTransform(foot.averageBirthRate)} />
                </TableFooterRow>
            </StickyTableFooter>
        </Table>
    </div>
}

type EntriesRowProps = {
    item: MatingEntry
    loading: boolean
}

const EntriesRow = ({ item, loading }: EntriesRowProps) => {

    const [rowData, setRowData] = useState<MatingEntry>(item)
    const [editing, setEditing] = useState(false)

    useEffect(() => setRowData(item), [item])

    if (loading) return <TableLoadingRow colSpan={7} />
    if (editing) return <EntriesRowEditing {...{ rowData, setEditing, setRowData }} />

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell>{rowData.bullName}</TableBodyCell>
        <TableBodyCell align="center">
            {rowData.pregnancyStatus &&
                <Chip
                    label={StatusMap.get(rowData.pregnancyStatus)}
                    color={StatusColorMap.get(rowData.pregnancyStatus)}
                />
            }
        </TableBodyCell>
        <TableBodyCell align="center">
            {rowData.birthStatus &&
                <Chip
                    label={StatusMap.get(rowData.birthStatus)}
                    color={StatusColorMap.get(rowData.birthStatus)}
                />
            }
        </TableBodyCell>
        <TableBodyCell>{rowData.childInformation}</TableBodyCell>
        <TableBodyCell>{rowData.observation}</TableBodyCell>
    </TableBodyRow>
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

    return <TableBodyRow>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell>{rowData.bullName}</TableBodyCell>
        <TableBodyCell align="center">{rowData.pregnancyStatus}</TableBodyCell>
        <TableBodyCell align="center">{rowData.birthStatus}</TableBodyCell>
        <TableBodyCell>{rowData.childInformation}</TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'observation' }} />
        </TableBodyCell>
    </TableBodyRow>
}

