import {
    CardChartContent,
    CardDefaultTitle,
    DashboardCard,
    DashboardContainer,
    DashboardInfoContainer,
    DashboardTableBody,
    DashboardTopContainer,
    TrendComponent
} from "@/ui/shared/dashboard/DashboardComponents"
import { DashboardInformationProps, DashboardTopBarProps } from "@/ui/shared/dashboard/Entities"
import { ReloadButton } from "@/ui/shared/table/TableTopBarComponents"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { AnimalsRating, LactationGroup, MilkEntry, MilkProductionHist, MonthMilkCard, ParentsRating } from "./Entities"
import {
    getLastEntries,
    getLastGroups,
    getMonthMilk,
    getParentRatings,
    getProductionHist,
    getRankedAnimals,
    getYearkyMilk
} from "./Controller"
import { dateTransform, decimalTransform } from "@/util/Transformations"
import { ComboBox, ComboBoxItem } from "@/ui/shared/common/ComboBox"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import { TrendValues } from "@/ui/shared/table/TableComponents"
import { BarPlot } from "@mui/x-charts/BarChart"
import { LineHighlightPlot, LinePlot } from "@mui/x-charts/LineChart"
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis"
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis"
import { ChartsTooltip } from "@mui/x-charts/ChartsTooltip"
import { ChartsAxisHighlight } from "@mui/x-charts/ChartsAxisHighlight"
import { Button } from "@mui/material"
import ChevronRight from "@mui/icons-material/ChevronRight"
import Add from "@mui/icons-material/Add"
import { EditControlButtons } from "@/ui/shared/table/ControlButtons"
import { PageProps } from "@/ui/shared/main-page/PageDisplay"
import { GroupTablePage } from "./MilkGroupTable"
import { HomePage } from "../home/HomePage"
import { LactationHistPage, MilkDashboardPage, MilkEntriesPage } from "./LactationPages"
import { PageContext } from "@/ui/shared/main-page/PageContext"
import { GroupEntriesTablePage } from "./GroupEntriesTable"
import { AddMilkEntryDialog } from "./AddMilkEntryDialog"
import { SparkLineChart } from "@mui/x-charts/SparkLineChart"
import { ChartDataProvider, ChartsLegend, ChartsSurface } from "@mui/x-charts"

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

    const { setPageProps } = useContext(PageContext)
    const [addMilkEntryOpen, setAddMilkEntryOpen] = useState(false)

    return <DashboardTopContainer>
        <ReloadButton
            variant="text"
            loading={activeRequests > 0}
            onReload={() => setReloadFlag(prev => prev + 1)}
        />
        <Button
            className="ml-auto"
            startIcon={<Add />}
            onClick={() => setAddMilkEntryOpen(true)}
        >
            Marcar Leite
        </Button>
        <Button
            variant="text"
            startIcon={<ChevronRight />}
            onClick={() => setPageProps && setPageProps(MilkEntriesPage)}
        >
            Ver Histórico de Marcações
        </Button>
        <AddMilkEntryDialog {...{ addMilkEntryOpen, setAddMilkEntryOpen }} />
    </DashboardTopContainer>
}

const LactationInfo = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {
    return <DashboardInfoContainer className="flex flex-col gap-4">
        <div className="grid grid-flow-row gap-4">
            <ProductionChart {...{ startLoading, stopLoading, reloadFlag }} />
            <MilkProductionCard {...{ stopLoading, startLoading, reloadFlag }} />
            <YearlyMilkProductionCard {...{ stopLoading, startLoading, reloadFlag }} />
            <LastEntriesTable {...{ startLoading, stopLoading, reloadFlag }} />
            <LastGroupsTable {...{ startLoading, stopLoading, reloadFlag }} />
            <AnimalsRatingTable {...{ startLoading, stopLoading, reloadFlag }} />
            <ParentsRatingTable {...{ startLoading, stopLoading, reloadFlag }} />
        </div>
    </DashboardInfoContainer>
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

    return <DashboardCard className="col-span-3 row-span-2">
        <CardDefaultTitle text="Histórico de Produção de Leite" />
        <div className="flex flex-col items-center">
            <ChartDataProvider
                dataset={dataset}
                height={350}
                series={[
                    {
                        id: "animalsNumber",
                        label: "Pico de Animais Lactando",
                        dataKey: "animalsNumber",
                        type: 'bar',
                        yAxisId: "totalAxis",
                        labelMarkType: 'square'
                    },
                    {
                        id: "totalMilk",
                        dataKey: "totalMilk",
                        label: "Produção de Leite",
                        type: "line",
                        yAxisId: "rateAxis",
                        labelMarkType: 'line',
                        valueFormatter: (value) => decimalTransform(value ?? 0)
                    }
                ]}
                xAxis={[{
                    scaleType: 'band',
                    label: "Mês",
                    dataKey: "entryDate",
                    valueFormatter: (date: Date) => date.toLocaleString('pt-BR', {
                        month: 'short',
                        year: 'numeric'
                    })
                }]}
                yAxis={[
                    { id: "totalAxis", position: 'left', label: "Nº de Animais", min: 0 },
                    { id: "rateAxis", position: 'right', label: "Leite Produzido", min: 0 }
                ]}
            >
                <ChartsLegend />
                <ChartsTooltip />
                <ChartsSurface>
                    <ChartsXAxis />
                    <ChartsYAxis axisId="totalAxis" />
                    <ChartsYAxis axisId="rateAxis" />
                    <BarPlot />
                    <LinePlot />
                    <ChartsAxisHighlight x='line' />
                    <LineHighlightPlot />
                </ChartsSurface>
            </ChartDataProvider>
        </div>
    </DashboardCard>

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

    return <DashboardCard className="h-[220]">
        <CardChartContent
            title="Produção de Leite no Mês"
            loading={loading}
            data={stats.current}
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.totalMilk)}
                    valueFormatter={(value) => decimalTransform(value ?? 0)}
                    height={100}
                    showTooltip
                    area
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

const YearlyMilkProductionCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

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
        getYearkyMilk()
            .then(response => setStats(response.json))
            .catch(() => setStats(defaultValue))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [defaultValue, reloadFlag, startLoading, stopLoading])

    return <DashboardCard className="h-[220]">
        <CardChartContent
            title="Produção de Leite no Ano"
            loading={loading}
            data={decimalTransform(stats.current)}
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.totalMilk)}
                    valueFormatter={value => decimalTransform(value ?? 0)}
                    height={100}
                    showTooltip
                    area
                    xAxis={{
                        data: stats.hist.map(item => new Date(item.entryDate)),
                        valueFormatter: (value: Date) => value.getFullYear().toString()
                    }}
                />
            )}
            trendProps={{ trend: stats.trend }}
        />
    </DashboardCard>
}

const LastGroupsTable = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [data, setData] = useState<LactationGroup[]>([])
    const [loading, setLoading] = useState(false)
    const { setPageProps } = useContext(PageContext)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getLastGroups()
            .then(response => setData(response.json))
            .catch(() => setData([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard className="col-span-2">
        <div className="flex flex-row gap-4">
            <CardDefaultTitle text="As 10 Últimas Marcações" />
            <Button
                className="ml-auto"
                variant="text"
                startIcon={<ChevronRight />}
                onClick={() => {
                    const pageProps: PageProps = {
                        title: "Histórico de Marcações",
                        page: <GroupTablePage />,
                        previousPages: [HomePage, MilkDashboardPage]
                    }
                    if (setPageProps) setPageProps(pageProps)
                }}
            >
                Ver Todas
            </Button>
        </div>
        <Table size="small" stickyHeader>
            <TableHead>
                <TableRow>
                    <TableCell />
                    <TableCell>Data da Marcação</TableCell>
                    <TableCell>Nº de Animais</TableCell>
                    <TableCell>Leite Produzido</TableCell>
                    <TableCell>Média de Produção</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <DashboardTableBody
                    colSpan={5}
                    dataset={data}
                    loadingProps={{ loading, rowSpan: 10 }}
                    render={item => (
                        <TableRow>
                            <TableCell>
                                <EditControlButtons
                                    onShow={() => {
                                        const pageProps: PageProps = {
                                            title: `Marcação - ${dateTransform(item.entryDate)}`,
                                            page: <GroupEntriesTablePage {...{ entryDate: item.entryDate }} />,
                                            previousPages: [HomePage, MilkDashboardPage]
                                        }
                                        if (setPageProps) setPageProps(pageProps)
                                    }}
                                />
                            </TableCell>
                            <TableCell>{dateTransform(item.entryDate)}</TableCell>
                            <TableCell>
                                <TrendValues
                                    value={item.animalsNumber}
                                    trendProps={{ trend: item.numberDifference, text: item.numberDifference.toString() }}
                                />
                            </TableCell>
                            <TableCell>
                                <TrendValues
                                    value={decimalTransform(item.totalMilk, 1)}
                                    trendProps={{ trend: item.totalRate }}
                                />
                            </TableCell>
                            <TableCell>
                                <TrendValues
                                    value={decimalTransform(item.averageMilk)}
                                    trendProps={{ trend: item.averageRate }}
                                />
                            </TableCell>
                        </TableRow>
                    )}
                />
            </TableBody>
        </Table>
    </DashboardCard>
}

const LastEntriesTable = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [data, setData] = useState<MilkEntry[]>([])
    const [lastDate, setLastDate] = useState<Date>()
    const [loading, setLoading] = useState(false)
    const [addMilkEntryOpen, setAddMilkEntryOpen] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getLastEntries()
            .then(response => {
                const entries: MilkEntry[] = response.json
                setLastDate(entries[0].entryDate)
                setData(entries)
            })
            .catch(() => {
                setLastDate(undefined)
                setData([])
            })
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard className="col-span-2 h-[650] overflow-hidden">
        <div className="flex flex-row gap-4">
            <CardDefaultTitle text={`Última Marcação de Leite${lastDate && ' - ' + dateTransform(lastDate)}`} />
            <Button
                className="ml-auto"
                variant="text"
                startIcon={<ChevronRight />}
            >
                Ver Todas
            </Button>
        </div>
        <div className="overflow-auto">
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Vaca</TableCell>
                        <TableCell>Pasto</TableCell>
                        <TableCell>Quantidade de Leite</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <DashboardTableBody
                        colSpan={3}
                        loadingProps={{ loading, rowSpan: 20 }}
                        dataset={data}
                        render={item => (
                            <TableRow>
                                <TableCell>{item.animalName}</TableCell>
                                <TableCell>{item.pastureName}</TableCell>
                                <TableCell align="center">{decimalTransform(item.quantity ?? 0, 1)}</TableCell>
                            </TableRow>
                        )}
                    />
                </TableBody>
            </Table>
        </div>
        <Button
            className="ml-auto"
            variant="text"
            startIcon={<Add />}
            onClick={() => setAddMilkEntryOpen(true)}
        >
            Marcar Leite
        </Button>
        <AddMilkEntryDialog {...{ addMilkEntryOpen, setAddMilkEntryOpen, entryDate: lastDate }} />
    </DashboardCard>
}

const AnimalsRatingTable = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [data, setData] = useState<AnimalsRating[]>([])
    const [loading, setLoading] = useState(false)
    const [rankBy, setRankBy] = useState('worst')
    const { setPageProps } = useContext(PageContext)

    const rankByValues: ComboBoxItem[] = [
        { name: 'As Melhores Vacas', value: 'best' },
        { name: 'As Piores Vacas', value: 'worst' },
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

    return <DashboardCard className="h-[500] col-span-4">
        <div className="flex flex-row gap-4">
            <ComboBox
                className="w-[300]"
                variant="standard"
                size="small"
                value={rankBy}
                onChange={(value) => setRankBy(value ?? 'worst')}
                items={rankByValues}
            />
            <Button
                className="ml-auto"
                variant="text"
                startIcon={<ChevronRight />}
                onClick={() => setPageProps && setPageProps(LactationHistPage)}
            >
                Ver Histórico de Lactação
            </Button>
        </div>
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Vaca</TableCell>
                    <TableCell align="center">Nº de Lactações</TableCell>
                    <TableCell>Média de Leite por Dia</TableCell>
                    <TableCell>Periodo de Lactação Médio</TableCell>
                    <TableCell>Produção Total Média</TableCell>
                    <TableCell>Intervalo entre Lactações Médio</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <DashboardTableBody
                    colSpan={6}
                    loadingProps={{ loading, rowSpan: 10 }}
                    dataset={data}
                    render={item => (
                        <TableRow>
                            <TableCell>{item.animalName}</TableCell>
                            <TableCell align="center">{item.lacNum}</TableCell>
                            <TableCell>
                                <div className="flex flex-row items-center gap-2">
                                    {decimalTransform(item.avgProd)}
                                    <TrendComponent trend={item.prodRate} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-row items-center gap-2">
                                    {decimalTransform(item.avgPeriod)}
                                    <TrendComponent trend={item.periodRate} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-row items-center gap-2">
                                    {decimalTransform(item.avgTotal)}
                                    <TrendComponent trend={item.totalRate} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-row items-center gap-2">
                                    {decimalTransform(item.avgInterval)}
                                    <TrendComponent trend={item.intervalRate} inverse />
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                />
            </TableBody>
        </Table>
    </DashboardCard>
}

const ParentsRatingTable = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [data, setData] = useState<ParentsRating[]>([])
    const [loading, setLoading] = useState(false)
    const [rankBy, setRankBy] = useState('best-mothers')
    const { setPageProps } = useContext(PageContext)

    const rankByValues: ComboBoxItem[] = [
        { name: 'As Melhores Mães', value: 'best-mothers' },
        { name: 'As Piores Mães', value: 'worst-mothers' },
        { name: 'Os Melhores Pais', value: 'best-fathers' },
        { name: 'Os Piores Pais', value: 'worst-fathers' },
    ]

    useEffect(() => {
        startLoading()
        setLoading(true)
        getParentRatings(rankBy)
            .then(response => setData(response.json))
            .catch(() => setData([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading, rankBy])

    return <DashboardCard className="h-[500] col-span-4">
        <div className="flex flex-row gap-4">
            <ComboBox
                className="w-[300]"
                variant="standard"
                size="small"
                value={rankBy}
                onChange={(value) => setRankBy(value ?? 'worst-fathers')}
                items={rankByValues}
            />
            <Button
                className="ml-auto"
                variant="text"
                startIcon={<ChevronRight />}
                onClick={() => setPageProps && setPageProps(LactationHistPage)}
            >
                Ver Histórico de Lactação
            </Button>
        </div>
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Vaca</TableCell>
                    <TableCell>Nº Médio de Lactações</TableCell>
                    <TableCell>Média de Leite por Dia</TableCell>
                    <TableCell>Periodo de Lactação Médio</TableCell>
                    <TableCell>Produção Total Média</TableCell>
                    <TableCell>Intervalo entre Lactações Médio</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <DashboardTableBody
                    dataset={data}
                    loadingProps={{ loading, rowSpan: 10 }}
                    colSpan={6}
                    render={item => (
                        <TableRow>
                            <TableCell>{item.parentName}</TableCell>
                            <TableCell>
                                <TrendValues
                                    value={decimalTransform(item.avgLac)}
                                    trendProps={{ trend: item.lacRate }}
                                />
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-row items-center gap-2">
                                    {decimalTransform(item.avgProd)}
                                    <TrendComponent trend={item.prodRate} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-row items-center gap-2">
                                    {decimalTransform(item.avgPeriod)}
                                    <TrendComponent trend={item.periodRate} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-row items-center gap-2">
                                    {decimalTransform(item.avgTotal)}
                                    <TrendComponent trend={item.totalRate} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-row items-center gap-2">
                                    {decimalTransform(item.avgInterval)}
                                    <TrendComponent trend={item.intervalRate} inverse />
                                </div>
                            </TableCell>
                        </TableRow>
                    )}

                />
            </TableBody>
        </Table>
    </DashboardCard>
}

