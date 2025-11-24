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
import {
    createContext,
    Dispatch,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react"
import {
    AnimalsNumberEntry,
    BestBulls,
    BirthRateEntry,
    FutureBirths,
    LastEntry,
    BreedingEntry,
    BreedingGroup,
    BreedingHist,
    PregnancyRateEntry,
    StatusColorMap,
    StatusMap,
    BreedingEntrySave
} from "./Entities"
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
import {
    getBirthRateStats,
    getInseminationHist,
    getLastEntries,
    getLastGroups,
    getPregnancyRateStats,
    getAnimalsNumber,
    getFutureBirths,
    getBestBulls,
    deleteNoValidation,
    deleteChangeFather,
    deleteBreeding,
    searchBreedingBulls,
    updateNoValidation,
    updateBreeding,
    deleteBatch
} from "./Controller"
import { DefaultTimerWarning, DefaultWarning, ERROR_TYPE, LOADING_MSG, NO_DATA_AVAILABLE } from "@/ui/shared/Globals"
import {
    Button,
    Chip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material"
import { dateTransform, percentageTransform } from "@/util/Transformations"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import ChevronRight from "@mui/icons-material/ChevronRight"
import { PageContext } from "@/ui/shared/main-page/PageContext"
import { PageProps } from "@/ui/shared/main-page/PageDisplay"
import { HomePage } from "../../home/HomePage"
import { ReloadButton } from "@/ui/shared/table/TableTopBarComponents"
import Add from "@mui/icons-material/Add"
import { orange, yellow } from "@mui/material/colors"
import { CardEntry } from "@/shared/entities/Page"
import { EditRowProps, TableRowProp } from "@/ui/shared/table/Entities"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { GroupsTablePageProps, BreedingMainPage } from "./BreedingPages"
import { TrendValues } from "@/ui/shared/table/TableComponents"
import { AddBreedingDialog } from "./AddBreedingDialog"
import { EntriesTablePage } from "./EntriesTable"
import { GroupEntriesTablePage } from "./GroupEntriesTable"
import { APIError } from "@/util/ApiRequest"
import { ErrorDialog, TimerYesNoDialog, YesNoDialog, YesNoDialogProps } from "@/ui/shared/dialog/DialogComponents"
import dayjs from "dayjs"

type AddContextProps = {
    setReloadFlag: Dispatch<SetStateAction<number>>
}

const AddContext = createContext<AddContextProps>(undefined!)

export const BreedingDashboard = () => {

    const [reloadFlag, setReloadFlag] = useState(0)
    const [activeRequests, setActiveRequests] = useState(0)

    const startLoading = useCallback(() => setActiveRequests(prev => prev + 1), [])
    const stopLoading = useCallback(() => setActiveRequests(prev => Math.max(prev - 1, 0)), [])


    return <DashboardContainer>
        <DashboardToolbar {...{ setReloadFlag, activeRequests }} />
        <AddContext value={{ setReloadFlag }}>
            <DashboardInformation {...{ reloadFlag, startLoading, stopLoading }} />
        </AddContext>
    </DashboardContainer>
}

type DashboardToolbarProps = {
    setReloadFlag: Dispatch<React.SetStateAction<number>>
    activeRequests: number
}

const DashboardToolbar = ({ setReloadFlag, activeRequests }: DashboardToolbarProps) => {

    const [addBreedingOpen, setAddBreedingOpen] = useState(false)
    const { setPageProps } = useContext(PageContext)

    const closeAddBreeding = useCallback((added?: boolean) => {
        if (added) setReloadFlag(prev => prev + 1)
        setAddBreedingOpen(false)
    }, [setReloadFlag])

    return <DashboardTopContainer>
        <ReloadButton
            onReload={() => setReloadFlag(prev => prev + 1)}
            loading={activeRequests > 0}
        />
        <Button
            className="ml-auto"
            startIcon={<Add />}
            onClick={() => setAddBreedingOpen(true)}
        >
            Adicionar Cobertura
        </Button>
        <Button
            endIcon={<ChevronRight />}
            onClick={() => {
                const page: PageProps = {
                    page: <EntriesTablePage />,
                    title: "Histórico de Coberturas",
                    previousPages: [HomePage, BreedingMainPage]
                }
                if (setPageProps) setPageProps(page)
            }}
        >
            Histórico de Coberturas
        </Button>
        <AddBreedingDialog {...{ addBreedingOpen, closeAddBreeding }} />
    </DashboardTopContainer>
}

type DashboardInformationProps = {
    reloadFlag: number
    startLoading: () => void
    stopLoading: () => void
}

const DashboardInformation = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {
    return <DashboardInfoContainer className="flex flex-col gap-4">
        <div className="grid grid-cols-[repeat(3,250)_1fr] grid-rows-[180_450] gap-4">
            <AnimalsNumbersCard {...{ reloadFlag, startLoading, stopLoading }} />
            <PregnancyRateCard {...{ reloadFlag, stopLoading, startLoading }} />
            <BirthRateCard {...{ reloadFlag, stopLoading, startLoading }} />
            <LastEntriesTable {...{ reloadFlag, stopLoading, startLoading }} />
            <LastGroupsTable {...{ reloadFlag, startLoading, stopLoading }} />
        </div>
        <div className="grid grid-cols-[1fr_400] grid-rows-[repeat(2,500)] gap-4">
            <BreedingHistGraph {...{ reloadFlag, startLoading, stopLoading }} />
            <FutureBirthsTable {...{ startLoading, stopLoading, reloadFlag }} />
            <BestBullsTable {...{ reloadFlag, startLoading, stopLoading }} />
        </div>
    </DashboardInfoContainer>
}

const BirthRateCard = ({ reloadFlag, startLoading, stopLoading }: DashboardInformationProps) => {

    const defaultValues = useMemo((): CardEntry<BirthRateEntry> => ({
        hist: [],
        trend: 0,
        current: 0
    }), [])

    const [data, setData] = useState<CardEntry<BirthRateEntry>>(defaultValues)
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
            data={percentageTransform(data.current)}
            chart={(
                <SparkLineChart
                    data={data.hist.map(item => item.birthRate)}
                    height={50}
                    color={yellow[600]}
                    showTooltip
                    showHighlight
                    valueFormatter={(value) => percentageTransform(value)}
                    xAxis={{
                        data: data.hist.map(item => new Date(item.breedingDate)),
                        domainLimit: 'strict',
                        scaleType: 'time',
                        valueFormatter: (value: Date) => value.toLocaleString('pt-BR', { dateStyle: 'short' })
                    }}
                />
            )}
        />
    </DashboardCard>
}

const PregnancyRateCard = ({ reloadFlag, startLoading, stopLoading }: DashboardInformationProps) => {

    const defaultValues = useMemo((): CardEntry<PregnancyRateEntry> => ({
        hist: [],
        trend: 0,
        current: 0
    }), [])

    const [data, setData] = useState<CardEntry<PregnancyRateEntry>>(defaultValues)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getPregnancyRateStats()
            .then(response => setData(response.json))
            .catch(() => setData(defaultValues))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [defaultValues, reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Taxa de Prenhez"
            loading={loading}
            trendProps={{ trend: data.trend }}
            data={percentageTransform(data.current)}
            chart={(
                <SparkLineChart
                    data={data.hist.map(item => item.pregnancyRate)}
                    height={50}
                    color={orange[600]}
                    showTooltip
                    showHighlight
                    valueFormatter={(value) => percentageTransform(value)}
                    xAxis={{
                        data: data.hist.map(item => new Date(item.breedingDate)),
                        domainLimit: 'strict',
                        scaleType: 'time',
                        valueFormatter: (value: Date) => value.toLocaleDateString('pt-BR', { dateStyle: 'short' })
                    }}
                />
            )}
        />
    </DashboardCard>
}

const AnimalsNumbersCard = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const defaultData: CardEntry<AnimalsNumberEntry> = useMemo(() => ({
        current: 0,
        trend: 0,
        hist: []
    }), [])

    const [data, setData] = useState<CardEntry<AnimalsNumberEntry>>(defaultData)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getAnimalsNumber()
            .then((response) => setData(response.json))
            .catch(() => setData(defaultData))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [defaultData, reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Nº de Vacas na Cobertura"
            data={data.current}
            loading={loading}
            trendProps={{ trend: data.trend }}
            chart={(
                <SparkLineChart
                    data={data.hist.map(item => item.animalsNumber)}
                    height={50}
                    showHighlight
                    showTooltip
                    xAxis={{
                        data: data.hist.map(item => new Date(item.breedingDate)),
                        valueFormatter: (value: Date) => value.toLocaleString('pt-BR', { dateStyle: 'short' }),
                        domainLimit: 'strict',
                        scaleType: 'time',
                    }}
                />
            )}
        />
    </DashboardCard>
}

const BestBullsTable = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [data, setData] = useState<BestBulls[]>([])
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

    return <DashboardCard className="col-span-2">
        <CardDefaultTitle text="Melhores Touros" />
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Touro</TableCell>
                    <TableCell align="center">Nº de Coberturas</TableCell>
                    <TableCell>Taxa de Prenhez</TableCell>
                    <TableCell>Taxa de Natalidade</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <DashboardTableBody
                    colSpan={4}
                    dataset={data}
                    loadingProps={{ loading, rowSpan: 10 }}
                    render={item => (
                        <TableRow>
                            <TableCell>{item.bullName}</TableCell>
                            <TableCell align="center">{item.total}</TableCell>
                            <TableCell>
                                <div className="flex flex-row items-center gap-2">
                                    {percentageTransform(item.pregnancyRate)}
                                    <TrendComponent trend={item.pregnancyComparisonRate} />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-row items-center gap-2">
                                    {percentageTransform(item.birthRate)}
                                    <TrendComponent trend={item.birthComparisonRate} />
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                />
            </TableBody>
        </Table>
    </DashboardCard>
}

const BreedingHistGraph = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [dataset, setDataset] = useState<BreedingHist[]>([])

    useEffect(() => {
        startLoading()
        getInseminationHist()
            .then(response => setDataset(response.json))
            .catch(() => setDataset([]))
            .finally(() => {
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardDefaultTitle text="Histórico de Coberturas" />
        <div className="h-full flex flex-col items-center">
            <ChartDataProvider
                localeText={{
                    loading: LOADING_MSG,
                    noData: NO_DATA_AVAILABLE
                }}
                dataset={dataset}
                series={[
                    {
                        id: 'total',
                        label: 'Total de Inseminadas',
                        type: 'bar',
                        data: dataset.map(item => item.animalsNumber)
                    },
                    {
                        id: 'birthRate',
                        label: 'Nº de Nascimentos',
                        type: 'line',
                        curve: 'linear',
                        data: dataset.map(item => item.birthsNumber),
                    },
                    {
                        id: 'pregnancyNumber',
                        label: 'Nº de Prenhas',
                        type: 'line',
                        curve: 'linear',
                        data: dataset.map(item => item.pregnanciesNumber),
                    }
                ]}
                xAxis={[{
                    scaleType: 'band',
                    data: dataset.map(item => new Date(item.breedingDate)),
                    domainLimit: 'strict',
                    valueFormatter: (value: Date) => value.toLocaleDateString('pt-BR', { dateStyle: 'short' })
                }]}
            >
                <ChartsLegend />
                <ChartsSurface>
                    <BarPlot />
                    <LinePlot />
                    <ChartsXAxis />
                    <ChartsYAxis />
                    <ChartsAxisHighlight x='line' />
                    <LineHighlightPlot />
                    <ChartsTooltip />
                </ChartsSurface>
            </ChartDataProvider>
        </div>
    </DashboardCard>
}

const FutureBirthsTable = ({ reloadFlag, startLoading, stopLoading }: DashboardInformationProps) => {

    const [data, setData] = useState<FutureBirths[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getFutureBirths()
            .then(response => setData(response.json))
            .catch(() => setData([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardDefaultTitle text="Nascimentos Previstos" />
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell align="center">Mês</TableCell>
                    <TableCell align="center">Nascimetos</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <DashboardTableBody
                    colSpan={2}
                    dataset={data}
                    loadingProps={{ loading, rowSpan: 12 }}
                    render={item => (
                        <TableRow>
                            <TableCell align="center">
                                {dateTransform(item.birthForecast, { month: 'short', year: 'numeric' })}
                            </TableCell>
                            <TableCell align="center">{item.birthsNumber}</TableCell>
                        </TableRow>
                    )}
                />
            </TableBody>
        </Table>
    </DashboardCard>
}

type EditContextProps = {
    setData: Dispatch<SetStateAction<BreedingEntry[]>>
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setWarningProps: Dispatch<SetStateAction<YesNoDialogProps>>
}

const EditContext = createContext<EditContextProps>(undefined!)

const LastEntriesTable = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [data, setData] = useState<BreedingEntry[]>([])
    const [loading, setLoading] = useState(false)
    const [breedingDate, setBreedingDate] = useState(new Date())
    const [lastDate, setLastDate] = useState('Sem dados')

    const [error, setError] = useState<APIError>()
    const [warningProps, setWarningProps] = useState(DefaultWarning)

    const { setPageProps } = useContext(PageContext)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getLastEntries()
            .then(response => {
                const lastEntry: LastEntry = response.json
                const lastDate = new Date(lastEntry.breedingDate)
                setBreedingDate(lastDate)
                setLastDate(lastDate.toLocaleString('pt-BR', { dateStyle: 'short' }))
                setData(lastEntry.entries)
            })
            .catch(() => {
                setData([])
                setBreedingDate(new Date())
                setLastDate('Sem dados')
            })
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard className="row-span-2">
        <div className="flex flex-row">
            <CardDefaultTitle text={`Última Cobertura - ${lastDate}`} />
        </div>
        <div className="overflow-auto">
            <EditContext value={{ setError, setWarningProps, setData }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Vaca</TableCell>
                            <TableCell>Touro</TableCell>
                            <TableCell>Prenhez</TableCell>
                            <TableCell>Nascimento</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <DashboardTableBody
                            colSpan={5}
                            dataset={data}
                            loadingProps={{ loading, rowSpan: 20 }}
                            render={row => <LastEntriesRow {...{ row }} />}
                        />
                    </TableBody>
                </Table>
            </EditContext>
            <ErrorDialog
                openError={!!error}
                title={error?.title}
                content={error?.message}
                onClose={() => setError(undefined)}
            />
            <YesNoDialog {...warningProps} />
        </div>
        <Button
            className="ml-auto"
            startIcon={<ChevronRight />}
            onClick={() => {
                const page: PageProps = {
                    page: <GroupEntriesTablePage {...{ breedingDate }} />,
                    title: `Cobertura - ${lastDate}`,
                    previousPages: [HomePage, BreedingMainPage]
                }
                if (setPageProps) setPageProps(page)
            }}
        >
            Ver Mais...
        </Button>
    </DashboardCard>
}

const LastEntriesRow = ({ row }: TableRowProp<BreedingEntry>) => {

    const [editing, setEditing] = useState(false)
    const [rowData, setRowData] = useState<BreedingEntry>(row)

    const { setError, setWarningProps, setData } = useContext(EditContext)

    useEffect(() => setRowData(row), [row])

    if (editing) return <EditLastEntriesRow {...{ setEditing, setRowData, rowData }} />

    const onDeleteNoValidation = () => {
        deleteNoValidation(rowData.id)
            .then(() => {
                setError(undefined)
                setWarningProps(DefaultWarning)
                setData(prev => prev.filter(item => item.id != rowData.id))
            })
            .catch((error: APIError) => setError(error))
            .finally(() => setWarningProps(DefaultWarning))
    }

    const onDeleteAndChangeFather = () => {
        deleteChangeFather(rowData.id)
            .then(() => {
                setError(undefined)
                setData(prev => prev.filter(item => item.id != rowData.id))
            })
            .catch((error: APIError) => setError(error))
            .finally(() => setWarningProps(DefaultWarning))
    }

    const onDelete = () => {
        deleteBreeding(rowData.id)
            .then(() => {
                setWarningProps(DefaultWarning)
                setError(undefined)
                setData(prev => prev.filter(item => item.id != rowData.id))
            })
            .catch((error: APIError) => {
                if (error.errType === ERROR_TYPE) {
                    setError(error)
                    return
                }
                if (error.kind == "ChildrenWarning") {
                    setWarningProps({
                        openYesNo: true,
                        title: error.title,
                        content: error.message,
                        onYes: onDeleteAndChangeFather,
                        onClose: () => setWarningProps(DefaultWarning)
                    })
                    return
                }
                setWarningProps({
                    openYesNo: true,
                    title: error.title,
                    content: error.message,
                    onYes: onDeleteNoValidation,
                    onClose: () => setWarningProps(DefaultWarning)
                })
            })
    }

    return <TableRow>
        <TableCell>
            <EditControlButtons {...{ setEditing, onDelete }} />
        </TableCell>
        <TableCell>{rowData.animalInfo}</TableCell>
        <TableCell>{rowData.bullName}</TableCell>
        <TableCell>
            <Chip
                label={StatusMap.get(rowData.pregnancyStatus)}
                color={StatusColorMap.get(rowData.pregnancyStatus)}
            />
        </TableCell>
        <TableCell>
            <Chip
                label={StatusMap.get(rowData.birthStatus)}
                color={StatusColorMap.get(rowData.birthStatus)}
            />
        </TableCell>
    </TableRow>

}

const EditLastEntriesRow = ({ setEditing, setRowData, rowData }: EditRowProps<BreedingEntry>) => {

    const [loading, setLoading] = useState(false)

    const { control, handleSubmit } = useForm<BreedingEntrySave>({ defaultValues: rowData })
    const { setError, setWarningProps } = useContext(EditContext)

    const onNoValidation: SubmitHandler<BreedingEntrySave> = (data: BreedingEntrySave) => {
        setLoading(true)
        updateNoValidation(data)
            .then((result: BreedingEntry) => {
                setRowData(result)
                setEditing(false)
            })
            .catch(err => setError(err))
            .finally(() => {
                setLoading(false)
                setWarningProps(DefaultWarning)
            })
    }

    const onSubmit: SubmitHandler<BreedingEntrySave> = (data: BreedingEntrySave) => {
        setLoading(true)
        updateBreeding(data)
            .then((result: BreedingEntry) => {
                setRowData(result)
                setEditing(false)
            })
            .catch((err: APIError) => {
                if (err.errType === ERROR_TYPE) {
                    setError(err)
                    return
                }
                setWarningProps({
                    openYesNo: true,
                    title: err.title,
                    content: err.message,
                    onClose: () => setWarningProps(DefaultWarning),
                    onYes: handleSubmit(onNoValidation)
                })
            })
            .finally(() => setLoading(false))
    }

    const onSave = handleSubmit(onSubmit)

    return <TableRow>
        <TableCell>
            <EditingControlButtons {...{ setEditing, onSave, loading }} />
        </TableCell>
        <TableCell>{rowData.animalInfo}</TableCell>
        <TableCell>
            <FormSearchBox
                formProps={{ control, name: 'bullId' }}
                searchOptions={searchBreedingBulls}
            />
        </TableCell>
        <TableCell>
            <Chip
                label={StatusMap.get(rowData.pregnancyStatus)}
                color={StatusColorMap.get(rowData.pregnancyStatus)}
            />
        </TableCell>
        <TableCell>
            <Chip
                label={StatusMap.get(rowData.birthStatus)}
                color={StatusColorMap.get(rowData.birthStatus)}
            />
        </TableCell>
    </TableRow>

}

const LastGroupsTable = ({ reloadFlag, startLoading, stopLoading }: DashboardInformationProps) => {

    const [data, setData] = useState<BreedingGroup[]>([])
    const [loading, setLoading] = useState(false)
    const { setPageProps } = useContext(PageContext)
    const { setReloadFlag } = useContext(AddContext)

    const [warningProps, setWarningProps] = useState(DefaultTimerWarning)
    const [error, setError] = useState<APIError>()
    const [loadingControls, setLoadingControls] = useState(false)
    const [addBreedingOpen, setAddBreedingOpen] = useState(false)
    const [breedingDate, setBreedingDate] = useState<Date>()

    const closeAddBreeding = (added?: boolean) => {
        if (added) setReloadFlag(prev => prev + 1)
        setBreedingDate(undefined)
        setAddBreedingOpen(false)
    }

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
    }, [reloadFlag, setLoading, startLoading, stopLoading])

    const onDelete = (breedingDate: Date) => {
        setWarningProps(DefaultTimerWarning)
        setLoadingControls(true)
        deleteBatch(breedingDate)
            .then(() => {
                setError(undefined)
                setData(prev => prev.filter(item => dayjs(breedingDate).isSame(dayjs(item.breedingDate))))
            })
            .catch(err => setError(err))
            .finally(() => setLoadingControls(false))
    }

    return <DashboardCard className="col-span-3">
        <CardDefaultTitle text="As Últimas Coberturas" />
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell />
                    <TableCell align="center">Data de Cobertura</TableCell>
                    <TableCell align="center">Total de Animais</TableCell>
                    <TableCell>Taxa de Prenhez</TableCell>
                    <TableCell>Taxa de Natalidade</TableCell>
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
                                    loading={loadingControls}
                                    onDelete={() => onDelete(new Date(item.breedingDate))}
                                    otherButtons={(
                                        <IconButton
                                            onClick={() => {
                                                setBreedingDate(new Date(item.breedingDate))
                                                setAddBreedingOpen(true)
                                            }}
                                        >
                                            <Add />
                                        </IconButton>
                                    )}
                                    onShow={() => {
                                        const breedingDate = new Date(item.breedingDate)
                                        const date = breedingDate.toLocaleDateString('pt-BR', {
                                            month: 'short',
                                            year: 'numeric'
                                        })
                                        const page: PageProps = {
                                            page: <GroupEntriesTablePage {...{ breedingDate }} />,
                                            title: `Cobertura - ${date}`,
                                            previousPages: [HomePage, BreedingMainPage]
                                        }
                                        if (setPageProps) setPageProps(page)
                                    }}
                                />
                            </TableCell>
                            <TableCell align="center">{dateTransform(item.breedingDate)}</TableCell>
                            <TableCell align="center">{item.cowNumber}</TableCell>
                            <TableCell>
                                <TrendValues
                                    value={percentageTransform(item.pregnancyRate)}
                                    trendProps={{ trend: item.pregnancyComparisonRate }}
                                />
                            </TableCell>
                            <TableCell>
                                <TrendValues
                                    value={percentageTransform(item.pregnancyRate)}
                                    trendProps={{ trend: item.pregnancyComparisonRate }}
                                />
                            </TableCell>
                        </TableRow>
                    )}
                />
            </TableBody>
        </Table>
        <Button
            className="ml-auto"
            endIcon={<ChevronRight />}
            onClick={() => setPageProps && setPageProps(GroupsTablePageProps)}
        >
            Ver Mais...
        </Button>
        <TimerYesNoDialog {...warningProps} />
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            content={error?.message}
            onClose={() => setError(undefined)}
        />
        <AddBreedingDialog {...{ addBreedingOpen, closeAddBreeding, breedingDate }} />
    </DashboardCard>
}
