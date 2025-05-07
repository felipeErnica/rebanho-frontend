/* eslint-disable react-hooks/exhaustive-deps */
import { JSX, useCallback, useEffect, useState } from "react"
import { ControlButton } from "../common/ControlButtons"
import { CloseIcon, EditIcon, OkIcon, TrashIcon } from "../common/SvgIcons"
import { CellProps, RowProps } from "./Table"
import { InputBox } from "../common/InputBox"

type EditedValues = {
    [columnName: string]: any
}

export const TableRow = (props: RowProps) => {

    const [isEditableRow, setEditableRow] = useState(false)
    const [isControlsVisible, setControlsVisible] = useState(false)
    const [newValues, setNewValues] = useState<EditedValues>([])

    useEffect(() => {
        setEditableRow(false)
        setControlsVisible(false)
        
        let editMap: EditedValues = newValues
        props.items.forEach((item) => {
            editMap = {...editMap, [item.columnName]: item.value}
        })

        setNewValues(editMap)
    }, [props])

    const DeleteButton = (): JSX.Element => {
        return <ControlButton
            icon={TrashIcon}
            onClick={() => {
                if (props.onDeleteRow) props.onDeleteRow(props.rowId)
            }}
        />
    }

    const EditButton = (): JSX.Element => {
        return <ControlButton
            icon={EditIcon}
            onClick={() => setEditableRow(true)}
        />
    }

    const rowButtons = () => {
        let rowButtons = []
        if (props.onDeleteRow) rowButtons.push(DeleteButton())
        if (props.onSaveRow) rowButtons.push(EditButton())
        return rowButtons
    }

    const ControlButtonsPanel = useCallback(() => {
        if (rowButtons().length == 0) return
        if (isControlsVisible) {
            return <div
                className="grow flex flex-row justify-end gap-4 pr-4"
            >
                {rowButtons()}
            </div>
        }
        return null
    }, [isControlsVisible])

    const EditButtonsPanel = () => {
        return <div className="grow flex flex-row justify-end gap-4 pr-4">
            <ControlButton
                icon={OkIcon}
                onClick={() => {
                    if (props.onSaveRow) props.onSaveRow(props.rowId)
                    props.items.forEach(item => item.value = newValues[item.columnName])
                    setEditableRow(false)
                }}
            />
            <ControlButton icon={CloseIcon} onClick={() => setEditableRow(false)} />
        </div>
    }

    const CellBody = (isLast: boolean, value: any): JSX.Element => {
        if (isLast) {
            return <td className="border-b border-gray-300 px-6 py-4">
                <div className="flex flex-row">
                    <span className="overflow-ellipsis"> {value} </span>
                    {ControlButtonsPanel()}
                </div>
            </td>
        }

        return <td className="border-b border-gray-300 px-6 py-4">
            <span className="overflow-ellipsis">{value}</span>
        </td>
    }

    const EditableCellContent = (item: CellProps) => {
        if (item.isEditable) {
            return <InputBox 
                type={item.type} 
                step={item.step} 
                defaultValue={item.value} 
                onInput={(event) => {
                    const editedValues = newValues
                    editedValues[item.columnName] = event.currentTarget.value
                    setNewValues(editedValues)
                }}
            />
        }
        return <span className="overflow-ellipsis">{item.value}</span>
    }

    const EditableCellBody = (isLast: boolean, item: CellProps): JSX.Element => {
        if (isLast) {
            return <td className="border-b border-gray-300 px-6 py-4">
                <div className="flex flex-row gap-8">
                    <EditableCellContent
                        isEditable={item.isEditable}
                        step={item.step}
                        value={item.value}
                        type={item.type}
                        columnName={item.columnName}
                    />
                    {EditButtonsPanel()}
                </div>
            </td>
        }

        return <td className="border-b border-gray-300 px-6 py-4">
            <EditableCellContent
                isEditable={item.isEditable}
                step={item.step}
                value={item.value}
                type={item.type}
                columnName={item.columnName}
            />
        </td>
    }

    if (isEditableRow) {
        return <tr id={props.rowId} className="hover:bg-gray-100">
            {props.items.map((item, i) => EditableCellBody(i === props.items.length - 1, item))}
        </tr>
    }

    return <tr
        id={props.rowId}
        className="hover:bg-gray-100"
        onMouseOver={() => setControlsVisible(true)}
        onMouseLeave={() => setControlsVisible(false)}
    >
        {props.items.map((item, i) => CellBody(i === props.items.length - 1, item.value))}
    </tr>
}
