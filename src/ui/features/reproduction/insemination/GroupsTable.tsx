import React, { useContext, useEffect, useRef, useState } from "react"
import { GroupFooter, InseminationGroup } from "./Entities"
import { findGroups, getGroupsFooter } from "./Controller"
import { Button, Table, TableBody, TableHead } from "@mui/material"
import { 
    FooterContent, 
    ResizableHeadCell, 
    StickyTableFooter, 
    TableBodyCell, 
    TableBodyRow, 
    TableFooterCell, 
    TableFooterRow, 
    TableHeadCell, 
    TableHeadRow, 
    TableLoadingRow 
} from "@/ui/shared/table/TableComponents"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { PageContext } from "@/ui/shared/main-page/PageContext"
import { PageProps } from "@/ui/shared/main-page/PageDisplay"
import { dateTransformToLocale, percentageTransform } from "@/util/Transformations"
import { GroupEntriesTablePage } from "./GroupEntriesTable"
import { HomePage } from "../../home/HomePage"
import { GroupsTablePageProps, InseminationPage } from "./InseminationPages"
import { TrendComponent } from "@/ui/shared/dashboard/DashboardComponents"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { ReloadButton } from "@/ui/shared/table/TableTopBarComponents"
import Add from "@mui/icons-material/Add"

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
        <Button
            className="ml-auto"
            startIcon={<Add />}
        >
            Adicionar Grupo
        </Button>
    </div>
}

type GroupsTableProps = {
    loading: boolean
    setLoading: (loading: boolean) => void
    reload: number
}

const GroupsTable = ({ reload, loading, setLoading }: GroupsTableProps) => {

    const [foot, setFoot] = useState<GroupFooter>({ totals: 0, averageBirthRate: 0 })
    const [rows, setRows] = useState<InseminationGroup[]>([])
    const [unit, setUnit] = useState(0)
    const tableRef = useRef<HTMLDivElement>(null)
    const { setPageProps } = useContext(PageContext)

    useEffect(() => {

        const handleResize = () => {
            if (!tableRef.current) return
            setUnit(tableRef.current.offsetWidth / 100)
        }

        setLoading(true)
        getGroupsFooter()
            .then(response => setFoot(response.json))
            .catch(() => setFoot({totals: 0, averageBirthRate: 0}))
        findGroups()
            .then(response => setRows(response.json))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [reload, setLoading])

    return <div className="w-max min-w-full" ref={tableRef}>
        <Table stickyHeader>
            <TableHead>
                <TableHeadRow>
                    <TableHeadCell width={unit * 10} />
                    <ResizableHeadCell width={unit * 30}>Touro</ResizableHeadCell>
                    <ResizableHeadCell width={unit * 15}>Data de Inseminação</ResizableHeadCell>
                    <ResizableHeadCell width={unit * 15}>Total de Animais</ResizableHeadCell>
                    <ResizableHeadCell width={unit * 15}>Taxa de Natalidade</ResizableHeadCell>
                    <ResizableHeadCell width={unit * 15}>Comparação com Média</ResizableHeadCell>
                </TableHeadRow>
            </TableHead>
            <TableBody>
                {rows.map(item => <GroupsRow {...{ item, loading, setPageProps }} />)}
            </TableBody>
            <StickyTableFooter>
                <TableFooterRow>
                    <TableFooterCell colSpan={4}>
                        <FooterContent title="Total" content={foot.totals} />
                    </TableFooterCell>
                    <TableFooterCell colSpan={2}>
                        <FooterContent title="Natalidade Média" content={percentageTransform(foot.averageBirthRate)} />
                    </TableFooterCell>
                </TableFooterRow>
            </StickyTableFooter>
        </Table>
    </div>
}

type GroupsRowProps = {
    item: InseminationGroup
    loading: boolean
    setPageProps: ((page: PageProps) => void) | undefined
}

const GroupsRow = ({ item, loading, setPageProps }: GroupsRowProps) => {

    const [rowData, setRowData] = useState<InseminationGroup>(item)
    const [editing, setEditing] = useState(false)

    if (loading) return <TableLoadingRow colSpan={6} />
    if (editing) return <GroupsRowEditing {...{ setEditing, setRowData, rowData }} />

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons
                setEditing={setEditing}
                onShow={() => {
                    const date = dateTransformToLocale(rowData.inseminationDate.toString())
                    const page: PageProps = {
                        page: <GroupEntriesTablePage {...{ groupId: rowData.id }} />,
                        title: `Inseminações - ${rowData.bullName} - ${date}`,
                        previousPages: [HomePage, InseminationPage, GroupsTablePageProps]
                    }
                    if (setPageProps) setPageProps(page)
                }}
            />
        </TableBodyCell>
        <TableBodyCell>{rowData.bullName}</TableBodyCell>
        <TableBodyCell align="center">{dateTransformToLocale(rowData.inseminationDate.toString())}</TableBodyCell>
        <TableBodyCell align="center">{rowData.cowNumber}</TableBodyCell>
        <TableBodyCell align="center">{percentageTransform(rowData.birthRate)}</TableBodyCell>
        <TableBodyCell>
            <TrendComponent trend={rowData.comparisonRate} />
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
    const onSubmit: SubmitHandler<InseminationGroup> = (data: InseminationGroup) => {
        setRowData(data)
        setEditing(false)
    }

    return <TableBodyRow>
        <TableBodyCell>
            <EditingControlButtons {...{ setEditing, onSave: handleSubmit(onSubmit) }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.bullName}</TableBodyCell>
        <TableBodyCell>
            <FormDatePicker
                formProps={{
                    control,
                    name: 'inseminationDate'
                }}
            />
        </TableBodyCell>
        <TableBodyCell>{rowData.cowNumber}</TableBodyCell>
        <TableBodyCell>{percentageTransform(rowData.birthRate)}</TableBodyCell>
        <TableBodyCell>
            <TrendComponent trend={rowData.comparisonRate} />
        </TableBodyCell>
    </TableBodyRow>
}
