import {
    ResizableHeadCell,
    TableBodyCell,
    TableBodyRow,
    TableHeadCell,
    TableHeadControlCell,
    TablePageBody,
    TablePageContainer
} from "@shared/table/TableComponents"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react"
import { APIError } from "@utils/ApiRequest"
import { Button, Table, TableBody, TableHead, TableRow } from "@mui/material"
import { AddButcherDialog } from "./AddButcherDialog"
import { ErrorDialog, YesNoDialog, YesNoDialogProps } from "@shared/dialog/DialogComponents"
import { EditRowProps, TableRowProp } from "@shared/table/Entities"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { toPercentage, transformWeight } from "@utils/Transformations"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@shared/form-controls/FormTextField"
import Add from "@mui/icons-material/Add"
import { useNavigate } from "react-router"
import { ButcherDelete, Butcher, ButcherSave } from "./Entities"
import { deleteButcher, findButchers, updateButcher } from "./Service"
import { DefaultWarning, ERROR_TYPE } from "@shared/Globals"
import { FormPercentageField } from "@shared/form-controls/FormPercentageField"

type EditContextProps = {
    setRows: Dispatch<SetStateAction<Butcher[]>>
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setWarning: Dispatch<SetStateAction<YesNoDialogProps>>
}

const EditContext = createContext<EditContextProps>(undefined!)

export const ButcherTable = () => {

    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState<Butcher[]>([])
    const [addButcherOpen, setAddButcherOpen] = useState(false)
    const [error, setError] = useState<APIError>()
    const [warning, setWarning] = useState<YesNoDialogProps>(DefaultWarning)

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
        <EditContext.Provider value={{ setError, setRows, setWarning }}>
            <ButcherTableBody {...{ rows, loading }} />
        </EditContext.Provider>
        <AddButcherDialog {...{ addButcherOpen, closeAddButcher }} />
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            message={error?.message}
            onClose={() => setError(undefined)}
        />
        <YesNoDialog {...warning} />
    </TablePageContainer>

}

type ButcherTableProps = {
    rows: Butcher[]
    loading: boolean
}

const COLUMN_COUNT = 9

const ButcherTableBody = ({ rows, loading }: ButcherTableProps) => {

    return <div className="overflow-auto">
        <Table className="w-max min-w-full" stickyHeader>
            <TableHead>
                <TableRow>
                    <TableHeadControlCell />
                    <ResizableHeadCell width={200}>Frigorífico</ResizableHeadCell>
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
                    colSpan={COLUMN_COUNT}
                    render={(row) => <ButcherRow {...{ row }} />}
                />
            </TableBody>
        </Table>
    </div>
}

const ButcherRow = ({ row }: TableRowProp<Butcher>) => {

    const [rowData, setRowData] = useState(row)
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [params, setParams] = useState<ButcherDelete>({
        id: row.id,
        ignoreDeaths: false,
        override: false
    })

    const { setError, setRows, setWarning } = useContext(EditContext)
    const navigate = useNavigate()

    useEffect(() => setRowData(row), [row])

    const onYes = useCallback(() => {
        setParams(params => ({ ...params, override: true }))
        setWarning(warning => ({
            ...warning,
            message: "Deseja alterar as datas de morte dos animais abatidos no frigoríco?" +
                "\nATENÇÃO: Ao confirmar, as datas serão apagadas e os animais constarão como vivos. Se recusar, os abates serão excluídos, " +
                "mas os animais ainda constarão como mortos.",
            onYes: () => {
                setParams(params => ({ ...params, ignoreDeaths: true }))
                onDelete()
            },
            onClose: () => {
                onDelete()
                setWarning(DefaultWarning)
            }
        }))
    }, [])

    const onDelete = useCallback(() => {
        setLoading(true)
        deleteButcher(params)
            .then(() => setRows(prev => prev.filter(item => item.id != params.id)))
            .catch((err: APIError) => {
                if (err.errType === ERROR_TYPE) {
                    setError(err)
                    return
                }
                setWarning({
                    openYesNo: true,
                    title: err.title,
                    message: err.message,
                    onClose: () => setWarning(DefaultWarning),
                    onYes
                })
            })
            .finally(() => setLoading(false))
    }, [params])

    const onShow = useCallback(() => navigate(`butchers/${rowData.id}`), [row])

    if (editing) return <EditButcherRow {...{ setEditing, rowData, setRowData }} />

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons {...{ setEditing, onDelete, onShow, loading }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.name}</TableBodyCell>
        <TableBodyCell>{rowData.cnpj}</TableBodyCell>
        <TableBodyCell align="center">{toPercentage(rowData.discount)}</TableBodyCell>
        <TableBodyCell align="center">{rowData.animalsNumber}</TableBodyCell>
        <TableBodyCell align="center">{transformWeight(rowData.averageWeight)}</TableBodyCell>
        <TableBodyCell align="center">{toPercentage(rowData.averageRate)}</TableBodyCell>
        <TableBodyCell>{rowData.address}</TableBodyCell>
    </TableBodyRow>

}

const EditButcherRow = ({ rowData, setRowData, setEditing }: EditRowProps<Butcher>) => {

    const [loading, setLoading] = useState(false)

    const { control, handleSubmit, setValue } = useForm<ButcherSave>({ defaultValues: rowData, mode: 'onBlur' })
    const { setError } = useContext(EditContext)

    const onSubmit: SubmitHandler<ButcherSave> = useCallback((data: ButcherSave) => {
        setLoading(true)
        updateButcher(data)
            .then(resp => {
                setRowData(resp)
                setEditing(false)
                setError(undefined)
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }, [])

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
            <FormTextField
                formProps={{
                    control,
                    name: 'name',
                    rules: { required: true }
                }}
            />
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
            <FormPercentageField
                formProps={{
                    control,
                    name: 'discount',
                    rules: { required: true }
                }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">{rowData.animalsNumber}</TableBodyCell>
        <TableBodyCell align="center">{transformWeight(rowData.averageWeight)}</TableBodyCell>
        <TableBodyCell align="center">{toPercentage(rowData.averageRate)}</TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'address' }} />
        </TableBodyCell>
    </TableBodyRow>

}
