import { JSX } from "react";
import { TableRow } from "./TableRow";

export const Table = (props: TableProps): JSX.Element => {
    return (
        <table>
            <thead>
                <tr>
                {props.columns.map((column) => {
                    return (<th>{column}</th>)
                })}
                </tr>
            </thead>
            <tbody>
                {props.rows.map((row) => <TableRow items={row.items} />)}
            </tbody>
        </table>
    )
}

interface TableProps {
    columns: string[];
    rows: DataRow[];
}

export interface DataRow {
    items: [];
}
