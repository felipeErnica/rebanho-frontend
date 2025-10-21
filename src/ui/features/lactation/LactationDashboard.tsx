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
import {
    AnimalsAverageHist as AnimalsNumberHist,
    AnimalsRating,
    AverageMilkHist,
    LactationGroup,
    MilkEntry,
    MilkProductionHist,
    ParentsRating,
    TotalMilkHist
} from "./Entities"
import {
    getYearAverage,
    getLastAverageMilk,
    getLastCount,
    getLastEntries,
    getLastGroups,
    getLastMilk,
    getParentRatings,
    getYearProduction,
    getRankedAnimals,
    getMilkProduction,
} from "./Controller"
import { dateTransform, decimalTransform } from "@/util/Transformations"
import { ComboBox, ComboBoxItem } from "@/ui/shared/common/ComboBox"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import { TrendValues } from "@/ui/shared/table/TableComponents"
import { Button } from "@mui/material"
import ChevronRight from "@mui/icons-material/ChevronRight"
import Add from "@mui/icons-material/Add"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { PageProps } from "@/ui/shared/main-page/PageDisplay"
import { GroupTablePage } from "./MilkGroupTable"
import { HomePage } from "../home/HomePage"
import { LactationHistPage, MilkDashboardPage, MilkEntriesPage } from "./LactationPages"
import { PageContext } from "@/ui/shared/main-page/PageContext"
import { GroupEntriesTablePage } from "./GroupEntriesTable"
import { AddMilkEntryDialog } from "./AddMilkEntryDialog"
import { SparkLineChart } from "@mui/x-charts/SparkLineChart"
import { CardEntry } from "@/shared/entities/Page"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { EditRow } from "@/ui/shared/table/Entities"
import { SubmitHandler, useForm } from "react-hook-form"
import {
    BarPlot,
    ChartDataProvider,
    ChartsAxisHighlight,
    ChartsLegend,
    ChartsSurface,
    ChartsTooltip,
    ChartsXAxis,
    ChartsYAxis,
    LineHighlightPlot,
    LinePlot
} from "@mui/x-charts"
import { LOADING_MSG, NO_DATA_AVAILABLE } from "@/ui/shared/Globals"
import { green, yellow } from "@mui/material/colors"

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
            endIcon={<ChevronRight />}
            onClick={() => setPageProps && setPageProps(MilkEntriesPage)}
        >
            Histórico de Leite
        </Button>
        <AddMilkEntryDialog {...{ addMilkEntryOpen, setAddMilkEntryOpen }} />
    </DashboardTopContainer>
}

const LactationInfo = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {
    return <DashboardInfoContainer className="flex flex-col gap-4">
        <div className="grid grid-cols-[250_250_250_1fr] grid-rows-[180_450] gap-4">
            <MilkProductionCard {...{ stopLoading, startLoading, reloadFlag }} />
            <AverageMilkCard {...{ stopLoading, startLoading, reloadFlag }} />
            <AnimalsCard {...{ startLoading, stopLoading, reloadFlag }} />
            <LastGroupsTable {...{ startLoading, stopLoading, reloadFlag }} />
            <LastEntriesTable {...{ startLoading, stopLoading, reloadFlag }} />
        </div>
        <div className="grid grid-rows-2 grid-cols-[1fr_500] gap-4">
            <MilkProductionChart {...{ startLoading, stopLoading, reloadFlag }} />
            <YearMilkChart {...{ startLoading, stopLoading, reloadFlag }} />
            <YearAverageChart {...{ startLoading, stopLoading, reloadFlag }} />
        </div>
        <div className="flex flex-col gap-4">
            <AnimalsRatingTable {...{ startLoading, stopLoading, reloadFlag }} />
            <ParentsRatingTable {...{ startLoading, stopLoading, reloadFlag }} />
        </div>
    </DashboardInfoContainer>
}

const MilkProductionCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultValue: CardEntry<TotalMilkHist> = useMemo(() => ({
        trend: 0,
        current: 0,
        hist: []
    }), [])

    const [stats, setStats] = useState<CardEntry<TotalMilkHist>>(defaultValue)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getLastMilk()
            .then(response => setStats(response.json))
            .catch(() => setStats(defaultValue))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [defaultValue, reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Produção de Leite"
            loading={loading}
            data={decimalTransform(stats.current)}
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.totalMilk)}
                    valueFormatter={(value) => decimalTransform(value ?? 0)}
                    height={50}
                    showHighlight
                    showTooltip
                    xAxis={{
                        data: stats.hist.map(item => new Date(item.entryDate)),
                        valueFormatter: (value: Date) => value.toLocaleString('pt-BR', { dateStyle: 'short' })
                    }}
                />
            )}
            trendProps={{ trend: stats.trend }}
        />
    </DashboardCard>
}

const AverageMilkCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultValue: CardEntry<AverageMilkHist> = useMemo(() => ({
        trend: 0,
        current: 0,
        hist: []
    }), [])

    const [stats, setStats] = useState<CardEntry<AverageMilkHist>>(defaultValue)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getLastAverageMilk()
            .then(response => setStats(response.json))
            .catch(() => setStats(defaultValue))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [defaultValue, reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Leite Médio por Vaca"
            loading={loading}
            data={decimalTransform(stats.current)}
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.averageMilk)}
                    valueFormatter={(value) => decimalTransform(value ?? 0)}
                    showHighlight
                    color={green[800]}
                    height={50}
                    showTooltip
                    xAxis={{
                        data: stats.hist.map(item => new Date(item.entryDate)),
                        valueFormatter: (value: Date) => value.toLocaleString('pt-BR', { dateStyle: 'short' })
                    }}
                />
            )}
            trendProps={{ trend: stats.trend }}
        />
    </DashboardCard>
}

const AnimalsCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultValue: CardEntry<AnimalsNumberHist> = useMemo(() => ({
        trend: 0,
        current: 0,
        hist: []
    }), [])

    const [stats, setStats] = useState<CardEntry<AnimalsNumberHist>>(defaultValue)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getLastCount()
            .then(response => setStats(response.json))
            .catch(() => setStats(defaultValue))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [defaultValue, reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Animais Lactando"
            loading={loading}
            data={stats.current}
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.animalsNumber)}
                    height={50}
                    color={yellow[800]}
                    showHighlight
                    showTooltip
                    xAxis={{
                        data: stats.hist.map(item => new Date(item.entryDate)),
                        valueFormatter: (value: Date) => value.toLocaleString('pt-BR', { dateStyle: 'short' })
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

    return <DashboardCard className="row-span-2">
        <CardDefaultTitle text="As Últimas Marcações" />
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
                                            title: `Leite - ${dateTransform(item.entryDate)}`,
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
        <Button
            className="ml-auto"
            variant="text"
            endIcon={<ChevronRight />}
            onClick={() => {
                const pageProps: PageProps = {
                    title: "Marcações de Leite",
                    page: <GroupTablePage />,
                    previousPages: [HomePage, MilkDashboardPage]
                }
                if (setPageProps) setPageProps(pageProps)
            }}
        >
            Ver Mais...
        </Button>
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

    return <DashboardCard className="col-span-3">
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
                        <TableCell />
                        <TableCell>Vaca</TableCell>
                        <TableCell align="center">Pasto</TableCell>
                        <TableCell align="center">Quantidade de Leite</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <DashboardTableBody
                        colSpan={4}
                        loadingProps={{ loading, rowSpan: 20 }}
                        dataset={data}
                        render={item => <EntriesRow {...item} />}
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

const EntriesRow = (row: MilkEntry) => {

    const [editing, setEditing] = useState(false)
    const [rowData, setRowData] = useState(row)

    useEffect(() => setRowData(row), [row])

    if (editing) return <EditingEntriesRow {...{ rowData, setRowData, setEditing }} />

    return <TableRow>
        <TableCell>
            <EditControlButtons {...{ setEditing }} />
        </TableCell>
        <TableCell>{rowData.animalName}</TableCell>
        <TableCell align="center">{rowData.pastureName}</TableCell>
        <TableCell align="center">{decimalTransform(rowData.quantity ?? 0, 1)}</TableCell>
    </TableRow>

}

const EditingEntriesRow = ({ rowData, setRowData, setEditing }: EditRow<MilkEntry>) => {

    const { control, handleSubmit } = useForm<MilkEntry>({ defaultValues: rowData })

    const onSubmit: SubmitHandler<MilkEntry> = (data: MilkEntry) => {
        setRowData(data)
        setEditing(false)
    }

    const onSave = handleSubmit(onSubmit)

    return <TableRow>
        <TableCell>
            <EditingControlButtons {...{ setEditing, onSave }} />
        </TableCell>
        <TableCell>{rowData.animalName}</TableCell>
        <TableCell align="center">{rowData.pastureName}</TableCell>
        <TableCell align="center">
            <FormTextField
                formProps={{ control, name: 'quantity' }}
                type="number"
            />
        </TableCell>
    </TableRow>
}

const MilkProductionChart = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const [dataset, setDataset] = useState<MilkProductionHist[]>([])

    useEffect(() => {
        startLoading()
        getMilkProduction()
            .then(results => setDataset(results.json))
            .catch(() => setDataset([]))
            .finally(() => stopLoading())
    }, [reloadFlag])

    return <DashboardCard className="row-span-2">
        <CardDefaultTitle text="Produção de Leite por Mês" />
        <div className="h-full flex flex-col items-center">
            <ChartDataProvider
                height={420}
                localeText={{
                    loading: LOADING_MSG,
                    noData: NO_DATA_AVAILABLE
                }}
                series={[
                    {
                        id: 'animalsNumber',
                        type: 'bar',
                        data: dataset.map(item => item.animalsNumber),
                        label: 'Nº de Vacas',
                        yAxisId: 'animalsAxis',
                        labelMarkType: 'square',
                    },
                    {
                        id: 'totalMilk',
                        type: 'line',
                        label: 'Total de Leite',
                        yAxisId: "totalAxis",
                        data: dataset.map(item => item.totalMilk),
                        showMark: false,
                        curve: 'linear',
                        valueFormatter: (value) => decimalTransform(value),
                        labelMarkType: 'line',
                    }
                ]}
                yAxis={[
                    { id: 'animalsAxis', min: 0, position: 'right', label: 'Nº de Animais' },
                    { id: 'totalAxis', min: 0, position: 'left', label: 'Leite Produzido' },
                ]}
                xAxis={[{
                    id: 'dateAxis',
                    scaleType: 'band',
                    data: dataset.map(item => new Date(item.entryDate)),
                    domainLimit: 'strict',
                    valueFormatter: (value: Date) => value.toLocaleString('pt-BR', {
                        month: 'short',
                        year: 'numeric'
                    })
                }]}
            >
                <ChartsLegend />
                <ChartsSurface>
                    <BarPlot />
                    <LinePlot />
                    <LineHighlightPlot />
                    <ChartsAxisHighlight x="line" />
                    <ChartsXAxis />
                    <ChartsYAxis axisId="totalAxis" />
                    <ChartsYAxis axisId="animalsAxis" />
                    <ChartsTooltip />
                </ChartsSurface>
            </ChartDataProvider>
        </div>
    </DashboardCard>
}

const YearAverageChart = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultCard: CardEntry<AverageMilkHist> = {
        current: 0,
        trend: 0,
        hist: []
    }

    const [dataset, setDataset] = useState<CardEntry<AverageMilkHist>>(defaultCard)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getYearAverage()
            .then(results => setDataset(results.json))
            .catch(() => setDataset(defaultCard))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag])

    return <DashboardCard>
        <CardChartContent
            loading={loading}
            title="Média de Produção Anual p/ Vaca"
            data={decimalTransform(dataset.current)}
            chart={(
                <SparkLineChart
                    area
                    showTooltip
                    showHighlight
                    color={green[600]}
                    data={dataset.hist.map(item => item.averageMilk)}
                    valueFormatter={(value) => decimalTransform(value)}
                    xAxis={{
                        data: dataset.hist.map(item => new Date(item.entryDate)),
                        domainLimit: 'strict',
                        valueFormatter: (value: Date) => value.toLocaleString('pt-BR', { year: 'numeric' })
                    }}
                />
            )}
            trendProps={{ trend: dataset.trend }}
        />
    </DashboardCard>
}

const YearMilkChart = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultCard: CardEntry<TotalMilkHist> = {
        current: 0,
        trend: 0,
        hist: []
    }

    const [dataset, setDataset] = useState<CardEntry<TotalMilkHist>>(defaultCard)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getYearProduction()
            .then(results => setDataset(results.json))
            .catch(() => setDataset(defaultCard))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag])

    return <DashboardCard>
        <CardChartContent
            loading={loading}
            title="Produção de Leite Anual"
            data={decimalTransform(dataset.current)}
            chart={(
                <SparkLineChart
                    area
                    showHighlight
                    showTooltip
                    data={dataset.hist.map(item => item.totalMilk)}
                    valueFormatter={value => decimalTransform(value)}
                    xAxis={{
                        id: 'dateAxis',
                        data: dataset.hist.map(item => new Date(item.entryDate)),
                        domainLimit: 'strict',
                        valueFormatter: (value: Date) => value.toLocaleString('pt-BR', { year: 'numeric' })
                    }}
                />
            )}
            trendProps={{ trend: dataset.trend }}
        />
    </DashboardCard>
}

const AnimalsRatingTable = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [data, setData] = useState<AnimalsRating[]>([])
    const [loading, setLoading] = useState(false)
    const [rankBy, setRankBy] = useState('worst-animals')
    const { setPageProps } = useContext(PageContext)

    const rankByValues: ComboBoxItem[] = [
        { name: 'As Melhores Vacas', value: 'best-animals' },
        { name: 'As Piores Vacas', value: 'worst-animals' },
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

    return <DashboardCard className="h-[500]">
        <div className="flex flex-row gap-4">
            <ComboBox
                className="w-[300]"
                variant="standard"
                size="small"
                value={rankBy}
                onChange={(value) => setRankBy(value ?? 'worst-animals')}
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

    return <DashboardCard className="h-[500]">
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
                    <TableCell>Nº de Filhas</TableCell>
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
                                {item.childrenNumber}
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

