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
import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
    getBirthRate,
    getLastEntries,
    getPregnancyRate,
    getTestHist,
    getNextBirths,
    getAnimalsNumber,
    getLastGroups,
    getRankedResults,
    deleteTest,
    updateTest
} from "./Controller"
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
    LinePlot,
    SparkLineChart
} from "@mui/x-charts"
import { dateTransform, percentageTransform } from "@/util/Transformations"
import {
    AnimalsNumberHist,
    BirthRateStats,
    BirthStatusMap,
    LastEntryProps,
    NextBirths,
    PregnancyRateStats,
    PregnancyStatusItems,
    PregnancyStatusMap,
    PregnancyTestsHist,
    TestAnimal,
    TestEntry,
    TestGroup
} from "./Entities"
import { ReloadButton } from "@/ui/shared/table/TableTopBarComponents"
import Button from "@mui/material/Button"
import ChevronRight from "@mui/icons-material/ChevronRight"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import { TableLoadingRow } from "@/ui/shared/table/TableComponents"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import Chip from "@mui/material/Chip"
import { ComboBox, ComboBoxItem } from "@/ui/shared/common/ComboBox"
import { PageContext } from "@/ui/shared/main-page/PageContext"
import {
    BirthTestDashboardPage,
    BirthTestEntriesPage,
    BirthTestGroupPage
} from "./BirthTestPages"
import Add from "@mui/icons-material/Add"
import { AddTestDialog } from "./AddTestDialog"
import { PageProps } from "@/ui/shared/main-page/PageDisplay"
import { GroupEntriesTablePage } from "./GroupEntriesTable"
import { HomePage } from "../../home/HomePage"
import IconButton from "@mui/material/IconButton"
import { CardEntry } from "@/shared/entities/Page"
import { ChipColorScheme } from "@/ui/shared/Globals"
import { orange, yellow } from "@mui/material/colors"
import { EditRowProps, TableRowProp } from "@/ui/shared/table/Entities"
import { APIError } from "@/util/ApiRequest"
import { ErrorDialog } from "@/ui/shared/dialog/DialogComponents"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { FormComboBox } from "@/ui/shared/form-controls/FormComboBox"
import { SubmitHandler, useForm } from "react-hook-form"

type ReloadContextProps = {
    setReloadFlag: Dispatch<SetStateAction<number>>
    setError: Dispatch<SetStateAction<APIError | undefined>>
}

const ReloadContext = createContext<ReloadContextProps>(undefined!)

export const BirthTestDashboard = () => {

    const [reloadFlag, setReloadFlag] = useState(0)
    const [activeRequests, setActiveRequests] = useState(0)

    const [error, setError] = useState<APIError>()

    const startLoading = useCallback(() => setActiveRequests(prev => prev + 1), [])
    const stopLoading = useCallback(() => setActiveRequests(prev => Math.min(prev - 1)), [])

    return <DashboardContainer>
        <DashboardTopBar {...{ setReloadFlag, activeRequests }} />
        <ReloadContext value={{ setReloadFlag, setError }}>
            <DashboardInformation {...{ startLoading, stopLoading, reloadFlag }} />
        </ReloadContext>
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            content={error?.message}
            onClose={() => setError(undefined)}
        />
    </DashboardContainer>
}

type DashboardTopBarProps = {
    setReloadFlag: Dispatch<SetStateAction<number>>
    activeRequests: number
}

const DashboardTopBar = ({ setReloadFlag, activeRequests }: DashboardTopBarProps) => {

    const [addTestOpen, setAddTestOpen] = useState(false)
    const { setPageProps } = useContext(PageContext)

    const closeAddTest = (added?: boolean) => {
        setAddTestOpen(false)
        if (added) setReloadFlag(prev => prev + 1)
    }

    return <DashboardTopContainer>
        <ReloadButton
            variant="text"
            onReload={() => setReloadFlag(prev => prev + 1)}
            loading={activeRequests > 0}
        />
        <Button
            startIcon={<Add />}
            className="ml-auto"
            onClick={() => setAddTestOpen(true)}
        >
            Adicionar Toque
        </Button>
        <Button
            endIcon={<ChevronRight />}
            onClick={() => setPageProps && setPageProps(BirthTestEntriesPage)}
        >
            Histórico de Toques
        </Button>
        <AddTestDialog {...{ addTestOpen, closeAddTest }} />
    </DashboardTopContainer>
}

type DashboardInformationProps = {
    startLoading: () => void
    stopLoading: () => void
    reloadFlag: number
}

const DashboardInformation = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {
    return <DashboardInfoContainer className="flex flex-col gap-4">
        <div className="grid grid-cols-[repeat(3,250)_1fr] grid-rows-[180_500] gap-4">
            <AnimalsNumberCard {...{ startLoading, stopLoading, reloadFlag }} />
            <PregnancyCard {...{ stopLoading, startLoading, reloadFlag }} />
            <BirthCard {...{ startLoading, stopLoading, reloadFlag }} />
            <LastEntriesTable {...{ startLoading, stopLoading, reloadFlag }} />
            <LastGroupTable {...{ stopLoading, startLoading, reloadFlag }} />
        </div>
        <div className="grid grid-cols-[1fr_500] grid-rows-[500_1fr] gap-4">
            <TestHistChart {...{ startLoading, stopLoading, reloadFlag }} />
            <NextBirthsTable {...{ startLoading, stopLoading, reloadFlag }} />
            <BestAnimalsTable {...{ stopLoading, startLoading, reloadFlag }} />
        </div>
    </DashboardInfoContainer>
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
            .then(response => setStats(response))
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
            data={percentageTransform(stats.current)}
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.pregnancyRate)}
                    valueFormatter={(value) => percentageTransform(value ?? 0)}
                    color={yellow[800]}
                    height={50}
                    showTooltip
                    showHighlight
                    xAxis={{
                        data: stats.hist.map(item => new Date(item.testDate)),
                        valueFormatter: (value: Date) => value.toLocaleString('pt-BR', { dateStyle: 'short' })
                    }}
                />
            )}
            trendProps={{ trend: stats.trend }}
        />
    </DashboardCard>
}

const AnimalsNumberCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

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
        getAnimalsNumber()
            .then(response => setStats(response))
            .catch(() => setStats(defaultValue))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [defaultValue, reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Nº de Animais"
            loading={loading}
            data={stats.current}
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.animalsNumber)}
                    height={50}
                    showTooltip
                    showHighlight
                    xAxis={{
                        data: stats.hist.map(item => new Date(item.testDate)),
                        valueFormatter: (value: Date) => value.toLocaleString('pt-BR', { dateStyle: 'short' })
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
            .then(response => setStats(response))
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
            data={percentageTransform(stats.current)}
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.birthRate)}
                    valueFormatter={(value) => percentageTransform(value ?? 0)}
                    color={orange[800]}
                    height={50}
                    showTooltip
                    showHighlight
                    xAxis={{
                        data: stats.hist.map(item => new Date(item.testDate)),
                        valueFormatter: (value: Date) => value.toLocaleString('pt-BR', { dateStyle: 'short' })
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
    const [rankBy, setRankBy] = useState('worst-results')

    const rankByValues: ComboBoxItem[] = [
        { name: 'Os Melhores Resultados', value: 'best-results' },
        { name: 'Os Piores Resultados', value: 'worst-results' },
    ]

    useEffect(() => {
        startLoading()
        setLoading(true)
        getRankedResults(rankBy)
            .then(response => setData(response))
            .catch(() => setData([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading, rankBy])

    return <DashboardCard className="col-span-2">
        <ComboBox
            className="max-w-[300]"
            variant="standard"
            size="small"
            value={rankBy}
            onChange={(value) => setRankBy(value ?? 'worst-results')}
            items={rankByValues}
        />
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Vaca</TableCell>
                    <TableCell align="center">Nº de Exames</TableCell>
                    <TableCell>Taxa de Prenhez</TableCell>
                    <TableCell>Taxa de Nascimento</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <DashboardTableBody
                    dataset={data}
                    colSpan={4}
                    loadingProps={{ loading, rowSpan: 10 }}
                    render={item => (
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
                    )}
                />
            </TableBody>
        </Table>
    </DashboardCard>
}

const TestHistChart = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const [dataset, setDataset] = useState<PregnancyTestsHist[]>([])

    useEffect(() => {
        startLoading()
        getTestHist()
            .then(response => setDataset(response))
            .catch(() => setDataset([]))
            .finally(() => {
                stopLoading()
            })
    }, [stopLoading, startLoading, reloadFlag])

    return <DashboardCard>
        <CardDefaultTitle text="Histórico de Exames de Toque" />
        <div className="h-full flex flex-col items-center">
            <ChartDataProvider
                series={[
                    {
                        id: "totals",
                        label: "Animais Examinados",
                        data: dataset.map(item => item.totals),
                        type: 'bar',
                    },
                    {
                        id: "pregnancyRate",
                        label: "Nº de Prenhas",
                        data: dataset.map(item => item.pregnancies),
                        type: "line",
                        curve: 'linear',
                    },
                    {
                        id: "birthRate",
                        data: dataset.map(item => item.births),
                        label: "Nascimentos",
                        type: "line",
                        curve: 'linear',
                    }
                ]}
                xAxis={[{
                    scaleType: 'band',
                    data: dataset.map(item => new Date(item.testDate)),
                    valueFormatter: (date: Date) => date.toLocaleString('pt-BR', { dateStyle: 'short' })
                }]}
            >
                <ChartsLegend />
                <ChartsSurface>
                    <BarPlot />
                    <LinePlot />
                    <ChartsXAxis />
                    <ChartsYAxis />
                    <ChartsTooltip />
                    <ChartsAxisHighlight x='line' />
                    <LineHighlightPlot />
                </ChartsSurface>
            </ChartDataProvider>
        </div>
    </DashboardCard>

}

const NextBirthsTable = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<NextBirths[]>([])

    useEffect(() => {
        startLoading()
        setLoading(true)
        getNextBirths()
            .then((response: NextBirths[]) => {
                response.forEach(item => item.birthForecast = new Date(item.birthForecast))
                setData(response)
            })
            .catch(() => setData([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardDefaultTitle text="Próximas Parições" />
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Mês</TableCell>
                    <TableCell>Parições Previstas</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {loading
                    ? Array(10).fill(<TableLoadingRow colSpan={10} />)
                    : data.map(item => (
                        <TableRow>
                            <TableCell>
                                {item.birthForecast.toLocaleString('pt-BR', {
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </TableCell>
                            <TableCell>{item.birthNumbers}</TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    </DashboardCard>
}

const LastGroupTable = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const [data, setData] = useState<TestGroup[]>([])
    const [loading, setLoading] = useState(false)
    const [testDate, setTestDate] = useState<Date>()
    const [addTestOpen, setAddTestOpen] = useState(false)

    const { setPageProps } = useContext(PageContext)
    const { setReloadFlag } = useContext(ReloadContext)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getLastGroups()
            .then(response => setData(response))
            .catch(() => setData([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    const closeAddTest = (added?: boolean) => {
        setAddTestOpen(false)
        if (added) setReloadFlag(prev => prev + 1)
    }

    return <DashboardCard className="col-span-3">
        <CardDefaultTitle text="Últimos Exames de Toque" />
        <AddTestDialog {...{ addTestOpen, closeAddTest, testDate }} />
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell />
                    <TableCell align="center">Data do Exame</TableCell>
                    <TableCell align="center">Total de Animais</TableCell>
                    <TableCell>Taxa de Prenhez</TableCell>
                    <TableCell>Taxa de Natalidade</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <DashboardTableBody
                    dataset={data}
                    colSpan={5}
                    loadingProps={{ loading, rowSpan: 20 }}
                    render={item => (
                        <TableRow>
                            <TableCell>
                                <EditControlButtons
                                    otherButtons={(
                                        <IconButton onClick={() => {
                                            setTestDate(item.testDate)
                                            setAddTestOpen(true)
                                        }}>
                                            <Add />
                                        </IconButton>
                                    )}
                                    onShow={() => {
                                        const testDate = new Date(item.testDate)
                                        const page: PageProps = {
                                            page: <GroupEntriesTablePage {...{ testDate }} />,
                                            title: `Toque - ${dateTransform(item.testDate)}`,
                                            previousPages: [HomePage, BirthTestDashboardPage]
                                        }
                                        if (setPageProps) setPageProps(page)
                                    }}
                                />
                            </TableCell>
                            <TableCell align="center">{dateTransform(item.testDate)}</TableCell>
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
                    )}
                />
            </TableBody>
        </Table>
        <Button
            className="ml-auto"
            startIcon={<ChevronRight />}
            onClick={() => setPageProps && setPageProps(BirthTestGroupPage)}
        >
            Ver Mais...
        </Button>
    </DashboardCard>
}

const LastEntriesTable = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [data, setData] = useState<TestEntry[]>([])
    const [testDate, setTestDate] = useState(new Date())
    const [textDate, setTextDate] = useState('Sem dados')
    const [loading, setLoading] = useState(false)

    const { setPageProps } = useContext(PageContext)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getLastEntries()
            .then((response: LastEntryProps) => {
                setData(response.entries)
                const date = new Date(response.testDate)
                setTestDate(date)
                setTextDate(dateTransform(date))
            })
            .catch(() => {
                setData([])
                setTestDate(new Date())
                setTextDate('Sem dados')
            })
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard className="row-span-2">
        <CardDefaultTitle text={`Último Exame de Toque - ${textDate}`} />
        <div className="overflow-auto">
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Vaca</TableCell>
                        <TableCell>Data</TableCell>
                        <TableCell>Resultado</TableCell>
                        <TableCell>Nascimento</TableCell>
                        <TableCell>Previsão de Parto</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <DashboardTableBody
                        dataset={data}
                        colSpan={5}
                        loadingProps={{ loading, rowSpan: 20 }}
                        render={row => <EntriesRow {...{ row }} />}
                    />
                </TableBody>
            </Table>
        </div>
        <Button
            className="ml-auto"
            endIcon={<ChevronRight />}
            onClick={() => {
                const page: PageProps = {
                    title: `Toque - ${textDate}`,
                    page: <GroupEntriesTablePage {...{ testDate }} />,
                    previousPages: [HomePage, BirthTestDashboardPage]
                }
                if (setPageProps) setPageProps(page)
            }}
        >
            Ver Mais...
        </Button>
    </DashboardCard>
}

function EntriesRow({ row }: TableRowProp<TestEntry>) {

    const [rowData, setRowData] = useState(row)
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)

    const { setError, setReloadFlag } = useContext(ReloadContext)

    const onDelete = () => {
        setLoading(true)
        deleteTest(rowData.id)
            .then(() => {
                setError(undefined)
                setReloadFlag(prev => prev + 1)
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }

    if (editing) return <EditEntriesRow {...{ setEditing, setRowData, rowData }} />

    return <TableRow>
        <TableCell>
            <EditControlButtons {...{ setEditing, onDelete, loading }} />
        </TableCell>
        <TableCell>{rowData.animalInfo}</TableCell>
        <TableCell>{dateTransform(rowData.testDate)}</TableCell>
        <TableCell>
            {rowData.pregnancyStatus &&
                <Chip
                    label={PregnancyStatusMap.get(rowData.pregnancyStatus)}
                    color={ChipColorScheme.get(rowData.pregnancyStatus)}
                />
            }
        </TableCell>
        <TableCell>
            {rowData.birthStatus &&
                <Chip
                    label={BirthStatusMap.get(rowData.birthStatus)}
                    color={ChipColorScheme.get(rowData.birthStatus)}
                />
            }
        </TableCell>
        <TableCell>{dateTransform(rowData.birthForecast)}</TableCell>
    </TableRow>

}

function EditEntriesRow({ setRowData, setEditing, rowData }: EditRowProps<TestEntry>) {

    const [showForecast, setShowForecast] = useState(rowData.pregnancyStatus === 'SUCCESS')
    const [loading, setLoading] = useState(false)

    const { control, handleSubmit, setValue } = useForm<TestEntry>({ defaultValues: rowData })
    const { setError } = useContext(ReloadContext)

    useEffect(() => setShowForecast(rowData.pregnancyStatus === 'SUCCESS'), [rowData])

    const onSubmit: SubmitHandler<TestEntry> = (data: TestEntry) => {
        setLoading(true)
        updateTest(data)
            .then(response => {
                setRowData(response)
                setEditing(false)
                setError(undefined)
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }

    const onSave = handleSubmit(onSubmit)

    return <TableRow>
        <TableCell>
            <EditingControlButtons {...{ onSave, setEditing, loading }} />
        </TableCell>
        <TableCell>{rowData.animalInfo}</TableCell>
        <TableCell align="center" width={200}>
            <FormDatePicker formProps={{ control, name: 'testDate' }} />
        </TableCell>
        <TableCell align="center">
            <FormComboBox
                items={PregnancyStatusItems}
                formProps={{ control, name: 'pregnancyStatus' }}
                onChange={(value) => {
                    setShowForecast(value === 'SUCCESS')
                    if (value === 'FAILED') setValue('birthForecast', undefined)
                }}
                renderOption={(props, option) => (
                    <li {...props}>
                        <Chip
                            label={PregnancyStatusMap.get(option.value)}
                            color={ChipColorScheme.get(option.value)}
                        />
                    </li>
                )}
                renderValue={value => (
                    <Chip
                        label={PregnancyStatusMap.get(value.value)}
                        color={ChipColorScheme.get(value.value)}
                    />
                )}
            />
        </TableCell>
        <TableCell align="center">
            <Chip
                label={BirthStatusMap.get(rowData.birthStatus)}
                color={ChipColorScheme.get(rowData.birthStatus)}
            />
        </TableCell>
        <TableCell align="center" width={200}>
            {showForecast && <FormDatePicker formProps={{ control, name: 'birthForecast' }} />}
        </TableCell>
    </TableRow>
}
