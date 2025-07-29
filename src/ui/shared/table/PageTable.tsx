/* eslint-disable react-hooks/exhaustive-deps */
import { ApiResponse } from "@/shared/entities/ApiResponse"
import { Page } from "@/shared/entities/Page"
import { IData } from "@/shared/interfaces/Filter"
import { Paper } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { forwardRef, RefObject, useEffect, useRef, useState } from "react"
import { TableVirtuosoProps, VirtuosoHandle } from "react-virtuoso";

export const VirtuosoTableComponents: TableVirtuosoProps<IData, any>['components'] = {
    Scroller: forwardRef((props, ref) => (
        <TableContainer
            component={Paper}
            {...props}
            ref={ref}
        />)),
    Table: (props) => <Table {...props} className="min-w-max table-fixed border-separate" />,
    TableHead,
    TableRow: (props) => <TableRow className="hover:bg-gray-300" {...props} />,
    TableBody: forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
}

export type PaginationResponse = {
    rows: IData[]
    fetchNextPage: () => void
    scrollRef: RefObject<VirtuosoHandle | null>
}

type PageFetcher = (cursor?: string) => Promise<ApiResponse>

type PaginationProps = {
    fetchPage: PageFetcher
    setLoading: (isLoading: boolean) => void
}

export function usePagination({ fetchPage, setLoading }: PaginationProps): PaginationResponse {

    const [page, setPage] = useState<Page>()
    const [rows, setRows] = useState<IData[]>([])

    const scrollRef = useRef<VirtuosoHandle>(null)

    useEffect(() => {
        setLoading(true)
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
            .finally(() => setLoading(false))
    }, [fetchPage])

    const fetchNextPage = () => {
        if (!page?.hasNextPage) return
        setLoading(true)
        fetchPage(page?.nextCursor)
            .then(response => {
                const newPage: Page = response.json
                setPage(newPage)
                setRows(prev => [...prev, ...newPage.list])
            })
            .catch(() => {
                setPage(undefined)
                setRows([])
            })
            .finally(() => setLoading(false))
    }

    const putScrollAtTop = () => {
        const scrollContainer = scrollRef.current
        if (!scrollContainer) return
        scrollContainer.scrollToIndex({ index: 0 })
    }

    return { rows, fetchNextPage, scrollRef }
}
