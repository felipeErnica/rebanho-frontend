import { ComponentRef, createRef, useCallback, useEffect, useState } from "react";
import { ColumnProps } from "./Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

type HeadComponentProps = {
    columns: ColumnProps[]
}

export const TableHeadComponent = ({ columns }: HeadComponentProps) => {

    const DEFAULT_MIN_WIDTH = 50

    const handlerRefs = columns.map(() => createRef<ComponentRef<'div'>>())
    const [index, setIndex] = useState(-1)

    //Observa o movimento do mouse para mudar o tamnho da coluna
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (index < 0) return
        const handler = handlerRefs[index].current
        if (!handler) return

        const parent = handler.parentElement

        if (!parent) return
        const width = e.clientX - parent.offsetLeft

        const newWidth = width < DEFAULT_MIN_WIDTH ? `${DEFAULT_MIN_WIDTH}px` : `${width}px`
        parent.style.width = newWidth
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


    return <TableRow>
        {columns.map((column, i) => {
            const width = column.width ? `${column.width}px` : '100px'
            return <TableCell
                style={{
                    width: width,
                    minWidth: `${DEFAULT_MIN_WIDTH}px`
                }}
                className={ `relative bg-gray-700 grow text-white text-nowrap overflow-hidden overflow-ellipsis` }
            >
                <span>{column.title}</span>
                {i < columns.length - 1 ? <div ref={handlerRefs[i]}
                    onMouseDown={() => setIndex(i)}
                    className="absolute h-full top-0 right-0 bg-gray-400 cursor-col-resize w-[2px]
                hover:bg-gray-300"
                /> : null}
            </TableCell>
        })}
    </TableRow>
}
