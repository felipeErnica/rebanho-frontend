import { CardChartContent, CardDefaultTitle, DashboardCard, TrendComponent } from "@/ui/shared/dashboard/DashboardComponents"
import { useCallback, useEffect, useMemo, useState } from "react"
import { getBestResults, getBirthRate, getLastEntries, getLastGroups, getPregnancyRate, getTestHist } from "./Controller"
import {
    BarPlot,
    ChartContainer,
    ChartsAxisHighlight,
    ChartsLegend,
    ChartsTooltip,
    ChartsXAxis,
    ChartsYAxis,
    LinePlot,
    SparkLineChart
} from "@mui/x-charts"
import { dateTransformToLocale, percentageTransform } from "@/util/Transformations"
import { BirthRateStats, PregnancyRateStats, PregnancyTestsHist, TestAnimal, TestEntry, TestGroups as TestGroup } from "./Entities"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
import Button from "@mui/material/Button"
import ChevronRight from "@mui/icons-material/ChevronRight"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import { TableLoadingRow } from "@/ui/shared/table/TableComponents"
import { EditControlButtons } from "@/ui/shared/table/ControlButtons"
import Chip from "@mui/material/Chip"
import { InseminationStatusColorMap, InseminationStatusMap } from "../insemination/Entities"

export const BirthTestDashboard = () => {

    const [reloadFlag, setReloadFlag] = useState(0)
    const [activeRequests, setActiveRequests] = useState(0)

    const startLoading = useCallback(() => setActiveRequests(prev => prev + 1), [])
    const stopLoading = useCallback(() => setActiveRequests(prev => Math.min(prev - 1)), [])

    return <div className="w-full h-full overflow-y-auto bg-gray-100 flex flex-col">
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
        <BestAnimalsTable {...{ stopLoading, startLoading, reloadFlag }} />
        <TestHistChart {...{ startLoading, stopLoading, reloadFlag }} />
        <LastEntriesTable {...{ startLoading, stopLoading, reloadFlag }} />
        <LastGroupTable {...{ stopLoading, startLoading, reloadFlag }} />
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

    return <DashboardCard>
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

const BestAnimalsTable = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [data, setData] = useState<TestAnimal[]>([])
    const [loading, setLoading] = useState(false)
    //const { setPageProps } = useContext(PageContext)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getBestResults()
            .then(response => setData(response.json))
            .catch(() => setData([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard className="col-span-2 row-span-2">
        <CardDefaultTitle text="Os Melhores Resultados" />
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Vaca</TableCell>
                    <TableCell>Nº de Exames</TableCell>
                    <TableCell>Taxa de Prenhez</TableCell>
                    <TableCell>Taxa de Nascimento</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {loading
                    ? Array(10).fill(<TableLoadingRow colSpan={4} />)
                    : data.map(item => (
                        <TableRow>
                            <TableCell>{item.animalName}</TableCell>
                            <TableCell align="center">{item.totals}</TableCell>
                            <TableCell>
                                <div className="flex flex-row items-center gap-2">
                                    {percentageTransform(item.pregnancyRate)}
                                    <TrendComponent trend={item.pregnancyComparison} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-row items-center gap-2">
                                    {percentageTransform(item.birthRate)}
                                    <TrendComponent trend={item.birthComparison} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
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

const LastEntriesTable = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [data, setData] = useState<TestEntry[]>([])
    const [loading, setLoading] = useState(false)
    //const { setPageProps } = useContext(PageContext)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getLastEntries()
            .then(response => {
                const json: TestEntry[] = response.json
                json.forEach(item => item.testDate = new Date(item.testDate ?? ''))
                setData(json)
            })
            .catch(() => setData([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard className="col-span-2 h-[400] overflow-hidden">
        <div className="flex flex-row">
            <CardDefaultTitle text="Última Inseminação" />
            <Button
                className="ml-auto"
                startIcon={<ChevronRight />}
            //onClick={() => {
            //    const page: PageProps = {
            //        page: <EntriesTablePage />,
            //        title: "Histórico de Inseminações",
            //        previousPages: [HomePage, InseminationPage]
            //    }
            //    if (setPageProps) setPageProps(page)
            //}}
            >
                Ver Histórico Completo
            </Button>
        </div>
        <div className="overflow-auto">
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Vaca</TableCell>
                        <TableCell>Data do Exame</TableCell>
                        <TableCell>Teste de Prenhez</TableCell>
                        <TableCell>Nascimento</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading
                        ? Array(10).fill(<TableLoadingRow colSpan={4} />)
                        : data.map(item => (
                            <TableRow>
                                <TableCell>{item.animalName}</TableCell>
                                <TableCell>{dateTransformToLocale(item.testDate?.toString())}</TableCell>
                                <TableCell>
                                    {item.pregnancyStatus &&
                                        <Chip
                                            label={InseminationStatusMap.get(item.pregnancyStatus)}
                                            color={InseminationStatusColorMap.get(item.pregnancyStatus)}
                                        />
                                    }
                                </TableCell>
                                <TableCell>
                                    {item.birthStatus &&
                                        <Chip
                                            label={InseminationStatusMap.get(item.birthStatus)}
                                            color={InseminationStatusColorMap.get(item.birthStatus)}
                                        />
                                    }
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    </DashboardCard>
}


const LastGroupTable = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const [data, setData] = useState<TestGroup[]>([])
    const [loading, setLoading] = useState(false)
    //const { setPageProps } = useContext(PageContext)

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

    return <DashboardCard className="col-start-3 col-span-2 row-span-2">
        <div className="flex flex-row">
            <CardDefaultTitle text="Últimos Grupos de Inseminação" />
            <Button
                className="ml-auto"
                startIcon={<ChevronRight />}
            //onClick={() => setPageProps && setPageProps(GroupsTablePageProps)}
            >
                Ver Todos
            </Button>
        </div>
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell colSpan={2}>Data do Exame</TableCell>
                    <TableCell>Total de Animais</TableCell>
                    <TableCell>Taxa de Prenhez</TableCell>
                    <TableCell>Taxa de Natalidade</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {loading
                    ? Array(10).fill(<TableLoadingRow colSpan={5} />)
                    : data.map(item => (
                        <TableRow>
                            <TableCell>
                                <EditControlButtons
                                //onShow={() => {
                                //    const bullId = item.bullId
                                //    const inseminationDate = new Date(item.inseminationDate)
                                //    const date = inseminationDate.toLocaleDateString('pt-BR', {
                                //        month: 'short',
                                //        year: 'numeric'
                                //    })
                                //    const page: PageProps = {
                                //        page: <GroupEntriesTablePage {...{ inseminationDate, bullId }} />,
                                //        title: `Inseminações - ${item.bullName} - ${date}`,
                                //        previousPages: [HomePage, InseminationPage]
                                //    }
                                //    if (setPageProps) setPageProps(page)
                                //}}
                                />
                            </TableCell>
                            <TableCell>{dateTransformToLocale(item.testDate.toString())}</TableCell>
                            <TableCell align="center" >{item.animalsNumber}</TableCell>
                            <TableCell>
                                <div className="flex flex-row items-center gap-2">
                                    {percentageTransform(item.pregnancyRate)}
                                    <TrendComponent trend={item.pregnancyComparison} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-row items-center gap-2">
                                    {percentageTransform(item.birthRate)}
                                    <TrendComponent trend={item.birthComparison} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    </DashboardCard>
}

