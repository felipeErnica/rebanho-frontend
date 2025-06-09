import Typography from "@mui/material/Typography"
import { JSX, useCallback, useState } from "react"

export type ChartContainerProps = {
    graph: (props: ChartProps) => JSX.Element
    className?: string
    title: string
}

export type ChartProps = {
    height: number
}

export const GraphContainer = ({ graph, className, title }: ChartContainerProps) => {

    const [height, setHeight] = useState(0)

    const containerRef = useCallback((node: HTMLDivElement) => {
        if (!node) return

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry) setHeight(entry.target.clientHeight)
            }
        })

        observer.observe(node)
        setHeight(node.clientHeight)
        return () => observer.disconnect()
    }, [])

    return <div
        className={`flex flex-col gap-2 p-3 bg-white border border-gray-200 rounded-md ${className}`}
    >
        <Typography variant="h5">{title}</Typography>
        <div className="flex-auto w-full h-full" ref={containerRef}>
            {graph({ height })}
        </div>
    </div>
}
