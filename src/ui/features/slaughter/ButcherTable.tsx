import {
    ResizableHeadCell,
    TableBodyCell,
    TableBodyRow,
    TableHeadCell,
    TablePageBody,
    TablePageContainer
} from "@/ui/shared/table/TableComponents"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react"
import { ButcherEntry, ButcherSave } from "./Entities"
import { deleteButcher, findButchers, updateButcher } from "./Controller"
import { APIError } from "@/util/ApiRequest"
import { Button, Table, TableBody, TableHead, TableRow } from "@mui/material"
import { AddButcherDialog } from "./AddButcherDialog"
import { ErrorDialog } from "@/ui/shared/dialog/DialogComponents"
import { EditRowProps, TableRowProp } from "@/ui/shared/table/Entities"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { percentageTransform, transformWeight } from "@/util/Transformations"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import Add from "@mui/icons-material/Add"

type EditContextProps = {
    setRows: Dispatch<SetStateAction<ButcherEntry[]>>
    setError: Dispatch<SetStateAction<APIError | undefined>>
}

const EditContext = createContext<EditContextProps>(undefined!)

export const ButcherTable = () => {

    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState<ButcherEntry[]>([])
    const [error, setError] = useState<APIError>()
    const [addButcherOpen, setAddButcherOpen] = useState(false)

    const onReload = useCallback(() => {
        setLoading(true)
        findButchers()
            .then((response: ButcherEntry[]) => {
                response.forEach(item => item.discount = item.discount ? item.discount * 100 : undefined)
                setRows(response)
                setError(undefined)
            })
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
        <EditContext value={{ setError, setRows }}>
            <ButcherTableBody {...{ rows, loading }} />
        </EditContext>
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
                    <ResizableHeadCell align="center" width={150}>Desconto Padrão</ResizableHeadCell>
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

    useEffect(() => setRowData(row), [row])

    if (editing) return <EditButcherRow {...{ setEditing, rowData, setRowData }} />

    const onDelete = () => {
        setLoading(true)
        deleteButcher(rowData.id)
            .then(() => {
                setRows(prev => prev.filter(item => item.id != rowData.id))
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing, onDelete, loading }} />
        </TableBodyCell>
        <TableBodyCell>{row.name}</TableBodyCell>
        <TableBodyCell>{row.cnpj}</TableBodyCell>
        <TableBodyCell align="center">{percentageTransform(row.discount)}</TableBodyCell>
        <TableBodyCell align="center">{row.animalsNumber}</TableBodyCell>
        <TableBodyCell align="center">{transformWeight(row.averageWeight)}</TableBodyCell>
        <TableBodyCell align="center">{percentageTransform(row.averageRate)}</TableBodyCell>
        <TableBodyCell>{row.address}</TableBodyCell>
    </TableBodyRow>

}

const EditButcherRow = ({ rowData, setRowData, setEditing }: EditRowProps<ButcherEntry>) => {

    const [loading, setLoading] = useState(false)

    const { control, handleSubmit, setValue } = useForm<ButcherSave>({ defaultValues: rowData })

    const onSubmit: SubmitHandler<ButcherSave> = (data: ButcherSave) => {
        setLoading(true)
        updateButcher(data)
            .then((response: ButcherEntry) => {
                setRowData(response)
                setEditing(false)
            })
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
                    rules: { minLength: 14, maxLength: 14 }
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
