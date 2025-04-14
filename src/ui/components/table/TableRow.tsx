import { RowData } from "./Table"

export const TableRow = ({items}: RowData) => {
    return (
        <tr className="hover:bg-gray-100"> {items.map((item) => (<td className="px-6 py-4">{item.value}</td>))} </tr>
    )
}

