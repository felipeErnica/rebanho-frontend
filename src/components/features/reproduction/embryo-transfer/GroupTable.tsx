import { Dispatch, SetStateAction, useCallback, useContext, useRef, useState } from "react"
import { TransferGroup } from "./Entities"
import { deleteGroup, findGroups, updateGroup } from "./Controller"
import { IconButton, Table, TableBody, TableHead } from "@mui/material"
import {
    ResizableHeadCell,
    TableBodyCell,
    TableBodyRow,
    TableHeadControlCell,
    TableHeadRow,
    TableLoadingRow,
    TrendValues
} from "@shared/table/TableComponents"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { useNavigate } from "react-router"
import { dateTransform, percentageTransform } from "@utils/Transformations"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { ReloadButton } from "@shared/table/TableTopBarComponents"
import { DefaultTimerWarning, GROUP_DELETE_TITLE, GROUP_UPDATE_TITLE } from "@shared/Globals"
import { ErrorDialog, TimerYesNoDialog, TimerYesNoDialogProps } from "@shared/dialog/DialogComponents"
import { APIError } from "@utils/ApiRequest"
import Add from "@mui/icons-material/Add"
import { AddTransferDialog } from "./AddTransferDialog"

export const GroupsTablePage = () => {

    const [loading, setLoading] = useState(false)
    const [reload, setReload] = useState(0)

    return <div className="w-full h-full flex flex-col">
        <GroupsToolBar {...{ setReload, loading }} />
        <GroupsTable {...{ reload, loading, setLoading }} />
    </div>
}

type GroupsToolBarProps = {
    loading: boolean
    setReload: React.Dispatch<SetStateAction<number>>
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
    setLoading: (loading: boolean) => void
}

const GroupsTable = ({ loading, setLoading }: GroupsTableProps) => {

    const [rows, setRows] = useState<TransferGroup[]>([])
    const [warningProps, setWarningProps] = useState(DefaultTimerWarning)
    const [error, setError] = useState<APIError>()

    const [addTransferOpen, setAddTransferOpen] = useState(false)
    const [transferDate, setTransferDate] = useState<Date>()

    const tableRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    const onReload = useCallback(() => {
        setLoading(true)
        findGroups()
            .then(response => setRows(response))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [setLoading])

    const closeAddTransfer = (added?: boolean) => {
        if (added) onReload()
        setAddTransferOpen(false)
        setTransferDate(undefined)
    }

    const openAddTransfer = (date: Date) => {
        setTransferDate(new Date(date))
        setAddTransferOpen(true)
    }

    return <div className="w-max min-w-full flex flex-col" ref={tableRef}>
        <Table stickyHeader>
            <TableHead>
                <TableHeadRow>
                    <TableHeadControlCell />
                    <ResizableHeadCell align="center" width={300}>Data de Transferência</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={150}>Total de Animais</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={150}>Taxa de Prenhez</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={150}>Taxa de Natalidade</ResizableHeadCell>
                </TableHeadRow>
            </TableHead>
            <TableBody>
                {rows.map(item => (
                    <GroupsRow {...{
                        item,
                        loading,
                        navigate,
                        setWarningProps,
                        setRows,
                        setError,
                        openAddTransfer
                    }}
                    />
                ))}
            </TableBody>
        </Table>
        <TimerYesNoDialog {...warningProps} />
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            onClose={() => setError(undefined)}
            content={error?.message}
        />
        <AddTransferDialog {...{ closeAddTransfer, addTransferOpen, transferDate }} />
    </div>
}

type GroupsRowProps = {
    item: TransferGroup
    loading: boolean
    navigate: ReturnType<typeof useNavigate>
    setRows: Dispatch<SetStateAction<TransferGroup[]>>
    setWarningProps: Dispatch<SetStateAction<TimerYesNoDialogProps>>
    setError: Dispatch<SetStateAction<APIError | undefined>>
    openAddTransfer: (date: Date) => void
}

const GroupsRow = ({
    item,
    loading,
    navigate,
    setError,
    setWarningProps,
    setRows,
    openAddTransfer
}: GroupsRowProps) => {

    const [rowData, setRowData] = useState<TransferGroup>(item)
    const [editing, setEditing] = useState(false)
    const [loadingControls, setLoadingControls] = useState(false)

    if (loading) return <TableLoadingRow colSpan={5} />
    if (editing) return <GroupsRowEditing {...{ setEditing, setRowData, rowData, setWarningProps, setError }} />

    const onDelete = () => {
        setLoadingControls(true)
        deleteGroup(rowData.transferDate)
            .then(() => {
                setError(undefined)
                setWarningProps(DefaultTimerWarning)
                setRows(prev => prev.filter(item => item.transferDate != rowData.transferDate))
            })
            .catch(err => setError(err))
            .finally(() => setLoadingControls(false))
    }

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons
                setEditing={setEditing}
                onDelete={() => {
                    setWarningProps({
                        openYesNo: true,
                        waitTime: 10,
                        onYes: onDelete,
                        title: GROUP_DELETE_TITLE,
                        content: `Ao continuar, o registro de ${rowData.cowNumber} transferências serão apagados! ` +
                            "Deseja continuar?" +
                            "\n\nOBS.: As parições relacionadas a estas transferências permanecerão, mude os pais por conta própria!",
                        onClose: () => setWarningProps(DefaultTimerWarning),
                    })
                }}
                otherButtons={(
                    <IconButton
                        onClick={() => openAddTransfer(rowData.transferDate)}
                    >
                        <Add />
                    </IconButton>
                )}
                loading={loadingControls}
                onShow={() => {
                    const transferDate = new Date(item.transferDate)
                    const dateStr = transferDate.toISOString().split('T')[0]
                    navigate(`groups/${dateStr}`)
                }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.transferDate)}</TableBodyCell>
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
    rowData: TransferGroup
    setRowData: (rowData: TransferGroup) => void
    setEditing: (editing: boolean) => void
    setWarningProps: Dispatch<SetStateAction<TimerYesNoDialogProps>>
    setError: Dispatch<SetStateAction<APIError | undefined>>
}

const GroupsRowEditing = ({ rowData, setRowData, setEditing, setWarningProps, setError }: GroupsRowEditingProps) => {

    const [loading, setLoading] = useState(false)

    const { control, handleSubmit } = useForm<TransferGroup>({ defaultValues: rowData })

    const onSubmit: SubmitHandler<TransferGroup> = (data: TransferGroup) => {
        setLoading(true)
        updateGroup(rowData.transferDate, data)
            .then(response => {
                setError(undefined)
                setWarningProps(DefaultTimerWarning)
                setRowData(response)
                setEditing(false)
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }

    const onSave = () => {
        setWarningProps({
            openYesNo: true,
            waitTime: 10,
            title: GROUP_UPDATE_TITLE,
            content: `Ao continuar, o registro de ${rowData.cowNumber} transferências terão as datas modificadas! ` +
                "Deseja continuar?" +
                "\n\nOBS.: A alteração de data pode causar uma mudança na taxa de prenhez e nascimento!",
            onYes: handleSubmit(onSubmit),
            onClose: () => setWarningProps(DefaultTimerWarning)
        })
    }

    return <TableBodyRow>
        <TableBodyCell>
            <EditingControlButtons {...{ setEditing, onSave, loading }} />
        </TableBodyCell>
        <TableBodyCell>
            <FormDatePicker formProps={{ control, name: 'transferDate' }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.cowNumber}</TableBodyCell>
        <TableBodyCell align="center">
            <TrendValues
                value={rowData.pregnancyRate}
                trendProps={{ trend: rowData.pregnancyComparisonRate }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <TrendValues
                value={rowData.birthRate}
                trendProps={{ trend: rowData.birthComparisonRate }}
            />
        </TableBodyCell>
    </TableBodyRow>
}
