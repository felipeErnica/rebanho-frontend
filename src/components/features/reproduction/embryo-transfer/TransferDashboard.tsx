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
import {
    AnimalsNumberEntry,
    BestAnimals,
    BirthRateEntry,
    FutureBirths,
    LastEntry,
    EmbryoTransfer,
    TransferGroup,
    TransferHist,
    PregnancyRateEntry,
    StatusColorMap,
    StatusMap
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
    getBestRanking,
    searchEmbryoDonors,
    searchTransferBulls,
    deleteGroup
} from "./Controller"
import { GROUP_DELETE_TITLE, LOADING_MSG, NO_DATA_AVAILABLE } from "@shared/Globals"
import {
    Button,
    Chip,
    Divider,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material"
import { dateTransform, percentageTransform } from "@utils/Transformations"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import ChevronRight from "@mui/icons-material/ChevronRight"
import { PageContext } from "@shared/main-page/PageContext"
import { PageProps } from "@shared/main-page/PageDisplay"
import { HomePage } from "@features/home/HomePage"
import { ReloadButton } from "@shared/table/TableTopBarComponents"
import Add from "@mui/icons-material/Add"
import { orange, yellow } from "@mui/material/colors"
import { CardEntry } from "@utils/Entities"
import { EditRowProps, TableRowProp } from "@shared/table/Entities"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { GroupsTablePageProps, TransferMainPage } from "./EmbryoTransferPages"
import { TrendValues } from "@shared/table/TableComponents"
import { AddTransferDialog } from "./AddTransferDialog"
import { EntriesTablePage } from "./EntriesTable"
import { GroupEntriesTablePage } from "./GroupEntriesTable"
import { ComboBox, ComboBoxItem } from "@shared/common/ComboBox"
import { ErrorDialog, TimerYesNoDialog } from "@shared/dialog/DialogComponents"
import { APIError } from "@utils/ApiRequest"
import { OptionMenuProps } from "@shared/dashboard/Entities"
import { AddTransferBull } from "./AddTransferBull"
import { AddEmbryoDonorDialog } from "./AddEmbryoDonor"
import { AddCowDialog } from "../../animals/AddCowDialog"
import { AddBullDialog } from "../../animals/AddBullDialog"
import ExpandMore from "@mui/icons-material/ExpandMore"

type ReloadContextProps = {
    setReloadFlag: Dispatch<SetStateAction<number>>
}

const ReloadContext = createContext<ReloadContextProps>(undefined!)

export const TransferDashboard = () => {

    const [reloadFlag, setReloadFlag] = useState(0)
    const [activeRequests, setActiveRequests] = useState(0)

    const startLoading = useCallback(() => setActiveRequests(prev => prev + 1), [])
    const stopLoading = useCallback(() => setActiveRequests(prev => Math.max(prev - 1, 0)), [])

    return <DashboardContainer>
        <DashboardToolbar {...{ setReloadFlag, activeRequests }} />
        <ReloadContext.Provider value={{ setReloadFlag }}>
            <DashboardInformation {...{ reloadFlag, startLoading, stopLoading }} />
        </ReloadContext.Provider>
    </DashboardContainer>
}

type DashboardToolbarProps = {
    setReloadFlag: Dispatch<React.SetStateAction<number>>
    activeRequests: number
}

const DashboardToolbar = ({ setReloadFlag, activeRequests }: DashboardToolbarProps) => {

    const [openMenu, setOpenMenu] = useState(false)
    const anchorEl = useRef<HTMLButtonElement>(null)

    return <DashboardTopContainer>
        <ReloadButton
            onReload={() => setReloadFlag(prev => prev + 1)}
            loading={activeRequests > 0}
        />
        <Button
            className="ml-auto"
            ref={anchorEl}
            startIcon={<ExpandMore />}
            onClick={() => setOpenMenu(true)}
        >
            Opções
        </Button>
        <OptionsMenu
            openMenu={openMenu}
            setReloadFlag={setReloadFlag}
            closeMenu={() => setOpenMenu(false)}
            menuAnchorEl={anchorEl}
        />
    </DashboardTopContainer>
}

const OptionsMenu = ({ openMenu, menuAnchorEl, closeMenu: handleClose, setReloadFlag }: OptionMenuProps) => {

    const [addTransferOpen, setAddTransferOpen] = useState(false)
    const [addTransferBullOpen, setAddTransferBullOpen] = useState(false)
    const [addEmbryoDonorOpen, setAddEmbryoDonorOpen] = useState(false)
    const [addCowOpen, setAddCowOpen] = useState(false)
    const [addBullOpen, setAddBullOpen] = useState(false)

    const { setPageProps } = useContext(PageContext)

    const closeAddTransfer = (added?: boolean) => {
        if (added) setReloadFlag(prev => prev + 1)
        setAddTransferOpen(false)
    }

    const closeAddTransferBull = (added?: boolean) => {
        if (added) setReloadFlag(prev => prev + 1)
        setAddTransferBullOpen(false)
    }

    const closeAddEmbryoDonor = (added?: boolean) => {
        if (added) setReloadFlag(prev => prev + 1)
        setAddEmbryoDonorOpen(false)
    }

    const closeAddCow = (added?: boolean) => {
        if (added) setReloadFlag(prev => prev + 1)
        setAddCowOpen(false)
    }

    const closeAddBull = (added?: boolean) => {
        if (added) setReloadFlag(prev => prev + 1)
        setAddBullOpen(false)
    }

    return <>
        <Menu
            open={openMenu}
            anchorEl={menuAnchorEl.current}
            onClose={handleClose}
        >
            <MenuItem onClick={() => setAddTransferOpen(true)} >
                <ListItemIcon>
                    <Add />
                </ListItemIcon>
                Adicionar Transferência
            </MenuItem>
            <MenuItem onClick={() => setAddEmbryoDonorOpen(true)} >
                <ListItemIcon>
                    <Add />
                </ListItemIcon>
                Registrar Vaca para Doação de Embrião
            </MenuItem>
            <MenuItem onClick={() => setAddTransferBullOpen(true)} >
                <ListItemIcon>
                    <Add />
                </ListItemIcon>
                Registrar Touro para Transferência
            </MenuItem>
            <MenuItem onClick={() => setAddCowOpen(true)} >
                <ListItemIcon>
                    <Add />
                </ListItemIcon>
                Adicionar Nova Vaca
            </MenuItem>
            <MenuItem onClick={() => setAddBullOpen(true)} >
                <ListItemIcon>
                    <Add />
                </ListItemIcon>
                Adicionar Novo Touro
            </MenuItem>
            <Divider />
            <MenuItem
                onClick={() => {
                    const page: PageProps = {
                        page: <EntriesTablePage />,
                        title: "Histórico de Transferências",
                        previousPages: [HomePage, TransferMainPage]
                    }
                    setPageProps(page)
                }}
            >
                <ListItemIcon>
                    <ChevronRight />
                </ListItemIcon>
                Histórico Geral
            </MenuItem>
            <MenuItem
                onClick={() => setPageProps(GroupsTablePageProps)}
            >
                <ListItemIcon>
                    <ChevronRight />
                </ListItemIcon>
                Datas de Transferência
            </MenuItem>
        </Menu>
        <AddTransferDialog {...{ addTransferOpen, closeAddTransfer }} />
        <AddTransferBull {...{ addTransferBullOpen, closeAddTransferBull }} />
        <AddEmbryoDonorDialog {...{ addEmbryoDonorOpen, closeAddEmbryoDonor }} />
        <AddCowDialog {...{ addCowOpen, closeAddCow, isEmbryoDonor: true }} />
        <AddBullDialog {...{ addBullOpen, closeAddBull, isTransferBull: true }} />
    </>
}

type DashboardInformationProps = {
    reloadFlag: number
    startLoading: () => void
    stopLoading: () => void
}

const DashboardInformation = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {
    return <DashboardInfoContainer className="flex flex-col gap-4">
        <div className="grid grid-cols-[repeat(3,260px)_1fr] grid-rows-[180px_450px] gap-4">
            <AnimalsNumbersCard {...{ reloadFlag, startLoading, stopLoading }} />
            <PregnancyRateCard {...{ reloadFlag, stopLoading, startLoading }} />
            <BirthRateCard {...{ reloadFlag, stopLoading, startLoading }} />
            <LastEntriesTable {...{ reloadFlag, stopLoading, startLoading }} />
            <LastGroupsTable {...{ reloadFlag, startLoading, stopLoading }} />
        </div>
        <div className="grid grid-cols-[1fr_400px] grid-rows-[repeat(2,500px)] gap-4">
            <TransferHistGraph {...{ reloadFlag, startLoading, stopLoading }} />
            <FutureBirthsTable {...{ startLoading, stopLoading, reloadFlag }} />
            <BestAnimalsTable {...{ reloadFlag, startLoading, stopLoading }} />
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
                        data: data.hist.map(item => new Date(item.transferDate)),
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
                        data: data.hist.map(item => new Date(item.transferDate)),
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
            title="Nº de Vacas"
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
                        data: data.hist.map(item => new Date(item.transferDate)),
                        valueFormatter: (value: Date) => value.toLocaleString('pt-BR', { dateStyle: 'short' }),
                        domainLimit: 'strict',
                        scaleType: 'time',
                    }}
                />
            )}
        />
    </DashboardCard>
}

const BestAnimalsTable = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [data, setData] = useState<BestAnimals[]>([])
    const [ranking, setRanking] = useState('best-bull')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getBestRanking(ranking)
            .then(response => setData(response))
            .catch(() => setData([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading, ranking])

    const rakingItens: ComboBoxItem[] = [
        { name: 'Os Melhores Touros', value: 'best-bull' },
        { name: 'As Melhores Receptoras', value: 'best-receivers' },
        { name: 'As Melhores Doadoras', value: 'best-donors' },
    ]

    return <DashboardCard className="col-span-2">
        <ComboBox
            className="w-[300px]"
            value={ranking}
            items={rakingItens}
            onChange={value => setRanking(value ?? 'best-bull')}
        />
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Touro</TableCell>
                    <TableCell align="center">Nº de Transferências</TableCell>
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
                            <TableCell>{item.animalName}</TableCell>
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

const TransferHistGraph = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [dataset, setDataset] = useState<TransferHist[]>([])

    useEffect(() => {
        startLoading()
        getInseminationHist()
            .then(response => setDataset(response))
            .catch(() => setDataset([]))
            .finally(() => {
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardDefaultTitle text="Histórico de Transferêcias" />
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
                    data: dataset.map(item => new Date(item.transferDate)),
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

    const [data, setData] = useState<EmbryoTransfer[]>([])
    const [loading, setLoading] = useState(false)
    const [transferDate, setInseminationDate] = useState(new Date())
    const [lastDate, setLastDate] = useState('Sem dados')
    const { setPageProps } = useContext(PageContext)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getLastEntries()
            .then(response => {
                const lastEntry: LastEntry = response
                const lastInsemination = new Date(lastEntry.transferDate)
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
            <CardDefaultTitle text={`Última Transferência - ${lastDate}`} />
        </div>
        <div className="overflow-auto">
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Receptora</TableCell>
                        <TableCell>Doadora</TableCell>
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
            onClick={() => {
                const page: PageProps = {
                    page: <GroupEntriesTablePage {...{ transferDate }} />,
                    title: `Transferência - ${lastDate}`,
                    previousPages: [HomePage, TransferMainPage]
                }
                setPageProps(page)
            }}
        >
            Ver Mais...
        </Button>
    </DashboardCard>
}

const LastEntriesRow = ({ row }: TableRowProp<EmbryoTransfer>) => {

    const [editing, setEditing] = useState(false)
    const [rowData, setRowData] = useState<EmbryoTransfer>(row)

    useEffect(() => setRowData(row), [row])
    const onDelete = useCallback(() => console.log(rowData.id), [rowData])

    if (editing) return <EditLastEntriesRow {...{ setEditing, setRowData, rowData }} />

    return <TableRow>
        <TableCell>
            <EditControlButtons {...{ setEditing, onDelete }} />
        </TableCell>
        <TableCell>{rowData.receiverInfo}</TableCell>
        <TableCell>{rowData.donorInfo}</TableCell>
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

const EditLastEntriesRow = ({ setEditing, setRowData, rowData }: EditRowProps<EmbryoTransfer>) => {

    const { handleSubmit, control } = useForm({ defaultValues: rowData })

    const onSubimt: SubmitHandler<EmbryoTransfer> = (data: EmbryoTransfer) => {
        setRowData(data)
        setEditing(false)
    }

    const onSave = handleSubmit(onSubimt)

    return <TableRow>
        <TableCell>
            <EditingControlButtons {...{ setEditing, onSave }} />
        </TableCell>
        <TableCell>{rowData.receiverInfo}</TableCell>
        <TableCell>
            <FormSearchBox
                formProps={{ control, name: 'donorId' }}
                searchOptions={searchEmbryoDonors}
            />
        </TableCell>
        <TableCell>
            <FormSearchBox
                formProps={{ control, name: 'bullId' }}
                searchOptions={searchTransferBulls}
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

    const [data, setData] = useState<TransferGroup[]>([])
    const [loading, setLoading] = useState(false)

    const { setPageProps } = useContext(PageContext)
    const { setReloadFlag } = useContext(ReloadContext)

    const [group, setGroup] = useState<TransferGroup>()
    const [error, setError] = useState<APIError>()
    const [transferDate, setTransferDate] = useState<Date>()
    const [addTransferOpen, setAddTransferOpen] = useState(false)

    const closeAddTransfer = (added?: boolean) => {
        if (added) setReloadFlag(prev => prev + 1)
        setAddTransferOpen(false)
    }

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
        <CardDefaultTitle text="As Últimas Transferências" />
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell width={10} />
                    <TableCell align="center">Data de Transferência</TableCell>
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
                                    onDelete={() => setGroup(item)}
                                    otherButtons={(
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                setTransferDate(item.transferDate)
                                                setAddTransferOpen(true)
                                            }}
                                        >
                                            <Add />
                                        </IconButton>
                                    )}
                                    onShow={() => {
                                        const transferDate = new Date(item.transferDate)
                                        const date = transferDate.toLocaleDateString('pt-BR', {
                                            month: 'short',
                                            year: 'numeric'
                                        })
                                        const page: PageProps = {
                                            page: <GroupEntriesTablePage {...{ transferDate }} />,
                                            title: `Transferência - ${date}`,
                                            previousPages: [HomePage, TransferMainPage]
                                        }
                                        if (setPageProps) setPageProps(page)
                                    }}
                                />
                            </TableCell>
                            <TableCell align="center">{dateTransform(item.transferDate)}</TableCell>
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
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            content={error?.message}
            onClose={() => setError(undefined)}
        />
        <TimerYesNoDialog
            openYesNo={!!group}
            waitTime={10}
            title={GROUP_DELETE_TITLE}
            onYes={() => {
                if (!group) return
                deleteGroup(group.transferDate)
                    .then(() => setReloadFlag(prev => prev + 1))
                    .catch(err => setError(err))
                    .finally(() => setGroup(undefined))
            }}
            content={
                `Ao continuar, o registro de ${group?.cowNumber} transferências serão apagados! ` +
                "Deseja continuar?" +
                "\n\nOBS.: As parições relacionadas a estas transferências não serão excluídas, nem modificadas!"
            }
            onClose={() => setGroup(undefined)}
        />
        <AddTransferDialog {...{ addTransferOpen, closeAddTransfer, transferDate }} />
    </DashboardCard>
}
