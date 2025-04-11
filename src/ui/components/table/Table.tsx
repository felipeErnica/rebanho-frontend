import { JSX, useCallback, useEffect, useState } from "react";
import { TableRow } from "./TableRow";
import { Page } from "../../../types/Page";
import { TableColumn } from "./TableColumn";

function getRowData<D>(columns: string[], row: D,
    getCellValue: (row: D, columnIndex: number) => unknown): RowData {

    const values: CellValue[] = []
    for (let i = 0; i < columns.length; i++) {
        const value: CellValue = { value: getCellValue(row, i) }
        values.push(value)
    }

    return { items: values }
}

export const Table = function <D>(props: TableProps<D>): JSX.Element {

    const [page, setPage] = useState<Page<D>>(props.page)
    const [list, setList] = useState<D[]>(props.page.list)
    const [nextCursor, setNextCursor] = useState<string>("")

    useEffect(() => {
        setPage(props.page)
        setList(props.page.list)
    }, [props])

    const scrollEvent = useCallback((cursor: string) => {
        //Usa o cursor para buscar a próxima página e concatenar a lista atual com a lista da próxima página
        props.fetchNextPage(cursor)
            .then((result) => {
                setPage(result);
                setList((prevList) => prevList.concat(result.list));
            })
    }, [props])

    return (
        <div
            className="h-full relative overflow-auto"
            onScroll={(e) => {
                if (!page.hasNextPage) return

                const scrollPosition = e.currentTarget.scrollTop;

                //Define a altura para disparar evento de próxima página.
                const eventHeight = (e.currentTarget.scrollHeight - e.currentTarget.offsetHeight)*0.9;

                if (scrollPosition >= eventHeight) {
                    //Verifica se o cursor mudou, indicando uma nova página.
                    //Isto previne chamadas repetidas que causam lentidão da aplicação
                    if (nextCursor === page.nextCursor) return
                    setNextCursor(page.nextCursor)
                    scrollEvent(page.nextCursor)
                }
            }}
        >
            <table
                className="min-w-full border-collapse table-auto text-left text-sm shadow-md rounded-xl overflow-y-auto"
            >
                <thead className="bg-gray-100 text-gray-700 uppercase tracking-wide sticky top-0 text-xs font-semibold">
                    <tr>
                        {props.columns.map((column) => {
                            return <TableColumn column={column} />
                        })}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {list.map((row) => {
                        const rowData: RowData = getRowData(props.columns, row, props.getCellValue)
                        return <TableRow items={rowData.items} />
                    })}
                </tbody>
            </table>
        </div>
    )
}

interface TableProps<D> {
    columns: string[];
    page: Page<D>;
    getCellValue: (value: D, columnIndex: number) => unknown;
    fetchNextPage: (cursor: string) => Promise<Page<D>>;
}

export interface RowData {
    items: CellValue[];
}

interface CellValue {
    value: any;
}
