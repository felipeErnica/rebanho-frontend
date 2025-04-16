import { ComponentRef, JSX, useCallback, useEffect, useRef, useState } from "react";
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

export function Table<D>(props: TableProps<D>): JSX.Element {

    const divRef = useRef<ComponentRef<'div'>>(null)
    const tableRef = useRef<ComponentRef<'table'>>(null)
    const [page, setPage] = useState<Page<D> | null>(props.page)
    const [list, setList] = useState<D[]>([])
    const [nextCursor, setNextCursor] = useState<string>("")

    useEffect(() => {
        setPage(props.page)
        setList(props.page ? props.page.list : [])
    }, [props])

    const scrollEvent = useCallback((cursor: string) => {
        //Usa o cursor para buscar a próxima página e concatenar a lista atual com a lista da próxima página
        props.fetchNextPage(cursor)
            .then((result) => {
                setPage(result);
                setList((prevList) => prevList.concat(result.list));
            })
    }, [props])

    const EmptyPanel = () => {
        return (
            <div className="bg-gray-200 flex justify-center items-center h-full p-4">
                <i className="text-gray-400 text-2xl">
                    {"Nenhum resultado encontrado!"}
                </i>
            </div>
        )
    }

    return (
        <div
            ref={divRef}
            className="h-full relative overflow-auto flex flex-col"
            onScroll={(e) => {
                if (!page) return
                if (!page.hasNextPage) return

                const scrollPosition = e.currentTarget.scrollTop;

                //Define a altura para disparar evento de próxima página.
                const eventHeight = (e.currentTarget.scrollHeight - e.currentTarget.offsetHeight) * 0.9;

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
                ref={tableRef}
                className="min-w-full flex-none border-spacing-0 border-separate table-auto text-left text-sm shadow-md rounded-xl overflow-y-auto"
            >
                <thead className="sticky bg-gray-200 text-gray-700 uppercase tracking-wider top-0 text-xs font-semibold">
                    <tr className="border-y-black">
                        {props.columns.map((column, i) => {
                            return <TableColumn isLast={i == props.columns.length - 1} column={column} />
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
            {!page ? <EmptyPanel /> : null}
        </div>
    )
}

interface TableProps<D> {
    columns: string[];
    page: Page<D> | null;
    getCellValue: (value: D, columnIndex: number) => unknown;
    fetchNextPage: (cursor: string) => Promise<Page<D>>;
}

export interface RowData {
    items: CellValue[];
}

interface CellValue {
    value: any;
}
