import {
    CardDefaultTitle,
    CardChartContent,
    DashboardCard,
} from "@/ui/shared/dashboard/DashboardComponents"
import { LineChart, SparkLineChart } from "@mui/x-charts"
import { BirthsByDate, BirthsBySex, DeathStats, IntervalAnimal, IntervalStats } from "./Entities"
import { getIntervalsRanking, getBirthHistory, getBirthIntervalStats, getBirthsBySex, getDeathIndex } from "./Controller"
import { LOADING_MSG, NO_DATA_AVAILABLE } from "@/ui/shared/Globals"
import { lightBlue, pink, red } from "@mui/material/colors"
import { useContext, useEffect, useMemo, useState } from "react"
import { decimalTransform } from "@/util/Transformations"
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import { TableLoadingRow, TrendValues } from "@/ui/shared/table/TableComponents"
import Add from "@mui/icons-material/Add"
import ChevronRight from "@mui/icons-material/ChevronRight"
import { PageProps } from "@/ui/shared/main-page/PageDisplay"
import { BirthTablePage } from "./BirthTable"
import { HomePage } from "../../home/HomePage"
import { BirthPage } from "./BirthPages"
import { PageContext } from "@/ui/shared/main-page/PageContext"
import { AddBirthDialog } from "./BirthAddDialog"
import { DashboardInformationProps, DashboardTopBarProps } from "@/ui/shared/dashboard/Entities"
import { ReloadButton } from "@/ui/shared/table/TableTopBarComponents"
import { ComboBox, ComboBoxItem } from "@/ui/shared/common/ComboBox"


export const BirthDashboard = () => {

    const [reloadFlag, setReloadFlag] = useState(0)
    const [activeRequests, setActiveRequests] = useState(0)

    const startLoading = () => setActiveRequests(prev => prev + 1)
    const stopLoading = () => setActiveRequests(prev => Math.max(prev - 1, 0))

    return <div className="w-full h-full overflow-auto bg-gray-100 p-4 flex flex-col gap-4">
        <DashboardToolbar  {...{ activeRequests, setReloadFlag }} />
        <DashboardInformations {...{ startLoading, stopLoading, reloadFlag }} />
    </div>
}

export const DashboardToolbar = ({ setReloadFlag, activeRequests }: DashboardTopBarProps) => {

    const { setPageProps } = useContext(PageContext)
    const [isAddBirthOpen, setAddBirthOpen] = useState(false)

    return <div className="flex flex-row gap-4">
        <ReloadButton
            variant="text"
            onReload={() => setReloadFlag(prev => prev + 1)}
            loading={activeRequests > 0}
        />
        <Button
            className="ml-auto"
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
        <AddBirthDialog {...{ isAddBirthOpen, setAddBirthOpen }} />
    </div>
}

const DashboardInformations = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {
    return <div className="grid grid-flow-row gap-4">
        <BirthIntervalCard {...{ startLoading, stopLoading, reloadFlag }} />
        <DeathIndexCard {...{ startLoading, stopLoading, reloadFlag }} />
        <BestIntervalAnimals {...{ stopLoading, startLoading, reloadFlag }} />
        <BirthByDateGraph {...{ startLoading, stopLoading, reloadFlag }} />
        <BirthBySexGraph {...{ stopLoading, startLoading, reloadFlag }} />
    </div>
}

const BirthIntervalCard = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultStats: IntervalStats = useMemo(() => ({
        intervalTrend: 0,
        intervalHist: [],
        currentInterval: 0
    }), [reloadFlag])

    const [stats, setStats] = useState<IntervalStats>(defaultStats)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getBirthIntervalStats()
            .then(response => setStats(response.json))
            .catch(() => setStats(defaultStats))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [defaultStats])

    return <DashboardCard>
        <CardChartContent
            title="Intervalo de Parição Médio"
            loading={loading}
            data={decimalTransform(stats.currentInterval)}
            chart={(
                <SparkLineChart
                    data={stats ? stats.intervalHist.map(item => item.intervalAverage) : []}
                    height={50}
                    valueFormatter={(value: number | null) => decimalTransform(value ?? 0)}
                    showTooltip
                    xAxis={{
                        scaleType: 'time',
                        data: stats.intervalHist.map(item => new Date(item.birthDate)),
                        valueFormatter: (value: Date) => value.getFullYear().toString()
                    }}
                />
            )}
            trendProps={{ trend: stats.intervalTrend, inverse: true }}
        />
    </DashboardCard>
}

const DeathIndexCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultStats: DeathStats = {
        currentDeathIndex: 0,
        deathIndexHist: [],
        deathTrend: 0
    }

    const [stats, setStats] = useState<DeathStats>(defaultStats)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getDeathIndex()
            .then(response => setStats(response.json))
            .catch(() => setStats(defaultStats))
            .finally(() => {
                stopLoading()
                setLoading(false)
            })
    }, [reloadFlag])

    return <DashboardCard className="col-start-2">
        <CardChartContent
            title="Índice de Mortalidade"
            loading={loading}
            data={decimalTransform(stats.currentDeathIndex)}
            chart={(
                <SparkLineChart
                    data={stats.deathIndexHist.map(item => item.deathIndex)}
                    color={red[600]}
                    height={50}
                    valueFormatter={(value) => decimalTransform(value ?? 0)}
                    xAxis={{
                        scaleType: 'time',
                        data: stats.deathIndexHist.map(item => new Date(item.month)),
                        valueFormatter: (value: Date) => value.getFullYear().toString()
                    }}
                    showTooltip
                />
            )}
            trendProps={{ trend: stats.deathTrend, inverse: true }}
        />
        <div>
            <Button startIcon={<Add />}>Registrar Morte</Button>
        </div>
    </DashboardCard>
}

const BirthByDateGraph = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const [dataset, setDataset] = useState<BirthsByDate[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getBirthHistory()
            .then(response => {
                const json: BirthsByDate[] = response.json
                json.forEach(item => item.date = new Date(item.date))
                setDataset(response.json)
            })
            .catch(() => setDataset([]))
            .finally(() => {
                stopLoading()
                setLoading(false)
            })
    }, [reloadFlag])

    return <DashboardCard className="col-span-2">
        <CardDefaultTitle text="Histórico de Nascimentos" />
        <LineChart
            loading={loading}
            dataset={dataset}
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
    </DashboardCard>
}

const BestIntervalAnimals = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const [data, setData] = useState<IntervalAnimal[]>([])
    const [rankBy, setRankBy] = useState('worst-intervals')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getIntervalsRanking(rankBy)
            .then(response => setData(response.json))
            .catch(() => setData([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, rankBy])

    const rankItems: ComboBoxItem[] = [
        { name: 'As Melhores Matrizes', value: 'best-intervals' },
        { name: 'As Piores Matrizes', value: 'worst-intervals' },
    ]

    return <DashboardCard className="col-start-3 row-span-2">
        <ComboBox
            variant="standard"
            className="w-[300]"
            items={rankItems}
            value={rankBy}
            onChange={(value) => setRankBy(value ?? 'worst-intervals')}
        />
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>{"Animal"}</TableCell>
                    <TableCell>{"Nº de Crias"}</TableCell>
                    <TableCell>{"Intervalo de Parição Médio"}</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {loading
                    ? Array(10).fill(<TableLoadingRow colSpan={4} />)
                    : data.map(item => (
                        <TableRow>
                            <TableCell>{item.animalName}</TableCell>
                            <TableCell>{item.birthNumbers}</TableCell>
                            <TableCell>
                                <TrendValues
                                    value={decimalTransform(item.intervalAverage)}
                                    trendProps={{ trend: item.averageRate, inverse: true }}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        </Table>
    </DashboardCard>
}

const BirthBySexGraph = ({ reloadFlag, startLoading, stopLoading }: DashboardInformationProps) => {

    const [dataset, setDataset] = useState<BirthsBySex[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getBirthsBySex()
            .then(response => {
                const newDataset: BirthsBySex[] = response.json
                newDataset.forEach(item => item.birthMonth = new Date(item.birthMonth))
                setDataset(newDataset)
            })
            .catch(() => setDataset([]))
            .finally(() => {
                stopLoading()
                setLoading(false)
            })
    }, [reloadFlag])

    return <DashboardCard className="col-span-2">
        <CardDefaultTitle text="Nascimentos por Sexo" />
        <LineChart
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
    </DashboardCard>
}

