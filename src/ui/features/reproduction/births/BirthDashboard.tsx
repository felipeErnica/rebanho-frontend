import { 
    CardDefaultTitle, 
    InfoCardWithChart, 
    DashboardCard, 
    GraphContainer, 
    TrendComponent, 
    CardDefaultText 
} from "@/ui/shared/dashboard/DashboardComponents"
import { LineChart, SparkLineChart } from "@mui/x-charts"
import { BirthBySex, BirthsByDate, BirthStats, IntervalAnimal } from "./Entities"
import { getBestIntervals, getBirthsBySex, getBirthStats } from "./Controller"
import { LOADING_MSG, NO_DATA_AVAILABLE } from "@/ui/shared/Globals"
import { lightBlue, pink, red } from "@mui/material/colors"
import { useEffect, useState } from "react"
import { decimalTransform } from "@/util/Transformations"
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import { TableLoadingRow } from "@/ui/shared/table/TableComponents"
import dayjs from "dayjs"
import Add from "@mui/icons-material/Add"
import ChevronRight from "@mui/icons-material/ChevronRight"

export const BirthDashboard = () => {
    return <div className="w-full h-full overflow-y-auto bg-gray-100 p-4 flex flex-col gap-4">
        <div className="flex flex-row-reverse gap-4">
            <Button startIcon={<ChevronRight />}>
                Ver Tabela de Parição
            </Button>
            <Button startIcon={<Add />}>
                Adicionar Parição
            </Button>
        </div>
        <DashboardInformations />
    </div>
}

const DashboardInformations = () => {

    const [stats, setStats] = useState<BirthStats>()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
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
    }, [])

    return <div className="grid grid-flow-row gap-4">
        <InfoCardWithChart
            title="Índice de Mortalidade"
            data={stats?.deathIndex}
            chart={(
                <SparkLineChart
                    data={stats ? stats.deathIndexHist.map(item => item.deathIndex) : []}
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
        <InfoCardWithChart
            className="col-start-2"
            title="Intervalo de Parição Médio"
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
        <BestIntervalAnimals />
        <GraphContainer className="col-span-2" title="Histórico de Nascimentos">
            <BirthByDateGraph {...{ birthDataset: stats?.birthHistory, loading }} />
        </GraphContainer>
        <InfoCardWithChart
            title="Nascimentos"
            integer
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
            trendProps={{ trend: stats?.lossTrend, inverse: true, noPercentage: true }}
        />
        <GraphContainer className="col-start-2 col-span-2 row-span-3" title="Nascimentos por Sexo">
            <BirthBySexGraph />
        </GraphContainer>
        <InfoCardWithChart
            title="Parições Interrompidas"
            integer
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
            trendProps={{ trend: stats?.lossTrend, inverse: true, noPercentage: true }}
        />
        <DashboardCard>
            <CardDefaultTitle text="Vacas Prenhas" />
            <CardDefaultText>{stats?.pregnantsNumber}</CardDefaultText>
        </DashboardCard>
    </div>
}

const BirthBySexGraph = () => {

    const [dataset, setDataset] = useState<BirthBySex[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        getBirthsBySex()
            .then(response => {
                const newDataset: BirthBySex[] = response.json
                newDataset.forEach(item => item.birthMonth = new Date(item.birthMonth))
                setDataset(newDataset)
            })
            .catch(() => setDataset([]))
            .finally(() => setLoading(false))
    }, [])

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
        height={320}
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

const BestIntervalAnimals = () => {

    const [data, setData] = useState<IntervalAnimal[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        getBestIntervals()
            .then(response => setData(response.json))
            .catch(() => setData([]))
            .finally(() => setLoading(false))
    }, [])

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
