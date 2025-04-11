import { JSX, MouseEventHandler, useState } from "react"

export const TableColumn = ({column}: TableColumnProps): JSX.Element => {

    const [columnWidth, setColumnWidth] = useState(0)
    const [startPos, setStartPos] = useState<MouseCoords>()

    const handleMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
        const element = e.currentTarget

        const currentStartPos = {
            posX: e.clientX,
            posY: e.clientY
        }

        setStartPos(currentStartPos)

        const parent = element.parentElement
        if (!parent) return
        const styles = window.getComputedStyle(parent)
        setColumnWidth(parseInt(styles.width, 10))
    }

    const handleMouseMove:MouseEventHandler<HTMLDivElement> = (e) => {
        const element = e.currentTarget
        const parent = element.parentElement

        console.log(startPos)

        if (!parent) return
        if (!startPos) return

        const dx = e.clientX - startPos.posX;
        parent.style.width = `${columnWidth + dx}`;
    };


    return (
        <th className="relative px-6 py-4 border-b">
            {column}
            <div className="absolute top-0 right-0 bg-gray-200 cursor-col-resize h-full w-0.5
                hover:bg-blue-100" 
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
            />
        </th>
    )
}

interface TableColumnProps {
    column: string;
}

interface MouseCoords {
    posX: number;
    posY: number;
}
