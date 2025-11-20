import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react"
import { TestGroup } from "./Entities"
import { findGroups, updateBatch } from "./Controller"
import Table from "@mui/material/Table"
import { IconButton, TableBody, TableHead } from "@mui/material"
import { TableBodyCell, TableBodyRow, TableHeadCell, TableHeadRow, TableLoadingRow, TrendValues } from "@/ui/shared/table/TableComponents"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { dateTransform, percentageTransform } from "@/util/Transformations"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { PageContext } from "@/ui/shared/main-page/PageContext"
import { PageProps } from "@/ui/shared/main-page/PageDisplay"
import { GroupEntriesTablePage } from "./GroupEntriesTable"
import { HomePage } from "../../home/HomePage"
import { BirthTestDashboardPage, BirthTestGroupPage } from "./BirthTestPages"
import Add from "@mui/icons-material/Add"
import { AddTestDialog } from "./AddTestDialog"
import { ErrorDialog, TimerYesNoDialog, TimerYesNoDialogProps } from "@/ui/shared/dialog/DialogComponents"
import { DefaultTimerWarning } from "@/ui/shared/Globals"
import { APIError } from "@/util/ApiRequest"

type ReloadContextProps = {
    onReload: () => void
    setWarningProps: Dispatch<SetStateAction<TimerYesNoDialogProps>>
    setError: Dispatch<SetStateAction<APIError | undefined>>
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
        <ReloadContext value={{ onReload, setWarningProps, setError }}>
            <GroupTable {...{ loading, rows }} />
        </ReloadContext>
        <TimerYesNoDialog {...warningProps} />
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            content={error?.message}
            onClose={() => setError(undefined)}
        />
    </div>
}

type GroupTableProps = {
    loading: boolean
    rows: TestGroup[]
}

const GroupTable = ({ loading, rows }: GroupTableProps) => {

    const { setPageProps } = useContext(PageContext)

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
            {rows.map(item => <GroupsRow {...{ item, loading, setPageProps }} />)}
        </TableBody>
    </Table>

}

type GroupsRowProps = {
    item: TestGroup
    loading: boolean
    setPageProps?: (pageProps: PageProps) => void
}

const GroupsRow = ({ item, loading, setPageProps }: GroupsRowProps) => {

    const [rowData, setRowData] = useState<TestGroup>(item)
    const [editing, setEditing] = useState(false)
    const [addTestOpen, setAddTestOpen] = useState(false)

    const { onReload } = useContext(ReloadContext)

    useEffect(() => setRowData(item), [item])

    const closeAddTest = (added?: boolean) => {
        setAddTestOpen(false)
        if (added) onReload()
    }

    if (loading) return <TableLoadingRow colSpan={6} />
    if (editing) return <GroupsRowEditing {...{ rowData, setEditing, setRowData }} />

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons
                otherButtons={(
                    <IconButton onClick={() => setAddTestOpen(true)}>
                        <Add />
                    </IconButton>
                )}
                onShow={() => {
                    const testDate = new Date(rowData.testDate)
                    const page: PageProps = {
                        title: `Toque - ${dateTransform(testDate)}`,
                        page: <GroupEntriesTablePage {...{ testDate }} />,
                        previousPages: [HomePage, BirthTestDashboardPage, BirthTestGroupPage]
                    }
                    if (setPageProps) setPageProps(page)
                }}
                setEditing={setEditing}
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

    const { control, handleSubmit } = useForm<TestGroup>({ defaultValues: rowData })
    const { setWarningProps, setError } = useContext(ReloadContext)

    const [loading, setLoading] = useState(false)

    const onSubmit: SubmitHandler<TestGroup> = useCallback((data: TestGroup) => {
        setWarningProps(DefaultTimerWarning)
        setLoading(true)
        updateBatch(rowData.testDate, data)
            .then(res => {
                setError(undefined)
                setRowData(res)
                setEditing(false)
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }, [rowData.testDate, setEditing, setError, setRowData, setWarningProps])

    const onSave = useCallback(() => {
        setWarningProps({
            openYesNo: true,
            waitTime: 10,
            title: "ATENÇÃO: Edição de Grupo",
            content: "Tem certeza que deseja editar este grupo?" +
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
