import { JSX, useCallback, useEffect, useState } from "react"
import { ControlButton } from "../common/ControlButtons"
import { TrashIcon } from "../common/SvgIcons"
import { RowData } from "./Table"


export const TableRow = ({ rowId, items, controlButtons, onDeleteRow }: RowData) => {

    const [rowButtons, setRowButtons] = useState<JSX.Element[]>(controlButtons ? controlButtons : [])

    const DeleteButton = useCallback((): JSX.Element => {
        return <ControlButton
            icon={TrashIcon}
            onClick={onDeleteRow ? () => onDeleteRow(rowId) : () => { }}
        />
    }, [onDeleteRow, rowId])

    useEffect(() => {


        if (onDeleteRow) {
            setRowButtons(prevButtons => [...prevButtons, DeleteButton()])
        }
    }, [onDeleteRow, DeleteButton])


    return (
        <tr id={rowId} className="hover:bg-gray-100">
            {items.map((item) => (<td className="border-b border-gray-300 px-6 py-4">{item.value}</td>))}
            {rowButtons ? <td className="flex flex-row gap-4 border-b border-gray-300  justify-center items-center py-4">{rowButtons}</td> : null}
        </tr>
    )
}

