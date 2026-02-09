import {
    CardDefaultTitle,
    CardChartContent,
    DashboardCard,
    DashboardTopContainer,
    DashboardContainer,
    DashboardTableBody,
    DashboardInfoContainer,
} from "@shared/dashboard/DashboardComponents"
import { BarChart, LineChart, SparkLineChart } from "@mui/x-charts"
import {
    BirthEntry,
    BirthsByDate,
    BirthsBySex,
    IntervalAnimal,
} from "./Entities"
import {
    getIntervalsRanking,
    getBirthHistory,
    getBirthIntervalStats,
    getBirthsBySex,
    getDeathIndex,
    getLastBirths,
    getLastBirthsNumber,
    getYearBirthsNumber,
    getYearBirthsSex,
    getYearDeathsNumber,
} from "./Service"
import { LOADING_MSG, NO_DATA_AVAILABLE } from "@shared/Globals"
import { green, lightBlue, pink, red } from "@mui/material/colors"
import { useCallback, useEffect, useState } from "react"
import { dateTransform, decimalTransform, positiveTransform } from "@utils/Transformations"
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import { TrendValues } from "@shared/table/TableComponents"
import Add from "@mui/icons-material/Add"
import ChevronRight from "@mui/icons-material/ChevronRight"
import { DashboardInformationProps, DashboardTopBarProps } from "@shared/dashboard/Entities"
import { ReloadButton } from "@shared/table/TableTopBarComponents"
import { ComboBox, ComboBoxItem } from "@shared/common/ComboBox"
import { CardEntry, DefaultCard } from "@utils/Entities"
import { useNavigate } from "react-router"
import { AddBirthDialog } from "./AddBirthDialog"
import { getAnimalLabel } from "@features/animals/Entities"

export const BirthDashboard = () => {

    const [reloadFlag, setReloadFlag] = useState(0)
    const [activeRequests, setActiveRequests] = useState(0)

    const startLoading = useCallback(() => setActiveRequests(prev => prev + 1), [])
    const stopLoading = useCallback(() => setActiveRequests(prev => Math.max(prev - 1, 0)), [])

    return <DashboardContainer>
        <DashboardToolbar  {...{ activeRequests, setReloadFlag }} />
        <DashboardInformations {...{ startLoading, stopLoading, reloadFlag }} />
    </DashboardContainer>
}

export const DashboardToolbar = ({ setReloadFlag, activeRequests }: DashboardTopBarProps) => {

    const [addBirthOpen, setAddBirthOpen] = useState(false)

    const navigate = useNavigate()

    const closeBirthDialog = useCallback((added?: boolean) => {
        setAddBirthOpen(false)
        if (!added) return
        setReloadFlag(prev => prev + 1)
    }, [setReloadFlag])

    return <DashboardTopContainer>
        <ReloadButton
            variant="text"
            onReload={() => setReloadFlag(prev => prev + 1)}
            loading={activeRequests > 0}
        />
        <Button
            className="ml-auto"
            startIcon={<Add />}
            onClick={() => setAddBirthOpen(true)}
        >
            Adicionar Parição
        </Button>
        <Button
            endIcon={<ChevronRight />}
            onClick={() => navigate("entries")}
        >
            Tabela de Parição
        </Button>
        <AddBirthDialog {...{ addBirthOpen, closeBirthDialog }} />
    </DashboardTopContainer>
}

const DashboardInformations = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {
    return <DashboardInfoContainer className="flex flex-col gap-4">
        <div className="grid grid-cols-[repeat(3,270px)_1fr] grid-rows-[180px_1fr] gap-4">
            <LastBirthNumberCard {...{ startLoading, stopLoading, reloadFlag }} />
            <BirthIntervalCard {...{ startLoading, stopLoading, reloadFlag }} />
            <DeathIndexCard {...{ startLoading, stopLoading, reloadFlag }} />
            <LastBirthsTable {...{ startLoading, stopLoading, reloadFlag }} />
            <BestIntervalAnimals {...{ stopLoading, startLoading, reloadFlag }} />
        </div>
        <div className="grid grid-cols-[1fr_600px] grid-rows-[repeat(2,200px)] gap-4">
            <BirthByDateGraph {...{ startLoading, stopLoading, reloadFlag }} />
            <YearBirthNumberCard {...{ startLoading, stopLoading, reloadFlag }} />
            <YearDeathNumberCard {...{ startLoading, stopLoading, reloadFlag }} />
        </div>
        <div className="grid grid-cols-[650px_1fr] auto-rows-[500px] gap-4">
            <YearBirthBySexGraph {...{ startLoading, stopLoading, reloadFlag }} />
            <BirthBySexGraph {...{ stopLoading, startLoading, reloadFlag }} />
        </div>
    </DashboardInfoContainer>
}

const LastBirthNumberCard = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const [stats, setStats] = useState<CardEntry>(DefaultCard)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getLastBirthsNumber()
            .then(response => setStats(response))
            .catch(() => setStats(DefaultCard))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Nascimentos no Mês"
            loading={loading}
            data={stats.current}
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.value)}
                    height={80}
                    color={green[600]}
                    showTooltip
                    showHighlight
                    xAxis={{
                        scaleType: 'time',
                        domainLimit: 'strict',
                        data: stats.hist.map(item => new Date(item.date)),
                        valueFormatter: (value: Date) => value.toLocaleString("pt-BR", {
                            month: 'short',
                            year: 'numeric'
                        })
                    }}
                />
            )}
            trendProps={{ trend: stats.trend, text: positiveTransform(stats.trend) }}
        />
    </DashboardCard>
}


const BirthIntervalCard = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const [stats, setStats] = useState<CardEntry>(DefaultCard)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getBirthIntervalStats()
            .then(response => setStats(response))
            .catch(() => setStats(DefaultCard))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Intervalo de Parição Médio"
            loading={loading}
            data={decimalTransform(stats.current)}
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.value)}
                    height={80}
                    valueFormatter={(value: number | null) => decimalTransform(value ?? 0)}
                    showTooltip
                    showHighlight
                    xAxis={{
                        scaleType: 'time',
                        domainLimit: 'strict',
                        data: stats.hist.map(item => new Date(item.date)),
                        valueFormatter: (value: Date) => value.getFullYear().toString()
                    }}
                />
            )}
            trendProps={{ trend: stats.trend, inverse: true }}
        />
    </DashboardCard>
}

const DeathIndexCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const [stats, setStats] = useState<CardEntry>(DefaultCard)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getDeathIndex()
            .then(response => setStats(response))
            .catch(() => setStats(DefaultCard))
            .finally(() => {
                stopLoading()
                setLoading(false)
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Índice de Mortalidade"
            loading={loading}
            data={decimalTransform(stats.current)}
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.value)}
                    color={red[600]}
                    height={80}
                    valueFormatter={(value) => decimalTransform(value ?? 0)}
                    xAxis={{
                        scaleType: 'time',
                        domainLimit: 'strict',
                        data: stats.hist.map(item => new Date(item.date)),
                        valueFormatter: (value: Date) => value.getFullYear().toString()
                    }}
                    showTooltip
                    showHighlight
                />
            )}
            trendProps={{ trend: stats.trend, inverse: true }}
        />
    </DashboardCard>
}

const BirthByDateGraph = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const [dataset, setDataset] = useState<BirthsByDate[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getBirthHistory()
            .then(response => setDataset(response))
            .catch(() => setDataset([]))
            .finally(() => {
                stopLoading()
                setLoading(false)
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard className="row-span-2">
        <CardDefaultTitle text="Histórico de Nascimentos" />
        <LineChart
            loading={loading}
            dataset={dataset}
            localeText={{
                loading: LOADING_MSG,
                noData: NO_DATA_AVAILABLE
            }}
            xAxis={[{
                data: dataset.map(item => new Date(item.date)),
                scaleType: 'time',
                domainLimit: 'strict',
                valueFormatter: (value: Date) => value.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
            }]}
            series={[
                {
                    data: dataset.map(item => item.birthTotal),
                    label: 'Nascimentos',
                    curve: 'linear',
                    showMark: false,
                    color: green[600],
                },
                {
                    data: dataset.map(item => item.deathTotal),
                    label: 'Morte de Bezerros (*abaixo de 1 ano)',
                    curve: 'linear',
                    showMark: false,
                    color: red[600],
                }
            ]}
        />
    </DashboardCard>
}

const YearBirthNumberCard = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const [stats, setStats] = useState<CardEntry>(DefaultCard)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getYearBirthsNumber()
            .then(response => setStats(response))
            .catch(() => setStats(DefaultCard))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Nascimentos p/ Ano"
            loading={loading}
            data={stats.current}
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.value)}
                    height={100}
                    showTooltip
                    showHighlight
                    area
                    color={green[600]}
                    xAxis={{
                        scaleType: 'time',
                        domainLimit: 'strict',
                        data: stats.hist.map(item => new Date(item.date)),
                        valueFormatter: (value: Date) => value.getFullYear().toString()
                    }}
                />
            )}
            trendProps={{ trend: stats.trend }}
        />
    </DashboardCard>
}

const YearDeathNumberCard = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const [stats, setStats] = useState<CardEntry>(DefaultCard)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getYearDeathsNumber()
            .then(response => setStats(response))
            .catch(() => setStats(DefaultCard))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Morte de Bezerros p/ Ano"
            loading={loading}
            data={stats.current}
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.value)}
                    height={100}
                    showTooltip
                    showHighlight
                    area
                    color={red[600]}
                    xAxis={{
                        scaleType: 'time',
                        domainLimit: 'strict',
                        data: stats.hist.map(item => new Date(item.date)),
                        valueFormatter: (value: Date) => value.getFullYear().toString()
                    }}
                />
            )}
            trendProps={{ trend: stats.trend, inverse: true }}
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
            .then(response => setData(response))
            .catch(() => setData([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, rankBy, startLoading, stopLoading])

    const rankItems: ComboBoxItem[] = [
        { name: 'As Melhores Matrizes', value: 'best-intervals' },
        { name: 'As Piores Matrizes', value: 'worst-intervals' },
    ]

    return <DashboardCard className="col-span-3">
        <ComboBox
            variant="standard"
            className="w-75"
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
                <DashboardTableBody
                    loading={loading}
                    dataset={data}
                    colSpan={3}
                    render={item => (
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
                    )}
                />
            </TableBody>
        </Table>
    </DashboardCard>
}

const LastBirthsTable = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const [data, setData] = useState<BirthEntry[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getLastBirths()
            .then(response => setData(response))
            .catch(() => setData([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard className="row-span-2">
        <CardDefaultTitle text="Últimos Nascimentos" />
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Mãe</TableCell>
                    <TableCell align="center">Data de Nascimento</TableCell>
                    <TableCell align="center">Intervalo de Parição</TableCell>
                    <TableCell align="center">Sexo</TableCell>
                    <TableCell>Pai</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <DashboardTableBody
                    dataset={data}
                    colSpan={5}
                    loading={loading}
                    render={row => (
                        <TableRow>
                            <TableCell>{getAnimalLabel(row.mother)}</TableCell>
                            <TableCell align="center">{dateTransform(row.calf.birthDate)}</TableCell>
                            <TableCell align="center">
                                {row.birthInterval ?? '1ª Cria'}
                            </TableCell>
                            <TableCell align="center">{row.calf.sex}</TableCell>
                            <TableCell>{getAnimalLabel(row.father)}</TableCell>
                        </TableRow>
                    )}
                />
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
                const newDataset: BirthsBySex[] = response
                newDataset.forEach(item => item.birthMonth = new Date(item.birthMonth))
                setDataset(newDataset)
            })
            .catch(() => setDataset([]))
            .finally(() => {
                stopLoading()
                setLoading(false)
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardDefaultTitle text="Nascimentos por Sexo" />
        <BarChart
            loading={loading}
            dataset={dataset}
            localeText={{
                loading: LOADING_MSG,
                noData: NO_DATA_AVAILABLE
            }}
            xAxis={[{
                dataKey: 'birthMonth',
                domainLimit: 'strict',
                valueFormatter: (value: Date) => value.toLocaleString('pt-BR', { month: 'short', year: 'numeric' })
            }]}
            series={[
                {
                    label: 'Machos',
                    dataKey: 'males',
                    color: lightBlue[600],
                },
                {
                    label: "Fêmeas",
                    dataKey: 'females',
                    color: pink[600],
                }
            ]}
        />
    </DashboardCard>
}

const YearBirthBySexGraph = ({ reloadFlag, startLoading, stopLoading }: DashboardInformationProps) => {

    const [dataset, setDataset] = useState<BirthsBySex[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getYearBirthsSex()
            .then(response => setDataset(response))
            .catch(() => setDataset([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardDefaultTitle text="Nascimentos Anuais por Sexo" />
        <BarChart
            loading={loading}
            localeText={{
                loading: LOADING_MSG,
                noData: NO_DATA_AVAILABLE
            }}
            layout="horizontal"
            yAxis={[{
                data: dataset.map(item => new Date(item.birthMonth)),
                domainLimit: 'strict',
                valueFormatter: (value: Date) => value.getFullYear().toString()
            }]}
            series={[
                {
                    data: dataset.map(item => item.males),
                    label: 'Machos',
                    color: lightBlue[600],
                },
                {
                    label: "Fêmeas",
                    data: dataset.map(item => item.females),
                    color: pink[600],
                }
            ]}
        />
    </DashboardCard>
}
