import {
    FooterContent,
    ResizableHeadCell,
    StickyTableFooter,
    TableBodyCell,
    TableBodyContainer,
    TableBodyRow,
    TableFooterRow,
    TableHeadCell,
    TablePageContainer,
} from "@shared/table/TableComponents"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { decimalTransform, percentageTransform } from "@utils/Transformations"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { ComboBoxItem } from "@shared/common/ComboBox"
import { EditRowProps } from "@shared/table/Entities"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { SlaughterEntry, SlaughterFoot } from "./Entities"
import { findEntriesByDate, getEntriesByDateFoot } from "./Controller"

type SlaughterGroupEntriesTableProps = {
    entryDate: Date
}

export const SlaughterGroupEntriesTable = ({ entryDate }: SlaughterGroupEntriesTableProps) => {

    const defaultSort = 'animal_order, birth_date'
    const defaultFoot: SlaughterFoot = useMemo(() => ({
        animalsNumber: 0,
        averageWeight: 0,
        averageDeadWeight: 0,
        averageRate: 0,
    }), [])

    const [foot, setFoot] = useState<SlaughterFoot>(defaultFoot)

    const [rows, setRows] = useState<SlaughterEntry[]>([])
    const [order, setOrder] = useState('asc')
    const [sort, setSort] = useState(defaultSort)
    const [loading, setLoading] = useState(false)
    const [discountRate, setDiscountRate] = useState(0)

    const onReload = useCallback(() => {
        setLoading(true)
        getEntriesByDateFoot(entryDate)
            .then(results => setFoot(results))
            .catch(() => setFoot(defaultFoot))
        findEntriesByDate(entryDate, sort, order)
            .then((results: SlaughterEntry[]) => {
                const entries = results
                setDiscountRate(entries.length != 0 ? entries[0]?.discountRate : 0)
                setRows(entries)
            })
            .catch(() => {
                setRows([])
                setDiscountRate(0)
            })
            .finally(() => setLoading(false))
    }, [entryDate, sort, order, defaultFoot])

    useEffect(onReload, [onReload])

    const sortColumns: ComboBoxItem[] = [
        { name: 'Brinco', value: defaultSort },
        { name: 'Nome', value: 'animal_name, birth_date' },
        { name: 'Data de Nascimento', value: 'birth_date, animal_order' },
        { name: 'Peso', value: 'weight, animal_order, birth_date' },
        { name: 'Peso de Abate', value: 'dead_weight, animal_order, birth_date' },
        { name: 'Rendimento', value: 'performance_rate, animal_order, birth_date' },
    ]

    return <TablePageContainer>
        <TableTopBar
            reloadProps={{ onReload, loading }}
            orderProps={{ order, setOrder }}
            sortProps={{ sort, setSort, sortColumns, defaultSort }}
        />
        <EntriesTable {...{ discountRate, rows, loading, foot }} />
    </TablePageContainer>

}

type EntriesTableProps = {
    discountRate: number
    loading: boolean
    foot: SlaughterFoot
    rows: SlaughterEntry[]
}

const EntriesTable = ({ rows, loading, foot, discountRate }: EntriesTableProps) => {

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
        <Table className="w-max min-w-full" stickyHeader>
            <TableHead>
                <TableRow>
                    <TableHeadCell width={unit * 10} />
                    <ResizableHeadCell width={unit * 15}>Animal</ResizableHeadCell>
                    <ResizableHeadCell width={unit * 15}>Mãe</ResizableHeadCell>
                    <ResizableHeadCell width={unit * 15}>Pai</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={unit * 10}>Peso</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={unit * 15}>
                        {`Peso (Desc.: ${percentageTransform(discountRate)})`}
                    </ResizableHeadCell>
                    <ResizableHeadCell width={unit * 10}>Peso de Abate</ResizableHeadCell>
                    <ResizableHeadCell width={unit * 10}>Rendimento</ResizableHeadCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableBodyContainer
                    colSpan={8}
                    loadingProps={{ loading, rowSpan: 30 }}
                    dataset={rows}
                    render={row => <EntriesRow {...row} />}
                />
            </TableBody>
            <StickyTableFooter>
                <TableFooterRow colSpan={8}>
                    <FooterContent title="Total" content={foot.animalsNumber} />
                    <FooterContent
                        title="Peso Médio"
                        content={`${decimalTransform(foot.averageWeight)} (${decimalTransform(foot.averageWeight / 15)}@)`}
                    />
                    <FooterContent
                        title="Peso de Abate Médio"
                        content={`${decimalTransform(foot.averageDeadWeight)} (${decimalTransform(foot.averageDeadWeight / 15)}@)`}
                    />
                    <FooterContent
                        title="Rendimento Médio"
                        content={percentageTransform(foot.averageRate)}
                    />
                </TableFooterRow>
            </StickyTableFooter>
        </Table>
    </div>
}

const EntriesRow = (row: SlaughterEntry) => {

    const [rowData, setRowData] = useState<SlaughterEntry>(row)
    const [editing, setEditing] = useState(false)

    useEffect(() => setRowData(row), [row])

    const onDelete = useCallback(() => console.log(rowData.id), [rowData])

    if (editing) return <EntriesRowEditing {...{ rowData, setRowData, setEditing }} />

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing, onDelete }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell>{rowData.motherName}</TableBodyCell>
        <TableBodyCell>{rowData.fatherName}</TableBodyCell>
        <TableBodyCell align="center">
            {`${decimalTransform(rowData.weight)} (${decimalTransform(rowData.weight / 15)}@)`}
        </TableBodyCell>
        <TableBodyCell align="center">
            {`${decimalTransform(rowData.discountWeight)} (${decimalTransform(rowData.discountWeight / 15)}@)`}
        </TableBodyCell>
        <TableBodyCell align="center">
            {`${decimalTransform(rowData.deadWeight)} (${decimalTransform(rowData.deadWeight / 15)}@)`}
        </TableBodyCell>
        <TableBodyCell align="center">{percentageTransform(rowData.performanceRate)}</TableBodyCell>
    </TableBodyRow>

}

const EntriesRowEditing = ({ rowData, setRowData, setEditing }: EditRowProps<SlaughterEntry>) => {

    const { handleSubmit, control } = useForm<SlaughterEntry>({ defaultValues: rowData })

    const onSubmit: SubmitHandler<SlaughterEntry> = (data: SlaughterEntry) => {
        setRowData(data)
        setEditing(false)
    }

    const onSave = handleSubmit(onSubmit)

    return <TableBodyRow>
        <TableBodyCell>
            <EditingControlButtons {...{ setEditing, onSave }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell>{rowData.motherName}</TableBodyCell>
        <TableBodyCell>{rowData.fatherName}</TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: "weight" }} type="number" />
        </TableBodyCell>
        <TableBodyCell align="center">
            {`${decimalTransform(rowData.discountWeight)} (${decimalTransform(rowData.discountWeight / 15)}@)`}
        </TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'deadWeight' }} type="number" />
        </TableBodyCell>
        <TableBodyCell align="center">{percentageTransform(rowData.performanceRate)}</TableBodyCell>
    </TableBodyRow>

}
