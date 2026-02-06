import React, {
    createContext,
    Dispatch,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react"
import { InseminationGroup, InseminationGroupDelete, InseminationGroupSave } from "./Entities"
import { deleteBatch, findGroups, updateBatch } from "./Service"
import { IconButton, Table, TableBody, TableHead } from "@mui/material"
import {
    ResizableHeadCell,
    TableBodyCell,
    TableBodyRow,
    TableHeadControlCell,
    TableHeadRow,
    TablePageBody,
    TrendValues
} from "@shared/table/TableComponents"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { dateTransform, percentageTransform } from "@utils/Transformations"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { ReloadButton } from "@shared/table/TableTopBarComponents"
import Add from "@mui/icons-material/Add"
import { APIError } from "@utils/ApiRequest"
import { ErrorDialog, TimerYesNoDialog, TimerYesNoDialogProps } from "@shared/dialog/DialogComponents"
import { DefaultTimerWarning, ERROR_TYPE } from "@shared/Globals"
import { AddInseminationDialog } from "./AddInseminationDialog"
import { useNavigate } from "react-router"

type EditContextProps = {
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setWarningProps: Dispatch<SetStateAction<TimerYesNoDialogProps>>
    setRows: Dispatch<SetStateAction<InseminationGroup[]>>
    setAddInseminationOpen: Dispatch<SetStateAction<boolean>>
    setInseminationDate: Dispatch<SetStateAction<Date | undefined>>
}

const EditContext = createContext<EditContextProps>(undefined!)

export const GroupsTablePage = () => {

    const [rows, setRows] = useState<InseminationGroup[]>([])
    const [loading, setLoading] = useState(false)
    const [reload, setReload] = useState(0)
    const [error, setError] = useState<APIError>()
    const [warningProps, setWarningProps] = useState(DefaultTimerWarning)

    const [addInseminationOpen, setAddInseminationOpen] = useState(false)
    const [inseminationDate, setInseminationDate] = useState<Date>()

    const closeAddInsemination = (added?: boolean) => {
        setAddInseminationOpen(false)
        if (added) setReload(prev => prev + 1)
    }

    useEffect(() => {
        setLoading(true)
        findGroups()
            .then(response => setRows(response))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [reload])

    return <div className="w-full h-full flex flex-col">
        <GroupsToolBar {...{ setReload, loading }} />
        <EditContext.Provider value={{
            setError,
            setWarningProps,
            setRows,
            setAddInseminationOpen,
            setInseminationDate
        }}>
            <GroupsTable {...{ reload, loading, rows }} />
        </EditContext.Provider>
        <TimerYesNoDialog {...warningProps} />
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            message={error?.message}
            onClose={() => setError(undefined)}
        />
        <AddInseminationDialog {...{ addInseminationOpen, inseminationDate, closeAddInsemination }} />
    </div>
}

type GroupsToolBarProps = {
    loading: boolean
    setReload: React.Dispatch<React.SetStateAction<number>>
}

const GroupsToolBar = ({ setReload, loading }: GroupsToolBarProps) => {
    return <div className="flex flex-row p-4">
        <ReloadButton
            loading={loading}
            onReload={() => setReload(prev => prev + 1)}
            variant="text"
        />
    </div>
}

type GroupsTableProps = {
    loading: boolean
    reload: number
    rows: InseminationGroup[]
}

const COLUMN_COUNT = 5

const GroupsTable = ({ loading, rows }: GroupsTableProps) => {

    return <div className="w-max min-w-full flex flex-col">
        <Table stickyHeader>
            <TableHead>
                <TableHeadRow>
                    <TableHeadControlCell />
                    <ResizableHeadCell align="center" width={150}>Data de Inseminação</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={150}>Total de Animais</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={150}>Taxa de Prenhez</ResizableHeadCell>
                    <ResizableHeadCell align="center">Taxa de Natalidade</ResizableHeadCell>
                </TableHeadRow>
            </TableHead>
            <TableBody>
                <TablePageBody
                    dataset={rows}
                    colSpan={COLUMN_COUNT}
                    loading={loading}
                    render={item => <GroupsRow {...{ item }} />}
                />
            </TableBody>
        </Table>
    </div>
}

type GroupsRowProps = {
    item: InseminationGroup
}

const GroupsRow = ({ item }: GroupsRowProps) => {

    const [rowData, setRowData] = useState<InseminationGroup>(item)
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [params, setParams] = useState<InseminationGroupDelete>({
        inseminationDate: item.inseminationDate,
        changeFather: false
    })

    const navigate = useNavigate()

    const {
        setWarningProps,
        setRows,
        setError,
        setInseminationDate,
        setAddInseminationOpen
    } = useContext(EditContext)

    if (editing) return <GroupsRowEditing {...{ setEditing, setRowData, rowData }} />

    const onDelete = useCallback(() => {
        setWarningProps(DefaultTimerWarning)
        setLoading(true)
        deleteBatch(params)
            .then(() => {
                setError(undefined)
                setRows(prev => prev.filter(item => item.inseminationDate != params.inseminationDate))
            })
            .catch((err: APIError) => {
                if (err.errType == ERROR_TYPE) {
                    setError(err)
                    return
                }

                setWarningProps({
                    waitTime: 5,
                    openYesNo: true,
                    title: err.title,
                    message: err.message,
                    onClose: () => setWarningProps(DefaultTimerWarning),
                    onYes: () => {
                        setParams(params => ({ ...params, changeFather: true }))
                        onDelete()
                    }
                })

            })
            .finally(() => setLoading(false))
    }, [params])

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons
                setEditing={setEditing}
                loading={loading}
                onDelete={() => {
                    setWarningProps({
                        openYesNo: true,
                        waitTime: 10,
                        title: "ATENÇÃO: Exclusão em grupo!",
                        message: `Ao continuar, os registros de inseminação de ${rowData.cowNumber} vacas serão excluídos. ` +
                            "Tem certeza que deseja continuar?" +
                            "\n\nIMPORTANTE: Ao continuar, todos os bezerros ligados a estes registros de inseminação trocarão de " +
                            "pai!",
                        onYes: onDelete,
                        onClose: () => setWarningProps(DefaultTimerWarning)
                    })
                }}
                otherButtons={(
                    <IconButton
                        onClick={() => {
                            setInseminationDate(new Date(rowData.inseminationDate))
                            setAddInseminationOpen(true)
                        }}
                    >
                        <Add />
                    </IconButton>
                )}
                onShow={() => {
                    const inseminationDate = new Date(item.inseminationDate)
                    const dateStr = inseminationDate.toISOString().split('T')[0]
                    navigate(`groups/${dateStr}`)
                }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.inseminationDate)}</TableBodyCell>
        <TableBodyCell align="center">{rowData.cowNumber}</TableBodyCell>
        <TableBodyCell align="center">
            <TrendValues
                value={percentageTransform(rowData.pregnancyRate)}
                trendProps={{ trend: rowData.pregnancyComparisonRate }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <TrendValues
                value={percentageTransform(rowData.birthRate)}
                trendProps={{ trend: rowData.birthComparisonRate }}
            />
        </TableBodyCell>
    </TableBodyRow>
}

type GroupsRowEditingProps = {
    rowData: InseminationGroup
    setRowData: (rowData: InseminationGroup) => void
    setEditing: (editing: boolean) => void
}

const GroupsRowEditing = ({ rowData, setRowData, setEditing }: GroupsRowEditingProps) => {

    const { control, handleSubmit } = useForm<InseminationGroupSave>({
        defaultValues: {
            ...rowData,
            oldInseminationDate: rowData.inseminationDate
        }
    })
    const { setError, setWarningProps } = useContext(EditContext)
    const [loading, setLoading] = useState(false)

    const onSubmit: SubmitHandler<InseminationGroupSave> = (data: InseminationGroupSave) => {
        setWarningProps(DefaultTimerWarning)
        setLoading(true)
        updateBatch(data)
            .then(res => {
                setRowData(res)
                setError(undefined)
                setEditing(false)
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }

    const onSave = () => {
        setWarningProps({
            openYesNo: true,
            waitTime: 10,
            title: "ATENÇÃO: Edição de grupo!",
            message: `Ao continuar, a data de inseminação de ${rowData.cowNumber} vacas será modificada. ` +
                "Tem certeza que deseja continuar?",
            onYes: handleSubmit(onSubmit),
            onClose: () => setWarningProps(DefaultTimerWarning)
        })
    }

    return <TableBodyRow>
        <TableBodyCell>
            <EditingControlButtons {...{ setEditing, loading, onSave }} />
        </TableBodyCell>
        <TableBodyCell>
            <FormDatePicker formProps={{ control, name: 'inseminationDate' }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.cowNumber}</TableBodyCell>
        <TableBodyCell align="center">
            <TrendValues
                value={percentageTransform(rowData.pregnancyRate)}
                trendProps={{ trend: rowData.pregnancyComparisonRate }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <TrendValues
                value={percentageTransform(rowData.birthRate)}
                trendProps={{ trend: rowData.birthComparisonRate }}
            />
        </TableBodyCell>
    </TableBodyRow>
}
