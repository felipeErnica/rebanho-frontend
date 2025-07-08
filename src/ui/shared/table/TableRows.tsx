import { useState } from "react"
import { ColumnProps } from "./TableCustom"
import { IData } from "@/shared/interfaces/Filter"
import { EditableRow } from "./table-row/EditableRow"
import { NormalRow } from "./table-row/NormalRow"
import TableRow from "@mui/material/TableRow"

export type RowsProps = {
    row: IData
    columns: ColumnProps[]
    onDeleteRow?: (id: string) => void
    onSaveRow?: (data: IData) => void
}

export type RowProps = RowsProps & {
    setEditableRow: (isEditableRow: boolean) => void
}

export function TableRows({ row, columns, onDeleteRow, onSaveRow }: RowsProps) {

    const [isEditableRow, setEditableRow] = useState(false)

    return <TableRow key={row.id} className="hover:bg-gray-300">
        {isEditableRow ?
            <EditableRow {...{ row, columns, onDeleteRow, onSaveRow, setEditableRow }} />
            :
            <NormalRow {...{ row, columns, onDeleteRow, onSaveRow, setEditableRow }} />
        }
    </TableRow>
}
