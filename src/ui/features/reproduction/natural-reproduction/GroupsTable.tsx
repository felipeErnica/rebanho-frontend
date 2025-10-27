import React, { useContext, useEffect, useRef, useState } from "react"
import { MatingGroup } from "./Entities"
import { findGroups } from "./Controller"
import { Button, Table, TableBody, TableHead } from "@mui/material"
import {
    ResizableHeadCell,
    TableBodyCell,
    TableBodyRow,
    TableHeadCell,
    TableHeadRow,
    TableLoadingRow,
    TrendValues
} from "@/ui/shared/table/TableComponents"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { PageContext } from "@/ui/shared/main-page/PageContext"
import { PageProps } from "@/ui/shared/main-page/PageDisplay"
import { dateTransform, percentageTransform } from "@/util/Transformations"
import { GroupEntriesTablePage } from "./GroupEntriesTable"
import { HomePage } from "../../home/HomePage"
import { GroupsTablePageProps, MatingMainPage } from "./NaturalMatingPages"
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

    const [rows, setRows] = useState<MatingGroup[]>([])
    const [unit, setUnit] = useState(0)

    const tableRef = useRef<HTMLDivElement>(null)
    const { setPageProps } = useContext(PageContext)

    useEffect(() => {

        const handleResize = () => {
            if (!tableRef.current) return
            setUnit(tableRef.current.offsetWidth / 100)
        }

        setLoading(true)
        findGroups()
            .then(response => setRows(response.json))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
        handleResize()

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [reload, setLoading])

    return <div className="w-max min-w-full flex flex-col" ref={tableRef}>
        <Table stickyHeader>
            <TableHead>
                <TableHeadRow>
                    <TableHeadCell width={unit * 10} />
                    <ResizableHeadCell align="center" width={unit * 20}>Data de Monta</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={unit * 20}>Total de Animais</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={unit * 25}>Taxa de Prenhez</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={unit * 25}>Taxa de Natalidade</ResizableHeadCell>
                </TableHeadRow>
            </TableHead>
            <TableBody>
                {rows.map(item => <GroupsRow {...{ item, loading, setPageProps }} />)}
            </TableBody>
        </Table>
    </div>
}

type GroupsRowProps = {
    item: MatingGroup
    loading: boolean
    setPageProps: ((page: PageProps) => void) | undefined
}

const GroupsRow = ({ item, loading, setPageProps }: GroupsRowProps) => {

    const [rowData, setRowData] = useState<MatingGroup>(item)
    const [editing, setEditing] = useState(false)

    if (loading) return <TableLoadingRow colSpan={5} />
    if (editing) return <GroupsRowEditing {...{ setEditing, setRowData, rowData }} />

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons
                setEditing={setEditing}
                onShow={() => {
                    const matingDate = new Date(item.matingDate)
                    const dateString = matingDate.toLocaleDateString('pt-BR', {
                        month: 'short',
                        year: 'numeric'
                    })
                    const page: PageProps = {
                        page: <GroupEntriesTablePage {...{ matingDate }} />,
                        title: `Monta - ${dateString}`,
                        previousPages: [HomePage, MatingMainPage, GroupsTablePageProps]
                    }
                    if (setPageProps) setPageProps(page)
                }}
            />
        </TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.matingDate)}</TableBodyCell>
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
    rowData: MatingGroup
    setRowData: (rowData: MatingGroup) => void
    setEditing: (editing: boolean) => void
}

const GroupsRowEditing = ({ rowData, setRowData, setEditing }: GroupsRowEditingProps) => {

    const { control, handleSubmit } = useForm<MatingGroup>({ defaultValues: rowData })
    const onSubmit: SubmitHandler<MatingGroup> = (data: MatingGroup) => {
        setRowData(data)
        setEditing(false)
    }

    return <TableBodyRow>
        <TableBodyCell>
            <EditingControlButtons {...{ setEditing, onSave: handleSubmit(onSubmit) }} />
        </TableBodyCell>
        <TableBodyCell>
            <FormDatePicker
                formProps={{
                    control,
                    name: 'matingDate'
                }}
            />
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
