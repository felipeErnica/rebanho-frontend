import React, { 
    createContext, 
    Dispatch, 
    SetStateAction, 
    useCallback, 
    useContext, 
    useEffect, 
    useRef, 
    useState 
} from "react"
import { BreedingGroup } from "./Entities"
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
import { PageContext } from "@shared/main-page/PageContext"
import { PageProps } from "@shared/main-page/PageDisplay"
import { dateTransform, percentageTransform } from "@utils/Transformations"
import { GroupEntriesTablePage } from "./GroupEntriesTable"
import { HomePage } from "@features/home/HomePage"
import { GroupsTablePageProps, BreedingMainPage } from "./BreedingPages"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { ReloadButton } from "@shared/table/TableTopBarComponents"
import { APIError } from "@utils/ApiRequest"
import { ErrorDialog, TimerYesNoDialog, TimerYesNoDialogProps } from "@shared/dialog/DialogComponents"
import { DefaultTimerWarning } from "@shared/Globals"
import Add from "@mui/icons-material/Add"
import { AddBreedingDialog } from "./AddBreedingDialog"

type EditContextProps = {
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setWarningProps: Dispatch<SetStateAction<TimerYesNoDialogProps>>
    setRows: Dispatch<SetStateAction<BreedingGroup[]>>
    setAddBreedingOpen: Dispatch<SetStateAction<boolean>>
    setBreedingDate: Dispatch<SetStateAction<Date | undefined>>
}

const EditContext = createContext<EditContextProps>(undefined!)

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
    setLoading: (loading: boolean) => void
    reload: number
}

const GroupsTable = ({ reload, loading, setLoading }: GroupsTableProps) => {

    const [rows, setRows] = useState<BreedingGroup[]>([])
    const [unit, setUnit] = useState(0)

    const [error, setError] = useState<APIError>()
    const [warningProps, setWarningProps] = useState(DefaultTimerWarning)

    const [addBreedingOpen, setAddBreedingOpen] = useState(false)
    const [breedingDate, setBreedingDate] = useState<Date>()

    const tableRef = useRef<HTMLDivElement>(null)
    const { setPageProps } = useContext(PageContext)

    const loadRows = useCallback(() => {
        setLoading(true)
        findGroups()
            .then(response => setRows(response))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [setLoading])

    const closeAddBreeding = useCallback((added?: boolean) => {
        if (added) loadRows()
        setBreedingDate(undefined)
        setAddBreedingOpen(false)
    }, [loadRows])

    useEffect(() => {
        const handleResize = () => {
            if (!tableRef.current) return
            setUnit(tableRef.current.offsetWidth / 100)
        }
        loadRows()
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [loadRows, reload, setLoading])

    return <div className="w-max min-w-full flex flex-col" ref={tableRef}>
        <EditContext.Provider value={{ setError, setWarningProps, setBreedingDate, setAddBreedingOpen, setRows }}>
            <Table stickyHeader>
                <TableHead>
                    <TableHeadRow>
                        <TableHeadCell width={unit * 10} />
                        <ResizableHeadCell align="center" width={unit * 20}>Data de Cobertura</ResizableHeadCell>
                        <ResizableHeadCell align="center" width={unit * 20}>Total de Animais</ResizableHeadCell>
                        <ResizableHeadCell align="center" width={unit * 25}>Taxa de Prenhez</ResizableHeadCell>
                        <ResizableHeadCell align="center" width={unit * 25}>Taxa de Natalidade</ResizableHeadCell>
                    </TableHeadRow>
                </TableHead>
                <TableBody>
                    {rows.map(item => <GroupsRow {...{ item, loading, setPageProps }} />)}
                </TableBody>
            </Table>
        </EditContext.Provider>
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            content={error?.message}
            onClose={() => setError(undefined)}
        />
        <TimerYesNoDialog {...warningProps} />
        <AddBreedingDialog {...{ closeAddBreeding, addBreedingOpen, breedingDate }} />
    </div>
}

type GroupsRowProps = {
    item: BreedingGroup
    loading: boolean
    setPageProps: ((page: PageProps) => void) | undefined
}

const GroupsRow = ({ item, loading, setPageProps }: GroupsRowProps) => {

    const [rowData, setRowData] = useState<BreedingGroup>(item)
    const [editing, setEditing] = useState(false)
    const [loadingControls, setLoadingControls] = useState(false)

    const {
        setWarningProps,
        setRows,
        setError,
        setAddBreedingOpen,
        setBreedingDate
    } = useContext(EditContext)

    if (loading) return <TableLoadingRow colSpan={5} />
    if (editing) return <GroupsRowEditing {...{ setEditing, setRowData, rowData }} />

    const onDelete = () => {
        setWarningProps(DefaultTimerWarning)
        setLoadingControls(true)
        deleteBatch(rowData.breedingDate)
            .then(() => {
                setError(undefined)
                setRows(prev => prev.filter(item => item.breedingDate != rowData.breedingDate))
            })
            .catch(err => setError(err))
            .finally(() => setLoadingControls(false))
    }

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons
                loading={loadingControls}
                setEditing={setEditing}
                otherButtons={(
                    <IconButton
                        onClick={() => {
                            setBreedingDate(new Date(rowData.breedingDate))
                            setAddBreedingOpen(true)
                        }}
                    >
                        <Add />
                    </IconButton>
                )}
                onDelete={() => setWarningProps({
                    openYesNo: true,
                    waitTime: 10,
                    title: "ATENÇÃO: Exclusão Data de Cobertura!",
                    content: `Ao continuar, o registro de ${rowData.cowNumber} coberturas será excluído! ` +
                        "Deseja proceder mesmo assim?",
                    onClose: () => setWarningProps(DefaultTimerWarning),
                    onYes: onDelete
                })}
                onShow={() => {
                    const breedingDate = new Date(item.breedingDate)
                    const dateString = breedingDate.toLocaleDateString('pt-BR', {
                        month: 'short',
                        year: 'numeric'
                    })
                    const page: PageProps = {
                        page: <GroupEntriesTablePage {...{ breedingDate }} />,
                        title: `Cobertura - ${dateString}`,
                        previousPages: [HomePage, BreedingMainPage, GroupsTablePageProps]
                    }
                    if (setPageProps) setPageProps(page)
                }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.breedingDate)}</TableBodyCell>
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
    rowData: BreedingGroup
    setRowData: (rowData: BreedingGroup) => void
    setEditing: (editing: boolean) => void
}

const GroupsRowEditing = ({ rowData, setRowData, setEditing }: GroupsRowEditingProps) => {

    const { control, handleSubmit } = useForm<BreedingGroup>({ defaultValues: rowData })
    const { setError, setWarningProps } = useContext(EditContext)
    const [loading, setLoading] = useState(false)

    const onSubmit: SubmitHandler<BreedingGroup> = (data: BreedingGroup) => {
        setWarningProps(DefaultTimerWarning)
        setLoading(true)
        updateBatch(rowData.breedingDate, data)
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
            content: `Ao continuar, o registro de ${rowData.cowNumber} coberturas será modificado. ` +
                "Tem certeza que deseja continuar?",
            onYes: handleSubmit(onSubmit),
            onClose: () => setWarningProps(DefaultTimerWarning)
        })
    }

    return <TableBodyRow>
        <TableBodyCell>
            <EditingControlButtons {...{ setEditing, onSave, loading }} />
        </TableBodyCell>
        <TableBodyCell>
            <FormDatePicker formProps={{ control, name: 'breedingDate' }} />
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
