import TrendingDown from "@mui/icons-material/TrendingDown"
import TrendingUp from "@mui/icons-material/TrendingUp"
import HorizontalRule from "@mui/icons-material/HorizontalRule"
import Card from "@mui/material/Card"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { ReactNode } from "react"
import { Skeleton, TableCell, TableRow } from "@mui/material"
import { trendingTransform } from "@utils/Transformations"
import { TableLoadingRow } from "@shared/table/TableComponents"

type DashboardContainerProps = {
    className?: string
    children?: ReactNode | ReactNode[]
}

export const DashboardTopContainer = ({ children, className }: DashboardContainerProps) => {
    return <div className={`p-4 bg-white border border-gray-200 flex flex-row gap-4 ${className}`}>
        {children}
    </div>
}

export const DashboardContainer = ({ className, children }: DashboardContainerProps) => {
    return <div className={`w-full h-full bg-gray-100 overflow-hidden flex flex-col ${className}`}>
        {children}
    </div>
}

export const DashboardInfoContainer = ({ children, className }: DashboardContainerProps) => {
    return <div className={`p-4 overflow-auto ${className}`}>
        {children}
    </div>
}

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
        <CardDefaultTitle text={title} />
        <div className="grow" style={{ height: height }} >
            {children}
        </div>
    </Paper>
}

type DashboardCardProps = {
    className?: string
    children?: ReactNode | ReactNode[]
}

export const DashboardCard = ({ className, children }: DashboardCardProps) => {
    return <Card
        variant="outlined"
        className={`min-h-[180] p-4 flex flex-col gap-4 ${className}`}
    >
        {children}
    </Card>
}

type CardDefaultTitleProps = {
    text: string
    className?: string
}

export const CardDefaultTitle = ({ text, className }: CardDefaultTitleProps) => {
    return <Typography
        variant="subtitle1"
        color="textSecondary"
        className={className}
    >
        {text}
    </Typography>
}

type CardDefaultTextProps = {
    children?: ReactNode
    loading?: boolean
    className?: string
}

export const CardDefaultText = ({ children, className, loading }: CardDefaultTextProps) => {

    if (loading) return <Skeleton variant="text" animation='wave' width={50} />

    return <Typography
        variant="h4"
        fontSize={24}
        className={className}
    >
        {children ?? 0}
    </Typography>
}

export type TrendComponentProps = {
    trend: number | undefined
    text?: string
    className?: string
    inverse?: boolean
    loading?: boolean
}

export const TrendComponent = ({ trend, text, inverse, className, loading }: TrendComponentProps) => {

    if (trend == undefined) return

    let textColor: 'success' | 'error' | 'warning'

    if (trend === 0) {
        textColor = 'warning'
    } else if (trend < 0) {
        textColor = inverse ? 'success' : 'error'
    } else {
        textColor = inverse ? 'error' : 'success'
    }

    const TrendIcon = () => {
        if (trend === 0) {
            return <HorizontalRule color={textColor} />
        } else if (trend < 0) {
            return <TrendingDown color={textColor} />
        } else {
            return <TrendingUp color={textColor} />
        }
    }

    return <div className={`flex flex-row gap-2 ${className}`}>
        {!loading ? <TrendIcon /> : <Skeleton width={20} animation='wave' variant="text" />}
        {!loading
            ? <Typography
                variant="body1"
                color={textColor}
            >
                {text ?? trendingTransform(trend)}
            </Typography>
            : <Skeleton variant="text" animation='wave' width={50} />
        }
    </div >
}

export type CardWithGraphProps = {
    title: string
    trendProps: TrendComponentProps
    chart: ReactNode
    data: string | number | undefined
    loading?: boolean
}

export const CardChartContent = ({ trendProps, data, chart, title, loading }: CardWithGraphProps) => {
    return <>
        <CardDefaultTitle text={title} />
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-4">
                <CardDefaultText loading={loading}>{data}</CardDefaultText>
                <TrendComponent {...{ ...trendProps, loading }} />
            </div>
            <div>
                {loading ? <Skeleton className="h-full w-full" animation='wave' variant="rounded" /> : chart}
            </div>
        </div>
    </>
}

type LoadingProps = {
    loading: boolean
    rowSpan: number
}

type DashboardTableBodyProps<T> = {
    dataset: T[]
    colSpan: number
    render: (row: T) => ReactNode | ReactNode[]
    loadingProps?: LoadingProps
}

export function DashboardTableBody<T>({ dataset, render, loadingProps, colSpan }: DashboardTableBodyProps<T>) {

    if (loadingProps !== undefined && loadingProps.loading) {
        return Array(loadingProps.rowSpan).fill(<TableLoadingRow colSpan={colSpan} />)
    }

    if (dataset.length === 0) {
        return <TableRow>
            <TableCell colSpan={colSpan}>
                <Typography align="center" variant="body1">Não há dados disponíveis</Typography>
            </TableCell>
        </TableRow>
    }

    return dataset.map(render)
}
