import {
    createContext,
    Dispatch,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react"
import { TestGroup, TestGroupSave } from "./Entities"
import { deleteBatch, findGroups, updateBatch } from "./Service"
import Table from "@mui/material/Table"
import { IconButton, TableBody, TableHead } from "@mui/material"
import {
    TableBodyCell,
    TableBodyRow,
    TableHeadCell,
    TableHeadRow,
    TablePageBody,
    TrendValues
} from "@shared/table/TableComponents"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { dateToISO, dateTransform, percentageTransform } from "@utils/Transformations"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { useNavigate } from "react-router"
import Add from "@mui/icons-material/Add"
import { AddTestDialog } from "./AddTestDialog"
import { ErrorDialog, TimerYesNoDialog, TimerYesNoDialogProps } from "@shared/dialog/DialogComponents"
import { DefaultTimerWarning } from "@shared/Globals"
import { APIError } from "@utils/ApiRequest"

type ReloadContextProps = {
    onReload: () => void
    setWarningProps: Dispatch<SetStateAction<TimerYesNoDialogProps>>
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setRows: Dispatch<SetStateAction<TestGroup[]>>
}

const ReloadContext = createContext<ReloadContextProps>(undefined!)

export const GroupTablePage = () => {

    const [rows, setRows] = useState<TestGroup[]>([])
    const [loading, setLoading] = useState(false)

    const [warningProps, setWarningProps] = useState(DefaultTimerWarning)
    const [error, setError] = useState<APIError>()

    const onReload = useCallback(() => {
        setLoading(true)
        findGroups()
            .then(response => setRows(response))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [])

    useEffect(onReload, [onReload])

    return <div className="w-full h-full flex flex-col">
        <ReloadContext.Provider value={{ onReload, setWarningProps, setError, setRows }}>
            <GroupTable {...{ loading, rows }} />
        </ReloadContext.Provider>
        <TimerYesNoDialog {...warningProps} />
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            message={error?.message}
            onClose={() => setError(undefined)}
        />
    </div>
}

type GroupTableProps = {
    loading: boolean
    rows: TestGroup[]
}

const COLUMN_COUNT = 5

const GroupTable = ({ loading, rows }: GroupTableProps) => {

    return <Table>
        <TableHead>
            <TableHeadRow>
                <TableHeadCell />
                <TableHeadCell align="center">Data de Exame</TableHeadCell>
                <TableHeadCell align="center">Nº de Animais</TableHeadCell>
                <TableHeadCell align="center">Taxa de Prenhez</TableHeadCell>
                <TableHeadCell align="center">Taxa de Natalidade</TableHeadCell>
            </TableHeadRow>
        </TableHead>
        <TableBody>
            <TablePageBody 
                colSpan={COLUMN_COUNT}
                dataset={rows}
                loading={loading}
                render={item => <GroupsRow {...item} />}
            />
        </TableBody>
    </Table>
}

const GroupsRow = (item: TestGroup) => {

    const [rowData, setRowData] = useState<TestGroup>(item)
    const [editing, setEditing] = useState(false)
    const [addTestOpen, setAddTestOpen] = useState(false)
    const [loadingControl, setLoadingControl] = useState(false)
    const { onReload, setWarningProps, setError, setRows } = useContext(ReloadContext)
    const navigate = useNavigate()

    useEffect(() => setRowData(item), [item])

    const closeAddTest = (added?: boolean) => {
        setAddTestOpen(false)
        if (added) onReload()
    }

    const onDelete = () => {
        setLoadingControl(true)
        deleteBatch(rowData.testDate)
            .then(() => {
                setError(undefined)
                setRows(prev => prev.filter(item => item.testDate != rowData.testDate))
            })
            .catch(err => setError(err))
            .finally(() => setLoadingControl(false))
    }

    if (editing) return <GroupsRowEditing {...{ rowData, setEditing, setRowData }} />

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons
                loading={loadingControl}
                otherButtons={(
                    <IconButton onClick={() => setAddTestOpen(true)}>
                        <Add />
                    </IconButton>
                )}
                onShow={() => navigate(dateToISO(item.testDate))}
                setEditing={setEditing}
                onDelete={() => setWarningProps({
                    openYesNo: true,
                    waitTime: 10,
                    title: 'ATENÇÃO: Exclusão de Grupo!',
                    message: `Ao excluir este grupo, o toque de ${rowData.animalsNumber} animais serão excluídos! Deseja continuar?`,
                    onYes: () => {
                        setWarningProps(DefaultTimerWarning)
                        onDelete()
                    },
                    onClose: () => setWarningProps(DefaultTimerWarning)
                })}
            />
        </TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.testDate)}</TableBodyCell>
        <TableBodyCell align="center">{rowData.animalsNumber}</TableBodyCell>
        <TableBodyCell align="center">
            <TrendValues
                value={percentageTransform(rowData.pregnancyRate)}
                trendProps={{ trend: rowData.pregnancyComparison }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <TrendValues
                value={percentageTransform(rowData.birthRate)}
                trendProps={{ trend: rowData.birthComparison }}
            />
        </TableBodyCell>
        <AddTestDialog {...{ addTestOpen, closeAddTest, testDate: item.testDate }} />
    </TableBodyRow>
}

type GroupsRowEditingProps = {
    rowData: TestGroup
    setRowData: (rowData: TestGroup) => void
    setEditing: (editing: boolean) => void
}

const GroupsRowEditing = ({ rowData, setRowData, setEditing }: GroupsRowEditingProps) => {

    const { control, handleSubmit } = useForm<TestGroupSave>({
        defaultValues: {
            oldTestDate: rowData.testDate
        }
    })

    const { setWarningProps, setError } = useContext(ReloadContext)
    const [loading, setLoading] = useState(false)

    const onSubmit: SubmitHandler<TestGroupSave> = useCallback((data: TestGroupSave) => {
        setWarningProps(DefaultTimerWarning)
        setLoading(true)
        if (data.testDate.getTime() == data.oldTestDate.getTime()) return
        updateBatch(data)
            .then(res => {
                setError(undefined)
                setRowData(res)
                setEditing(false)
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }, [setEditing, setError, setRowData, setWarningProps])

    const onSave = useCallback(() => {
        setWarningProps({
            openYesNo: true,
            waitTime: 10,
            title: "ATENÇÃO: Edição de Grupo",
            message: "Tem certeza que deseja editar este grupo?" +
                `\n\nIMPORTANTE: Ao confirmar, as datas de toque de ${rowData.animalsNumber} vacas serão modificadas!`,
            onYes: handleSubmit(onSubmit),
            onClose: () => {
                setWarningProps(DefaultTimerWarning)
                setEditing(false)
            }
        })
    }, [handleSubmit, onSubmit, rowData.animalsNumber, setEditing, setWarningProps])

    return <TableBodyRow>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing, loading }} />
        </TableBodyCell>
        <TableBodyCell align="center">
            <FormDatePicker formProps={{ control, name: 'testDate' }} />
        </TableBodyCell>
        <TableBodyCell align="center">{rowData.animalsNumber}</TableBodyCell>
        <TableBodyCell align="center">
            <TrendValues
                value={percentageTransform(rowData.pregnancyRate)}
                trendProps={{ trend: rowData.pregnancyComparison }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <TrendValues
                value={percentageTransform(rowData.birthRate)}
                trendProps={{ trend: rowData.birthComparison }}
            />
        </TableBodyCell>
    </TableBodyRow>
}
