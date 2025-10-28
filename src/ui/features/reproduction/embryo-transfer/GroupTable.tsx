import React, { useContext, useEffect, useRef, useState } from "react"
import { TransferGroup } from "./Entities"
import { findGroups } from "./Controller"
import { Table, TableBody, TableHead } from "@mui/material"
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
import { GroupsTablePageProps, TransferMainPage } from "./EmbryoTransferPages"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { ReloadButton } from "@/ui/shared/table/TableTopBarComponents"

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

    const [rows, setRows] = useState<TransferGroup[]>([])
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
                    <ResizableHeadCell align="center" width={unit * 20}>Data de Transferência</ResizableHeadCell>
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
    item: TransferGroup
    loading: boolean
    setPageProps: ((page: PageProps) => void) | undefined
}

const GroupsRow = ({ item, loading, setPageProps }: GroupsRowProps) => {

    const [rowData, setRowData] = useState<TransferGroup>(item)
    const [editing, setEditing] = useState(false)

    if (loading) return <TableLoadingRow colSpan={5} />
    if (editing) return <GroupsRowEditing {...{ setEditing, setRowData, rowData }} />

    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons
                setEditing={setEditing}
                onShow={() => {
                    const transferDate = new Date(item.transferDate)
                    const dateString = transferDate.toLocaleDateString('pt-BR', {
                        month: 'short',
                        year: 'numeric'
                    })
                    const page: PageProps = {
                        page: <GroupEntriesTablePage {...{ transferDate }} />,
                        title: `Transferência - ${dateString}`,
                        previousPages: [HomePage, TransferMainPage, GroupsTablePageProps]
                    }
                    if (setPageProps) setPageProps(page)
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
}

const GroupsRowEditing = ({ rowData, setRowData, setEditing }: GroupsRowEditingProps) => {

    const { control, handleSubmit } = useForm<TransferGroup>({ defaultValues: rowData })
    const onSubmit: SubmitHandler<TransferGroup> = (data: TransferGroup) => {
        setRowData(data)
        setEditing(false)
    }

    return <TableBodyRow>
        <TableBodyCell>
            <EditingControlButtons {...{ setEditing, onSave: handleSubmit(onSubmit) }} />
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
