import {
    FooterContent,
    ResizableHeadCell,
    StickyTableFooter,
    TableBodyCell,
    TableBodyContainer,
    TableBodyRow,
    TableFooterRow,
    TableHeadControlCell,
    TablePageContainer,
} from "@shared/table/TableComponents"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { percentageTransform, transformWeight } from "@utils/Transformations"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { ComboBoxItem } from "@shared/common/ComboBox"
import { EditRowProps } from "@shared/table/Entities"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { SlaughterEntry, SlaughterEntrySave, SlaughterFoot } from "./Entities"
import { deleteSlaughter, findEntriesByDate, getEntriesByDateFoot, updateSlaughter } from "./Controller"
import { APIError } from "@/utils/ApiRequest"
import { ErrorDialog } from "@/components/shared/dialog/DialogComponents"

type EditContextProps = {
    setRows: Dispatch<SetStateAction<SlaughterEntry[]>>
    setError: Dispatch<SetStateAction<APIError | undefined>>
    loadFoot: () => void
}

const EditContext = createContext<EditContextProps>(undefined!)

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

    const [error, setError] = useState<APIError>()

    const loadFoot = useCallback(() => {
        getEntriesByDateFoot(entryDate)
            .then(results => setFoot(results))
            .catch(() => setFoot(defaultFoot))
    }, [defaultFoot, entryDate])

    const onReload = useCallback(() => {
        setLoading(true)
        loadFoot()
        findEntriesByDate(entryDate, sort, order)
            .then((results: SlaughterEntry[]) => {
                setDiscountRate(results.length != 0 ? results[0]?.discountRate : 0)
                setRows(results)
            })
            .catch(() => {
                setRows([])
                setDiscountRate(0)
            })
            .finally(() => setLoading(false))
    }, [loadFoot, entryDate, sort, order])

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
        <EditContext.Provider value={{ setRows, setError, loadFoot }}>
            <EntriesTable {...{ discountRate, rows, loading, foot }} />
        </EditContext.Provider>
        <ErrorDialog 
            openError={!!error}
            title={error?.title}
            content={error?.message}
            onClose={() => setError(undefined)}
        />
    </TablePageContainer>

}

type EntriesTableProps = {
    discountRate: number
    loading: boolean
    foot: SlaughterFoot
    rows: SlaughterEntry[]
}

const EntriesTable = ({ rows, loading, foot, discountRate }: EntriesTableProps) => {

    return <div className="overflow-auto" >
        <Table className="w-max min-w-full" stickyHeader>
            <TableHead>
                <TableRow>
                    <TableHeadControlCell />
                    <ResizableHeadCell>Animal</ResizableHeadCell>
                    <ResizableHeadCell width={200}>Mãe</ResizableHeadCell>
                    <ResizableHeadCell width={200}>Pai</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={150}>Peso</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={150}>
                        {`Peso (Desc.: ${percentageTransform(discountRate)})`}
                    </ResizableHeadCell>
                    <ResizableHeadCell align="center" width={150}>Peso de Abate</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={150}>Rendimento</ResizableHeadCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableBodyContainer
                    colSpan={8}
                    loading={loading}
                    dataset={rows}
                    render={row => <EntriesRow {...row} />}
                />
            </TableBody>
            <StickyTableFooter>
                <TableFooterRow colSpan={8}>
                    <FooterContent title="Total" content={foot.animalsNumber} />
                    <FooterContent
                        title="Peso Médio"
                        content={transformWeight(foot.averageWeight)}
                    />
                    <FooterContent
                        title="Peso de Abate Médio"
                        content={transformWeight(foot.averageDeadWeight)}
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
    const [loadingControls, setLoadingControls] = useState(false)

    const { setError, setRows, loadFoot } = useContext(EditContext)

    useEffect(() => setRowData(row), [row])

    const onDelete = () => {
        setLoadingControls(true)
        deleteSlaughter(rowData.id)
            .then(() => {
                setError(undefined)
                setRows(prev => prev.filter(item => item.id != rowData.id))
                loadFoot()
            })
            .catch(err => setError(err))
            .finally(() => setLoadingControls(false))
    }


    if (editing) return <EntriesRowEditing {...{ rowData, setRowData, setEditing }} />

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing, onDelete, loading: loadingControls }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell>{rowData.motherName}</TableBodyCell>
        <TableBodyCell>{rowData.fatherName}</TableBodyCell>
        <TableBodyCell align="center">{transformWeight(rowData.weight)}</TableBodyCell>
        <TableBodyCell align="center">{transformWeight(rowData.discountWeight)}</TableBodyCell>
        <TableBodyCell align="center">{transformWeight(rowData.deadWeight)}</TableBodyCell>
        <TableBodyCell align="center">{percentageTransform(rowData.performanceRate)}</TableBodyCell>
    </TableBodyRow>

}

const EntriesRowEditing = ({ rowData, setRowData, setEditing }: EditRowProps<SlaughterEntry>) => {

    const [loading, setLoading] = useState(false)

    const { handleSubmit, control } = useForm<SlaughterEntry>({ defaultValues: rowData })
    const { setError, loadFoot } = useContext(EditContext)

    const onSubmit: SubmitHandler<SlaughterEntrySave> = (data: SlaughterEntrySave) => {
        setLoading(true)
        updateSlaughter(data)
            .then(response => {
                setRowData(response)
                setEditing(false)
                loadFoot()
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }

    const onSave = handleSubmit(onSubmit)

    return <TableBodyRow>
        <TableBodyCell>
            <EditingControlButtons {...{ setEditing, onSave, loading }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalInfo}</TableBodyCell>
        <TableBodyCell>{rowData.motherName}</TableBodyCell>
        <TableBodyCell>{rowData.fatherName}</TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: "weight" }} type="number" />
        </TableBodyCell>
        <TableBodyCell align="center">{transformWeight(rowData.discountWeight)}</TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'deadWeight' }} type="number" />
        </TableBodyCell>
        <TableBodyCell align="center">{percentageTransform(rowData.performanceRate)}</TableBodyCell>
    </TableBodyRow>

}
