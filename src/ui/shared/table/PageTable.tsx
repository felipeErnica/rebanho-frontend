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
import { forwardRef, RefObject, useCallback, useEffect, useRef, useState } from "react"
import { TableVirtuosoProps, VirtuosoHandle } from "react-virtuoso";
import { VirtuosoNoDataPlaceholder } from "./TableComponents";

export function useVirtuosoComponents(colSpan: number) {

    const [tableComponents, setTableComponents] = useState<TableVirtuosoProps<IData,any>['components']>({
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
        EmptyPlaceholder: () => <VirtuosoNoDataPlaceholder {...{ colSpan }} />
    })

    useEffect(() => setTableComponents({
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
        EmptyPlaceholder: () => <VirtuosoNoDataPlaceholder {...{ colSpan }} />

    }), [])

    return tableComponents
}

export type PaginationResponse<T> = {
    rows: T[]
    fetchNextPage: () => void
    scrollRef: RefObject<VirtuosoHandle | null>
    onReload: () => void
}

type PageFetcher = (cursor?: string) => Promise<ApiResponse>

type PaginationProps = {
    fetchPage: PageFetcher
    setLoading: (isLoading: boolean) => void
}

export function useTableResizer(ref: HTMLDivElement | null) {

    const [tableWidth, setTableWidth] = useState(0)

    useEffect(() => {
        const handleResize = () => {
            if (!ref) return
            setTableWidth(ref.offsetWidth)
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return tableWidth
}

export function usePagination<T>({ fetchPage, setLoading }: PaginationProps): PaginationResponse<T> {

    const [page, setPage] = useState<Page<T>>()
    const [rows, setRows] = useState<T[]>([])

    const scrollRef = useRef<VirtuosoHandle>(null)

    const onReload = useCallback(() => {
        setLoading(true)
        fetchPage()
            .then((result) => {
                const newPage: Page<T> = result.json
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

    useEffect(onReload, [onReload])

    const fetchNextPage = () => {
        if (!page?.hasNextPage) return
        setLoading(true)
        fetchPage(page?.nextCursor)
            .then(response => {
                const newPage: Page<T> = response.json
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

    return { rows, fetchNextPage, scrollRef, onReload }
}
