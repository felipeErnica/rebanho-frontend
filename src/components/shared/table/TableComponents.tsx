import { Skeleton, TableFooter, TableRow, Typography } from "@mui/material"
import TableCell from "@mui/material/TableCell"
import { ForwardedRef, ReactNode, Ref, RefObject, useRef } from "react"
import { TrendComponent, TrendComponentProps } from "@shared/dashboard/DashboardComponents"

type NoDataPlaceholderProps = {
    colSpan: number
}

export const NoDataPlaceholder = ({ colSpan }: NoDataPlaceholderProps) => {
    return <TableRow>
        <TableCell height={'100%'} colSpan={colSpan}>
            <Typography align="center" variant="body1">Não há dados disponíveis</Typography>
        </TableCell>
    </TableRow>
}

export const VirtuosoNoDataPlaceholder = ({ colSpan }: NoDataPlaceholderProps) => {
    return <TableCell colSpan={colSpan}>
        <div className="flex flex-col p-10 items-center">
            <Typography align="center" variant="body1">Não há dados disponíveis</Typography>
        </div>
    </TableCell>
}

type TableBodyContainerProps<T> = {
    dataset: T[]
    colSpan: number
    render: (row: T) => ReactNode | ReactNode[]
    loading?: boolean
}

export function TableBodyContainer<T>({ dataset, render, loading, colSpan }: TableBodyContainerProps<T>) {
    if (loading) return Array(30).fill(<TableLoadingRow colSpan={colSpan} />)

    if (!dataset || dataset.length === 0) return <NoDataPlaceholder {...{ colSpan }} />
    return dataset.map(render)
}

type TablePageContainerProps = {
    children: ReactNode | ReactNode[]
}

export const TablePageContainer = ({ children }: TablePageContainerProps) => {
    return <div className="w-full h-full flex flex-col overflow-hidden">
        {children}
    </div>
}

type TableHeadRowProps = {
    children?: ReactNode | ReactNode[]
    className?: string
}

export const TableHeadRow = ({ children, className }: TableHeadRowProps) => {
    return <TableRow className={`bg-gray-700 ${className}`} >
        {children}
    </TableRow>
}

type CommonTableHeadProps = {
    children?: ReactNode
    className?: string
    colSpan?: number
    width?: number | string
    align?: 'left' | 'right' | 'center' | 'justify'
}

export const TableHeadCell = ({ children, colSpan, className, width, align }: CommonTableHeadProps) => {
    return <TableCell
        className={`bg-gray-700 border-none text-white text-nowrap ${className}`}
        colSpan={colSpan}
        sx={{ width: width ?? 'auto' }}
        align={align}
    >
        {children}
    </TableCell>
}

export const TableHeadControlCell = ({ children, colSpan, className, width, align }: CommonTableHeadProps) => {
    return <TableCell
        className={`bg-gray-700 border-none text-white text-nowrap ${className}`}
        colSpan={colSpan}
        sx={{ width: width ?? 200 }}
        align={align}
    >
        {children}
    </TableCell>
}

type ResizableTableHeadCellProps = {
    children?: ReactNode
    className?: string
    colSpan?: number
    width?: string | number
    align?: 'left' | 'right' | 'center' | 'justify'
}

export const ResizableHeadCell = ({ children, colSpan, className, width, align }: ResizableTableHeadCellProps) => {

    const handlerRef = useRef<HTMLDivElement>(null)

    //Observa o movimento do mouse para mudar o tamnho da coluna
    const handleMouseMove = (e: MouseEvent) => {
        const handler = handlerRef.current
        if (!handler) return
        const parent = handler.parentElement
        if (!parent) return
        const width = e.clientX - parent.getBoundingClientRect().left
        parent.style.width = `${width}px`
    }

    //Evento para liberação do mouse
    //Remove os observadores de evento e libera o mouse
    const handleMouseUp = () => {
        window.removeEventListener('mouseup', handleMouseUp)
        window.removeEventListener('mousemove', handleMouseMove)
    }

    //Adiciona os observadores de evento de mouse
    const handleMouseDown = () => {
        window.addEventListener('mouseup', handleMouseUp)
        window.addEventListener('mousemove', handleMouseMove)
    }

    return <TableCell
        className={`bg-gray-700 border-none text-white text-nowrap 
          overflow-hidden overflow-ellipsis ${className}`
        }
        sx={{ width: width ?? 'auto', minWidth: 80 }}
        colSpan={colSpan}
        align={align}
    >
        <span>{children}</span>
        <div
            ref={handlerRef}
            onMouseDown={handleMouseDown}
            className="absolute h-full top-0 right-0 bg-gray-400 cursor-col-resize w-0.5 hover:bg-gray-200"
        />
    </TableCell>
}

type VirtuosoHeadCellProps = {
    children?: ReactNode
    className?: string
    colSpan?: number
    width?: number
    align?: 'left' | 'right' | 'center' | 'justify'
}

export const VirtuosoHeadCell = ({ children, colSpan, className, width, align }: VirtuosoHeadCellProps) => {
    return <TableCell
        className={`bg-gray-700 border-none text-white text-nowrap ${className}`}
        colSpan={colSpan}
        sx={{ width: width ?? 'auto' }}
        align={align}
    >
        {children}
    </TableCell>
}

export const VirtuosoResizeHeadCell = ({ children, colSpan, className, width, align }: VirtuosoHeadCellProps) => {

    const DEFAULT_MIN_WIDTH = 80

    const handlerRef = useRef<HTMLDivElement>(null)

    //Observa o movimento do mouse para mudar o tamnho da coluna
    const handleMouseMove = (e: MouseEvent) => {
        const handler = handlerRef.current
        if (!handler) return
        const parent = handler.parentElement
        if (!parent) return
        const width = e.clientX - parent.getBoundingClientRect().left
        const newWidth = Math.max(DEFAULT_MIN_WIDTH, width)
        parent.style.width = `${newWidth}px`
    }


    //Evento para liberação do mouse
    //Remove os observadores de evento e libera o mouse
    const handleMouseUp = () => {
        window.removeEventListener('mouseup', handleMouseUp)
        window.removeEventListener('mousemove', handleMouseMove)
    }

    //Adiciona os observadores de evento de mouse
    const handleMouseDown = () => {
        window.addEventListener('mouseup', handleMouseUp)
        window.addEventListener('mousemove', handleMouseMove)
    }

    return <TableCell
        className={`relative bg-gray-700 border-none text-white  
                    text-nowrap overflow-hidden overflow-ellipsis ${className}`}
        sx={{ minWidth: DEFAULT_MIN_WIDTH, width: width ?? 'auto' }}
        colSpan={colSpan}
        align={align}
    >
        {children}
        <div
            ref={handlerRef}
            onMouseDown={handleMouseDown}
            className="absolute h-full top-0 right-0 bg-gray-400 cursor-col-resize w-0.5 hover:bg-gray-200"
        />
    </TableCell>
}

export type TableBodyRowProps = {
    children?: ReactNode | ReactNode[]
    style?: React.CSSProperties
    className?: string
    ref?: RefObject<HTMLTableSectionElement> | ForwardedRef<HTMLTableSectionElement>
}

export const TableBodyRow = ({ children, className, style, ref }: TableBodyRowProps) => {
    return <TableRow
        ref={ref as unknown as Ref<HTMLTableRowElement>}
        style={style}
        className={`hover:bg-gray-300 ${className}`}
    >
        {children}
    </TableRow>
}

type TableBodyCellProps = {
    children?: ReactNode
    className?: string
    colSpan?: number
    width?: number
    align?: 'left' | 'right' | 'center' | 'justify'
}

export const TableBodyCell = ({ children, className, colSpan, align, width }: TableBodyCellProps) => {
    return <TableCell
        className={`border-b border-b-gray-400 overflow-hidden text-nowrap overflow-ellipsis ${className}`}
        align={align ?? 'inherit'}
        colSpan={colSpan}
        width={width}
    >
        {children}
    </TableCell>
}

type StickyTableFooterProps = {
    children?: ReactNode | ReactNode[]
    className?: string
}

export const StickyTableFooter = ({ className, children }: StickyTableFooterProps) => {
    return <TableFooter className={`bottom-0 sticky ${className}`}>
        {children}
    </TableFooter>
}

type TableFooterRowProps = TableBodyRowProps & {
    colSpan: number
}

export const TableFooterRow = ({ children, className, style, ref, colSpan }: TableFooterRowProps) => {
    return <TableRow
        ref={ref as unknown as Ref<HTMLTableRowElement>}
        style={style}
        className={`bg-white ${className}`}
    >
        <TableCell
            size="small"
            className={`border-t border-gray-400 overflow-hidden text-nowrap overflow-ellipsis`}
            colSpan={colSpan}
        >
            <div className="flex flex-row gap-52">
                {children}
            </div>
        </TableCell>
    </TableRow>
}

type FooterContentProps = {
    title: string
    content: ReactNode
}

export const FooterContent = ({ title, content }: FooterContentProps) => {
    return <div className="flex flex-col gap-2">
        <Typography color='textPrimary' variant="body2">{title}</Typography>
        <Typography fontSize={16} variant="h6">{content}</Typography>
    </div>
}

type TableLoadingRowProps = {
    colSpan: number
}

export const TableLoadingRow = ({ colSpan }: TableLoadingRowProps) => {
    return <TableRow>
        <TableLoadingCells colSpan={colSpan} />
    </TableRow>
}

export const TableLoadingCells = ({ colSpan }: TableLoadingRowProps) => {
    return Array(colSpan).fill((
        <TableCell>
            <Skeleton animation='wave' variant="rounded" />
        </TableCell>
    ))
}

type TrendValuesProps = {
    value: string | number
    trendProps: TrendComponentProps
}

export const TrendValues = ({ value, trendProps }: TrendValuesProps) => {
    return <div className="inline-flex items-center gap-2">
        {value}
        <TrendComponent {...trendProps} />
    </div>
}

type TablePageBodyProps<T> = {
    dataset: T[]
    render: (row: T) => ReactNode | ReactNode[]
    loading: boolean
    colSpan: number
}

export function TablePageBody<T>({ dataset, render, loading, colSpan }: TablePageBodyProps<T>) {

    if (loading) return Array(30).fill(<TableLoadingRow colSpan={colSpan} />)

    if (dataset.length === 0) {
        return <TableRow>
            <TableCell colSpan={colSpan}>
                <Typography align="center" variant="body1">Não há dados disponíveis</Typography>
            </TableCell>
        </TableRow>
    }

    return dataset.map(render)
}

type VirtuosoRowRenderProps = {
    render: () => ReactNode | ReactNode[]
    loading: boolean
    colSpan: number
}

export function VirtuosoRowRender({ render, loading, colSpan }: VirtuosoRowRenderProps) {
    if (loading) return <TableLoadingCells colSpan={colSpan} />
    return render()
}
