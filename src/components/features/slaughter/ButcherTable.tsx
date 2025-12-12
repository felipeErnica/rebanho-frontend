import {
    ResizableHeadCell,
    TableBodyCell,
    TableBodyRow,
    TableHeadCell,
    TablePageBody,
    TablePageContainer
} from "@shared/table/TableComponents"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react"
import { ButcherEntry, ButcherSave } from "./Entities"
import { deleteButcher, findButchers, updateButcher } from "./Controller"
import { APIError } from "@utils/ApiRequest"
import { Button, Table, TableBody, TableHead, TableRow } from "@mui/material"
import { AddButcherDialog } from "./AddButcherDialog"
import { ErrorDialog } from "@shared/dialog/DialogComponents"
import { EditRowProps, TableRowProp } from "@shared/table/Entities"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { percentageTransform, transformWeight } from "@utils/Transformations"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@shared/form-controls/FormTextField"
import Add from "@mui/icons-material/Add"
import { PageContext } from "@shared/main-page/PageContext"
import { PageProps } from "@shared/main-page/PageDisplay"
import { ButcherEntriesTable } from "./ButcherEntriesTable"
import { HomePage } from "../home/HomePage"
import { ButcherPage, SlaughterMainPage } from "./SlaughterPages"

type EditContextProps = {
    setRows: Dispatch<SetStateAction<ButcherEntry[]>>
    setError: Dispatch<SetStateAction<APIError | undefined>>
}

const EditContext = createContext<EditContextProps>(undefined!)

export const ButcherTable = () => {

    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState<ButcherEntry[]>([])
    const [addButcherOpen, setAddButcherOpen] = useState(false)
    const [error, setError] = useState<APIError>()

    const onReload = useCallback(() => {
        setLoading(true)
        findButchers()
            .then(response => setRows(response))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [])

    const closeAddButcher = (added?: boolean) => {
        if (added) onReload()
        setAddButcherOpen(false)
    }

    useEffect(onReload, [onReload])

    return <TablePageContainer>
        <TableTopBar
            reloadProps={{ loading, onReload }}
            otherProps={(
                <Button
                    onClick={() => setAddButcherOpen(true)}
                    startIcon={<Add />}
                >
                    Adicionar Frigorífico
                </Button>
            )}
        />
        <EditContext.Provider value={{ setError, setRows }}>
            <ButcherTableBody {...{ rows, loading }} />
        </EditContext.Provider>
        <AddButcherDialog {...{ addButcherOpen, closeAddButcher }} />
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            content={error?.message}
            onClose={() => setError(undefined)}
        />
    </TablePageContainer>

}

type ButcherTableProps = {
    rows: ButcherEntry[]
    loading: boolean
}

const ButcherTableBody = ({ rows, loading }: ButcherTableProps) => {

    return <div className="overflow-auto">
        <Table className="w-max min-w-full" stickyHeader>
            <TableHead>
                <TableRow>
                    <TableHeadCell width={150} />
                    <ResizableHeadCell width={400}>Frigorífico</ResizableHeadCell>
                    <ResizableHeadCell width={300}>CNPJ</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={150}>Taxa de Perda Média</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={120}>Nº de Animais Enviados</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={150}>Média de Peso Morto</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={150}>Rendimento Médio</ResizableHeadCell>
                    <TableHeadCell>Endereço</TableHeadCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TablePageBody
                    dataset={rows}
                    loading={loading}
                    colSpan={9}
                    render={(row) => <ButcherRow {...{ row }} />}
                />
            </TableBody>
        </Table>
    </div>
}

const ButcherRow = ({ row }: TableRowProp<ButcherEntry>) => {

    const [rowData, setRowData] = useState(row)
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)

    const { setError, setRows } = useContext(EditContext)
    const { setPageProps } = useContext(PageContext)

    useEffect(() => setRowData(row), [row])

    if (editing) return <EditButcherRow {...{ setEditing, rowData, setRowData }} />

    const onDelete = () => {
        setLoading(true)
        deleteButcher(rowData.id)
            .then(() => setRows(prev => prev.filter(item => item.id != rowData.id)))
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }

    const onShow = () => {
        if (!setPageProps) return
        const page: PageProps = {
            title: `Abate - ${rowData.name}`,
            page: <ButcherEntriesTable {...{ butcherId: rowData.id }} />,
            previousPages: [HomePage, SlaughterMainPage, ButcherPage]
        }
        setPageProps(page)
    }

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing, onDelete, onShow, loading }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.name}</TableBodyCell>
        <TableBodyCell>{rowData.cnpj}</TableBodyCell>
        <TableBodyCell align="center">{percentageTransform(rowData.discount)}</TableBodyCell>
        <TableBodyCell align="center">{rowData.animalsNumber}</TableBodyCell>
        <TableBodyCell align="center">{transformWeight(rowData.averageWeight)}</TableBodyCell>
        <TableBodyCell align="center">{percentageTransform(rowData.averageRate)}</TableBodyCell>
        <TableBodyCell>{rowData.address}</TableBodyCell>
    </TableBodyRow>

}

const EditButcherRow = ({ rowData, setRowData, setEditing }: EditRowProps<ButcherEntry>) => {

    const [loading, setLoading] = useState(false)

    const { control, handleSubmit, setValue } = useForm<ButcherSave>({ defaultValues: rowData, mode: 'onBlur' })
    const { setError } = useContext(EditContext)

    const onSubmit: SubmitHandler<ButcherSave> = (data: ButcherSave) => {
        setLoading(true)
        console.log("update ", data)
        updateButcher(data)
            .then((response: ButcherEntry) => {
                setRowData(response)
                setEditing(false)
                setError(undefined)
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }

    const onSave = handleSubmit(onSubmit)

    const applyMask = (input: string) => {
        const onlyNumbers = input.replace(/\D/, "")
        const cnpjMask = onlyNumbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
        setValue('cnpj', cnpjMask)
    }

    return <TableBodyRow>
        <TableBodyCell>
            <EditingControlButtons {...{ setEditing, onSave, loading }} />
        </TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'name' }} />
        </TableBodyCell>
        <TableBodyCell>
            <FormTextField
                onChange={applyMask}
                formProps={{
                    control,
                    name: 'cnpj',
                    rules: { pattern: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/ }
                }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <FormTextField
                type="number"
                formProps={{
                    control,
                    name: 'discount',
                    rules: { min: 0, max: 100 }
                }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">{rowData.animalsNumber}</TableBodyCell>
        <TableBodyCell align="center">{transformWeight(rowData.averageWeight)}</TableBodyCell>
        <TableBodyCell align="center">{percentageTransform(rowData.averageRate)}</TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'address' }} />
        </TableBodyCell>
    </TableBodyRow>

}
