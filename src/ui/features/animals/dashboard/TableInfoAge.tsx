import { ColumnProps } from "@/ui/components/table/Table"
import Table from "@mui/material/Table"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { useEffect, useState } from "react"
import { AnimalDashboardFilter, AnimalsByAgeAndFarm } from "../api/AnimalDashboard"
import { getGroupByAgeFarm } from "../api/AnimalController"
import TableBody from "@mui/material/TableBody"
import { IDashboardData } from "@/interfaces/Filter"
import Skeleton from "@mui/material/Skeleton"
import ChevronRight from "@mui/icons-material/ChevronRight"
import IconButton from "@mui/material/IconButton"
import Collapse from "@mui/material/Collapse"

type RowProps = {
    row: IDashboardData
    columns: ColumnProps[]
    mainColumns: string[]
    filter: AnimalDashboardFilter
    setFilter: (filter: AnimalDashboardFilter) => void
}

type PastureProps = {
    columns: ColumnProps[]
    mainColumns: string[]
}

type TableInfoAgeProps = {
    filter: AnimalDashboardFilter
    setFilter: (filter: AnimalDashboardFilter) => void
}


const PastureTable = ({ columns, mainColumns }: PastureProps) => {

    useEffect(() => {
        columns[0].title = ""
    }, [columns])

    const values: IDashboardData[] = [
        {
            farmName: "Pasto 1",
            newbornFemale: 0,
            newbornMale: 0,
            babyFemale: 0,
            babyMale: 0,
            childFemale: 0,
            childMale: 0,
            youngFemale: 0,
            youngMale: 0,
            adultFemale: 0,
            adultMale: 0,
            oldFemale: 0,
            oldMale: 0,
            totalFemale: 0,
            totalMale: 0
        },
    ]

    const TablePastureHead = () => {
        return <TableHead>
            <TableRow>
                <TableCell />
                {mainColumns.map(column => {
                    return <TableCell align="center" colSpan={2} >
                        {column}
                    </TableCell>
                })}
            </TableRow>
            <TableRow>
                {columns.map(column => {
                    return <TableCell align={column.align || 'center'} >
                        {column.title}
                    </TableCell>
                })}
            </TableRow>
        </TableHead>
    }

    return <Table size="small">
        <TablePastureHead />
        <TableBody>
            {values.map(value => {
                return <TableRow>
                    {columns.map(column => {
                        return <TableCell align={column.align || 'center'} >
                            {value[column.name]}
                        </TableCell>
                    })}
                </TableRow>
            })}
        </TableBody>
    </Table>
}


const TableInfoRow = ({ row, columns, mainColumns, filter, setFilter }: RowProps) => {

    const [isOpen, setOpen] = useState(false)
    const handleClick = (farmId: string) => setFilter({ ...filter, farmId })

    return <>
        <TableRow hover>
            {columns.map((column, i) => {
                if (i == 0) {
                    return <TableCell
                        onClick={() => handleClick(row['farmId'])}
                        className="text-nowrap"
                    >
                        <IconButton onClick={() => setOpen(!isOpen)}>
                            <ChevronRight className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
                        </IconButton>
                        {row[column.name]}
                    </TableCell>
                }
                return <TableCell
                    onClick={() => handleClick(row['farmId'])}
                    className="text-nowrap"
                    align={column.align || 'center'}
                >
                    {row[column.name]}
                </TableCell>
            })}
        </TableRow>
        <TableRow>
            <TableCell colSpan={columns.length} className="p-0">
                <Collapse in={isOpen}>
                    <PastureTable {...{ columns, mainColumns }} />
                </Collapse>
            </TableCell>
        </TableRow>
    </>
}

export const TableInfoAge = ({ filter, setFilter }: TableInfoAgeProps) => {

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
                    return <TableCell
                        align="center"
                        className="bg-gray-700 text-white"
                        colSpan={2}
                    >
                        {column}
                    </TableCell>
                })}
            </TableRow>
            <TableRow>
                {columns.map(column => {
                    return <TableCell
                        align={column.align || 'center'}
                        className="bg-gray-700 text-white"
                        sx={{ width: column.width }}
                    >
                        {column.title}
                    </TableCell>
                })}
            </TableRow>
        </TableHead>
    }


    useEffect(() => {
        const farmFilter: AnimalDashboardFilter = { ...filter, farmId: undefined }
        setLoading(true)
        getGroupByAgeFarm(farmFilter)
            .then(response => {
                setList(response.json)
                setLoading(false)
            })
            .catch(() => setLoading(true))
    }, [filter])

    return <Table size="small">
        <TableInfoHead />
        <TableBody>
            {isLoading ?
                <TableCell colSpan={columns.length}>
                    <Skeleton animation='pulse' variant="rectangular" />
                </TableCell>
                :
                list.map(row => <TableInfoRow {...{ row, columns, mainColumns, filter, setFilter }} />)
            }
        </TableBody>
    </Table>
}
