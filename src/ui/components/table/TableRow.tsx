import { DataRow } from "./Table"

export const TableRow = ({items}: DataRow) => {
    return (
        <tr>
            {items.map((item) => (<td>{item}</td>))}
        </tr>
    )
}

