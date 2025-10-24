import { Table, TableBody, TableHead } from "@mui/material"
import { dateTransform } from "@/util/Transformations"
import { EditControlButtons } from "@/ui/shared/table/ControlButtons"
import { transformAnimalType } from "../../animals/shared/AnimalEntities"
import {
    FooterContent,
    ResizableHeadCell,
    StickyTableFooter,
    TableBodyCell,
    TableBodyContainer,
    TableBodyRow,
    TableFooterRow,
    TableHeadCell,
    TableHeadRow,
} from "@/ui/shared/table/TableComponents"
import { PastureAnimal } from "./Entities"
import { useEffect, useRef, useState } from "react"

type PastureAnimalsTableProps = {
    rows: PastureAnimal[]
    loading: boolean
}

export const PastureAnimalsTable = ({ rows, loading }: PastureAnimalsTableProps) => {

    const [unit, setUnit] = useState(0)
    const tableRef = useRef<HTMLDivElement>(null)

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
        className="h-full w-full overflow-auto"
        ref={tableRef}
    >
        <Table stickyHeader className="w-max min-w-full">
            <TableHead className="bg-gray-700">
                <TableHeadRow>
                    <TableHeadCell width={unit * 10} />
                    <ResizableHeadCell width={unit * 25}>Nome</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={unit * 5}>Sexo</ResizableHeadCell>
                    <ResizableHeadCell align="center" width={unit * 15}>Data de Nascimento</ResizableHeadCell>
                    <ResizableHeadCell width={unit * 15}>Mãe</ResizableHeadCell>
                    <ResizableHeadCell width={unit * 15}>Pai</ResizableHeadCell>
                    <ResizableHeadCell width={unit * 15}>Tipo de Animal</ResizableHeadCell>
                </TableHeadRow>
            </TableHead>
            <TableBody>
                <TableBodyContainer
                    dataset={rows}
                    colSpan={7}
                    loadingProps={{ loading, rowSpan: 20 }}
                    render={row => <PastureAnimalRow {...row} />}
                />
            </TableBody>
            <StickyTableFooter>
                <TableFooterRow colSpan={7}>
                    <FooterContent title="Total" content={rows.length} />
                </TableFooterRow>
            </StickyTableFooter>
        </Table>
    </div>
}

const PastureAnimalRow = (row: PastureAnimal) => {
    return <TableBodyRow>
        <TableBodyCell>
            <EditControlButtons
                onDelete={() => console.log("delete", row.name)}
            />
        </TableBodyCell>
        <TableBodyCell>{row.name}</TableBodyCell>
        <TableBodyCell align="center">{row.sex}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(row.birthDate)}</TableBodyCell>
        <TableBodyCell>{row.motherName}</TableBodyCell>
        <TableBodyCell>{row.fatherName}</TableBodyCell>
        <TableBodyCell>{transformAnimalType(row.animalType, row.sex)}</TableBodyCell>
    </TableBodyRow>

}
