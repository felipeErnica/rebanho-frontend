import { Skeleton, TableRow } from "@mui/material"
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
}

export const TableHeadCell = ({ children, colSpan, className }: CommonTableHeadProps) => {
    return <TableCell
        className={`bg-gray-700 border-none text-white ${className}`}
        colSpan={colSpan}
    >
        {children}
    </TableCell>
}

export const ResizableTableHeadCell = ({ children, colSpan, className }: CommonTableHeadProps) => {

    const DEFAULT_MIN_WIDTH = 20

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
        className={`bg-gray-700 border-none text-white text-nowrap 
          overflow-hidden overflow-ellipsis ${className}`
        }
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
}

export const TableBodyCell = ({ children, className }: TableBodyCellProps) => {
    return <TableCell
        className={`border-b border-b-gray-400 overflow-hidden text-nowrap overflow-ellipsis ${className}`}
    >
        {children}
    </TableCell>
}

type TableLoadingRowProps = {
    colSpan: number
}

export const TableLoadingRow = ({ colSpan }: TableLoadingRowProps) => {
    return <TableRow>
        <TableCell colSpan={colSpan}>
            <Skeleton animation='wave' variant="rectangular" />
        </TableCell>
    </TableRow>
}
