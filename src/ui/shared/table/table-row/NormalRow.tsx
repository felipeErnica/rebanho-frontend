import IconButton from "@mui/material/IconButton";
import { RowProps } from "../TableRows";
import { JSX } from "react";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import { TableCell } from "@mui/material";

export function NormalRow({ 
    row, 
    columns, 
    onDeleteRow, 
    onSaveRow, 
    setEditableRow 
}: RowProps) {

    const DeleteButton = () => {
        return <IconButton
            size="small"
            onClick={() => {
                if (onDeleteRow) onDeleteRow(row.id)
            }}
        >
            <Delete />
        </IconButton>
    }

    const EditButton = (): JSX.Element => {
        return <IconButton size="small" onClick={() => setEditableRow(true)} >
            <Edit />
        </IconButton>
    }

    const rowButtons = () => {
        const rowButtons = []
        if (onDeleteRow) rowButtons.push(DeleteButton())
        if (onSaveRow) rowButtons.push(EditButton())
        return rowButtons
    }

    const ControlButtonsPanel = () => {
        if (rowButtons().length == 0) return
        return <div className="flex flex-row gap-2">
            {rowButtons()}
        </div>
    }

    return columns.map((column, index) => {
        const value = column.format ? column.format(row[column.name]) : row[column.name]
        return <TableCell
            align={column.align}
            className="border-b border-b-gray-400 overflow-hidden text-nowrap overflow-ellipsis"
        >
            <div className="flex flex-row gap-6 items-center">
                {index === 0 && ControlButtonsPanel()}
                <span>{value}</span>
            </div>
        </TableCell>
    })

}
