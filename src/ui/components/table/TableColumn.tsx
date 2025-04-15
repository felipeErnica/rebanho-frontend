import { ComponentRef, JSX, useCallback, useEffect, useRef, useState } from "react"

export const TableColumn = ({ column }: TableColumnProps): JSX.Element => {

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
    }, [activeHandler])

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

    }, [handleMouseMove, handleMouseUp, removeListeners])

    return (
        <th className="relative px-6 py-4">
            <span className="overflow-ellipsis block">{column}</span>
            <div ref={refHandle}
                onMouseDown={() => setActiveHandler(refHandle.current)}
                className="absolute h-full top-0 right-0 bg-gray-400 cursor-col-resize w-[2px]
                hover:bg-gray-300"
            />
        </th>
    )
}

interface TableColumnProps {
    column: string;
}
