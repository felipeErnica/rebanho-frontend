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
import React, { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
    BirthRateStats,
    InseminationBulls,
    InseminationEntry,
    InseminationGroup,
    InseminationHist,
    InseminationStatusColorMap,
    InseminationStatusMap,
    PregnancyRateStats,
    AnimalsNumberEntry,
    LastEntry,
    FutureBirthsEntry,
    InseminationEntrySave
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
    deleteInsemination,
    deleteNoValidate,
    deleteAndChangeFather,
    searchInseminationBulls,
    updateInsemination,
    updateNoValidation
} from "./Controller"
import { ERROR_TYPE, LOADING_MSG, NO_DATA_AVAILABLE } from "@/ui/shared/Globals"
import {
    Button,
    Chip,
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
import { EntriesTablePage } from "./EntriesTable"
import { HomePage } from "../../home/HomePage"
import { GroupsTablePageProps, InseminationPage } from "./InseminationPages"
import { GroupEntriesTablePage } from "./GroupEntriesTable"
import { ReloadButton } from "@/ui/shared/table/TableTopBarComponents"
import { AddInseminationDialog } from "./AddInseminationDialog"
import Add from "@mui/icons-material/Add"
import { orange, yellow } from "@mui/material/colors"
import { CardEntry } from "@/shared/entities/Page"
import { EditRowProps, TableRowProp } from "@/ui/shared/table/Entities"
import { APIError } from "@/util/ApiRequest"
import { ErrorDialog, YesNoDialog, YesNoDialogProps } from "@/ui/shared/dialog/DialogComponents"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"

type ErrorDialogContextProps = {
    defaultWarning: YesNoDialogProps
    setWarningProps: Dispatch<SetStateAction<YesNoDialogProps>>
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setReload: () => void
}

const ErrorDialogContext = createContext<ErrorDialogContextProps>(undefined!)

export const InseminationDasboard = () => {

    const defaultWarning: YesNoDialogProps = {
        openYesNo: false,
        title: undefined,
        content: undefined,
        onYes: undefined,
        onClose: undefined
    }

    const [error, setError] = useState<APIError>()
    const [warningProps, setWarningProps] = useState<YesNoDialogProps>(defaultWarning)
    const [reloadFlag, setReloadFlag] = useState(0)
    const [activeRequests, setActiveRequests] = useState(0)

    const startLoading = useCallback(() => setActiveRequests(prev => prev + 1), [])
    const stopLoading = useCallback(() => setActiveRequests(prev => Math.max(prev - 1, 0)), [])
    const setReload = useCallback(() => setReloadFlag(prev => prev + 1), [])

    return <DashboardContainer>
        <DashboardToolbar {...{ setReloadFlag, activeRequests }} />
        <ErrorDialogContext value={{ setWarningProps, setError, defaultWarning, setReload }}>
            <DashboardInformation {...{ reloadFlag, startLoading, stopLoading }} />
        </ErrorDialogContext>
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            content={error?.message}
            onClose={() => setError(undefined)}
        />
        <YesNoDialog {...warningProps} />
    </DashboardContainer>
}

type DashboardToolbarProps = {
    setReloadFlag: Dispatch<React.SetStateAction<number>>
    activeRequests: number
}

const DashboardToolbar = ({ setReloadFlag, activeRequests }: DashboardToolbarProps) => {

    const [addInseminationOpen, setAddInseminationOpen] = useState(false)

    const { setPageProps } = useContext(PageContext)

    const closeAddInsemination = (added?: boolean) => {
        setAddInseminationOpen(false)
        if (added) setReloadFlag(prev => prev + 1)
    }

    return <DashboardTopContainer>
        <ReloadButton
            onReload={() => setReloadFlag(prev => prev + 1)}
            loading={activeRequests > 0}
        />
        <Button
            className="ml-auto"
            startIcon={<Add />}
            onClick={() => setAddInseminationOpen(true)}
        >
            Adicionar Inseminação
        </Button>
        <Button
            endIcon={<ChevronRight />}
            onClick={() => {
                const page: PageProps = {
                    page: <EntriesTablePage />,
                    title: "Histórico de Inseminações",
                    previousPages: [HomePage, InseminationPage]
                }
                if (setPageProps) setPageProps(page)
            }}
        >
            Histórico de Inseminações
        </Button>
        <AddInseminationDialog {...{ addInseminationOpen, closeAddInsemination }} />
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
            <InseminationHistGraph {...{ reloadFlag, startLoading, stopLoading }} />
            <FutureBirthsTable {...{ startLoading, stopLoading, reloadFlag }} />
            <BestBullsTable {...{ reloadFlag, startLoading, stopLoading }} />
        </div>
    </DashboardInfoContainer>
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
            .then(response => setData(response))
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
                        data: data.hist.map(item => new Date(item.inseminationDate)),
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

    const defaultValues = useMemo((): PregnancyRateStats => ({
        hist: [],
        trend: 0,
        current: 0
    }), [])

    const [data, setData] = useState<PregnancyRateStats>(defaultValues)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getPregnancyRateStats()
            .then(response => setData(response))
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
                        data: data.hist.map(item => new Date(item.inseminationDate)),
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
            .then((response) => setData(response))
            .catch(() => setData(defaultData))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [defaultData, reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Nº de Vacas Inseminadas"
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
                        data: data.hist.map(item => new Date(item.inseminationDate)),
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

    const [data, setData] = useState<InseminationBulls[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getBestBulls()
            .then(response => setData(response))
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
                    <TableCell align="center">Nº de Inseminações</TableCell>
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

const InseminationHistGraph = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [dataset, setDataset] = useState<InseminationHist[]>([])

    useEffect(() => {
        startLoading()
        getInseminationHist()
            .then((response: InseminationHist[]) => {
                response.forEach(item => item.inseminationDate = new Date(item.inseminationDate))
                setDataset(response)
            })
            .catch(() => setDataset([]))
            .finally(() => {
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardDefaultTitle text="Histórico de Inseminações" />
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
                        data: dataset.map(item => item.total)
                    },
                    {
                        id: 'birthRate',
                        label: 'Nº de Nascimentos',
                        type: 'line',
                        curve: 'linear',
                        data: dataset.map(item => item.birthNumbers),
                    },
                    {
                        id: 'pregnancyNumber',
                        label: 'Nº de Prenhas',
                        type: 'line',
                        curve: 'linear',
                        data: dataset.map(item => item.pregnancyNumbers),
                    }
                ]}
                xAxis={[{
                    scaleType: 'band',
                    data: dataset.map(item => new Date(item.inseminationDate)),
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

    const [data, setData] = useState<FutureBirthsEntry[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getFutureBirths()
            .then(response => setData(response))
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

const LastEntriesTable = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [data, setData] = useState<InseminationEntry[]>([])
    const [loading, setLoading] = useState(false)
    const [inseminationDate, setInseminationDate] = useState(new Date())
    const [lastDate, setLastDate] = useState('Sem dados')
    const { setPageProps } = useContext(PageContext)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getLastEntries()
            .then(response => {
                const lastEntry: LastEntry = response
                const lastInsemination = new Date(lastEntry.inseminationDate)
                setInseminationDate(lastInsemination)
                setLastDate(lastInsemination.toLocaleString('pt-BR', { dateStyle: 'short' }))
                setData(lastEntry.entries)
            })
            .catch(() => {
                setData([])
                setInseminationDate(new Date())
                setLastDate('Sem dados')
            })
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard className="row-span-2">
        <div className="flex flex-row">
            <CardDefaultTitle text={`Última Inseminação - ${lastDate}`} />
        </div>
        <div className="overflow-auto">
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Vaca</TableCell>
                        <TableCell>Data</TableCell>
                        <TableCell>Touro</TableCell>
                        <TableCell>Prenhez</TableCell>
                        <TableCell>Nascimento</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <DashboardTableBody
                        colSpan={6}
                        dataset={data}
                        loadingProps={{ loading, rowSpan: 20 }}
                        render={row => <LastEntriesRow {...{ row }} />}
                    />
                </TableBody>
            </Table>
        </div>
        <Button
            className="ml-auto"
            startIcon={<ChevronRight />}
            onClick={() => {
                const page: PageProps = {
                    page: <GroupEntriesTablePage {...{ inseminationDate }} />,
                    title: `Inseminação - ${lastDate}`,
                    previousPages: [HomePage, InseminationPage]
                }
                if (setPageProps) setPageProps(page)
            }}
        >
            Ver Mais...
        </Button>
    </DashboardCard>
}

const LastEntriesRow = ({ row }: TableRowProp<InseminationEntry>) => {

    const [loading, setLoading] = useState(false)
    const [editing, setEditing] = useState(false)
    const [rowData, setRowData] = useState(row)

    const { setError, setWarningProps, setReload, defaultWarning } = useContext(ErrorDialogContext)

    useEffect(() => setRowData(row), [row])

    const onDeleteNoValidation = useCallback(() => {
        setLoading(true)
        deleteNoValidate(row.id)
            .then(() => {
                setError(undefined)
                setWarningProps(defaultWarning)
                setReload()
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }, [defaultWarning, row.id, setError, setReload, setWarningProps])

    const onDeleteAndChangeFather = useCallback(() => {
        setLoading(true)
        deleteAndChangeFather(row.id)
            .then(() => {
                setError(undefined)
                setWarningProps(defaultWarning)
                setReload()
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }, [defaultWarning, row.id, setError, setReload, setWarningProps])

    const onDelete = useCallback(() => {
        setLoading(true)
        deleteInsemination(row.id)
            .then(() => {
                setError(undefined)
                setWarningProps(defaultWarning)
                setReload()
            })
            .catch((err: APIError) => {
                if (err.errType === ERROR_TYPE) {
                    setError(err)
                    return
                }
                if (err.kind === "ChildreWarning") {
                    setWarningProps({
                        openYesNo: true,
                        title: err.title,
                        content: err.message,
                        onYes: onDeleteAndChangeFather,
                        onClose: () => setWarningProps(defaultWarning)
                    })
                }
                setWarningProps({
                    openYesNo: true,
                    title: err.title,
                    content: err.message,
                    onYes: onDeleteNoValidation,
                    onClose: () => setWarningProps(defaultWarning)
                })
            })
            .finally(() => setLoading(false))
    }, [defaultWarning, onDeleteAndChangeFather, onDeleteNoValidation, row.id, setError, setReload, setWarningProps])

    if (editing) return <EntriesRowEditing {...{ setEditing, setRowData, rowData }} />

    return <TableRow>
        <TableCell>
            <EditControlButtons {...{ setEditing, onDelete, loading }} />
        </TableCell>
        <TableCell>{rowData.animalInfo}</TableCell>
        <TableCell>{dateTransform(rowData.inseminationDate)}</TableCell>
        <TableCell>{rowData.bullName}</TableCell>
        <TableCell>
            <Chip
                label={InseminationStatusMap.get(rowData.pregnancyStatus)}
                color={InseminationStatusColorMap.get(rowData.pregnancyStatus)}
            />
        </TableCell>
        <TableCell>
            <Chip
                label={InseminationStatusMap.get(rowData.birthStatus)}
                color={InseminationStatusColorMap.get(rowData.birthStatus)}
            />
        </TableCell>
    </TableRow>

}

const EntriesRowEditing = ({ rowData, setRowData, setEditing }: EditRowProps<InseminationEntry>) => {

    const [loading, setLoading] = useState(false)
    const { setError, setWarningProps, defaultWarning } = useContext(ErrorDialogContext)

    const { control, handleSubmit } = useForm<InseminationEntrySave>({
        defaultValues: {
            id: rowData.id,
            animalId: rowData.animalId,
            bullId: rowData.bullId,
            inseminationDate: rowData.inseminationDate,
            observation: rowData.observation
        }
    })

    const onUpdateNoValidation: SubmitHandler<InseminationEntrySave> = (data: InseminationEntrySave) => {
        setLoading(true)
        updateNoValidation(data)
            .then((response: InseminationEntry) => {
                setRowData(response)
                setError(undefined)
                setWarningProps(defaultWarning)
            })
            .catch(err => setError(err))
            .finally(() => {
                setLoading(false)
                setEditing(false)
                setWarningProps(defaultWarning)
            })
    }

    const onUpdate: SubmitHandler<InseminationEntrySave> = (data: InseminationEntrySave) => {
        setLoading(true)
        updateInsemination(data)
            .then((response: InseminationEntry) => {
                setRowData(response)
                setError(undefined)
                setWarningProps(defaultWarning)
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
                    onYes: handleSubmit(onUpdateNoValidation),
                    onClose: () => setWarningProps(defaultWarning)
                })
            })
            .finally(() => {
                setLoading(false)
                setEditing(false)
            })
    }

    const onSave = handleSubmit(onUpdate)

    return <TableRow>
        <TableCell>
            <EditingControlButtons {...{ setEditing, onSave, loading }} />
        </TableCell>
        <TableCell>{rowData.animalInfo}</TableCell>
        <TableCell width={300}>
            <FormDatePicker formProps={{ control, name: 'inseminationDate' }} />
        </TableCell>
        <TableCell width={400}>
            <FormSearchBox
                formProps={{ control, name: 'bullId' }}
                searchOptions={searchInseminationBulls}
            />
        </TableCell>
        <TableCell>
            <Chip
                label={InseminationStatusMap.get(rowData.pregnancyStatus)}
                color={InseminationStatusColorMap.get(rowData.pregnancyStatus)}
            />
        </TableCell>
        <TableCell>
            <Chip
                label={InseminationStatusMap.get(rowData.birthStatus)}
                color={InseminationStatusColorMap.get(rowData.birthStatus)}
            />
        </TableCell>
    </TableRow>

}

const LastGroupsTable = ({ reloadFlag, startLoading, stopLoading }: DashboardInformationProps) => {

    const [data, setData] = useState<InseminationGroup[]>([])
    const [loading, setLoading] = useState(false)
    const { setPageProps } = useContext(PageContext)

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

    return <DashboardCard className="col-span-3">
        <CardDefaultTitle text="As Últimas Inseminações" />
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell />
                    <TableCell align="center">Data de Inseminação</TableCell>
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
                                    onShow={() => {
                                        const inseminationDate = new Date(item.inseminationDate)
                                        const date = inseminationDate.toLocaleDateString('pt-BR', {
                                            month: 'short',
                                            year: 'numeric'
                                        })
                                        const page: PageProps = {
                                            page: <GroupEntriesTablePage {...{ inseminationDate }} />,
                                            title: `Inseminação - ${date}`,
                                            previousPages: [HomePage, InseminationPage]
                                        }
                                        if (setPageProps) setPageProps(page)
                                    }}
                                />
                            </TableCell>
                            <TableCell align="center">{dateTransform(item.inseminationDate)}</TableCell>
                            <TableCell align="center">{item.cowNumber}</TableCell>
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
        <Button
            className="ml-auto"
            endIcon={<ChevronRight />}
            onClick={() => setPageProps && setPageProps(GroupsTablePageProps)}
        >
            Ver Mais...
        </Button>
    </DashboardCard>
}
