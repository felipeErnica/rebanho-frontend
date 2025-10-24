import { useCallback, useContext, useEffect, useState } from "react"
import { TestGroup } from "./Entities"
import { findGroups } from "./Controller"
import Table from "@mui/material/Table"
import { IconButton, TableBody, TableHead } from "@mui/material"
import { TableBodyCell, TableBodyRow, TableHeadCell, TableHeadRow, TableLoadingRow, TrendValues } from "@/ui/shared/table/TableComponents"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { dateTransform, percentageTransform } from "@/util/Transformations"
import { TrendComponent } from "@/ui/shared/dashboard/DashboardComponents"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { PageContext } from "@/ui/shared/main-page/PageContext"
import { PageProps } from "@/ui/shared/main-page/PageDisplay"
import { GroupEntriesTablePage } from "./GroupEntriesTable"
import { HomePage } from "../../home/HomePage"
import { BirthTestDashboardPage, BirthTestGroupPage } from "./BirthTestPages"
import Add from "@mui/icons-material/Add"
import { AddTestDialog } from "./AddTestDialog"

export const GroupTablePage = () => {

    const [rows, setRows] = useState<TestGroup[]>([])
    const [loading, setLoading] = useState(false)

    const onReload = useCallback(() => {
        setLoading(true)
        findGroups()
            .then(response => setRows(response.json))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [])

    useEffect(onReload, [onReload])

    return <div className="w-full h-full flex flex-col">
        <GroupTable {...{ loading, rows }} />
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
                <TableHeadCell>Data de Exame</TableHeadCell>
                <TableHeadCell>Nº de Animais</TableHeadCell>
                <TableHeadCell>Taxa de Prenhez</TableHeadCell>
                <TableHeadCell>Taxa de Natalidade</TableHeadCell>
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

    useEffect(() => setRowData(item), [item])

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
                        title: `Toque - Dia ${dateTransform(testDate)}`,
                        page: <GroupEntriesTablePage {...{ testDate }} />,
                        previousPages: [HomePage, BirthTestDashboardPage, BirthTestGroupPage]
                    }
                    if (setPageProps) setPageProps(page)
                }}
                setEditing={setEditing}
            />
        </TableBodyCell>
        <TableBodyCell>{dateTransform(rowData.testDate)}</TableBodyCell>
        <TableBodyCell align="center">{rowData.animalsNumber}</TableBodyCell>
        <TableBodyCell>
            <TrendValues
                value={percentageTransform(rowData.pregnancyRate)}
                trendProps={{ trend: rowData.pregnancyComparison }}
            />
        </TableBodyCell>
        <TableBodyCell>
            <TrendValues
                value={percentageTransform(rowData.birthRate)}
                trendProps={{ trend: rowData.birthComparison }}
            />
        </TableBodyCell>
        <AddTestDialog {...{ addTestOpen, setAddTestOpen, testDate: item.testDate }} />
    </TableBodyRow>
}

type GroupsRowEditingProps = {
    rowData: TestGroup
    setRowData: (rowData: TestGroup) => void
    setEditing: (editing: boolean) => void
}

const GroupsRowEditing = ({ rowData, setRowData, setEditing }: GroupsRowEditingProps) => {

    const { control, handleSubmit } = useForm<TestGroup>({ defaultValues: rowData })

    const onSubmit: SubmitHandler<TestGroup> = (data: TestGroup) => {
        setRowData(data)
        setEditing(false)
    }

    const onSave = handleSubmit(onSubmit)

    return <TableBodyRow>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing }} />
        </TableBodyCell>
        <TableBodyCell>
            <FormDatePicker
                formProps={{
                    control,
                    name: 'testDate'
                }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">{rowData.animalsNumber}</TableBodyCell>
        <TableBodyCell>
            {rowData.pregnancyRate}
            <TrendComponent trend={rowData.pregnancyComparison} />
        </TableBodyCell>
        <TableBodyCell>
            {rowData.birthRate}
            <TrendComponent trend={rowData.birthComparison} />
        </TableBodyCell>
    </TableBodyRow>
}
