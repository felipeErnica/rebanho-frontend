import {
    FooterContent,
    ResizableHeadCell,
    StickyTableFooter,
    TableBodyCell,
    TableBodyContainer,
    TableBodyRow,
    TableFooterRow,
    TableHeadCell,
    TableHeadControlCell,
    TablePageContainer,
} from "@shared/table/TableComponents"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { useCallback, useEffect, useMemo, useState } from "react"
import { WeightEntry, WeightFoot } from "./Entities"
import { findEntriesByDate, getEntriesFootByDate } from "./Controller"
import { decimalTransform, positiveTransform, transformWeight } from "@utils/Transformations"
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

    const loadFoot = useCallback(() => {
        getEntriesFootByDate(entryDate)
            .then(results => setFoot(results))
            .catch(() => setFoot(defaultFoot))
    }, [defaultFoot, entryDate])

    const onReload = useCallback(() => {
        setLoading(true)
        loadFoot()
        findEntriesByDate(entryDate, order, sort)
            .then(results => setRows(results))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [entryDate, loadFoot, order, sort])

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

    return <div className="overflow-auto">
        <Table className="w-max min-w-full" stickyHeader>
            <TableHead>
                <TableRow>
                    <TableHeadControlCell />
                    <ResizableHeadCell>Animal</ResizableHeadCell>
                    <ResizableHeadCell width={300}>Mãe</ResizableHeadCell>
                    <ResizableHeadCell width={300}>Pai</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={200}>Peso</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={200}>Ganho de Peso Diário (Kg/dia)</ResizableHeadCell>
                    <TableHeadCell width={200} align="center">Varição de Peso</TableHeadCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableBodyContainer
                    colSpan={7}
                    loading={loading}
                    dataset={rows}
                    render={row => <EntriesRow {...row} />}
                />
            </TableBody>
            <StickyTableFooter>
                <TableFooterRow colSpan={7}>
                    <FooterContent title="Total" content={foot.animalsNumber} />
                    <FooterContent
                        title="Peso Médio"
                        content={transformWeight(foot.averageWeight)}
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
        <TableBodyCell align="center">{transformWeight(rowData.weight)}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.weightGain)}</TableBodyCell>
        <TableBodyCell align="center">
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
