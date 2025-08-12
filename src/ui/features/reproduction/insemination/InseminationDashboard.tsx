import {
    CardChartContent,
    CardDefaultText,
    CardDefaultTitle,
    DashboardCard,
    GraphContainer,
    TrendComponent
} from "@/ui/shared/dashboard/DashboardComponents"
import React, { Dispatch, useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
    BirthRateStats,
    InseminationBulls,
    InseminationEntry,
    InseminationGroup,
    InseminationHist,
    InseminationStatusColorMap,
    InseminationStatusMap,
    PregnantsNumber
} from "./Entities"
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
import {
    getBestBulls,
    getBirthRateStats,
    getInseminationHist,
    getLastEntries,
    getLastGroups,
    getPregnantsNumber
} from "./Controller"
import { LOADING_MSG, NO_DATA_AVAILABLE } from "@/ui/shared/Globals"
import {
    Button,
    Chip,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@mui/material"
import { TableLoadingRow } from "@/ui/shared/table/TableComponents"
import { dateTransformToLocale, percentageTransform } from "@/util/Transformations"
import { EditControlButtons } from "@/ui/shared/table/ControlButtons"
import ChevronRight from "@mui/icons-material/ChevronRight"
import { PageContext } from "@/ui/shared/main-page/PageContext"
import { PageProps } from "@/ui/shared/main-page/PageDisplay"
import { EntriesTablePage } from "./EntriesTable"
import { HomePage } from "../../home/HomePage"
import { GroupsTablePageProps, InseminationPage } from "./InseminationPages"
import { GroupEntriesTablePage } from "./GroupEntriesTable"
import { ReloadButton } from "@/ui/shared/table/TableTopBarComponents"

export const InseminationDasboard = () => {

    const [reloadFlag, setReloadFlag] = useState(0)
    const [activeRequests, setActiveRequests] = useState(0)

    const startLoading = useCallback(() => setActiveRequests(prev => prev + 1), [])
    const stopLoading = useCallback(() => setActiveRequests(prev => Math.max(prev - 1, 0)), [])

    return <div className="w-full h-full overflow-auto bg-gray-100 p-4">
        <DashboardToolbar {...{ setReloadFlag, activeRequests }} />
        <DashboardInformation {...{ reloadFlag, startLoading, stopLoading }} />
    </div>
}

type DashboardToolbarProps = {
    setReloadFlag: Dispatch<React.SetStateAction<number>>
    activeRequests: number
}

const DashboardToolbar = ({ setReloadFlag, activeRequests }: DashboardToolbarProps) => {

    const { setPageProps } = useContext(PageContext)

    return <div className="flex flex-row pb-4">
        <ReloadButton
            variant="text"
            onReload={() => setReloadFlag(prev => prev + 1)}
            loading={activeRequests > 0}
        />
        <div className="grow flex flex-row-reverse">
            <Button
                startIcon={<ChevronRight />}
                onClick={() => {
                    const page: PageProps = {
                        page: <EntriesTablePage />,
                        title: "Histórico de Inseminações",
                        previousPages: [HomePage, InseminationPage]
                    }
                    if (setPageProps) setPageProps(page)
                }}
            >
                Ver Histórico de Inseminações
            </Button>
        </div>
    </div>
}

type DashboardInformationProps = {
    reloadFlag: number
    startLoading: () => void
    stopLoading: () => void
}

const DashboardInformation = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {
    return <div className="grid grid-flow-row gap-4">
        <BirthRateCard {...{ reloadFlag, stopLoading, startLoading }} />
        <PregnantNumbersCard {...{ reloadFlag, startLoading, stopLoading }} />
        <BestBullsTable {...{ reloadFlag, startLoading, stopLoading }} />
        <InseminationHistGraph {...{ reloadFlag, startLoading, stopLoading }} />
        <LastEntriesTable {...{ reloadFlag, stopLoading, startLoading }} />
        <LastGroupsTable {...{ reloadFlag, startLoading, stopLoading }} />
    </div>
}

const BirthRateCard = ({ reloadFlag, startLoading, stopLoading }: DashboardInformationProps) => {

    const defaultValues = useMemo((): BirthRateStats => ({
        hist: [],
        trend: 0,
        current: 0
    }), [])

    const [data, setData] = useState<BirthRateStats>(defaultValues)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getBirthRateStats()
            .then(response => setData(response.json))
            .catch(() => setData(defaultValues))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [defaultValues, reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Taxa de Natalidade"
            loading={loading}
            trendProps={{ trend: data.trend }}
            data={data.current}
            chart={(
                <SparkLineChart
                    data={data.hist.map(item => item.birthRate)}
                    height={50}
                    showTooltip
                    valueFormatter={(value: number | null) => percentageTransform(value ?? 0)}
                    xAxis={{
                        data: data.hist.map(item => new Date(item.dateMonth)),
                        scaleType: 'time',
                        valueFormatter: (value: Date) => value.toLocaleDateString('pt-BR', {
                            month: 'short',
                            year: 'numeric'
                        })
                    }}
                />
            )}
        />
    </DashboardCard>
}

const PregnantNumbersCard = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [data, setData] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getPregnantsNumber()
            .then((response) => {
                const json: PregnantsNumber = response.json
                console.log('response: ', json)
                setData(json.pregnantNumber)
            })
            .catch(() => setData(0))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard className="col-start-2">
        <CardDefaultTitle text="Vacas Inseminadas Prenhas" />
        <CardDefaultText loading={loading}>{data}</CardDefaultText>
    </DashboardCard>
}

const BestBullsTable = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [data, setData] = useState<InseminationBulls[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getBestBulls()
            .then(response => setData(response.json))
            .catch(() => setData([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard className="col-start-3 row-span-2">
        <CardDefaultTitle text="Melhores Touros" />
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Touro</TableCell>
                    <TableCell>Nº de Inseminações</TableCell>
                    <TableCell>Taxa de Natalidade</TableCell>
                    <TableCell>Taxa Comparativa</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {loading
                    ? Array(10).fill(<TableLoadingRow colSpan={4} />)
                    : data.map(item => {
                        return <TableRow>
                            <TableCell>{item.bullName}</TableCell>
                            <TableCell align="center">{item.total}</TableCell>
                            <TableCell align="center">{percentageTransform(item.birthRate)}</TableCell>
                            <TableCell>
                                <TrendComponent trend={item.comparisonRate} />
                            </TableCell>
                        </TableRow>
                    })
                }
            </TableBody>
        </Table>
    </DashboardCard>
}

const InseminationHistGraph = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [dataset, setDataset] = useState<InseminationHist[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getInseminationHist()
            .then(response => {
                const json: InseminationHist[] = response.json
                json.forEach(item => item.dateMonth = new Date(item.dateMonth))
                setDataset(response.json)
            })
            .catch(() => setDataset([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <GraphContainer title="Histórico de Inseminação" className="col-span-2">
        {loading
            ? <CircularProgress />
            : <ChartContainer
                height={200}
                localeText={{
                    loading: LOADING_MSG,
                    noData: NO_DATA_AVAILABLE
                }}
                dataset={dataset}
                series={[
                    { id: 'total', label: 'Total de Inseminadas', type: 'bar', dataKey: 'total', yAxisId: 'totalAxis' },
                    {
                        id: 'birthRate',
                        label: 'Taxa de Natalidade',
                        type: 'line',
                        dataKey: 'birthRate',
                        yAxisId: 'rateAxis',
                        valueFormatter: (value: number | null) => percentageTransform(value ?? 0),
                    }
                ]}
                xAxis={[{
                    scaleType: 'band',
                    dataKey: 'dateMonth',
                    valueFormatter: (value: Date) => value.toLocaleDateString('pt-BR', {
                        month: 'short',
                        year: 'numeric'
                    })
                }]}
                yAxis={[
                    { id: 'totalAxis', position: 'left' },
                    {
                        id: 'rateAxis',
                        position: 'right',
                        domainLimit: () => ({ min: 0, max: 100 }),
                        valueFormatter: (value: number) => percentageTransform(value)
                    },
                ]}
            >
                <ChartsXAxis />
                <ChartsYAxis axisId='totalAxis' />
                <ChartsYAxis axisId='rateAxis' />
                <ChartsTooltip />
                <BarPlot />
                <LinePlot />
                <ChartsLegend />
                <ChartsAxisHighlight x='line' />
            </ChartContainer>
        }
    </GraphContainer>
}

const LastEntriesTable = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [data, setData] = useState<InseminationEntry[]>([])
    const [loading, setLoading] = useState(false)
    const { setPageProps } = useContext(PageContext)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getLastEntries()
            .then(response => {
                const json: InseminationEntry[] = response.json
                json.forEach(item => item.inseminationDate = new Date(item.inseminationDate ?? ''))
                setData(json)
            })
            .catch(() => setData([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard className="h-[400] overflow-hidden">
        <div className="flex flex-row">
            <CardDefaultTitle text="Última Inseminação" />
            <Button
                className="ml-auto"
                startIcon={<ChevronRight />}
                onClick={() => {
                    const page: PageProps = {
                        page: <EntriesTablePage />,
                        title: "Histórico de Inseminações",
                        previousPages: [HomePage, InseminationPage]
                    }
                    if (setPageProps) setPageProps(page)
                }}
            >
                Ver Histórico Completo
            </Button>
        </div>
        <div className="overflow-auto">
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Vaca</TableCell>
                        <TableCell>Data de Inseminação</TableCell>
                        <TableCell>Touro</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading
                        ? Array(10).fill(<TableLoadingRow colSpan={4} />)
                        : data.map(item => (
                            <TableRow>
                                <TableCell>{item.animalName}</TableCell>
                                <TableCell>{dateTransformToLocale(item.inseminationDate?.toString())}</TableCell>
                                <TableCell>{item.bullName}</TableCell>
                                <TableCell>
                                    {item.status &&
                                        <Chip
                                            label={InseminationStatusMap.get(item.status)}
                                            color={InseminationStatusColorMap.get(item.status)}
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

const LastGroupsTable = ({ reloadFlag, startLoading, stopLoading }: DashboardInformationProps) => {

    const [data, setData] = useState<InseminationGroup[]>([])
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

    return <DashboardCard className="col-start-2 col-span-2">
        <div className="flex flex-row">
            <CardDefaultTitle text="Últimos Grupos de Inseminação" />
            <Button
                className="ml-auto"
                startIcon={<ChevronRight />}
                onClick={() => setPageProps && setPageProps(GroupsTablePageProps)}
            >
                Ver Todos
            </Button>
        </div>
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell colSpan={2}>Data de Inseminação</TableCell>
                    <TableCell>Touro</TableCell>
                    <TableCell>Total de Animais</TableCell>
                    <TableCell>Taxa de Natalidade</TableCell>
                    <TableCell>Comparação c/ Média</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {loading
                    ? Array(10).fill(<TableLoadingRow colSpan={6} />)
                    : data.map(item => (
                        <TableRow>
                            <TableCell>
                                <EditControlButtons
                                    onShow={() => {
                                        const date = dateTransformToLocale(item.inseminationDate.toString())
                                        const page: PageProps = {
                                            page: <GroupEntriesTablePage {...{ groupId: item.id }} />,
                                            title: `Inseminações - ${item.bullName} - ${date}`,
                                            previousPages: [HomePage, InseminationPage]
                                        }
                                        if (setPageProps) setPageProps(page)
                                    }}
                                />
                            </TableCell>
                            <TableCell>{dateTransformToLocale(item.inseminationDate.toString())}</TableCell>
                            <TableCell>{item.bullName}</TableCell>
                            <TableCell align="center">{item.cowNumber}</TableCell>
                            <TableCell align="center">{percentageTransform(item.birthRate)}</TableCell>
                            <TableCell>
                                <TrendComponent trend={item.comparisonRate} />
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    </DashboardCard>
}
