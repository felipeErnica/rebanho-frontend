import { RowData } from "./Table"

export const TableRow = ({items, controlButtons}: RowData) => {
    return (
        <tr className=" hover:bg-gray-100"> 
            {items.map((item) => (<td className="border-b border-gray-300 px-6 py-4">{item.value}</td>))} 
            {controlButtons ? <td className="flex flex-row gap-4 border-b border-gray-300  justify-center items-center py-4">{controlButtons}</td> :  null}
        </tr>
    )
}

