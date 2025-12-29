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
import { useCallback, useEffect, useState } from "react"
import { findGroups } from "./Controller"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableBody from "@mui/material/TableBody"
import { EditControlButtons } from "@shared/table/ControlButtons"
import { dateTransform, decimalTransform } from "@utils/Transformations"
import { useNavigate } from "react-router"

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

    const navigate = useNavigate()

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
                                        const dateStr = entryDate.toISOString().split('T')[0]
                                        navigate(`groups/${dateStr}`)
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
