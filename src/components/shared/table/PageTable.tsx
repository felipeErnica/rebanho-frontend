import { Page } from "@utils/Entities"
import { IData } from "@utils/Entities"
import { Paper } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Dispatch, forwardRef, RefObject, SetStateAction, useCallback, useEffect, useRef, useState } from "react"
import { TableVirtuosoProps, VirtuosoHandle } from "react-virtuoso";
import { VirtuosoNoDataPlaceholder } from "./TableComponents";

export function useVirtuosoComponents(colSpan: number) {

    const [tableComponents, setTableComponents] = useState<TableVirtuosoProps<IData, any>['components']>({
        Scroller: forwardRef((props, ref) => (
            <TableContainer
                component={Paper}
                {...props}
                ref={ref}
            />)),
        Table: (props) => <Table {...props} className="min-w-max table-fixed border-separate" />,
        TableHead: forwardRef((props, ref) => <TableHead {...props} ref={ref} />),
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
        TableHead: forwardRef((props, ref) => <TableHead {...props} ref={ref} />),
        TableRow: (props) => <TableRow className="hover:bg-gray-300" {...props} />,
        TableBody: forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
        EmptyPlaceholder: () => <VirtuosoNoDataPlaceholder {...{ colSpan }} />

    }), [colSpan])

    return tableComponents
}

export type PaginationResponse<T> = {
    setRows: Dispatch<SetStateAction<T[]>>
    rows: T[]
    fetchNextPage: () => void
    scrollRef: RefObject<VirtuosoHandle | null>
    onReload: () => void
}

type PageFetcher<T> = (cursor?: string) => Promise<Page<T>>

type PaginationProps<T> = {
    fetchPage: PageFetcher<T>
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
    }, [ref])

    return tableWidth
}

export function usePagination<T>({ fetchPage, setLoading }: PaginationProps<T>): PaginationResponse<T> {

    const [page, setPage] = useState<Page<T>>()
    const [rows, setRows] = useState<T[]>([])

    const scrollRef = useRef<VirtuosoHandle>(null)

    const onReload = useCallback(() => {
        setLoading(true)
        fetchPage()
            .then((result) => {
                console.log(result)
                const newPage: Page<T> = result
                setPage(newPage)
                setRows(newPage.list)
                putScrollAtTop()
            })
            .catch(() => {
                setPage(undefined)
                setRows([])
            })
            .finally(() => setLoading(false))
    }, [fetchPage, setLoading])

    useEffect(onReload, [onReload])

    const fetchNextPage = () => {
        if (!page?.hasNextPage) return
        setLoading(true)
        fetchPage(page?.nextCursor)
            .then(response => {
                const newPage: Page<T> = response
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

    return { rows, fetchNextPage, scrollRef, onReload, setRows }
}
