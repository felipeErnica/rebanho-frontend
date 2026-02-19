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
import { percentageTransform, toPercentage, transformWeight } from "@utils/Transformations"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { ComboBoxItem } from "@shared/common/ComboBox"
import { EditRowProps } from "@shared/table/Entities"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { Slaughter, SlaughterSave, SlaughterFoot } from "./Entities"
import { deleteSlaughter, findEntries, getEntriesFoot, updateSlaughter } from "./Service"
import { APIError } from "@/utils/ApiRequest"
import { ErrorDialog, YesNoDialog, YesNoDialogProps } from "@/components/shared/dialog/DialogComponents"
import { getAnimalBirthLabel, getAnimalLabel } from "@features/animals/Entities"
import { DefaultWarning, ERROR_TYPE, WARNING_TYPE } from "@shared/Globals"
import { InputAdornment } from "@mui/material"

type EditContextProps = {
    setRows: Dispatch<SetStateAction<Slaughter[]>>
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setWarning: Dispatch<SetStateAction<YesNoDialogProps>>
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

    const [rows, setRows] = useState<Slaughter[]>([])
    const [order, setOrder] = useState('asc')
    const [sort, setSort] = useState(defaultSort)
    const [loading, setLoading] = useState(false)
    const [discountRate, setDiscountRate] = useState(0)

    const [error, setError] = useState<APIError>()
    const [warning, setWarning] = useState<YesNoDialogProps>(DefaultWarning)

    const loadFoot = useCallback(() => {
        getEntriesFoot({ isFiltered: true, minEntryDate: entryDate, maxEntryDate: entryDate })
            .then(results => setFoot(results))
            .catch(() => setFoot(defaultFoot))
    }, [defaultFoot, entryDate])

    const onReload = useCallback(() => {
        setLoading(true)
        loadFoot()
        findEntries({ isFiltered: true, minEntryDate: entryDate, maxEntryDate: entryDate }, sort, order)
            .then((results: Slaughter[]) => {
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
        <EditContext.Provider value={{ setRows, setError, loadFoot, setWarning }}>
            <EntriesTable {...{ discountRate, rows, loading, foot }} />
        </EditContext.Provider>
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            message={error?.message}
            onClose={() => setError(undefined)}
        />
        <YesNoDialog {...warning} />
    </TablePageContainer>

}

type EntriesTableProps = {
    discountRate: number
    loading: boolean
    foot: SlaughterFoot
    rows: Slaughter[]
}

const COLUMN_COUNT = 8

const EntriesTable = ({ rows, loading, foot, discountRate }: EntriesTableProps) => {

    return <div className="overflow-auto" >
        <Table className="w-max min-w-full" stickyHeader>
            <TableHead>
                <TableRow>
                    <TableHeadControlCell />
                    <ResizableHeadCell width={400}>Animal</ResizableHeadCell>
                    <ResizableHeadCell width={300}>Mãe</ResizableHeadCell>
                    <ResizableHeadCell width={300}>Pai</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={180}>Peso</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={180}>
                        {`Peso (Desc.: ${percentageTransform(discountRate)})`}
                    </ResizableHeadCell>
                    <ResizableHeadCell align="center" width={180}>Peso de Abate</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={180}>Rendimento</ResizableHeadCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableBodyContainer
                    colSpan={COLUMN_COUNT}
                    loading={loading}
                    dataset={rows}
                    render={row => <EntriesRow {...row} />}
                />
            </TableBody>
            <StickyTableFooter>
                <TableFooterRow colSpan={COLUMN_COUNT}>
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

const EntriesRow = (row: Slaughter) => {

    const [rowData, setRowData] = useState<Slaughter>(row)
    const [editing, setEditing] = useState(false)
    const [loadingControls, setLoadingControls] = useState(false)

    const { setError, setRows, loadFoot } = useContext(EditContext)

    useEffect(() => setRowData(row), [row])

    const onDelete = useCallback(() => {
        setLoadingControls(true)
        deleteSlaughter(rowData.id)
            .then(() => {
                setError(undefined)
                setRows(prev => prev.filter(item => item.id != rowData.id))
                loadFoot()
            })
            .catch(err => setError(err))
            .finally(() => setLoadingControls(false))
    }, [rowData])

    if (editing) return <EntriesRowEditing {...{ rowData, setRowData, setEditing }} />

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing, onDelete, loading: loadingControls }} />
        </TableBodyCell>
        <TableBodyCell>{getAnimalBirthLabel(rowData.animal)}</TableBodyCell>
        <TableBodyCell>{getAnimalLabel(rowData.animal?.mother)}</TableBodyCell>
        <TableBodyCell>{getAnimalLabel(rowData.animal?.father)}</TableBodyCell>
        <TableBodyCell align="center">{transformWeight(rowData.weight)}</TableBodyCell>
        <TableBodyCell align="center">{transformWeight(rowData.discountWeight)}</TableBodyCell>
        <TableBodyCell align="center">{transformWeight(rowData.deadWeight)}</TableBodyCell>
        <TableBodyCell align="center">{toPercentage(rowData.performanceRate)}</TableBodyCell>
    </TableBodyRow>

}

const EntriesRowEditing = ({ rowData, setRowData, setEditing }: EditRowProps<Slaughter>) => {

    const [loading, setLoading] = useState(false)

    const { handleSubmit, control, setValue } = useForm<SlaughterSave>({ defaultValues: rowData })
    const { setError, loadFoot, setWarning } = useContext(EditContext)

    const onSubmit: SubmitHandler<SlaughterSave> = (data: SlaughterSave) => {
        setLoading(true)
        updateSlaughter(data)
            .then(response => {
                setRowData(response)
                setEditing(false)
                loadFoot()
            })
            .catch(err => {
                if (err.errType === ERROR_TYPE) setError(err)
                if (err.errType === WARNING_TYPE) {
                    setWarning({
                        openYesNo: true,
                        title: err.title,
                        message: err.message,
                        onClose: () => setWarning(DefaultWarning),
                        onYes: () => {
                            setValue('ignoreDeath', true)
                            onSave()
                        }
                    })
                }
            })
            .finally(() => setLoading(false))
    }

    const onSave = handleSubmit(onSubmit)

    return <TableBodyRow>
        <TableBodyCell>
            <EditingControlButtons {...{ setEditing, onSave, loading }} />
        </TableBodyCell>
        <TableBodyCell>{getAnimalBirthLabel(rowData.animal)}</TableBodyCell>
        <TableBodyCell>{getAnimalLabel(rowData.animal?.mother)}</TableBodyCell>
        <TableBodyCell>{getAnimalLabel(rowData.animal?.father)}</TableBodyCell>
        <TableBodyCell>
            <FormTextField
                type="number"
                endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
                formProps={{ control, name: "weight" }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">{transformWeight(rowData.discountWeight)}</TableBodyCell>
        <TableBodyCell>
            <FormTextField
                type="number"
                endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
                formProps={{ control, name: 'deadWeight' }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">{toPercentage(rowData.performanceRate)}</TableBodyCell>
    </TableBodyRow>

}
