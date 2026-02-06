import {
    CardChartContent,
    CardDefaultTitle,
    DashboardCard,
    DashboardContainer,
    DashboardInfoContainer,
    DashboardTopContainer
} from "@/components/shared/dashboard/DashboardComponents"
import { DashboardInformationProps, DashboardTopBarProps } from "@/components/shared/dashboard/Entities"
import { ReloadButton } from "@/components/shared/table/TableTopBarComponents"
import { useCallback, useEffect, useState } from "react"
import { getPastureDashboardStats, getPastureOccupancy } from "./Service"
import {  PastureOccupancy, PastureStats } from "./Entities"
import { SparkLineChart } from "@mui/x-charts/SparkLineChart"
import { dateTransform,  positiveTransform } from "@/utils/Transformations"
import { BarChart, Gauge, gaugeClasses } from "@mui/x-charts"
import { green, orange } from "@mui/material/colors"
import { LOADING_MSG, NO_DATA_AVAILABLE } from "@/components/shared/Globals"

export const PastureDashboard = () => {
    const [reloadFlag, setReloadFlag] = useState(0)
    const [activeRequests, setActiveRequests] = useState(0)

    const startLoading = useCallback(() => setActiveRequests(prev => prev + 1), [])
    const stopLoading = useCallback(() => setActiveRequests(prev => Math.max(prev - 1)), [])

    return <DashboardContainer>
        <PastureTopBar {...{ setReloadFlag, activeRequests }} />
        <PastureContent {...{ reloadFlag, startLoading, stopLoading }} />
    </DashboardContainer>
}

const PastureTopBar = ({ activeRequests, setReloadFlag }: DashboardTopBarProps) => {
    return <DashboardTopContainer>
        <ReloadButton
            onReload={() => setReloadFlag(prev => prev + 1)}
            loading={activeRequests > 0}
        />
    </DashboardTopContainer>
}

const PastureContent = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {
    return <DashboardInfoContainer className="h-full flex flex-col gap-4">
        <div className="grid grid-cols-3 grid-rows-[220px] gap-4">
            <TotalAnimalsCard {...{ stopLoading, reloadFlag, startLoading }} />
            <OccupiedPasturesCard {...{ stopLoading, reloadFlag, startLoading }} />
            <MovesCard {...{ stopLoading, reloadFlag, startLoading }} />
        </div>
        <div className="h-full grid grid-cols-[1fr_400px] grid-rows-[500px] gap-4">
            <OccupancyChart {...{ startLoading, stopLoading, reloadFlag }} />
        </div>
    </DashboardInfoContainer>
}

const TotalAnimalsCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {
    const [stats, setStats] = useState<PastureStats['totalAnimals'] | undefined>()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getPastureDashboardStats()
            .then(res => setStats(res.totalAnimals))
            .catch(() => setStats(undefined))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    if (!stats) return <DashboardCard><CardDefaultTitle text="Total de Animais em Pasto" /></DashboardCard>

    return <DashboardCard>
        <CardChartContent
            title="Total de Animais em Pasto"
            loading={loading}
            data={stats.current}
            chart={(
                <SparkLineChart
                    data={stats.history.map(item => item.value)}
                    height={80}
                    showHighlight
                    showTooltip
                    xAxis={{
                        data: stats.history.map(item => new Date(item.date)),
                        valueFormatter: (value: Date) => dateTransform(value, { month: 'short', day: '2-digit' })
                    }}
                />
            )}
            trendProps={{ trend: stats.trend, text: positiveTransform(stats.trend) }}
        />
    </DashboardCard>
}

const OccupiedPasturesCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {
    const [stats, setStats] = useState<PastureStats['occupiedPastures'] | undefined>()

    useEffect(() => {
        startLoading()
        getPastureDashboardStats()
            .then(res => setStats(res.occupiedPastures))
            .catch(() => setStats(undefined))
            .finally(() => stopLoading())
    }, [reloadFlag, startLoading, stopLoading])

    if (!stats) return <DashboardCard><CardDefaultTitle text="Pastos Ocupados" /></DashboardCard>

    return <DashboardCard className="relative">
        <CardDefaultTitle text="Pastos Ocupados" />
        <div className="flex items-center justify-center h-full pb-8">
            <Gauge
                width={200}
                height={150}
                value={stats.current}
                valueMax={stats.total}
                startAngle={-110}
                endAngle={110}
                sx={{
                    [`& .${gaugeClasses.valueText}`]: {
                        fontSize: 30,
                        transform: 'translate(0px, 0px)',
                    },
                }}
                text={({ value, valueMax }) => `${value} / ${valueMax}`}
            />
        </div>
        <div className="absolute bottom-4 w-full text-center text-gray-500">
            {stats.total - stats.current} pastos livres
        </div>
    </DashboardCard>
}

const MovesCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {
    const [stats, setStats] = useState<PastureStats['recentMoves'] | undefined>()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getPastureDashboardStats()
            .then(res => setStats(res.recentMoves))
            .catch(() => setStats(undefined))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    if (!stats) return <DashboardCard><CardDefaultTitle text="Movimentações Recentes (7d)" /></DashboardCard>

    return <DashboardCard>
        <CardChartContent
            title="Movimentações Recentes"
            loading={loading}
            data={stats.current}
            chart={(
                <SparkLineChart
                    data={stats.history.map(item => item.value)}
                    height={80}
                    color={orange[600]}
                    showHighlight
                    showTooltip
                    xAxis={{
                        data: stats.history.map(item => new Date(item.date)),
                        valueFormatter: (value: Date) => dateTransform(value, { month: 'short', day: '2-digit' })
                    }}
                />
            )}
            trendProps={{ trend: stats.trend, text: positiveTransform(stats.trend) }}
        />
    </DashboardCard>
}

const OccupancyChart = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {
    const [data, setData] = useState<PastureOccupancy[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getPastureOccupancy()
            .then(res => setData(res))
            .catch(() => setData([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardDefaultTitle text="Ocupação por Pasto" />
        <BarChart
            loading={loading}
            dataset={data}
            yAxis={[{ scaleType: 'band', dataKey: 'name' }]}
            series={[{ dataKey: 'animalCount', label: 'Quantidade de Animais', color: green[600] }]}
            layout="horizontal"
            margin={{ left: 150 }}
            slotProps={{
                loadingOverlay: { message: LOADING_MSG },
                noDataOverlay: { message: NO_DATA_AVAILABLE }
            }}
        />
    </DashboardCard>
}
