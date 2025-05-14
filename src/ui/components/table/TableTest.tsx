import { ComponentRef, HTMLInputTypeAttribute, JSX, useCallback, useEffect, useRef, useState } from "react";
import { Page } from "../../../types/Page";
import { IData, IFilters } from "@/interfaces/Filter";
import { ApiResponse } from "@/types/ApiResponse";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { TableHeadComponent } from "./TableHeadComponent";
import { ColumnProps } from "./Table";
import { TestWidth } from "./TestWidth";

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

export function TableTest<D extends IData>(props: TableProps<D>): JSX.Element {

    const scrollRef = useRef<ComponentRef<'div'>>(null)
    const [page, setPage] = useState<Page<D> | null>(null)
    const [pageList, setPageList] = useState<Page<D>[]>([])
    const [index, setIndex] = useState<number>(0)
    const [list, setList] = useState<D[]>([])
    const [isLoading, setLoading] = useState(false)
    const [templateColumn, setTemplateColumn] = useState('')
    const [columnsWidth, setColumnsWidth] = useState<string[]>([])


    useEffect(() => {
        setLoading(true)

        const columnsWidth = props.columns.map(column => column.width ? `${column.width}px` : '1fr')
        setColumnsWidth(columnsWidth)

        const templateColumn = columnsWidth.join(' ')
        setTemplateColumn(templateColumn)
        console.log(templateColumn)

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

    return <div>
        <div style={{ display: 'grid', gridTemplateColumns: templateColumn}} className={`w-full`}>
            {props.columns.map((column, i) => {
                return <TestWidth
                    setColumnWidth={setColumnsWidth}
                    setTemplateColumn={setTemplateColumn}
                    columnsWidth={columnsWidth}
                    index={i}
                    column={column}
                    isLast={i === props.columns.length - 1}
                />
            })}
        </div>
        <div
            className={`h-full overflow-scroll`}
            ref={scrollRef}
            onScroll={handleScroll}
        >
            <Table stickyHeader >
                <TableHead >
                    <TableRow>
                        {props.columns.map((column, i) => {
                            return <TableHeadComponent
                                tableRef={scrollRef.current}
                                setColumnWidth={setColumnsWidth}
                                setTemplateColumn={setTemplateColumn}
                                columnsWidth={columnsWidth}
                                index={i}
                                column={column}
                                isLast={i === props.columns.length - 1}
                            />
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {list.map((row) => {
                        return <TableRow hover key={row.id}>
                            {props.columns.map((column) => {
                                const value: any = row[column.name]
                                return <TableCell>{value}</TableCell>
                            })}
                        </TableRow>
                    })}
                </TableBody>
            </Table>
        </div >
    </div>
}
