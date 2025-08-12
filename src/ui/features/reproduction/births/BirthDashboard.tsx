import {
    CardDefaultTitle,
    CardChartContent,
    DashboardCard,
    GraphContainer,
    TrendComponent,
    CardDefaultText
} from "@/ui/shared/dashboard/DashboardComponents"
import { LineChart, SparkLineChart } from "@mui/x-charts"
import { BirthBySex, BirthsByDate, BirthStats, IntervalAnimal } from "./Entities"
import { getBestIntervals, getBirthsBySex, getBirthStats } from "./Controller"
import { LOADING_MSG, NO_DATA_AVAILABLE, ReloadFunction } from "@/ui/shared/Globals"
import { lightBlue, pink, red } from "@mui/material/colors"
import { useContext, useEffect, useState } from "react"
import { decimalTransform } from "@/util/Transformations"
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import { TableLoadingRow } from "@/ui/shared/table/TableComponents"
import dayjs from "dayjs"
import Add from "@mui/icons-material/Add"
import ChevronRight from "@mui/icons-material/ChevronRight"
import Refresh from "@mui/icons-material/Refresh"
import { PageProps } from "@/ui/shared/main-page/PageDisplay"
import { BirthTablePage } from "./BirthTable"
import { HomePage } from "../../home/HomePage"
import { BirthPage } from "./BirthPages"
import { PageContext } from "@/ui/shared/main-page/PageContext"
import { AddBirthDialog } from "./BirthAddDialog"


export const BirthDashboard = () => {

    const reloadListener: ReloadFunction[] = []

    return <div className="w-full h-full overflow-auto bg-gray-100 p-4 flex flex-col gap-4">
        <DashboardToolbar  {...{ reloadListener }} />
        <DashboardInformations {...{ reloadListener }} />
    </div>
}

type DashboardProps = {
    reloadListener: ReloadFunction[]
}

export const DashboardToolbar = ({ reloadListener }: DashboardProps) => {

    const { setPageProps } = useContext(PageContext)
    const [isAddBirthOpen, setAddBirthOpen] = useState(false)

    return <div className="flex flex-row">
        <div className="grow">
            <Button
                startIcon={<Refresh />}
                onClick={() => reloadListener.forEach(func => func())}
            >
                Recarregar Informações
            </Button>
        </div>
        <div className="flex flex-row gap-4">
            <Button
                startIcon={<ChevronRight />}
                onClick={() => {
                    const tablePage: PageProps = {
                        title: 'Tabela de Parição',
                        page: <BirthTablePage />,
                        previousPages: [HomePage, BirthPage]
                    }
                    if (setPageProps) setPageProps(tablePage)
                }}
            >
                Ver Tabela de Parição
            </Button>
            <Button
                startIcon={<Add />}
                onClick={() => setAddBirthOpen(true)}
            >
                Adicionar Parição
            </Button>
        </div>
        <AddBirthDialog {...{ isAddBirthOpen, setAddBirthOpen }} />
    </div>
}

const DashboardInformations = ({ reloadListener }: DashboardProps) => {

    const [stats, setStats] = useState<BirthStats>()
    const [loading, setLoading] = useState(false)

    const handleLoad = () => {
        setLoading(true)
        getBirthStats()
            .then(response => {
                const birthStats: BirthStats = response.json
                birthStats.lossHist.forEach(item => item.month = new Date(item.month))
                birthStats.intervalHist.forEach(item => item.month = new Date(item.month))
                birthStats.deathIndexHist.forEach(item => item.month = new Date(item.month))
                birthStats.birthHistory.forEach(item => item.date = new Date(item.date))
                setStats(birthStats)
            })
            .catch(() => setStats(undefined))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        reloadListener.push(handleLoad)
        handleLoad()
    }, [reloadListener])

    return <div className="grid grid-flow-row gap-4">
        <DashboardCard>
            <CardChartContent
                title="Índice de Mortalidade"
                loading={loading}
                data={stats?.deathIndex}
                chart={(
                    <SparkLineChart
                        data={stats ? stats.deathIndexHist.map(item => item.deathIndex) : []}
                        color={red[600]}
                        height={50}
                        valueFormatter={(value) => decimalTransform(value ?? 0)}
                        xAxis={{
                            scaleType: 'time',
                            data: stats?.deathIndexHist.map(item => item.month),
                            valueFormatter: (value: Date) => {
                                const year = value.getFullYear()
                                const quarter = Math.ceil((value.getMonth() + 1) / 3)
                                return `T${quarter} ${year}`
                            }
                        }}
                        showTooltip
                    />
                )}
                trendProps={{ trend: stats?.deathTrend, inverse: true }}
            />
            <div>
                <Button startIcon={<Add />}>Registrar Morte</Button>
            </div>
        </DashboardCard>
        <DashboardCard className="col-start-2">
            <CardChartContent
                title="Intervalo de Parição Médio"
                loading={loading}
                data={stats?.currentInterval}
                chart={(
                    <SparkLineChart
                        data={stats ? stats.intervalHist.map(item => item.intervalAverage) : []}
                        height={50}
                        valueFormatter={(value) => decimalTransform(value ?? 0)}
                        showTooltip
                        xAxis={{
                            scaleType: 'time',
                            data: stats?.intervalHist.map(item => item.month),
                            valueFormatter: (value: Date) => {
                                return value.toLocaleDateString('pt-BR', {
                                    month: 'short',
                                    year: 'numeric'
                                })
                            }
                        }}
                    />
                )}
                trendProps={{ trend: stats?.intervalTrend, inverse: true }}
            />
        </DashboardCard>
        <BestIntervalAnimals {...{ reloadListener }} />
        <GraphContainer className="col-span-2" title="Histórico de Nascimentos">
            <BirthByDateGraph {...{ birthDataset: stats?.birthHistory, loading }} />
        </GraphContainer>
        <DashboardCard>
            <CardChartContent
                title="Nascimentos"
                loading={loading}
                data={stats?.currentBirthNumbers}
                chart={(
                    <SparkLineChart
                        data={stats
                            ? stats.birthHistory
                                .filter(item => {
                                    return dayjs(item.date).isAfter(dayjs().subtract(1, 'year'))
                                })
                                .map(item => item.birthTotal)
                            : []
                        }
                        height={50}
                        showTooltip
                        xAxis={{
                            scaleType: 'time',
                            data: stats?.birthHistory
                                .map(item => item.date)
                                .filter(item => dayjs(item).isAfter(dayjs().subtract(1, 'year'))),
                            valueFormatter: (value: Date) => {
                                return value.toLocaleDateString('pt-BR', {
                                    month: 'short',
                                    year: 'numeric'
                                })
                            }
                        }}
                    />
                )}
                trendProps={{
                    trend: stats?.birthNumbersTrend,
                    noPercentage: true,
                    integer: true,
                }}
            />
        </DashboardCard>
        <GraphContainer className="col-start-2 col-span-2 row-span-3" title="Nascimentos por Sexo">
            <BirthBySexGraph {...{ reloadListener }} />
        </GraphContainer>
        <DashboardCard>
            <CardChartContent
                title="Parições Interrompidas"
                loading={loading}
                data={stats?.losses}
                chart={(
                    <SparkLineChart
                        data={stats ? stats.lossHist.map(item => item.losses) : []}
                        height={50}
                        showTooltip
                        xAxis={{
                            scaleType: 'time',
                            data: stats?.lossHist.map(item => item.month),
                            valueFormatter: (value: Date) => {
                                return value.toLocaleDateString('pt-BR', {
                                    month: 'short',
                                    year: 'numeric'
                                })
                            }
                        }}
                    />
                )}
                trendProps={{
                    trend: stats?.lossTrend,
                    inverse: true,
                    noPercentage: true,
                    integer: true,
                }}
            />
        </DashboardCard>
        <DashboardCard>
            <CardDefaultTitle text="Vacas Prenhas" />
            <CardDefaultText loading={loading}>{stats?.pregnantsNumber}</CardDefaultText>
        </DashboardCard>
    </div>
}

const BirthBySexGraph = ({ reloadListener }: DashboardProps) => {

    const [dataset, setDataset] = useState<BirthBySex[]>([])
    const [loading, setLoading] = useState(false)

    const handleLoad = () => {
        setLoading(true)
        getBirthsBySex()
            .then(response => {
                const newDataset: BirthBySex[] = response.json
                newDataset.forEach(item => item.birthMonth = new Date(item.birthMonth))
                setDataset(newDataset)
            })
            .catch(() => setDataset([]))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        reloadListener.push(handleLoad)
        handleLoad()
    }, [reloadListener])

    return <LineChart
        height={350}
        loading={loading}
        dataset={dataset}
        localeText={{
            loading: LOADING_MSG,
            noData: NO_DATA_AVAILABLE
        }}
        xAxis={[{
            dataKey: 'birthMonth',
            scaleType: 'time',
            valueFormatter: (value: Date) => `${value.toLocaleDateString('pt-BR', { month: 'short' })}  ${value.getFullYear()}`,
        }]}
        series={[
            {
                label: 'Machos',
                dataKey: 'males',
                color: lightBlue[600],
                showMark: false,
            },
            {
                label: "Fêmeas",
                dataKey: 'females',
                color: pink[600],
                showMark: false,
            }
        ]}
    />
}

type BirthsByDateProps = {
    birthDataset?: BirthsByDate[]
    loading: boolean
}

const BirthByDateGraph = ({ birthDataset, loading }: BirthsByDateProps) => {

    return <LineChart
        loading={loading}
        dataset={birthDataset ?? []}
        localeText={{
            loading: LOADING_MSG,
            noData: NO_DATA_AVAILABLE
        }}
        height={250}
        xAxis={[{
            dataKey: 'date',
            scaleType: 'time',
            valueFormatter: (value: Date) => `${value.toLocaleDateString('pt-BR', { month: 'short' })}  ${value.getFullYear()}`,
        }]}
        series={[
            {
                dataKey: 'birthTotal',
                label: 'Nascimentos',
                showMark: false,
            },
            {
                dataKey: 'deathTotal',
                label: 'Morte de Bezerros (*abaixo de 1 ano)',
                showMark: false,
                color: red[600],
            }
        ]}
    />

}

const BestIntervalAnimals = ({ reloadListener }: DashboardProps) => {

    const [data, setData] = useState<IntervalAnimal[]>([])
    const [loading, setLoading] = useState(false)

    const handleLoad = () => {
        setLoading(true)
        getBestIntervals()
            .then(response => setData(response.json))
            .catch(() => setData([]))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        reloadListener.push(handleLoad)
        handleLoad()
    }, [reloadListener])

    return <DashboardCard className="col-start-3 row-span-2">
        <CardDefaultTitle text="Melhores Matrizes" />
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>{"Animal"}</TableCell>
                    <TableCell>{"Nº de Crias"}</TableCell>
                    <TableCell>{"Intervalo de Parição Médio"}</TableCell>
                    <TableCell>{"Comparação com a Média"}</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {loading
                    ? Array(10).fill(<TableLoadingRow colSpan={4} />)
                    : data.map(item => (
                        <TableRow>
                            <TableCell>{item.animalName}</TableCell>
                            <TableCell>{item.birthNumbers}</TableCell>
                            <TableCell>{decimalTransform(item.intervalAverage)}</TableCell>
                            <TableCell>
                                <TrendComponent trend={item.averageRate} inverse />
                            </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
    </DashboardCard>
}
