import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { TestEntry, TestEntryFooter } from "./Entities"
import { findEntriesByGroup, getEntriesByGroupFoot } from "./Controller"
import Table from "@mui/material/Table"
import { Button, Chip, TableBody, TableHead } from "@mui/material"
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
import { dateTransform, percentageTransform } from "@/util/Transformations"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { InseminationStatusColorMap, InseminationStatusMap, statusMapToComboBox } from "../insemination/Entities"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormComboBox } from "@/ui/shared/form-controls/FormComboBox"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
import Add from "@mui/icons-material/Add"
import { AddTestDialog } from "./AddTestDialog"
import { ComboBoxItem } from "@/ui/shared/common/ComboBox"

type GroupEntriesTablePageProps = {
    testDate: Date
}

export const GroupEntriesTablePage = ({ testDate }: GroupEntriesTablePageProps) => {

    const defaultSort = 'animal_order'

    const defaultFoot: TestEntryFooter = useMemo(() => ({
        pregnancyRate: 0,
        birthRate: 0,
        totals: 0
    }), [])

    const [rows, setRows] = useState<TestEntry[]>([])
    const [foot, setFoot] = useState<TestEntryFooter>(defaultFoot)
    const [loading, setLoading] = useState(false)
    const [addTestOpen, setAddTestOpen] = useState(false)
    const [sort, setSort] = useState(defaultSort)
    const [order, setOrder] = useState('asc')

    const sortColumns: ComboBoxItem[] = [
        { name: 'Brinco da Vaca', value: 'animal_order' },
        { name: 'Nome da Vaca', value: 'name' },
        { name: 'Data de Previsão', value: "birth_forecast,animal_order" }
    ]

    const onReload = useCallback(() => {
        setLoading(true)
        getEntriesByGroupFoot(testDate)
            .then(response => setFoot(response.json))
            .catch(() => setFoot(defaultFoot))
        findEntriesByGroup(testDate, sort, order)
            .then(response => setRows(response.json))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [defaultFoot, order, sort, testDate])

    useEffect(onReload, [onReload])

    const otherProps = (
        <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setAddTestOpen(true)}
        >
            Adicionar Toque
        </Button>
    )

    return <div className="h-full w-full overflow-hidden flex flex-col">
        <TableTopBar
            sortProps={{ setSort, sort, sortColumns, defaultSort }}
            orderProps={{ setOrder, order }}
            reloadProps={{ onReload }}
            otherProps={otherProps}
        />
        <EntriesTable {...{ rows, loading, foot }} />
        <AddTestDialog {...{ setAddTestOpen, addTestOpen, testDate }} />
    </div>
}

type EntriesTableProps = {
    rows: TestEntry[]
    foot: TestEntryFooter
    loading: boolean
}

const EntriesTable = ({ rows, loading, foot }: EntriesTableProps) => {

    const [unit, setUnit] = useState(0)
    const tableRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleResize = () => {
            if (!tableRef.current) return
            const table = tableRef.current
            setUnit(table.offsetWidth / 100)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return <div
        className="overflow-auto"
        ref={tableRef}
    >
        <Table className="min-w-full w-max" stickyHeader>
            <TableHead>
                <TableHeadRow>
                    <TableHeadCell width={unit * 10} />
                    <ResizableHeadCell width={unit * 20}>Vaca</ResizableHeadCell>
                    <ResizableHeadCell width={unit * 15}>Prenhez</ResizableHeadCell>
                    <ResizableHeadCell width={unit * 15}>Nascimento</ResizableHeadCell>
                    <ResizableHeadCell width={unit * 10}>Data de Previsão</ResizableHeadCell>
                    <ResizableHeadCell width={unit * 30}>Observações</ResizableHeadCell>
                </TableHeadRow>
            </TableHead>
            <TableBody>
                {rows.map((item) => <EntriesRow {...{ item, loading }} />)}
            </TableBody>
            <StickyTableFooter>
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
            </StickyTableFooter>
        </Table>
    </div>
}

type EntriesRowProps = {
    item: TestEntry
    loading: boolean
}

const EntriesRow = ({ item, loading }: EntriesRowProps) => {

    const [rowData, setRowData] = useState<TestEntry>(item)
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
    </TableBodyRow>
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
    </TableBodyRow>
}

