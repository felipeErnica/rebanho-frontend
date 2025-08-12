import { Skeleton, TableFooter, TableRow, Typography } from "@mui/material"
import TableCell from "@mui/material/TableCell"
import { ForwardedRef, ReactNode, Ref, RefObject, useRef } from "react"

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
}

export const TableHeadCell = ({ children, colSpan, className, width }: CommonTableHeadProps) => {
    return <TableCell
        className={`bg-gray-700 border-none text-white ${className}`}
        colSpan={colSpan}
        sx={{ width }}
    >
        {children}
    </TableCell>
}

type ResizableTableHeadCellProps = {
    children?: ReactNode
    className?: string
    colSpan?: number
    width?: string | number
}

export const ResizableHeadCell = ({ children, colSpan, className, width }: ResizableTableHeadCellProps) => {

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
        sx={{ width, minWidth: width ?? 80 }}
        colSpan={colSpan}
    >
        <span>{children}</span>
        <div
            ref={handlerRef}
            onMouseDown={handleMouseDown}
            className="absolute h-full top-0 right-0 bg-gray-400 cursor-col-resize w-[3px] hover:bg-gray-200"
        />
    </TableCell>
}

type VirtuosoHeadCellProps = {
    children?: ReactNode
    className?: string
    colSpan?: number
    width: number
}

export const VirtuosoHeadCell = ({ children, colSpan, className, width }: VirtuosoHeadCellProps) => {
    return <TableCell
        className={`bg-gray-700 border-none text-white text-nowrap ${className}`}
        colSpan={colSpan}
        sx={{ minWidth: width, width }}
    >
        {children}
    </TableCell>
}

export const VirtuosoResizeHeadCell = ({ children, colSpan, className, width }: VirtuosoHeadCellProps) => {

    const DEFAULT_MIN_WIDTH = width

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
        className={`relative bg-gray-700 border-none text-white text-nowrap 
          overflow-hidden overflow-ellipsis ${className}`
        }
        sx={{ minWidth: DEFAULT_MIN_WIDTH, width }}
        colSpan={colSpan}
    >
        {children}
        <div
            ref={handlerRef}
            onMouseDown={handleMouseDown}
            className="absolute h-full top-0 right-0 bg-gray-400 cursor-col-resize w-[3px] hover:bg-gray-200"
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
        ref={ref as Ref<HTMLTableRowElement>}
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
    align?: 'left' | 'right' | 'center' | 'justify'
}

export const TableBodyCell = ({ children, className, colSpan, align }: TableBodyCellProps) => {
    return <TableCell
        className={`border-b border-b-gray-400 overflow-hidden text-nowrap overflow-ellipsis ${className}`}
        align={align}
        colSpan={colSpan}
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

export const TableFooterRow = ({ children, className, style, ref }: TableBodyRowProps) => {
    return <TableRow
        ref={ref as Ref<HTMLTableRowElement>}
        style={style}
        className={`bg-white ${className}`}
    >
        {children}
    </TableRow>
}

export const TableFooterTitleCell = ({ children, className, colSpan }: TableBodyCellProps) => {
    return <TableCell
        className={`bg-gray-700 border-t border-gray-400 font-bold text-white ${className}`}
        colSpan={colSpan}
    >
        <Typography variant="body2">{children}</Typography>
    </TableCell>
}

export const TableFooterCell = ({ children, className, colSpan }: TableBodyCellProps) => {
    return <TableCell
        size="small"
        className={`border-t border-gray-400 overflow-hidden text-nowrap overflow-ellipsis ${className}`}
        colSpan={colSpan}
    >
        {children}
    </TableCell>
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
