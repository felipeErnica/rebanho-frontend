import { ComponentRef, JSX, useCallback, useEffect, useRef, useState } from "react";
import { TableRow } from "./TableRow";
import { Page } from "../../../types/Page";
import { TableColumn } from "./TableColumn";
import { IFilters } from "@/interfaces/Filter";

type TableProps<D> = {
    filter: IFilters
    order: string
    sort: string
    columns: string[];
    getCellValue: (value: D, columnIndex: number) => unknown;
    fetchPage: (cursor: string) => Promise<Page<D>>;
    controlButtons?: JSX.Element[]
}

export type RowData = {
    items: CellValue[];
    controlButtons?: JSX.Element[]
}

type CellValue = {
    value: any;
}

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
                setList(result.list)
                setPage(result)
                setPageList([result])
                setIndex(0)
                setLoading(false)
            })
            .catch(() => {
                setPage(null)
                setList([])
                setLoading(false)
            })
    }, [props])

    const putScrollAtTop = () => {
        const scrollContainer = scrollRef.current
        if (!scrollContainer) return
        scrollContainer.scrollTo({ top: scrollContainer.scrollHeight * 0.15 })
    }

    const putScrollAtBottom = () => {
        const scrollContainer = scrollRef.current
        if (!scrollContainer) return
        const scrollHeight = scrollContainer.scrollHeight
        scrollContainer.scrollTo({ top: scrollHeight * 0.75 })
    }

    const fetchPreviousData = useCallback(() => {
        console.log("fetching previous")
        setLoading(true)

        const newIndex = index - 1
        const newPage = pageList[newIndex]
        setIndex(newIndex)
        setPage(newPage)

        if (!newPage) return

        setList(newPage.list)
        putScrollAtBottom()
        setLoading(false)
    }, [index])

    const fetchFromList = useCallback(() => {
        const newIndex = index + 1
        const newPage = pageList[newIndex]
        setIndex(newIndex)
        setPage(newPage)

        if (!newPage) return

        setList(newPage.list)
        putScrollAtTop()
    }, [index])

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

        //Usa o cursor para buscar a próxima página e concatenar a lista atual com a lista da próxima página
        props.fetchPage(page.nextCursor)
            .then((result) => {
                setPage(result)
                setPageList(list => [...list, page])
                setIndex(index + 1)
                setList(result.list)
                putScrollAtTop()
                setLoading(false)
            })
            .catch(() => {
                setPage(null)
                setList([])
                setLoading(false)
            })
    }, [props, page, isLoading])

    useEffect(() => {
        const scrollContainer = scrollRef.current

        if (!scrollContainer) return

        const handleScroll = () => {
            const scrollHeight = scrollContainer.scrollHeight
            const scrollPos = scrollContainer.scrollTop

            if (scrollPos <= scrollHeight * 0.1) {
                if (isLoading || index === 0) return
                fetchPreviousData()
                return
            }

            if (scrollPos >= scrollHeight * 0.8) {
                if (isLoading) return
                fetchData()
                return
            }
        }

        scrollContainer.addEventListener('scroll', handleScroll)
        return () => scrollContainer.removeEventListener('scroll', handleScroll)
    }, [props, isLoading, index])

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
        >
            <table
                className="min-w-full flex-none border-spacing-0 border-separate table-auto text-left text-sm shadow-md rounded-xl"
            >
                <thead className="sticky bg-gray-700 text-white uppercase tracking-wider top-0 text-xl font-semibold">
                    <tr className="border-y-black">
                        {props.columns.map((column, i) => {
                            return <TableColumn isLast={props.controlButtons ? false : i == props.columns.length} column={column} />
                        })}
                        {props.controlButtons ? <TableColumn isLast={true} column="" /> : null}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {list.map((row) => {
                        const rowData: RowData = getRowData(props.columns, row, props.getCellValue)
                        return <TableRow items={rowData.items} controlButtons={props.controlButtons} />
                    })}
                </tbody>
            </table>
            {!page ? <EmptyPanel /> : null}
        </div >
    )
}
