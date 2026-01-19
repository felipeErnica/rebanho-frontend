import React, {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useRef,
    useState
} from "react"
import { InseminationGroup } from "./Entities"
import { deleteBatch, findGroups, updateBatch } from "./Controller"
import { IconButton, Table, TableBody, TableHead } from "@mui/material"
import {
    ResizableHeadCell,
    TableBodyCell,
    TableBodyRow,
    TableHeadCell,
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
import Add from "@mui/icons-material/Add"
import { APIError } from "@utils/ApiRequest"
import { ErrorDialog, TimerYesNoDialog, TimerYesNoDialogProps } from "@shared/dialog/DialogComponents"
import { DefaultTimerWarning } from "@shared/Globals"
import { AddInseminationDialog } from "./AddInseminationDialog"

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

const GroupsTable = ({ reload, loading, rows }: GroupsTableProps) => {

    const [unit, setUnit] = useState(0)

    const tableRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    useEffect(() => {

        const handleResize = () => {
            if (!tableRef.current) return
            setUnit(tableRef.current.offsetWidth / 100)
        }

        handleResize()

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [reload])

    return <div className="w-max min-w-full flex flex-col" ref={tableRef}>
        <Table stickyHeader>
            <TableHead>
                <TableHeadRow>
                    <TableHeadCell width={unit * 10} />
                    <ResizableHeadCell align="center" width={unit * 20}>Data de Inseminação</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={unit * 20}>Total de Animais</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={unit * 25}>Taxa de Prenhez</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={unit * 25}>Taxa de Natalidade</ResizableHeadCell>
                </TableHeadRow>
            </TableHead>
            <TableBody>
                {rows.map(item => <GroupsRow {...{ item, loading, navigate }} />)}
            </TableBody>
        </Table>
    </div>
}

type GroupsRowProps = {
    item: InseminationGroup
    loading: boolean
    navigate: ReturnType<typeof useNavigate>
}

const GroupsRow = ({ item, loading, navigate }: GroupsRowProps) => {

    const [rowData, setRowData] = useState<InseminationGroup>(item)
    const [editing, setEditing] = useState(false)
    const [loadingControls, setLoadingControls] = useState(false)

    const { 
        setWarningProps, 
        setRows, 
        setError, 
        setInseminationDate, 
        setAddInseminationOpen 
    } = useContext(EditContext)

    if (loading) return <TableLoadingRow colSpan={5} />
    if (editing) return <GroupsRowEditing {...{ setEditing, setRowData, rowData }} />

    const onDelete = () => {
        setWarningProps(DefaultTimerWarning)
        setLoadingControls(true)
        deleteBatch(rowData.inseminationDate)
            .then(() => {
                setError(undefined)
                setRows(prev => prev.filter(item => item.inseminationDate != rowData.inseminationDate))
            })
            .catch(err => setError(err))
            .finally(() => setLoadingControls(false))
    }

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons
                setEditing={setEditing}
                loading={loadingControls}
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

    const { control, handleSubmit } = useForm<InseminationGroup>({ defaultValues: rowData })
    const { setError, setWarningProps } = useContext(EditContext)
    const [loading, setLoading] = useState(false)

    const onSubmit: SubmitHandler<InseminationGroup> = (data: InseminationGroup) => {
        setWarningProps(DefaultTimerWarning)
        setLoading(true)
        updateBatch(rowData.inseminationDate, data)
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
