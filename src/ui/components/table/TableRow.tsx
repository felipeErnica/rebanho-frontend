import { JSX, useEffect, useState } from "react"
import { ControlButton } from "../common/ControlButtons"
import { EditIcon, TrashIcon } from "../common/SvgIcons"
import { RowProps } from "./Table"
import { InputBox } from "../common/InputBox"


export const TableRow = (props: RowProps) => {

    const [isEditableRow, setEditableRow] = useState(false)

    useEffect(() => setEditableRow(false), [props])

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

    const rowButtons = props.controlButtons ? [...props.controlButtons, DeleteButton(), EditButton()] : [DeleteButton(), EditButton()]

    if (isEditableRow) {
        return <tr id={props.rowId} className="hover:bg-gray-100">
            {props.items.map((item) => (
                <td className="border-b border-gray-300 px-6 py-4">
                    {item.isEditable ? 
                        <InputBox 
                            type={item.type} 
                            step={item.step} 
                            defaultValue={item.value} 
                        /> 
                        : <span className="overflow-ellipsis">{item.value}</span>}
                </td>))
            }
        </tr>
    }

    return <tr id={props.rowId} className="hover:bg-gray-100">
            {props.items.map((item) => (
                <td className="border-b border-gray-300 px-6 py-4">
                    <span className="overflow-ellipsis"> {item.value} </span>
                </td>))
            }
            {rowButtons ? <td className="flex flex-row gap-4 border-b border-gray-300  justify-center items-center py-4">{rowButtons}</td> : null}
        </tr>
}

