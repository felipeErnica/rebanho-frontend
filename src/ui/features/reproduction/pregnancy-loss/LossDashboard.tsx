import { CardChartContent, CardDefaultTitle, DashboardCard, DashboardContainer } from "@/ui/shared/dashboard/DashboardComponents"
import { ReloadButton } from "@/ui/shared/table/TableTopBarComponents"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { LossNumbersHist, LossRate, MostLossesAnimals } from "./Entities"
import { getLossesHist, getLossRate, getMostLossesAnimals } from "./Controller"
import { percentageTransform } from "@/util/Transformations"
import { BarChart, SparkLineChart } from "@mui/x-charts"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import { TableLoadingRow, TrendValues } from "@/ui/shared/table/TableComponents"
import Button from "@mui/material/Button"
import Add from "@mui/icons-material/Add"
import ChevronRight from "@mui/icons-material/ChevronRight"
import { PageContext } from "@/ui/shared/main-page/PageContext"
import { LossTablePageProps } from "./LossPages"
import { AddLossDialog } from "./AddLossDialog"
import { DashboardInformationProps, DashboardTopBarProps } from "@/ui/shared/dashboard/Entities"

export const LossDashboard = () => {

    const [reloadFlag, setReloadFlag] = useState(0)
    const [activeRequests, setActiveRequests] = useState(0)

    const startLoading = useCallback(() => setActiveRequests(prev => prev + 1), [])
    const stopLoading = useCallback(() => setActiveRequests(prev => Math.min(prev - 1)), [])

    return <DashboardContainer>
        <DashboardTopBar {...{ activeRequests, setReloadFlag }} />
        <LossInformation {...{ reloadFlag, stopLoading, startLoading }} />
    </DashboardContainer>
}

const DashboardTopBar = ({ setReloadFlag, activeRequests }: DashboardTopBarProps) => {

    const [addLossOpen, setAddLossOpen] = useState(false)
    const { setPageProps } = useContext(PageContext)

    return <div className="flex flex-row">
        <ReloadButton
            variant="text"
            onReload={() => setReloadFlag(prev => prev + 1)}
            loading={activeRequests > 0}
        />
        <Button
            className="ml-auto"
            startIcon={<Add />}
            onClick={() => setAddLossOpen(true)}
        >
            Registrar Interrupção
        </Button>
        <Button
            onClick={() => setPageProps && setPageProps(LossTablePageProps)}
            startIcon={<ChevronRight />}
        >
            Ver Histórico de Interrupções
        </Button>
        <AddLossDialog {...{ addLossOpen, setAddLossOpen }} />
    </div>
}

const LossInformation = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {
    return <div className="w-full h-full overflow-auto grid grid-flow-row gap-4">
        <LossRateCard {...{ reloadFlag, startLoading, stopLoading }} />
        <LossesAnimalsTable {...{ reloadFlag, startLoading, stopLoading }} />
        <LossHistGraph {...{ reloadFlag, startLoading, stopLoading }} />
    </div>
}

const LossRateCard = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultValue: LossRate = useMemo(() => ({
        trend: 0,
        current: 0,
        hist: []
    }), [])

    const [data, setData] = useState<LossRate>(defaultValue)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getLossRate()
            .then(response => setData(response.json))
            .catch(() => setData(defaultValue))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [defaultValue, startLoading, stopLoading, reloadFlag])

    return <DashboardCard>
        <CardChartContent
            title="Taxa de Interrupções"
            data={percentageTransform(data.current)}
            loading={loading}
            chart={(
                <SparkLineChart
                    data={data.hist.map(item => item.lossRate)}
                    height={50}
                    valueFormatter={(value) => percentageTransform(value ?? 0)}
                    showTooltip
                    xAxis={{
                        scaleType: 'time',
                        data: data.hist.map(item => new Date(item.lossDate)),
                        valueFormatter: (value: Date) => value.getFullYear().toString()
                    }}
                />
            )}
            trendProps={{ trend: data.trend, inverse: true }}
        />
    </DashboardCard>
}

const LossHistGraph = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const [data, setData] = useState<LossNumbersHist[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getLossesHist()
            .then(response => setData(response.json))
            .catch(() => setData([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [startLoading, stopLoading, reloadFlag])

    return <DashboardCard>
        <CardDefaultTitle text="Histórico de Perdas" />
        <BarChart
            height={200}
            loading={loading}
            series={[{
                id: 'lossTotals',
                data: data.map(item => item.lossNumbers),
                label: 'Nº de Perdas',
            }]}
            xAxis={[{
                data: data.map(item => new Date(item.lossDate)),
                valueFormatter: (value: Date) => value.toLocaleDateString('pt-BR', {
                    month: 'short',
                    year: 'numeric'
                }),
                label: 'Data de Perda',
                scaleType: 'band'
            }]}
        />
    </DashboardCard>
}

const LossesAnimalsTable = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const [data, setData] = useState<MostLossesAnimals[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getMostLossesAnimals()
            .then(response => setData(response.json))
            .catch(() => setData([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [startLoading, stopLoading, reloadFlag])

    return <DashboardCard className="col-start-2 row-span-2">
        <CardDefaultTitle text="Piores Taxas de Interrupção" />
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Vaca</TableCell>
                    <TableCell>Nº de Interrupções</TableCell>
                    <TableCell>Taxa de Perda</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {loading
                    ? Array(10).fill(<TableLoadingRow colSpan={4} />)
                    : data.map(item => (
                        <TableRow>
                            <TableCell>{item.animalName}</TableCell>
                            <TableCell>{item.losses}</TableCell>
                            <TableCell>
                                <TrendValues
                                    value={percentageTransform(item.lossRate)}
                                    trendProps={{ trend: item.rateComparison }}
                                />
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    </DashboardCard>

}
