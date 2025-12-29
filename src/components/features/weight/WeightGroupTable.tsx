import {
    TableBodyCell,
    TableBodyContainer,
    TableBodyRow,
    TableHeadCell,
    TablePageContainer,
    TrendValues
} from "@shared/table/TableComponents"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { WeightGroup } from "./Entities"
import { findGroups } from "./Controller"
import { dateTransform, decimalTransform } from "@utils/Transformations"
import { EditControlButtons } from "@shared/table/ControlButtons"
import { AppRoute } from "@shared/main-page/PageDisplay"
import { HomePage } from "../home/HomePage"
import { WeightGroupsPage, WeightMainPage } from "./WeightPages"
import { PageContext } from "@shared/main-page/PageContext"
import { WeightGroupEntriesTable } from "./WeightGroupEntriesTable"

export const WeightGroupTable = () => {

    const [rows, setRows] = useState<WeightGroup[]>([])
    const [order, setOrder] = useState('desc')
    const [loading, setLoading] = useState(false)

    const onReload = useCallback(() => {
        setLoading(true)
        findGroups(order)
            .then(results => setRows(results.json))
            .catch(() => setRows([]))
            .finally(() => setLoading(false))
    }, [order])

    useEffect(onReload, [onReload])

    return <TablePageContainer>
        <TableTopBar
            reloadProps={{ onReload, loading }}
            orderProps={{ order, setOrder }}
        />
        <GroupTable {...{ rows, loading }} />
    </TablePageContainer>

}

type GroupTableProps = {
    loading: boolean
    rows: WeightGroup[]
}

const GroupTable = ({ rows, loading }: GroupTableProps) => {

    const [unit, setUnit] = useState(0)
    const tableRef = useRef<HTMLDivElement>(null)
    const { setPageProps } = useContext(PageContext)

    useEffect(() => {
        const handleResize = () => {
            if (!tableRef.current) return
            const table = tableRef.current
            setUnit(table.offsetWidth / 100)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return <div
        className="overflow-auto"
        ref={tableRef}
    >
        <Table stickyHeader>
            <TableHead>
                <TableRow>
                    <TableHeadCell width={unit * 10} />
                    <TableHeadCell align="center" width={unit * 30}>Data</TableHeadCell>
                    <TableHeadCell align="center" width={unit * 20}>Nº de Animais</TableHeadCell>
                    <TableHeadCell align="center" width={unit * 20}>Peso</TableHeadCell>
                    <TableHeadCell align="center" width={unit * 20}>Ganho de Peso (Kg/dia)</TableHeadCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableBodyContainer
                    colSpan={5}
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
                                            title: `Marcações de Peso - ${dateStr}`,
                                            page: <WeightGroupEntriesTable {...{ entryDate }} />,
                                            previousPages: [HomePage, WeightMainPage, WeightGroupsPage]
                                        }
                                        if (setPageProps) setPageProps(newPage)
                                    }}
                                />
                            </TableBodyCell>
                            <TableBodyCell align="center">{dateTransform(row.entryDate)}</TableBodyCell>
                            <TableBodyCell align="center">{row.animalsNumber}</TableBodyCell>
                            <TableBodyCell align="center">
                                <TrendValues
                                    value={decimalTransform(row.averageWeight)}
                                    trendProps={{ trend: row.weightVariation }}
                                />
                            </TableBodyCell>
                            <TableBodyCell align="center">
                                <TrendValues
                                    value={decimalTransform(row.averageGain)}
                                    trendProps={{ trend: row.gainVariation }}
                                />
                            </TableBodyCell>
                        </TableBodyRow>
                    )}
                />
            </TableBody>
        </Table>
    </div>
}
