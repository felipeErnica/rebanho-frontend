import { CardChartContent, CardDefaultTitle, DashboardCard } from "@/ui/shared/dashboard/DashboardComponents"
import { useCallback, useEffect, useMemo, useState } from "react"
import { getBirthRate, getPregnancyRate, getTestHist } from "./Controller"
import { BarPlot, ChartContainer, ChartsAxisHighlight, ChartsLegend, ChartsTooltip, ChartsXAxis, ChartsYAxis, LinePlot, SparkLineChart } from "@mui/x-charts"
import { percentageTransform } from "@/util/Transformations"
import { BirthRateStats, PregnancyRateStats, PregnancyTestsHist } from "./Entities"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"

export const BirthTestDashboard = () => {

    const [reloadFlag, setReloadFlag] = useState(0)
    const [activeRequests, setActiveRequests] = useState(0)

    const startLoading = useCallback(() => setActiveRequests(prev => prev + 1), [])
    const stopLoading = useCallback(() => setActiveRequests(prev => Math.min(prev - 1)), [])

    return <div className="w-full h-full bg-gray-100 flex flex-col">
        <TableTopBar
            reloadProps={{
                onReload: () => setReloadFlag(prev => prev + 1),
                loading: activeRequests > 0
            }}
        />
        <DashboardInformation {...{ startLoading, stopLoading, reloadFlag }} />
    </div>
}

type DashboardInformationProps = {
    startLoading: () => void
    stopLoading: () => void
    reloadFlag: number
}

const DashboardInformation = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {
    return <div className="p-4 grid grid-flow-row gap-4">
        <PregnancyCard {...{ stopLoading, startLoading, reloadFlag }} />
        <BirthCard {...{ startLoading, stopLoading, reloadFlag }} />
        <TestHistChart {...{ startLoading, stopLoading, reloadFlag }} />
    </div>
}

const PregnancyCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultValue: PregnancyRateStats = useMemo(() => ({
        trend: 0,
        current: 0,
        hist: []
    }), [])

    const [stats, setStats] = useState<PregnancyRateStats>(defaultValue)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getPregnancyRate()
            .then(response => setStats(response.json))
            .catch(() => setStats(defaultValue))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [defaultValue, reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Taxa de Prenhez"
            loading={loading}
            data={stats.current}
            percentage
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.pregnancyRate)}
                    valueFormatter={(value) => percentageTransform(value ?? 0)}
                    height={50}
                    showTooltip
                    xAxis={{
                        data: stats.hist.map(item => new Date(item.testDate)),
                        valueFormatter: (value: Date) => value.toLocaleString('pt-BR', {
                            month: 'short',
                            year: 'numeric'
                        })
                    }}
                />
            )}
            trendProps={{ trend: stats.trend }}
        />
    </DashboardCard>
}

const BirthCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultValue: BirthRateStats = useMemo(() => ({
        trend: 0,
        current: 0,
        hist: []
    }), [])

    const [stats, setStats] = useState<BirthRateStats>(defaultValue)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getBirthRate()
            .then(response => setStats(response.json))
            .catch(() => setStats(defaultValue))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [defaultValue, reloadFlag, startLoading, stopLoading])

    return <DashboardCard className="col-start-2">
        <CardChartContent
            title="Taxa de Natalidade"
            loading={loading}
            data={stats.current}
            percentage
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.birthRate)}
                    valueFormatter={(value) => percentageTransform(value ?? 0)}
                    height={50}
                    showTooltip
                    xAxis={{
                        data: stats.hist.map(item => new Date(item.testDate)),
                        valueFormatter: (value: Date) => value.toLocaleString('pt-BR', {
                            month: 'short',
                            year: 'numeric'
                        })
                    }}
                />
            )}
            trendProps={{ trend: stats.trend }}
        />
    </DashboardCard>
}

const TestHistChart = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const [dataset, setDataset] = useState<PregnancyTestsHist[]>([])

    useEffect(() => {
        startLoading()
        getTestHist()
            .then(response => {
                const dataset: PregnancyTestsHist[] = response.json
                dataset.forEach(item => item.testDate = new Date(item.testDate))
                setDataset(dataset)
            })
            .catch(() => setDataset([]))
            .finally(() => {
                stopLoading()
            })
    }, [stopLoading, startLoading, reloadFlag])

    return <DashboardCard className="col-span-2">
        <CardDefaultTitle text="Histórico de Exames de Toque" />
        <ChartContainer
            dataset={dataset}
            height={250}
            series={[
                {
                    id: "totals",
                    label: "Animais Examinados",
                    dataKey: "totals",
                    type: 'bar',
                    yAxisId: "totalAxis"
                },
                {
                    id: "pregnancyRate",
                    label: "Taxa de Prenhez",
                    dataKey: "pregnancyRate",
                    type: "line",
                    yAxisId: "rateAxis",
                    valueFormatter: (value) => percentageTransform(value ?? 0)
                },
                {
                    id: "birthRate",
                    dataKey: "birthRate",
                    label: "Taxa de Natalidade",
                    type: "line",
                    yAxisId: "rateAxis",
                    valueFormatter: (value) => percentageTransform(value ?? 0)
                }
            ]}
            xAxis={[{
                scaleType: 'band',
                dataKey: "testDate",
                valueFormatter: (date: Date) => date.toLocaleString('pt-BR', {
                    month: 'short',
                    year: 'numeric'
                })
            }]}
            yAxis={[
                { id: "totalAxis", position: 'left' },
                { 
                    id: "rateAxis", 
                    valueFormatter: (value: number) => `${value}%`,
                    domainLimit: () => ({ min: 0, max: 100 }), 
                    position: 'right' 
                }
            ]}
        >
            <BarPlot />
            <LinePlot />
            <ChartsXAxis />
            <ChartsYAxis axisId="totalAxis" />
            <ChartsYAxis axisId="rateAxis" />
            <ChartsTooltip />
            <ChartsLegend />
            <ChartsAxisHighlight x='line' />
        </ChartContainer>
    </DashboardCard>

}
