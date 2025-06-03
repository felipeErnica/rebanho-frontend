import { ColumnProps } from "@/ui/components/table/Table"
import Table from "@mui/material/Table"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { useEffect, useState } from "react"
import { AnimalsByAgeAndFarm } from "../api/AnimalDashboard"
import { getGroupByAge } from "../api/AnimalController"
import TableBody from "@mui/material/TableBody"
import { IDashboardData } from "@/interfaces/Filter"
import Skeleton from "@mui/material/Skeleton"


export const TableInfoAge = () => {

    const [list, setList] = useState<AnimalsByAgeAndFarm[]>([])
    const [isLoading, setLoading] = useState(false)

    const mainColumns: string[] = [
        "0-2 meses",
        "3-8 meses",
        "9-12 meses",
        "13-24 meses",
        "25-36 meses",
        "+36 meses",
        "Total",
    ]

    const columns: ColumnProps[] = [
        { title: "Fazendas", name: "farmName", type: "text", isEditable: false, align: 'left' },
        { title: "M", name: "newbornMale", type: "text", isEditable: false },
        { title: "F", name: "newbornFemale", type: "text", isEditable: false },
        { title: "M", name: "babyMale", type: "text", isEditable: false },
        { title: "F", name: "babyFemale", type: "text", isEditable: false },
        { title: "M", name: "childMale", type: "text", isEditable: false },
        { title: "F", name: "childFemale", type: "text", isEditable: false },
        { title: "M", name: "youngMale", type: "text", isEditable: false },
        { title: "F", name: "youngFemale", type: "text", isEditable: false },
        { title: "M", name: "adultMale", type: "text", isEditable: false },
        { title: "F", name: "adultFemale", type: "text", isEditable: false },
        { title: "M", name: "oldMale", type: "text", isEditable: false },
        { title: "F", name: "oldFemale", type: "text", isEditable: false },
        { title: "M", name: "totalMale", type: "text", isEditable: false },
        { title: "F", name: "totalFemale", type: "text", isEditable: false },
    ]

    const TableInfoHead = () => {
        return <TableHead>
            <TableRow>
                <TableCell className="bg-gray-700" />
                {mainColumns.map(column => {
                    return <TableCell align="center" className="bg-gray-700 text-white" colSpan={2}>{column}</TableCell>
                })}
            </TableRow>
            <TableRow>
                {columns.map(column => {
                    return <TableCell align={column.align || 'center'} className="bg-gray-700 text-white">{column.title}</TableCell>
                })}
            </TableRow>
        </TableHead>
    }

    const TableInfoRow = (row: IDashboardData) => {
        return <TableRow>
            {columns.map(column => {
                return <TableCell align={column.align || 'center'}>{row[column.name]}</TableCell>
            })}
        </TableRow>
    }

    useEffect(() => {
        setLoading(true)
        getGroupByAge({ isFiltered: false })
            .then(response => { 
                setList(response.json) 
                setLoading(false)
            })
            .catch(() => setLoading(true))
    }, [])

    return <Table size="small">
        <TableInfoHead />
        <TableBody>
            {isLoading ? <Skeleton /> : list.map(value => TableInfoRow(value))}
        </TableBody>
    </Table>
}
