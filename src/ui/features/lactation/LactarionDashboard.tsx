import { CardChartContent, CardDefaultTitle, DashboardCard, DashboardContainer, TrendComponent } from "@/ui/shared/dashboard/DashboardComponents"
import { DashboardInformationProps, DashboardTopBarProps } from "@/ui/shared/dashboard/Entities"
import { ReloadButton } from "@/ui/shared/table/TableTopBarComponents"
import { useCallback, useEffect, useMemo, useState } from "react"
import { AnimalsAverage, AnimalsRating, MilkProductionHist, MonthMilkCard } from "./Entities"
import { getAnimalsAverage, getMonthMilk, getProductionHist, getRankedAnimals } from "./Controller"
import { SparkLineChart } from "@mui/x-charts/SparkLineChart"
import { decimalTransform, percentageTransform } from "@/util/Transformations"
import { ComboBox, ComboBoxItem } from "@/ui/shared/common/ComboBox"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import { TableLoadingRow } from "@/ui/shared/table/TableComponents"
import { ChartContainer } from "@mui/x-charts/ChartContainer"
import { BarPlot } from "@mui/x-charts/BarChart"
import { LinePlot } from "@mui/x-charts/LineChart"
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis"
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis"
import { ChartsTooltip } from "@mui/x-charts/ChartsTooltip"
import { ChartsLegend } from "@mui/x-charts/ChartsLegend"
import { ChartsAxisHighlight } from "@mui/x-charts/ChartsAxisHighlight"

export const LactationDashboard = () => {

    const [activeRequests, setActiveRequests] = useState(0)
    const [reloadFlag, setReloadFlag] = useState(0)

    const startLoading = useCallback(() => setActiveRequests(prev => prev + 1), [])
    const stopLoading = useCallback(() => setActiveRequests(prev => Math.max(prev - 1, 0)), [])

    return <DashboardContainer>
        <DashboardTopBar {...{ activeRequests, setReloadFlag }} />
        <LactationInfo {...{ startLoading, stopLoading, reloadFlag }} />
    </DashboardContainer>
}

const DashboardTopBar = ({ setReloadFlag, activeRequests }: DashboardTopBarProps) => {
    return <div className="flex flex-row">
        <ReloadButton
            loading={activeRequests > 0}
            onReload={() => setReloadFlag(prev => prev + 1)}
        />
    </div>
}

const LactationInfo = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {
    return <div className="grid grid-flow-row gap-4">
        <MilkProductionCard {...{ stopLoading, startLoading, reloadFlag }} />
        <AnimalsAverageCard {...{ stopLoading, startLoading, reloadFlag }} />
        <ProductionChart {...{ startLoading, stopLoading, reloadFlag }} />
        <BestAnimalsTable {...{ startLoading, stopLoading, reloadFlag }} />
    </div>
}

const MilkProductionCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultValue: MonthMilkCard = useMemo(() => ({
        trend: 0,
        current: 0,
        hist: []
    }), [])

    const [stats, setStats] = useState<MonthMilkCard>(defaultValue)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getMonthMilk()
            .then(response => setStats(response.json))
            .catch(() => setStats(defaultValue))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [defaultValue, reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Produção de Leite no Mês"
            loading={loading}
            data={stats.current}
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.totalMilk)}
                    valueFormatter={(value) => decimalTransform(value ?? 0)}
                    height={50}
                    showTooltip
                    xAxis={{
                        data: stats.hist.map(item => new Date(item.entryDate)),
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

const AnimalsAverageCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultValue: AnimalsAverage = useMemo(() => ({
        trend: 0,
        current: 0,
        hist: []
    }), [])

    const [stats, setStats] = useState<AnimalsAverage>(defaultValue)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getAnimalsAverage()
            .then(response => setStats(response.json))
            .catch(() => setStats(defaultValue))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [defaultValue, reloadFlag, startLoading, stopLoading])

    return <DashboardCard className="col-start-2">
        <CardChartContent
            title="Média Mensal de Animais em Lactação"
            loading={loading}
            data={decimalTransform(stats.current)}
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.animalsNumber)}
                    valueFormatter={(value) => decimalTransform(value ?? 0)}
                    height={50}
                    showTooltip
                    xAxis={{
                        data: stats.hist.map(item => new Date(item.entryDate)),
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

const BestAnimalsTable = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [data, setData] = useState<AnimalsRating[]>([])
    const [loading, setLoading] = useState(false)
    const [rankBy, setRankBy] = useState('worst-results')

    const rankByValues: ComboBoxItem[] = [
        { name: 'Os Melhores Resultados', value: 'best-results' },
        { name: 'Os Piores Resultados', value: 'worst-results' },
    ]

    useEffect(() => {
        startLoading()
        setLoading(true)
        getRankedAnimals(rankBy)
            .then(response => setData(response.json))
            .catch(() => setData([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading, rankBy])

    return <DashboardCard className="col-start-3 col-span-2 row-span-2">
        <ComboBox
            className="max-w-[300]"
            variant="standard"
            size="small"
            value={rankBy}
            onChange={(value) => setRankBy(value ?? 'worst-results')}
            items={rankByValues}
        />
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Vaca</TableCell>
                    <TableCell>Nº de Lactações</TableCell>
                    <TableCell>Média de Leite por Dia</TableCell>
                    <TableCell>Periodo de Lactação Médio</TableCell>
                    <TableCell>Produção Total Média</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {loading
                    ? Array(10).fill(<TableLoadingRow colSpan={4} />)
                    : data.map(item => (
                        <TableRow>
                            <TableCell>{item.animalName}</TableCell>
                            <TableCell align="center">{item.lacNum}</TableCell>
                            <TableCell>
                                <div className="flex flex-row items-center gap-2">
                                    {percentageTransform(item.avgProd)}
                                    <TrendComponent trend={item.prodRate} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-row items-center gap-2">
                                    {percentageTransform(item.avgPeriod)}
                                    <TrendComponent trend={item.periodRate} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-row items-center gap-2">
                                    {percentageTransform(item.avgTotal)}
                                    <TrendComponent trend={item.totalRate} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    </DashboardCard>
}

const ProductionChart = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const [dataset, setDataset] = useState<MilkProductionHist[]>([])

    useEffect(() => {
        startLoading()
        getProductionHist()
            .then(response => {
                const dataset: MilkProductionHist[] = response.json
                dataset.forEach(item => item.entryDate = new Date(item.entryDate))
                setDataset(dataset)
            })
            .catch(() => setDataset([]))
            .finally(() => {
                stopLoading()
            })
    }, [stopLoading, startLoading, reloadFlag])

    return <DashboardCard className="col-span-2">
        <CardDefaultTitle text="Histórico de Produção de Leite" />
        <ChartContainer
            dataset={dataset}
            height={250}
            series={[
                {
                    id: "animalsNumber",
                    label: "Média de Animais Lactando",
                    dataKey: "animalsNumber",
                    type: 'bar',
                    yAxisId: "totalAxis",
                    valueFormatter: (value) => decimalTransform(value ?? 0)
                },
                {
                    id: "totalMilk",
                    dataKey: "totalMilk",
                    label: "Produção de Leite",
                    type: "line",
                    yAxisId: "rateAxis",
                    valueFormatter: (value) => decimalTransform(value ?? 0)
                }
            ]}
            xAxis={[{
                scaleType: 'band',
                dataKey: "entryDate",
                valueFormatter: (date: Date) => date.toLocaleString('pt-BR', {
                    month: 'short',
                    year: 'numeric'
                })
            }]}
            yAxis={[
                { id: "totalAxis", position: 'left' },
                { id: "rateAxis", position: 'right' }
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
