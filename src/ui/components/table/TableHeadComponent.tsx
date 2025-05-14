import TableCell from "@mui/material/TableCell";
import { ComponentRef, useCallback, useEffect, useRef, useState } from "react";
import { ColumnProps } from "./Table";

type HeadComponentProps = {
    tableRef: ComponentRef<'div'> | null
    column: ColumnProps
    isLast: boolean
    index: number
    columnsWidth: string[]
    setColumnWidth: (widths: string[]) => void
    setTemplateColumn: (template: string) => void
}

export const TableHeadComponent = ({ 
    column, 
    isLast, 
    columnsWidth, 
    setColumnWidth, 
    setTemplateColumn,
    tableRef,
    index }: HeadComponentProps) => {

    const [activeHandler, setActiveHandler] = useState<HTMLDivElement | null>(null)
    const refHandle = useRef<ComponentRef<'div'>>(null)

    //Observa o movimento do mouse para mudar o tamnho da coluna
    const handleMouseMove = useCallback((e: MouseEvent) => {
        const handler = activeHandler
        if (!handler) return

        const parent = handler.parentElement

        if (!parent) return
        const width = e.clientX - parent.offsetLeft
        parent.style.width = `${width}px`
        columnsWidth[index] = `${width}px`
        setColumnWidth(columnsWidth)
        setTemplateColumn(columnsWidth.join('_'))
    }, [activeHandler, columnsWidth, index, setColumnWidth, setTemplateColumn])

    //Remove os observadores de evento e libera o mouse
    const removeListeners = useCallback(() => {
        window.removeEventListener('mouseup', removeListeners)
        window.removeEventListener('mousemove', handleMouseMove)
    }, [handleMouseMove])

    //Evento para liberação do mouse
    const handleMouseUp = useCallback(() => {
        setActiveHandler(null)
        removeListeners()
    }, [removeListeners])

    //Ativa os eventos na inicialização
    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp)
        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            removeListeners()
        }
    }, [column.width, handleMouseMove, handleMouseUp, removeListeners])

    return <TableCell
        className={`bg-gray-700 text-white`}
    >
        {column.title}
        {!isLast ? <div ref={refHandle}
            onMouseDown={() => setActiveHandler(refHandle.current)}
            className="absolute h-full top-0 right-0 bg-gray-400 cursor-col-resize w-[2px]
                hover:bg-gray-300"
        /> : null}
    </TableCell>
}
