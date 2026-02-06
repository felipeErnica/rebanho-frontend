import { OptionMenuProps } from "@/components/shared/dashboard/Entities"
import { AddBullDialog } from "@features/animals/AddBullDialog"
import Add from "@mui/icons-material/Add"
import ChevronRight from "@mui/icons-material/ChevronRight"
import ExpandMore from "@mui/icons-material/ExpandMore"
import {
    Button,
    Chip,
    Divider,
    ListItemIcon,
    Menu,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material"
import { orange, yellow } from "@mui/material/colors"
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
    CardChartContent,
    CardDefaultTitle,
    DashboardCard,
    DashboardContainer,
    DashboardInfoContainer,
    DashboardTableBody,
    DashboardTopContainer,
    TrendComponent
} from "@shared/dashboard/DashboardComponents"
import { ErrorDialog, YesNoDialog, YesNoDialogProps } from "@shared/dialog/DialogComponents"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { DefaultWarning, ERROR_TYPE, LOADING_MSG, NO_DATA_AVAILABLE } from "@shared/Globals"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { EditRowProps, TableRowProp } from "@shared/table/Entities"
import { ReloadButton } from "@shared/table/TableTopBarComponents"
import { APIError } from "@utils/ApiRequest"
import { CardEntry } from "@utils/Entities"
import { dateToISO, dateTransform, percentageTransform } from "@utils/Transformations"
import {
    createContext,
    Dispatch,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { AddInseminationBullDialog } from "./AddInseminationBull"
import { AddInseminationDialog } from "./AddInseminationDialog"
import {
    AnimalsNumberEntry,
    BirthRateHist,
    BirthRateStats,
    FutureBirthsEntry,
    InseminationBulls,
    InseminationEntry,
    InseminationEntryDelete,
    InseminationEntrySave,
    InseminationGroup,
    InseminationHist,
    InseminationStatusColorMap,
    InseminationStatusMap,
    PregnancyRateHist,
    PregnancyRateStats
} from "./Entities"
import {
    deleteInsemination,
    getAnimalsNumber,
    getBestBulls,
    getBirthRateStats,
    getFutureBirths,
    getInseminationHist,
    getLastEntries,
    getLastGroups,
    getPregnancyRateStats,
    searchInseminationBulls,
    updateInsemination,
} from "./Service"
import { Animal, getAnimalLabel } from "@features/animals/Entities"

type ErrorDialogContextProps = {
    setWarningProps: Dispatch<SetStateAction<YesNoDialogProps>>
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setReload: () => void
}

const ErrorDialogContext = createContext<ErrorDialogContextProps>(undefined!)

export const InseminationDasboard = () => {

    const [error, setError] = useState<APIError>()
    const [warningProps, setWarningProps] = useState<YesNoDialogProps>(DefaultWarning)
    const [reloadFlag, setReloadFlag] = useState(0)
    const [activeRequests, setActiveRequests] = useState(0)

    const startLoading = useCallback(() => setActiveRequests(prev => prev + 1), [])
    const stopLoading = useCallback(() => setActiveRequests(prev => Math.max(prev - 1, 0)), [])
    const setReload = useCallback(() => setReloadFlag(prev => prev + 1), [])

    return <DashboardContainer>
        <DashboardToolbar {...{ setReloadFlag, activeRequests }} />
        <ErrorDialogContext.Provider value={{ setWarningProps, setError, setReload }}>
            <DashboardInformation {...{ reloadFlag, startLoading, stopLoading }} />
        </ErrorDialogContext.Provider>
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            message={error?.message}
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

    const [openMenu, setOpenMenu] = useState(false)
    const menuAnchorEl = useRef<HTMLButtonElement>(null)

    return <DashboardTopContainer>
        <ReloadButton
            onReload={() => setReloadFlag(prev => prev + 1)}
            loading={activeRequests > 0}
        />
        <Button
            className="ml-auto"
            startIcon={<ExpandMore />}
            onClick={() => setOpenMenu(true)}
            ref={menuAnchorEl}
        >
            Opções
        </Button>
        <OptionsMenu
            openMenu={openMenu}
            menuAnchorEl={menuAnchorEl}
            closeMenu={() => setOpenMenu(false)}
            setReloadFlag={setReloadFlag}
        />
    </DashboardTopContainer>
}

const OptionsMenu = ({ openMenu, menuAnchorEl, closeMenu, setReloadFlag }: OptionMenuProps) => {

    const [addInseminationOpen, setAddInseminationOpen] = useState(false)
    const [addInseminationBull, setAddInseminationBull] = useState(false)
    const [addBullOpen, setAddBullOpen] = useState(false)
    const navigate = useNavigate()

    const closeAddInsemination = (added?: boolean) => {
        if (added) setReloadFlag(prev => prev + 1)
        setAddInseminationOpen(false)
    }

    const closeAddInseminationBull = (added?: boolean) => {
        if (added) setReloadFlag(prev => prev + 1)
        setAddInseminationBull(false)
    }

    const closeAddBull = (added?: boolean) => {
        if (added) setReloadFlag(prev => prev + 1)
        setAddBullOpen(false)
    }

    return <>
        <Menu
            open={openMenu}
            anchorEl={menuAnchorEl.current}
            onClose={closeMenu}
        >
            <MenuItem onClick={() => setAddInseminationOpen(true)} >
                <ListItemIcon>
                    <Add />
                </ListItemIcon>
                Adicionar Inseminação
            </MenuItem>
            <MenuItem onClick={() => setAddInseminationBull(true)} >
                <ListItemIcon>
                    <Add />
                </ListItemIcon>
                Registrar Touro para Inseminação
            </MenuItem>
            <MenuItem onClick={() => setAddBullOpen(true)} >
                <ListItemIcon>
                    <Add />
                </ListItemIcon>
                Adicionar Novo Touro
            </MenuItem>
            <Divider />
            <MenuItem
                onClick={() => navigate("entries")}
            >
                <ListItemIcon>
                    <ChevronRight />
                </ListItemIcon>
                Histórico de Inseminações
            </MenuItem>
            <MenuItem
                onClick={() => navigate("groups")}
            >
                <ListItemIcon>
                    <ChevronRight />
                </ListItemIcon>
                Datas de Inseminação
            </MenuItem>
        </Menu>
        <AddInseminationDialog {...{ addInseminationOpen, closeAddInsemination }} />
        <AddInseminationBullDialog {...{ addInseminationBull, closeAddInseminationBull }} />
        <AddBullDialog {...{ addBullOpen, closeAddBull, isInseminationBull: true }} />
    </>
}

type DashboardInformationProps = {
    reloadFlag: number
    startLoading: () => void
    stopLoading: () => void
}

const DashboardInformation = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {
    return <DashboardInfoContainer className="flex flex-col gap-4">
        <div className="grid grid-cols-[repeat(3,250px)_1fr] grid-rows-[180px_450px] gap-4">
            <AnimalsNumbersCard {...{ reloadFlag, startLoading, stopLoading }} />
            <PregnancyRateCard {...{ reloadFlag, stopLoading, startLoading }} />
            <BirthRateCard {...{ reloadFlag, stopLoading, startLoading }} />
            <LastEntriesTable {...{ reloadFlag, stopLoading, startLoading }} />
            <LastGroupsTable {...{ reloadFlag, startLoading, stopLoading }} />
        </div>
        <div className="grid grid-cols-[1fr_400px] grid-rows-[repeat(2,500px)] gap-4">
            <InseminationHistGraph {...{ reloadFlag, startLoading, stopLoading }} />
            <FutureBirthsTable {...{ startLoading, stopLoading, reloadFlag }} />
            <BestBullsTable {...{ reloadFlag, startLoading, stopLoading }} />
        </div>
    </DashboardInfoContainer>
}

const BirthRateCard = ({ reloadFlag, startLoading, stopLoading }: DashboardInformationProps) => {

    const defaultValues = useMemo((): CardEntry<BirthRateHist> => ({
        hist: [],
        trend: 0,
        current: 0
    }), [])

    const [data, setData] = useState<CardEntry<BirthRateHist>>(defaultValues)
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
                        valueFormatter: (value: Date) => dateTransform(value)
                    }}
                />
            )}
        />
    </DashboardCard>
}

const PregnancyRateCard = ({ reloadFlag, startLoading, stopLoading }: DashboardInformationProps) => {

    const defaultValues = useMemo((): CardEntry<PregnancyRateHist> => ({
        hist: [],
        trend: 0,
        current: 0
    }), [])

    const [data, setData] = useState<CardEntry<PregnancyRateHist>>(defaultValues)
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
                        valueFormatter: (value: Date) => dateTransform(value),
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
                    loading={loading}
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
                    loading={loading}
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
    const navigate = useNavigate()

    useEffect(() => {
        startLoading()
        setLoading(true)
        getLastEntries()
            .then((response: InseminationEntry[]) => {
                const lastInsemination = new Date(response[0].inseminationDate)
                setInseminationDate(lastInsemination)
                setData(response)
            })
            .catch(() => {
                setData([])
                setInseminationDate(new Date())
            })
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    const lastDate = useMemo(() => {
        if (!inseminationDate) return "Sem Dados"
        return dateTransform(inseminationDate)
    }, [inseminationDate])

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
                        loading={loading}
                        render={row => <LastEntriesRow {...{ row }} />}
                    />
                </TableBody>
            </Table>
        </div>
        <Button
            className="ml-auto"
            startIcon={<ChevronRight />}
            onClick={() => navigate(`groups/${dateToISO(inseminationDate)}`)}
        >
            Ver Mais...
        </Button>
    </DashboardCard>
}

const LastEntriesRow = ({ row }: TableRowProp<InseminationEntry>) => {

    const [loading, setLoading] = useState(false)
    const [editing, setEditing] = useState(false)
    const [rowData, setRowData] = useState(row)
    const [params, setParams] = useState<InseminationEntryDelete>({
        id: row.id,
        ignorePregnancy: false,
        changeFather: false,
    })

    const { setError, setWarningProps, setReload } = useContext(ErrorDialogContext)

    useEffect(() => setRowData(row), [row])

    const onDelete = useCallback(() => {
        setLoading(true)
        deleteInsemination(params)
            .then(() => {
                setError(undefined)
                setWarningProps(DefaultWarning)
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
                        message: err.message,
                        onYes: () => {
                            setParams(params => ({ ...params, changeFather: true }))
                            onDelete()
                        },
                        onClose: () => setWarningProps(DefaultWarning)
                    })
                }
                setWarningProps({
                    openYesNo: true,
                    title: err.title,
                    message: err.message,
                    onYes: () => {
                        setParams(params => ({ ...params, ignorePregnancy: true }))
                        onDelete()
                    },
                    onClose: () => setWarningProps(DefaultWarning)
                })
            })
            .finally(() => setLoading(false))
    }, [params, setError, setReload, setWarningProps])

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
    const [bulls, setBulls] = useState<Animal[]>([])

    const { setError, setWarningProps } = useContext(ErrorDialogContext)

    const { control, handleSubmit, setValue } = useForm<InseminationEntrySave>({
        defaultValues: {
            id: rowData.id,
            animalId: rowData.animalId,
            bullId: rowData.bullId,
            inseminationDate: rowData.inseminationDate,
            observation: rowData.observation
        }
    })

    useEffect(() => {
        searchInseminationBulls()
            .then(resp => setBulls(resp))
            .catch(() => setBulls([]))
    }, [])

    const onUpdate: SubmitHandler<InseminationEntrySave> = (data: InseminationEntrySave) => {
        setLoading(true)
        updateInsemination(data)
            .then((response: InseminationEntry) => {
                setRowData(response)
                setError(undefined)
                setWarningProps(DefaultWarning)
            })
            .catch((err: APIError) => {
                if (err.errType === ERROR_TYPE) {
                    setError(err)
                    return
                }

                setWarningProps({
                    openYesNo: true,
                    title: err.title,
                    message: err.message,
                    onYes: () => {
                        setValue('ignoreWarnings', true)
                        handleSubmit(onUpdate)
                    },
                    onClose: () => setWarningProps(DefaultWarning)
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
                options={bulls.map(item => ({
                    id: item.id,
                    label: getAnimalLabel(item)
                }))}
                formProps={{ control, name: 'bullId' }}
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
    const navigate = useNavigate()

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
                    loading={loading}
                    render={item => (
                        <TableRow>
                            <TableCell>
                                <EditControlButtons
                                    onShow={() => {
                                        const inseminationDate = new Date(item.inseminationDate)
                                        const dateStr = inseminationDate.toISOString().split('T')[0]
                                        navigate(`groups/${dateStr}`)
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
            onClick={() => navigate("groups")}
        >
            Ver Mais...
        </Button>
    </DashboardCard>
}
