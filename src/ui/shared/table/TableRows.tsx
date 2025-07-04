/* eslint-disable react-hooks/exhaustive-deps */
import { JSX, useEffect, useState } from "react"
import { ColumnProps } from "./TableCustom"
import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import Delete from "@mui/icons-material/Delete"
import Edit from "@mui/icons-material/Edit"
import Check from "@mui/icons-material/Check"
import Close from "@mui/icons-material/Close"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import { IData } from "@/shared/interfaces/Filter"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import dayjs from "dayjs"

export type RowProps = {
    row: IData
    columns: ColumnProps[]
    onDeleteRow?: (id: string) => void
    onSaveRow?: (id: string) => void
}

type RowValues = {
    [colName: string]: any
}

export function TableRows({ row, columns, onDeleteRow, onSaveRow }: RowProps) {

    const [isEditableRow, setEditableRow] = useState(false)
    const [editedValues, setEditedValues] = useState<RowValues>({})

    useEffect(() => {
        let values: RowValues = editedValues
        columns.forEach(column => {
            values = { ...values, [column.name]: row[column.name] }
        })
        setEditedValues(values)
        setEditableRow(false)
    }, [columns, row])

    const DeleteButton = (): JSX.Element => {
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
        return <div className="flex flex-row gap-4">
            {rowButtons()}
        </div>
    }

    const EditButtonsPanel = () => {
        return <div className="flex flex-row gap-4">
            <IconButton
                onClick={() => {
                    columns.forEach(column => row[column.name] = editedValues[column.name])
                    if (onSaveRow) onSaveRow(row.id)
                    setEditableRow(false)
                }}
            >
                <Check />
            </IconButton>
            <IconButton onClick={() => {
                columns.forEach(column => editedValues[column.name] = row[column.name])
                setEditableRow(false)
            }}>
                <Close />
            </IconButton>
        </div>
    }


    const EditableComponent = (value: any, props: ColumnProps): JSX.Element => {
        if (props.type === 'date' || props.type === 'datetime-local') {
            return <DatePicker
                defaultValue={dayjs(value)}
                views={['year', 'month', 'day']}
                localeText={{
                    fieldDayPlaceholder: () => 'dd',
                    fieldMonthPlaceholder: () => 'mm',
                    fieldYearPlaceholder: () => 'aaaa',
                }}
                onChange={(event) => {
                    if (!event) return
                    const newValues = editedValues
                    newValues[props.name] = event.toDate
                    setEditedValues(newValues)
                }}
            />
        }

        return <TextField
            className="w-full"
            type={props.type}
            slotProps={{
                htmlInput: {
                    step: props.step
                }
            }}
            defaultValue={value}
            onChange={(event) => {
                const newValues = editedValues
                newValues[props.name] = event.currentTarget.value
                setEditedValues(newValues)
            }}
        />
    }

    const EditableCellContent = (value: any, props: ColumnProps): JSX.Element => {
        if (props.isEditable) return EditableComponent(value, props)
        return <span>{value}</span>
    }

    const ButtonPanel = () => {
        return isEditableRow ? <EditButtonsPanel /> : <ControlButtonsPanel />
    }

    const CellContent = (index: number, value: any, props: ColumnProps) => {
        if (index == 0) {
            return <div className="flex flex-row gap-6 items-center">
                <ButtonPanel />
                {isEditableRow ? EditableCellContent(value, props) : <span>{value}</span>}
            </div>
        }
        return isEditableRow ? EditableCellContent(value, props) : <span>{value}</span>
    }

    const CellBody = (index: number, value: any, props: ColumnProps): JSX.Element => {
        return <TableCell
            align={props.align}
            className="overflow-hidden text-nowrap overflow-ellipsis"
        >
            {CellContent(index, value, props)}
        </TableCell>
    }

    return <TableRow key={row.id} hover>
        {columns.map((column, index) => {
            const value = column.format ? column.format(row[column.name]) : row[column.name]
            return CellBody(index, value, column)
        })}
    </TableRow>
}
