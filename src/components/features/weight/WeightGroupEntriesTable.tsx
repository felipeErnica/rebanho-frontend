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
import { WeightEntry, WeightFoot } from "./Entities"
import { findEntriesByDate, getEntriesFootByDate } from "./Controller"
import { decimalTransform, positiveTransform } from "@utils/Transformations"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { ComboBoxItem } from "@shared/common/ComboBox"
import { TrendComponent } from "@shared/dashboard/DashboardComponents"
import { EditRowProps } from "@shared/table/Entities"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@shared/form-controls/FormTextField"

type WeightGroupEntriesTableProps = {
    entryDate: Date
}

export const WeightGroupEntriesTable = ({ entryDate }: WeightGroupEntriesTableProps) => {

    const defaultSort = 'animal_order, birth_date'
    const defaultFoot: WeightFoot = useMemo(() => ({
        animalsNumber: 0,
        averageGain: 0,
        averageWeight: 0
    }), [])

    const [foot, setFoot] = useState<WeightFoot>(defaultFoot)

    const [rows, setRows] = useState<WeightEntry[]>([])
    const [order, setOrder] = useState('asc')
    const [sort, setSort] = useState(defaultSort)
    const [loading, setLoading] = useState(false)

    const onReload = useCallback(() => {
        setLoading(true)
        getEntriesFootByDate(entryDate)
            .then(results => setFoot(results.json))
            .catch(() => setFoot(defaultFoot))
        findEntriesByDate(entryDate, order, sort)
            .then(results => setRows(results.json))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [defaultFoot, entryDate, order, sort])

    useEffect(onReload, [onReload])

    const sortColumns: ComboBoxItem[] = [
        { name: "Brinco", value: defaultSort },
        { name: "Nome", value: 'animal_name, animal_order, birth_date' },
        { name: "Data de Nascimento", value: 'birth_date, animal_order' },
    ]

    return <TablePageContainer>
        <TableTopBar
            reloadProps={{ onReload, loading }}
            orderProps={{ order, setOrder }}
            sortProps={{ sort, setSort, sortColumns, defaultSort }}
        />
        <EntriesTable {...{ rows, loading, foot }} />
    </TablePageContainer>

}

type EntriesTableProps = {
    loading: boolean
    foot: WeightFoot
    rows: WeightEntry[]
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
        <Table className="w-max min-w-full" stickyHeader>
            <TableHead>
                <TableRow>
                    <TableHeadCell width={unit * 10} />
                    <ResizableHeadCell width={unit * 20}>Animal</ResizableHeadCell>
                    <ResizableHeadCell width={unit * 15}>Mãe</ResizableHeadCell>
                    <ResizableHeadCell width={unit * 15}>Pai</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={unit * 10}>Peso</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={unit * 15}>Ganho de Peso Diário (Kg/dia)</ResizableHeadCell>
                    <ResizableHeadCell width={unit * 15}>Varição de Peso</ResizableHeadCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableBodyContainer
                    colSpan={7}
                    loadingProps={{ loading, rowSpan: 30 }}
                    dataset={rows}
                    render={row => <EntriesRow {...row} />}
                />
            </TableBody>
            <StickyTableFooter>
                <TableFooterRow colSpan={7}>
                    <FooterContent title="Total" content={foot.animalsNumber} />
                    <FooterContent
                        title="Peso Médio"
                        content={`${decimalTransform(foot.averageWeight)} (${decimalTransform(foot.averageWeight / 15)}@)`}
                    />
                    <FooterContent
                        title="Ganho de Peso Médio"
                        content={decimalTransform(foot.averageGain)}
                    />
                </TableFooterRow>
            </StickyTableFooter>
        </Table>
    </div>
}

const EntriesRow = (row: WeightEntry) => {

    const [rowData, setRowData] = useState<WeightEntry>(row)
    const [editing, setEditing] = useState(false)

    useEffect(() => setRowData(row), [row])

    if (editing) return <EntriesRowEditing {...{ rowData, setRowData, setEditing }} />

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons
                setEditing={setEditing}
            />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell>{rowData.motherName}</TableBodyCell>
        <TableBodyCell>{rowData.fatherName}</TableBodyCell>
        <TableBodyCell align="center">
            {`${decimalTransform(rowData.weight)} (${decimalTransform(rowData.weight / 15)}@)`}
        </TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.weightGain)}</TableBodyCell>
        <TableBodyCell>
            <TrendComponent
                trend={rowData.weightVariation}
                text={positiveTransform(rowData.weightVariation)}
            />
        </TableBodyCell>
    </TableBodyRow>

}

const EntriesRowEditing = ({ rowData, setRowData, setEditing }: EditRowProps<WeightEntry>) => {

    const { handleSubmit, control } = useForm<WeightEntry>({ defaultValues: rowData })

    const onSubmit: SubmitHandler<WeightEntry> = (data: WeightEntry) => {
        setRowData(data)
        setEditing(false)
    }

    const onSave = handleSubmit(onSubmit)

    return <TableBodyRow>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell>{rowData.motherName}</TableBodyCell>
        <TableBodyCell>{rowData.fatherName}</TableBodyCell>
        <TableBodyCell align="center">
            <FormTextField
                formProps={{ control, name: 'weight' }}
                type="number"
            />
        </TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.weightGain)}</TableBodyCell>
        <TableBodyCell>
            <TrendComponent
                trend={rowData.weightVariation}
                text={positiveTransform(rowData.weightVariation)}
            />
        </TableBodyCell>
    </TableBodyRow>

}
