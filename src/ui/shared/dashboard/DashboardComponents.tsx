import { decimalTransform } from "@/util/Transformations"
import TrendingDown from "@mui/icons-material/TrendingDown"
import TrendingUp from "@mui/icons-material/TrendingUp"
import HorizontalRule from "@mui/icons-material/HorizontalRule"
import Card from "@mui/material/Card"
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
    return <Card variant="outlined" className={`p-4 flex flex-col gap-4 ${className}`}>
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
    className?: string
}

export const CardDefaultText = ({ children, className }: CardDefaultTextProps) => {
    return <Typography
        variant="h4"
        className={className}
    >
        {children}
    </Typography>
}

export type TrendComponentProps = {
    trend: number | undefined
    className?: string
    inverse?: boolean
    noPercentage?: boolean
    integer?: boolean
}

export const TrendComponent = ({ trend, inverse, className, noPercentage, integer }: TrendComponentProps) => {

    if (!trend) return

    const percentage = !noPercentage ? '%' : ''
    const plus = trend > 0 ? "+" : ''
    const number = integer ? trend.toString() : decimalTransform(trend)
    const text = plus + number + percentage

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
            return <HorizontalRule color="warning" />
        } else if (trend < 0) {
            return <TrendingDown color={textColor} />
        } else {
            return <TrendingUp color={textColor} />
        }
    }

    return <div className={`flex flex-row gap-2 ${className}`}>
        <TrendIcon />
        <Typography
            variant="body1"
            color={textColor}
        >
            {text}
        </Typography>
    </div >
}

export type CardWithGraphProps = {
    title: string
    trendProps: TrendComponentProps
    chart: ReactNode
    data: number | undefined
    integer?: boolean
    className?: string
}

export const InfoCardWithChart = ({ title, trendProps, data, chart, className, integer }: CardWithGraphProps) => {

    const transformedData = integer ? data?.toString() : decimalTransform(data ?? 0)

    return <DashboardCard className={className}>
        <CardDefaultTitle text={title} />
        <div className="grid grid-flow-row auto-cols-auto auto-rows-auto gap-2">
            <CardDefaultText>{transformedData}</CardDefaultText>
            <div className="row-start-1 col-start-2 row-span-2">
                {chart}
            </div>
            <TrendComponent {...{ ...trendProps, integer }} />
        </div>
    </DashboardCard>
}
