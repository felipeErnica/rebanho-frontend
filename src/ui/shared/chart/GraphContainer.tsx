import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { ReactNode } from "react"

export type ChartContainerProps = {
    children: ReactNode | ReactNode[]
    className?: string
    height?: string | number
    title: string
}

export const GraphContainer = ({ children, className, title, height }: ChartContainerProps) => {
    return <Paper
        variant="outlined"
        className={`flex flex-col gap-2 p-3 bg-white ${className}`}
    >
        <Typography variant="h5">{title}</Typography>
        <div className="grow" style={{ height: height }} >
            {children}
        </div>
    </Paper>
}
