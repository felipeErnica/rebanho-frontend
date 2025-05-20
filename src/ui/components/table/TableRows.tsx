/* eslint-disable react-hooks/exhaustive-deps */
import { JSX, useCallback, useEffect, useState } from "react"
import { ColumnProps } from "./Table"
import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import Delete from "@mui/icons-material/Delete"
import Edit from "@mui/icons-material/Edit"
import Check from "@mui/icons-material/Check"
import Close from "@mui/icons-material/Close"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import { IData } from "@/interfaces/Filter"
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
    const [isControlsVisible, setControlsVisible] = useState(false)
    const [editedValues, setEditedValues] = useState<RowValues>({})

    useEffect(() => {
        let values: RowValues = editedValues
        columns.forEach(column => {
            values = { ...values, [column.name]: row[column.name] }
        })
        setEditedValues(values)
        setEditableRow(false)
        setControlsVisible(false)
    }, [columns, row])

    const DeleteButton = (): JSX.Element => {
        return <IconButton
            onClick={() => {
                if (onDeleteRow) onDeleteRow(row.id)
            }}
        >
            <Delete />
        </IconButton>
    }

    const EditButton = (): JSX.Element => {
        return <IconButton onClick={() => setEditableRow(true)} >
            <Edit />
        </IconButton>
    }

    const rowButtons = () => {
        const rowButtons = []
        if (onDeleteRow) rowButtons.push(DeleteButton())
        if (onSaveRow) rowButtons.push(EditButton())
        return rowButtons
    }

    const ControlButtonsPanel = useCallback(() => {
        if (rowButtons().length == 0) return
        if (isControlsVisible) {
            return <div className="grow flex flex-row justify-end gap-4 pr-4" >
                {rowButtons()}
            </div>
        }
        return null
    }, [isControlsVisible])

    const EditButtonsPanel = () => {
        return <div className="grow flex flex-row justify-end gap-4 pr-4">
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

    const CellBody = (isLast: boolean, value: any): JSX.Element => {
        if (isLast) {
            return <TableCell className="overflow-hidden text-nowrap overflow-ellipsis">
                <div className="flex flex-row items-center">
                    <span> {value} </span>
                    {ControlButtonsPanel()}
                </div>
            </TableCell>
        }

        return <TableCell className="overflow-hidden text-nowrap overflow-ellipsis">
            <span>{value}</span>
        </TableCell>
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

    const EditableCellBody = (isLast: boolean, value: any, props: ColumnProps): JSX.Element => {
        if (isLast) {
            return <TableCell className="overflow-hidden text-nowrap overflow-ellipsis">
                <div className="flex flex-row items-center">
                    {EditableCellContent(value, props)}
                    {EditButtonsPanel()}
                </div>
            </TableCell>
        }

        return <TableCell className="overflow-hidden text-nowrap overflow-ellipsis">
            {EditableCellContent(value, props)}
        </TableCell>
    }

    if (isEditableRow) {
        return <TableRow key={row.id} hover>
            {columns.map((column, i) => EditableCellBody(i === columns.length - 1, row[column.name], column))}
        </TableRow>
    }

    return <TableRow
        key={row.id}
        onMouseOver={() => setControlsVisible(true)}
        onMouseLeave={() => setControlsVisible(false)}
    >
        {columns.map((column, i) => {
            return CellBody(i === columns.length - 1, row[column.name])
        })}
    </TableRow>
}
