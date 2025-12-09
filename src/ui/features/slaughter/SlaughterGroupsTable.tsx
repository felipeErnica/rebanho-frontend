import {
    TableBodyCell,
    TableBodyContainer,
    TableBodyRow,
    TableHeadCell,
    TablePageContainer,
    TrendValues
} from "@/ui/shared/table/TableComponents"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
import { SlaughterGroup } from "./Entities"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { findGroups } from "./Controller"
import { PageContext } from "@/ui/shared/main-page/PageContext"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableBody from "@mui/material/TableBody"
import { EditControlButtons } from "@/ui/shared/table/ControlButtons"
import { dateTransform, decimalTransform } from "@/util/Transformations"
import { HomePage } from "../home/HomePage"
import { SlaughterGroupsPage, SlaughterMainPage } from "./SlaughterPages"
import { PageProps } from "@/ui/shared/main-page/PageDisplay"
import { SlaughterGroupEntriesTable } from "./SlaughterGroupEntriesTable"

export const SlaughterGroupsTable = () => {

    const [rows, setRows] = useState<SlaughterGroup[]>([])
    const [loading, setLoading] = useState(false)
    const [order, setOrder] = useState('desc')

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
                    <TableHeadCell align="center" width={unit * 15}>Data</TableHeadCell>
                    <TableHeadCell align="center" width={unit * 15}>Frigorífico</TableHeadCell>
                    <TableHeadCell align="center" width={unit * 15}>Nº de Animais</TableHeadCell>
                    <TableHeadCell align="center" width={unit * 15}>Peso</TableHeadCell>
                    <TableHeadCell align="center" width={unit * 15}>Peso de Abate</TableHeadCell>
                    <TableHeadCell align="center" width={unit * 15}>Rendimento</TableHeadCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableBodyContainer
                    colSpan={7}
                    loadingProps={{ loading, rowSpan: 30 }}
                    dataset={rows}
                    render={row => (
                        <TableBodyRow>
                            <TableBodyCell>
                                <EditControlButtons
                                    onShow={() => {
                                        const entryDate = new Date(row.entryDate)
                                        const dateStr = entryDate.toLocaleString("pt-BR", { dateStyle: 'short' })
                                        const newPage: PageProps = {
                                            title: `Marcações de Peso - ${dateStr} (Frig.: ${row.butcher})`,
                                            page: <SlaughterGroupEntriesTable {...{ entryDate }} />,
                                            previousPages: [HomePage, SlaughterMainPage, SlaughterGroupsPage]
                                        }
                                        if (setPageProps) setPageProps(newPage)
                                    }}
                                />
                            </TableBodyCell>
                            <TableBodyCell align="center">{dateTransform(row.entryDate)}</TableBodyCell>
                            <TableBodyCell align="center">{row.butcher}</TableBodyCell>
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
