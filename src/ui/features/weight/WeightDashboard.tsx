import {
    CardChartContent,
    CardDefaultTitle,
    DashboardCard,
    DashboardContainer,
    DashboardInfoContainer,
    DashboardTopContainer,
    TrendComponent
} from "@/ui/shared/dashboard/DashboardComponents"
import { useCallback, useEffect, useState } from "react"
import { CardWeight, CardWeightGain, WeightEntry, WeightGroup } from "./Entities"
import { getLastEntries, getLastGroups, getLastWeight, getLastWeightGain } from "./Controller"
import Table from "@mui/material/Table"
import { TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import { TableLoadingRow, TrendValues } from "@/ui/shared/table/TableComponents"
import { dateTransform, decimalTransform } from "@/util/Transformations"
import { DashboardInformationProps, DashboardTopBarProps } from "@/ui/shared/dashboard/Entities"
import { ReloadButton } from "@/ui/shared/table/TableTopBarComponents"
import { SparkLineChart } from "@mui/x-charts"

export const WeightDashboard = () => {

    const [activeRequests, setActiveRequests] = useState(0)
    const [reloadFlag, setReloadFlag] = useState(0)

    const startLoading = useCallback(() => setActiveRequests(prev => prev + 1), [])
    const stopLoading = useCallback(() => setActiveRequests(prev => Math.max(prev - 1)), [])

    return <DashboardContainer>
        <DashboardTopBar {...{ setReloadFlag, activeRequests }} />
        <DashboardInfo {...{ startLoading, stopLoading, reloadFlag }} />
    </DashboardContainer>
}

const DashboardTopBar = ({ setReloadFlag, activeRequests }: DashboardTopBarProps) => {
    return <DashboardTopContainer>
        <ReloadButton
            onReload={() => setReloadFlag(prev => prev + 1)}
            loading={activeRequests > 0}
        />
    </DashboardTopContainer>
}

const DashboardInfo = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {
    return <DashboardInfoContainer>
        <div className="grid gap-4 grid-cols-[350_350_1fr] grid-rows-[180_1fr]">
            <LastWeightCard {...{ startLoading, stopLoading, reloadFlag }} />
            <LastGainCard {...{ startLoading, stopLoading, reloadFlag }} />
            <LastEntriesTable {...{ startLoading, stopLoading, reloadFlag }} />
            <LastGroupsTable {...{ startLoading, stopLoading, reloadFlag }} />
        </div>
    </DashboardInfoContainer>
}

const LastWeightCard = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultValue: CardWeight = {
        trend: 0,
        current: 0,
        hist: []
    }

    const [data, setData] = useState<CardWeight>(defaultValue)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getLastWeight()
            .then(response => setData(response.json))
            .catch(() => setData(defaultValue))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [startLoading, stopLoading, reloadFlag])

    return <DashboardCard>
        <CardChartContent
            title="Peso Médio (Kg)"
            data={`${decimalTransform(data.current)} (${decimalTransform(data.current / 15)}@)`}
            trendProps={{ trend: data.trend }}
            loading={loading}
            chart={(
                <SparkLineChart
                    data={data.hist.map(item => item.averageWeight)}
                    height={50}
                    valueFormatter={(value) => `${decimalTransform(value || 0)} (${decimalTransform((value || 0) / 15)}@)`}
                    showTooltip
                    xAxis={{
                        data: data.hist.map(item => new Date(item.entryDate)),
                        valueFormatter: (value: Date) => dateTransform(value)
                    }}
                />
            )}
        />
    </DashboardCard>
}

const LastGainCard = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultValue: CardWeightGain = {
        trend: 0,
        current: 0,
        hist: []
    }

    const [data, setData] = useState<CardWeightGain>(defaultValue)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getLastWeightGain()
            .then(response => setData(response.json))
            .catch(() => setData(defaultValue))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [startLoading, stopLoading, reloadFlag])

    return <DashboardCard>
        <CardChartContent
            title="Ganho de Peso Diário (Kg/Dia)"
            data={decimalTransform(data.current)}
            trendProps={{ trend: data.trend }}
            loading={loading}
            chart={(
                <SparkLineChart
                    data={data.hist.map(item => item.averageGain)}
                    height={50}
                    valueFormatter={(value) => decimalTransform(value || 0)}
                    showTooltip
                    xAxis={{
                        data: data.hist.map(item => new Date(item.entryDate)),
                        valueFormatter: (value: Date) => dateTransform(value)
                    }}
                />
            )}
        />
    </DashboardCard>
}

const LastEntriesTable = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const [results, setResults] = useState<WeightEntry[]>([])
    const [lastDate, setLastDate] = useState<string>("Sem Data")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getLastEntries()
            .then(results => {
                const json: WeightEntry[] = results.json
                const entryDate = new Date(json[0].entryDate)
                setLastDate(dateTransform(entryDate))
                setResults(json)
            })
            .catch(() => {
                setResults([])
                setLastDate("Sem Data")
            })
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [startLoading, stopLoading, reloadFlag])

    return <DashboardCard className="col-start-3 row-span-2 h-[550]">
        <CardDefaultTitle text={`Última Marcação de Peso - ${lastDate}`} />
        <div className="overflow-auto">
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>Animal</TableCell>
                        <TableCell>Peso</TableCell>
                        <TableCell align="center">Ganho de Peso (Kg/dia)</TableCell>
                        <TableCell>Variação de Peso</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading
                        ? Array(10).fill(<TableLoadingRow colSpan={4} />)
                        : results.map(row => (
                            <TableRow>
                                <TableCell>{row.animalName}</TableCell>
                                <TableCell>{row.weight}</TableCell>
                                <TableCell align="center">{decimalTransform(row.weightGain)}</TableCell>
                                <TableCell>
                                    <TrendComponent
                                        trend={row.weightVariation}
                                        text={row.weightVariation.toString()}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    </DashboardCard>
}

const LastGroupsTable = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const [results, setResults] = useState<WeightGroup[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getLastGroups()
            .then(results => setResults(results.json))
            .catch(() => setResults([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [startLoading, stopLoading, reloadFlag])

    return <DashboardCard className="col-start-1 col-span-2">
        <CardDefaultTitle text="As 5 Últimas Marcações" />
        <div className="overflow-auto">
            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Data</TableCell>
                        <TableCell>Nº de Animais</TableCell>
                        <TableCell align="center">Peso</TableCell>
                        <TableCell align="center">Ganho de Peso (Kg/dia)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading
                        ? Array(10).fill(<TableLoadingRow colSpan={4} />)
                        : results.map(row => (
                            <TableRow>
                                <TableCell>{dateTransform(row.entryDate)}</TableCell>
                                <TableCell>{row.animalsNumber}</TableCell>
                                <TableCell align="center">
                                    <TrendValues
                                        value={decimalTransform(row.averageWeight)}
                                        trendProps={{ trend: row.weightVariation }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <TrendValues
                                        value={decimalTransform(row.averageGain)}
                                        trendProps={{ trend: row.gainVariation }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    </DashboardCard>
}

