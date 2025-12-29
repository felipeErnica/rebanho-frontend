import {
    TableBodyCell,
    TableBodyContainer,
    TableBodyRow,
    TableHeadCell,
    TableHeadControlCell,
    TablePageContainer,
    TrendValues
} from "@shared/table/TableComponents"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import { SlaughterGroup } from "./Entities"
import { useCallback, useContext, useEffect, useState } from "react"
import { findGroups } from "./Controller"
import { PageContext } from "@shared/main-page/PageContext"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableBody from "@mui/material/TableBody"
import { EditControlButtons } from "@shared/table/ControlButtons"
import { dateTransform, decimalTransform } from "@utils/Transformations"
import { HomePage } from "../home/HomePage"
import { SlaughterGroupsPage, SlaughterMainPage } from "./SlaughterPages"
import { AppRoute } from "@shared/main-page/PageDisplay"
import { SlaughterGroupEntriesTable } from "./SlaughterGroupEntriesTable"

export const SlaughterGroupsTable = () => {

    const [rows, setRows] = useState<SlaughterGroup[]>([])
    const [loading, setLoading] = useState(false)
    const [order, setOrder] = useState('desc')

    const onReload = useCallback(() => {
        setLoading(true)
        findGroups(order)
            .then(results => setRows(results))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [order])

    useEffect(onReload, [onReload])

    return <TablePageContainer>
        <TableTopBar
            reloadProps={{ onReload }}
            orderProps={{ setOrder, order }}
        />
        <GroupTable {...{ rows, loading }} />
    </TablePageContainer>
}

type GroupTableProps = {
    loading: boolean
    rows: SlaughterGroup[]
}

const GroupTable = ({ rows, loading }: GroupTableProps) => {

    const { setPageProps } = useContext(PageContext)

    return <div className="overflow-auto">
        <Table stickyHeader>
            <TableHead>
                <TableRow>
                    <TableHeadControlCell />
                    <TableHeadCell>Data</TableHeadCell>
                    <TableHeadCell width={300}>Frigorífico</TableHeadCell>
                    <TableHeadCell align="center" width={280}>Nº de Animais</TableHeadCell>
                    <TableHeadCell align="center" width={280}>Peso</TableHeadCell>
                    <TableHeadCell align="center" width={280}>Peso de Abate</TableHeadCell>
                    <TableHeadCell align="center" width={280}>Rendimento</TableHeadCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableBodyContainer
                    colSpan={7}
                    loading={loading}
                    dataset={rows}
                    render={row => (
                        <TableBodyRow>
                            <TableBodyCell>
                                <EditControlButtons
                                    onShow={() => {
                                        const entryDate = new Date(row.entryDate)
                                        const dateStr = entryDate.toLocaleString("pt-BR", { dateStyle: 'short' })
                                        const newPage: AppRoute = {
                                            title: `Abate - ${dateStr} (Frig.: ${row.butcher})`,
                                            page: <SlaughterGroupEntriesTable {...{ entryDate }} />,
                                            previousPages: [HomePage, SlaughterMainPage, SlaughterGroupsPage]
                                        }
                                        if (setPageProps) setPageProps(newPage)
                                    }}
                                />
                            </TableBodyCell>
                            <TableBodyCell>{dateTransform(row.entryDate)}</TableBodyCell>
                            <TableBodyCell>{row.butcher}</TableBodyCell>
                            <TableBodyCell align="center">{row.animalsNumber}</TableBodyCell>
                            <TableBodyCell align="center">
                                <TrendValues
                                    value={decimalTransform(row.averageWeight)}
                                    trendProps={{ trend: row.weightVariation }}
                                />
                            </TableBodyCell>
                            <TableBodyCell align="center">
                                <TrendValues
                                    value={decimalTransform(row.averageDeadWeight)}
                                    trendProps={{ trend: row.deadWeightVariation }}
                                />
                            </TableBodyCell>
                            <TableBodyCell align="center">
                                <TrendValues
                                    value={decimalTransform(row.averageRate)}
                                    trendProps={{ trend: row.rateVariation }}
                                />
                            </TableBodyCell>
                        </TableBodyRow>
                    )}
                />
            </TableBody>
        </Table>
    </div>
}
