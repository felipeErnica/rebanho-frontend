/* eslint-disable react-hooks/exhaustive-deps */
//import { JSX, useCallback, useEffect, useState } from "react"
//import { CellProps } from "./Table"
//import TextField from "@mui/material/TextField"
//import IconButton from "@mui/material/IconButton"
//import Delete from "@mui/icons-material/Delete"
//import Edit from "@mui/icons-material/Edit"
//import Check from "@mui/icons-material/Check"
//import Close from "@mui/icons-material/Close"
//
//type EditedValues = {
//    [columnName: string]: any
//}

//export const TableRow = (props: RowProps) => {
//
//    const [isEditableRow, setEditableRow] = useState(false)
//    const [isControlsVisible, setControlsVisible] = useState(false)
//    const [newValues, setNewValues] = useState<EditedValues>([])
//
//    useEffect(() => {
//        setEditableRow(false)
//        setControlsVisible(false)
//
//        let editMap: EditedValues = newValues
//        props.items.forEach((item) => {
//            editMap = { ...editMap, [item.columnName]: item.value }
//        })
//
//        setNewValues(editMap)
//    }, [props])
//
//    const DeleteButton = (): JSX.Element => {
//        return <IconButton
//            onClick={() => {
//                if (props.onDeleteRow) props.onDeleteRow(props.rowId)
//            }}
//        >
//            <Delete />
//        </IconButton>
//    }
//
//    const EditButton = (): JSX.Element => {
//        return <IconButton
//            onClick={() => setEditableRow(true)}
//        >
//            <Edit />
//        </IconButton>
//    }
//
//    const rowButtons = () => {
//        const rowButtons = []
//        if (props.onDeleteRow) rowButtons.push(DeleteButton())
//        if (props.onSaveRow) rowButtons.push(EditButton())
//        return rowButtons
//    }
//
//    const ControlButtonsPanel = useCallback(() => {
//        if (rowButtons().length == 0) return
//        if (isControlsVisible) {
//            return <div
//                className="grow flex flex-row justify-end gap-4 pr-4"
//            >
//                {rowButtons()}
//            </div>
//        }
//        return null
//    }, [isControlsVisible])
//
//    const EditButtonsPanel = () => {
//        return <div className="grow flex flex-row justify-end gap-4 pr-4">
//            <IconButton
//                onClick={() => {
//                    if (props.onSaveRow) props.onSaveRow(props.rowId)
//                    props.items.forEach(item => item.value = newValues[item.columnName])
//                    setEditableRow(false)
//                }}
//            >
//                <Check/>
//            </IconButton>
//            <IconButton onClick={() => setEditableRow(false)} ><Close /></IconButton>
//        </div>
//    }
//
//    const CellBody = (isLast: boolean, value: any): JSX.Element => {
//        if (isLast) {
//            return <td className="border-b border-gray-300 px-6 py-4">
//                <div className="flex flex-row">
//                    <span className="overflow-ellipsis"> {value} </span>
//                    {ControlButtonsPanel()}
//                </div>
//            </td>
//        }
//
//        return <td className="border-b border-gray-300 px-6 py-4">
//            <span className="overflow-ellipsis">{value}</span>
//        </td>
//    }
//
//    const EditableCellContent = (item: CellProps) => {
//        if (item.isEditable) {
//            return <TextField
//                size="small"
//                type={item.type}
//                slotProps={{
//                    htmlInput: {
//                        step: item.step
//                    }
//                }}
//                defaultValue={item.value}
//                onChange={(event) => {
//                    const editedValues = newValues
//                    editedValues[item.columnName] = event.currentTarget.value
//                    setNewValues(editedValues)
//                }}
//            />
//        }
//        return <span className="overflow-ellipsis">{item.value}</span>
//    }
//
//    const EditableCellBody = (isLast: boolean, item: CellProps): JSX.Element => {
//        if (isLast) {
//            return <td className="border-b border-gray-300 px-6 py-4">
//                <div className="flex flex-row gap-8">
//                    <EditableCellContent
//                        isEditable={item.isEditable}
//                        step={item.step}
//                        value={item.value}
//                        type={item.type}
//                        columnName={item.columnName}
//                    />
//                    {EditButtonsPanel()}
//                </div>
//            </td>
//        }
//
//        return <td className="border-b border-gray-300 px-6 py-4">
//            <EditableCellContent
//                isEditable={item.isEditable}
//                step={item.step}
//                value={item.value}
//                type={item.type}
//                columnName={item.columnName}
//            />
//        </td>
//    }
//
//    if (isEditableRow) {
//        return <tr id={props.rowId} className="hover:bg-gray-100">
//            {props.items.map((item, i) => EditableCellBody(i === props.items.length - 1, item))}
//        </tr>
//    }
//
//    return <tr
//        id={props.rowId}
//        className="hover:bg-gray-100"
//        onMouseOver={() => setControlsVisible(true)}
//        onMouseLeave={() => setControlsVisible(false)}
//    >
//        {props.items.map((item, i) => CellBody(i === props.items.length - 1, item.value))}
//    </tr>
//}
