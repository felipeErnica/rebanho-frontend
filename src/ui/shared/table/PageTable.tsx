/* eslint-disable react-hooks/exhaustive-deps */
import { ApiResponse } from "@/shared/entities/ApiResponse"
import { Page } from "@/shared/entities/Page"
import { IData } from "@/shared/interfaces/Filter"
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React from "react";
import { RefObject, useEffect, useRef, useState } from "react"
import { TableComponents } from "react-virtuoso";

export const VirtuosoTableComponents: TableComponents<IData> = {
    Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
        <div {...props} ref={ref} />
    )),
    Table: (props) => (
        <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
    ),
    TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableHead {...props} ref={ref} />
    )),
    TableRow: (props) => <TableRow className="hover:bg-gray-300" {...props} />,
    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableBody {...props} ref={ref} />
    )),
};

export type PaginationResponse = {
    rows: IData[]
    onReload: () => void
    isPageLoading: boolean
    scrollRef: RefObject<HTMLDivElement | null>
    handleScroll: () => void
    calculateRef: () => void
}

type PageFetcher = (cursor?: string) => Promise<ApiResponse>

export function usePagination(fetchPage: PageFetcher): PaginationResponse {

    const [isPageLoading, setPageLoading] = useState(false)
    const [page, setPage] = useState<Page>()
    const [rows, setRows] = useState<IData[]>([])

    const scrollRef = useRef<HTMLDivElement>(null)
    const heightRef = useRef<number>(0)

    const onReload = () => {
        setPageLoading(true)
        fetchPage()
            .then((result) => {
                const newPage: Page = result.json
                setPage(newPage)
                setRows(newPage.list)
                putScrollAtTop()
            })
            .catch(() => {
                setPage(undefined)
                setRows([])
            })
            .finally(() => setPageLoading(false))
    }

    useEffect(() => onReload(), [])

    const calculateRef = () => {
        const scrollContainer = scrollRef.current
        if (!scrollContainer) return
        heightRef.current = scrollContainer.scrollHeight - 1
    }

    const putScrollAtTop = () => {
        const scrollContainer = scrollRef.current
        if (!scrollContainer) return
        scrollContainer.scrollTo({ top: 0 })
    }

    const fetchData = () => {
        if (!page) return
        if (!page.hasNextPage) return

        //Usa o cursor para buscar a próxima página e concatenar a lista atual com a lista da próxima página
        setPageLoading(true)
        fetchPage(page.nextCursor)
            .then((result) => {
                const newPage: Page = result.json
                setPage(newPage)
                setRows(prev => [...prev, ...newPage.list])
            })
            .catch(() => {
                setPage(undefined)
                setRows([])
            })
            .finally(() => setPageLoading(false))
    }

    const handleScroll = () => {
        const scrollContainer = scrollRef.current
        calculateRef()
        if (!scrollContainer) return
        const scrollBottomPos = scrollContainer.scrollTop + scrollContainer.clientHeight
        const scrollHeight = heightRef.current
        if (scrollBottomPos >= scrollHeight && !isPageLoading) {
            fetchData()
        }
    }

    return { handleScroll, onReload, rows, calculateRef, scrollRef, isPageLoading }

}
