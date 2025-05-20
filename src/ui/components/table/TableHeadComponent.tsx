import { ComponentRef, createRef, useCallback, useEffect, useRef, useState } from "react";
import { ColumnProps } from "./Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

type HeadComponentProps = {
    columns: ColumnProps[]
}

export const TableHeadComponent = ({ columns }: HeadComponentProps) => {

    const DEFAULT_MIN_WIDTH = 20

    const handlerRefs = columns.map(() => createRef<ComponentRef<'div'>>())
    const startXRef = useRef(0)
    const startWidthRef = useRef(0)
    const [index, setIndex] = useState(-1)
    const [columnWidths, setColumnWidths] = useState(
        columns.map(col => col.width || 100)
    );

    const handleMouseDown = (e: React.MouseEvent, i: number) => {
        startXRef.current = e.clientX;
        startWidthRef.current = columnWidths[i]
        setIndex(i);
    };

    //Observa o movimento do mouse para mudar o tamnho da coluna
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (index < 0) return
        const handler = handlerRefs[index].current
        if (!handler) return
        const parent = handler.parentElement
        if (!parent) return
        const dx = e.clientX - startXRef.current
        const width = startWidthRef.current + dx
        const newWidth = Math.max(DEFAULT_MIN_WIDTH, width)
        parent.style.width = `${newWidth}px`
        setColumnWidths(prev => {
            const updated = [...prev];
            updated[index] = newWidth;
            return updated;
        });
    }, [handlerRefs, index])

    //Remove os observadores de evento e libera o mouse
    const removeListeners = useCallback(() => {
        window.removeEventListener('mouseup', removeListeners)
        window.removeEventListener('mousemove', handleMouseMove)
    }, [handleMouseMove])

    //Evento para liberação do mouse
    const handleMouseUp = useCallback(() => {
        setIndex(-1)
        removeListeners()
    }, [removeListeners])

    //Ativa os eventos na inicialização
    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp)
        window.addEventListener('mousemove', handleMouseMove)
        return () => removeListeners()
    }, [columns, handleMouseMove, handleMouseUp, removeListeners])

    return <TableRow >
        {columns.map((column, i) => {
            return <TableCell 
                sx={{ minWidth: `${DEFAULT_MIN_WIDTH}px`, width: `${columnWidths[i]}px` }}
                className={
                    `bg-gray-700 text-white text-nowrap 
                    overflow-hidden overflow-ellipsis`
                }
            >
                <span>{column.title}</span>
                {i < columns.length - 1 ? <div ref={handlerRefs[i]}
                    onMouseDown={(e) => handleMouseDown(e, i) } 
                    className="absolute h-full top-0 right-0 bg-gray-400 cursor-col-resize w-[3px]
                    hover:bg-gray-200"
                /> : null}
            </TableCell>
        })}
    </TableRow>
}
