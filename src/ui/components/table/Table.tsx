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
    const divRef = useRef<ComponentRef<'div'>>(null)
    const [page, setPage] = useState<Page<D> | null>(null)
    const [list, setList] = useState<D[]>([])
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)

        //Usa o cursor para buscar a próxima página e concatenar a lista atual com a lista da próxima página
        props.fetchPage("")
            .then((result) => {
                setList(result.list)
                setPage(result)
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
        scrollContainer.scrollTo({ top: 0 })
    }


    const fetchData = useCallback(() => {
        if (!page) return
        if (!page.hasNextPage) return
        if (isLoading) return
        setLoading(true)

        //Usa o cursor para buscar a próxima página e concatenar a lista atual com a lista da próxima página
        props.fetchPage(page.nextCursor)
            .then((result) => {
                setPage(result)
                setList(result.list)
                setLoading(false)
                putScrollAtTop()
            })
            .catch(() => {
                setPage(null)
                setList([])
                setLoading(false)
            })
    }, [props, page, isLoading])

    useEffect(() => {
        const loader = divRef.current
        const observer = new IntersectionObserver((entries) => {
            const target = entries[0]
            if (target.isIntersecting) {
                console.log("fetching")
                fetchData()
            }
        }, { threshold: 1 })

        if (loader) {
            observer.observe(loader)
        }

        return () => {
            if (loader) {
                observer.unobserve(loader)
            }
        }
    }, [fetchData])

    const EmptyPanel = () => {
        return (
            <div className="bg-gray-200 flex justify-center items-center h-full p-4">
                <i className="text-gray-400 text-2xl">
                    {"Nenhum resultado encontrado!"}
                </i>
            </div>
        )
    }

    const BottomLoadingElement = () => {
        if (page?.hasNextPage) return
        return <div ref={divRef} className="bg-gray-100 justify-center items-center flex flex-row" >
            {isLoading ? <>
                <span className="h-full text-gray-400 text-6xl animate-pulse ease-in-out">....</span>
            </> : null}
        </div>
    }

    return (
        <div
            className="h-full relative overflow-auto flex flex-col"
            ref={scrollRef}
        >
            <table
                className="min-w-full flex-none border-spacing-0 border-separate table-auto text-left text-sm shadow-md rounded-xl"
            >
                <thead className="sticky bg-gray-700 text-white uppercase tracking-wider top-0 text-xs font-semibold">
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
            {!page && isLoading ? <EmptyPanel /> : null}
            <BottomLoadingElement />
        </div >
    )
}

