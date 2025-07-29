import { Table, TableBody, TableFooter, TableHead, TableRow } from "@mui/material"
import { dateTransformToLocale } from "@/util/Transformations"
import { EditControlButtons } from "@/ui/shared/table/ControlButtons"
import { transformAnimalType } from "../../animals/shared/AnimalEntities"
import {
    ResizableTableHeadCell,
    TableBodyCell,
    TableBodyRow,
    TableFooterCell,
    TableFooterTitleCell,
    TableHeadCell,
    TableHeadRow,
    TableLoadingRow
} from "@/ui/shared/table/TableComponents"
import { PastureAnimal } from "./Entities"

type PastureAnimalsTableProps = {
    rows: PastureAnimal[]
    isLoading: boolean
}

export const PastureAnimalsTable = ({ rows, isLoading }: PastureAnimalsTableProps) => {
    return <div className="h-full w-full overflow-auto">
        <Table stickyHeader className="w-max min-w-full">
            <TableHead className="bg-gray-700">
                <TableHeadRow>
                    <TableHeadCell />
                    <ResizableTableHeadCell>Brinco</ResizableTableHeadCell>
                    <ResizableTableHeadCell>Nome</ResizableTableHeadCell>
                    <ResizableTableHeadCell>Sexo</ResizableTableHeadCell>
                    <ResizableTableHeadCell>Data de Nascimento</ResizableTableHeadCell>
                    <ResizableTableHeadCell>Mãe</ResizableTableHeadCell>
                    <ResizableTableHeadCell>Pai</ResizableTableHeadCell>
                    <ResizableTableHeadCell>Tipo de Animal</ResizableTableHeadCell>
                </TableHeadRow>
            </TableHead>
            <TableBody>
                {isLoading
                    ? <TableLoadingRow colSpan={8} />
                    : rows.map(row => <PastureAnimalRow {...row} />)
                }
            </TableBody>
            <TableFooter className="bg-white bottom-0 sticky">
                <TableRow>
                    <TableFooterTitleCell colSpan={2}>Total</TableFooterTitleCell>
                    <TableFooterCell colSpan={6}>{rows.length}</TableFooterCell>
                </TableRow>
            </TableFooter>
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
        <TableBodyCell>{row.ringNumber}</TableBodyCell>
        <TableBodyCell>{row.name}</TableBodyCell>
        <TableBodyCell>{row.sex}</TableBodyCell>
        <TableBodyCell>{dateTransformToLocale(row.birthDate)}</TableBodyCell>
        <TableBodyCell>{row.motherName}</TableBodyCell>
        <TableBodyCell>{row.fatherName}</TableBodyCell>
        <TableBodyCell>{transformAnimalType(row.animalType, row.sex)}</TableBodyCell>
    </TableBodyRow>

}
