import { ComponentRef, HTMLInputTypeAttribute, JSX, useCallback, useEffect, useRef, useState } from "react";
import { TableRow } from "./TableRow";
import { Page } from "../../../types/Page";
import { TableColumn } from "./TableColumn";
import { IData, IFilters } from "@/interfaces/Filter";
import { ApiResponse } from "@/types/ApiResponse";

type TableProps<D> = {
    filter: IFilters
    order: string
    sort: string
    columns: ColumnProps[];
    getCellValue: (value: D, columnName: string) => CellProps;
    fetchPage: (cursor: string) => Promise<ApiResponse>;
    onDeleteRow?: (id: string) => void
    onSaveRow?: (id: string) => void
}

export type RowProps = {
    rowId: string;
    items: CellProps[];
    onDeleteRow?: (id: string) => void
    onSaveRow?: (id: string) => void
}

export type RowCells = {
    [column: string]: CellProps
}

export type CellProps = {
    columnName: string
    value: any;
    type: HTMLInputTypeAttribute;
    isEditable: boolean
    step?: string
}

export type ColumnProps = {
    title: string,
    name: string
}

function getRowData<D extends IData>(columns: ColumnProps[], row: D,
    getCellValue: (row: D, columnName: string) => CellProps): RowProps {

    const values: CellProps[] = []
    for (const column of columns) {
        const value: CellProps = getCellValue(row, column.name)
        values.push(value)
    }

    return { rowId: row.id, items: values }
}

export function Table<D extends IData>(props: TableProps<D>): JSX.Element {

    const scrollRef = useRef<ComponentRef<'div'>>(null)
    const [page, setPage] = useState<Page<D> | null>(null)
    const [pageList, setPageList] = useState<Page<D>[]>([])
    const [index, setIndex] = useState<number>(0)
    const [list, setList] = useState<D[]>([])
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)

        //Usa o cursor para buscar a próxima página e concatenar a lista atual com a lista da próxima página
        props.fetchPage("")
            .then((result) => {
                const page: Page<D> = result.json
                setList(page.list)
                setPage(page)
                setPageList([page])
                setIndex(0)
                setLoading(false)
            })
            .catch(() => {
                setPageList([])
                setPage(null)
                setList([])
                setIndex(0)
                setLoading(false)
            })
    }, [props])

    const putScrollAtTop = () => {
        const scrollContainer = scrollRef.current
        if (!scrollContainer) return
        scrollContainer.scrollTo({ top: scrollContainer.scrollHeight * 0.01 })
    }

    const putScrollAtBottom = () => {
        const scrollContainer = scrollRef.current
        if (!scrollContainer) return
        const scrollHeight = scrollContainer.scrollHeight
        scrollContainer.scrollTo({ top: (scrollHeight * 0.99) - scrollContainer.clientHeight })
    }

    const fetchPreviousData = useCallback(() => {
        setLoading(true)

        const newIndex = index - 1
        const newPage = pageList[newIndex]
        const fillerList = page ? page.list.slice(0, 10) : []
        setIndex(newIndex)
        setPage(newPage)

        if (!newPage) return

        setList([...newPage.list, ...fillerList])
        putScrollAtBottom()
        setLoading(false)
    }, [index, page, pageList])

    const fetchFromList = useCallback(() => {
        const newIndex = index + 1
        const newPage = pageList[newIndex]
        const fillerList = page ? page.list.slice(-10) : []
        setIndex(newIndex)
        setPage(newPage)

        if (!newPage) return

        setList([...fillerList, ...newPage.list])
        putScrollAtTop()
    }, [index, pageList, page])

    const fetchData = useCallback(() => {
        if (!page) return
        if (!page.hasNextPage) return
        if (isLoading) return
        setLoading(true)

        if (index < pageList.length - 1) {
            fetchFromList()
            setLoading(false)
            return
        }

        const fillerList = page ? page.list.slice(-10) : []

        //Usa o cursor para buscar a próxima página e concatenar a lista atual com a lista da próxima página
        props.fetchPage(page.nextCursor)
            .then((result) => {
                const page: Page<D> = result.json
                setPage(page)
                setPageList(list => [...list, page])
                setIndex(index + 1)
                setList([...fillerList, ...page.list])
                putScrollAtTop()
                setLoading(false)
            })
            .catch(() => {
                setIndex(0)
                setPage(null)
                setList([])
                setLoading(false)
            })
    }, [page, isLoading, index, pageList.length, props, fetchFromList])

    const handleScroll = useCallback(() => {
        const scrollContainer = scrollRef.current

        if (!scrollContainer) return
        const scrollHeight = scrollContainer.scrollHeight
        const scrollTopPos = scrollContainer.scrollTop
        const scrollBottomPos = scrollContainer.scrollTop + scrollContainer.clientHeight

        if (scrollTopPos == 0) {
            if (isLoading || index === 0) return
            fetchPreviousData()
            return
        }

        if (scrollBottomPos >= scrollHeight) {
            if (isLoading) return
            fetchData()
        }
    }, [fetchData, fetchPreviousData, index, isLoading])

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
            className="h-full relative overflow-auto flex flex-col"
            ref={scrollRef}
            onScroll={handleScroll}
        >
            <table
                className="min-w-full flex-none border-spacing-0 border-separate table-auto text-left text-sm shadow-md rounded-xl"
            >
                <thead className="sticky bg-gray-700 text-white uppercase tracking-wider top-0 text-sm font-semibold">
                    <tr className="border-y-black">
                        {props.columns.map((column, i) => {
                            const isLast = i === props.columns.length - 1
                            return <TableColumn isLast={isLast} column={column.title} />
                        })}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {list.map((row) => {
                        const rowData: RowProps = getRowData(props.columns, row, props.getCellValue)
                        return <TableRow
                            rowId={row.id}
                            items={rowData.items}
                            onDeleteRow={props.onDeleteRow}
                            onSaveRow={props.onSaveRow}
                        />
                    })}
                </tbody>
            </table>
            {!page ? <EmptyPanel /> : null}
        </div >
    )
}
