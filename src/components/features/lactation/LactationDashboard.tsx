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
import { DashboardInformationProps, DashboardTopBarProps, OptionMenuProps } from "@shared/dashboard/Entities"
import { ReloadButton } from "@shared/table/TableTopBarComponents"
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
    AnimalsAverageHist as AnimalsNumberHist,
    AnimalsRating,
    AverageMilkHist,
    DairyAnimalsType,
    LactationHistFoot,
    ParentsRating,
    TotalMilkHist
} from "./Entities"
import {
    getLastAverageMilk,
    getLastLactating,
    getLastLac,
    getLastGroups,
    getLastMilk,
    getParentRatings,
    getRankedAnimals,
    getMilkProduction,
    getDairyTypes,
    getLastDry,
    getLongLactations,
} from "./Service"
import { dateToISO, dateTransform, decimalTransform, positiveTransform } from "@utils/Transformations"
import { ComboBox, ComboBoxItem } from "@shared/common/ComboBox"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import { TrendValues } from "@shared/table/TableComponents"
import { Alert, AlertTitle, Button, Collapse, Divider, ListItemIcon, Menu, MenuItem } from "@mui/material"
import ChevronRight from "@mui/icons-material/ChevronRight"
import Add from "@mui/icons-material/Add"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { SparkLineChart } from "@mui/x-charts/SparkLineChart"
import { CardEntry } from "@utils/Entities"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { EditRowProps, TableRowProp } from "@shared/table/Entities"
import { SubmitHandler, useForm } from "react-hook-form"
import {
    LineChart,
    PieChart,
} from "@mui/x-charts"
import { DefaultTimerWarning, GROUP_DELETE_TITLE, GROUP_UPDATE_TITLE, LOADING_MSG, LONG_LACTATION_DAYS, NO_DATA_AVAILABLE } from "@shared/Globals"
import { green, yellow } from "@mui/material/colors"
import ExpandMore from "@mui/icons-material/ExpandMore"
import { EndLactationDialog } from "./EndLactationDialog"
import { AddLacDialog } from "./AddLactationDialog"
import { APIError } from "@/utils/ApiRequest"
import { ErrorDialog, TimerYesNoDialog, TimerYesNoDialogProps } from "@/components/shared/dialog/DialogComponents"
import { FormDatePicker } from "@/components/shared/form-controls/FormDatePicker"
import { useNavigate } from "react-router"
import { AddMilkEntryDialog } from "./milk-tables/AddMilkEntryDialog"
import { LactationGroup, LactationGroupSave, MilkEntry } from "./milk-tables/Entities"
import { deleteMilkEntry, deleteMilkGroup, updateMilkGroup } from "./milk-tables/Service"
import BackHand from "@mui/icons-material/BackHand"

export const LactationDashboard = () => {

    const [activeRequests, setActiveRequests] = useState(0)
    const [reloadFlag, setReloadFlag] = useState(0)

    const startLoading = useCallback(() => setActiveRequests(prev => prev + 1), [])
    const stopLoading = useCallback(() => setActiveRequests(prev => Math.max(prev - 1, 0)), [])

    return <DashboardContainer>
        <DashboardTopBar {...{ activeRequests, setReloadFlag }} />
        <LactationInfo {...{ startLoading, stopLoading, reloadFlag, setReloadFlag }} />
    </DashboardContainer>
}

const DashboardTopBar = ({ setReloadFlag, activeRequests }: DashboardTopBarProps) => {

    const [menuOpen, setMenuOpen] = useState(false)
    const optionsEl = useRef<HTMLButtonElement>(null)

    return <DashboardTopContainer>
        <ReloadButton
            variant="text"
            loading={activeRequests > 0}
            onReload={() => setReloadFlag(prev => prev + 1)}
        />
        <Button
            className="ml-auto"
            ref={optionsEl}
            startIcon={<ExpandMore />}
            onClick={() => setMenuOpen(true)}
        >
            Opções
        </Button>
        <OptionsMenu
            menuAnchorEl={optionsEl}
            openMenu={menuOpen}
            closeMenu={() => setMenuOpen(false)}
            setReloadFlag={setReloadFlag}
        />
    </DashboardTopContainer>
}

type OptionsMenuProps = OptionMenuProps & {
    setReloadFlag: Dispatch<SetStateAction<number>>
}

const OptionsMenu = ({ openMenu: open, menuAnchorEl, closeMenu: handleClose, setReloadFlag }: OptionsMenuProps) => {

    const [addMilkEntryOpen, setAddMilkEntryOpen] = useState(false)
    const [openEndLactation, setOpenEndLactation] = useState(false)
    const [openStartLac, setOpenStartLac] = useState(false)
    const navigate = useNavigate()

    const onClose = useCallback((added: boolean) => {
        setAddMilkEntryOpen(false)
        if (added) setReloadFlag(prev => prev + 1)
    }, [setReloadFlag])

    const closeEndLactation = useCallback(() => setOpenEndLactation(false), [])
    const closeStartLac = useCallback(() => setOpenStartLac(false), [])

    return <>
        <Menu
            open={open}
            anchorEl={menuAnchorEl.current}
            onClose={handleClose}
        >
            <MenuItem onClick={() => setAddMilkEntryOpen(true)}>
                <ListItemIcon>
                    <Add />
                </ListItemIcon>
                Marcar Leite
            </MenuItem>
            <MenuItem onClick={() => setOpenStartLac(true)}>
                <ListItemIcon>
                    <Add />
                </ListItemIcon>
                Iniciar Lactações
            </MenuItem>
            <MenuItem onClick={() => setOpenEndLactation(true)}>
                <ListItemIcon>
                    <BackHand fontSize="small" />
                </ListItemIcon>
                Encerrar Lactações
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => navigate("milk")}>
                <ListItemIcon>
                    <ChevronRight />
                </ListItemIcon>
                Histórico de Leite
            </MenuItem>
            <MenuItem onClick={() => navigate("milk/groups")}>
                <ListItemIcon>
                    <ChevronRight />
                </ListItemIcon>
                Dias de Marcação
            </MenuItem>
            <MenuItem onClick={() => navigate("history")}>
                <ListItemIcon>
                    <ChevronRight />
                </ListItemIcon>
                Histórico de Lactações
            </MenuItem>
        </Menu>
        <AddMilkEntryDialog {...{ addMilkEntryOpen, onClose }} />
        <EndLactationDialog {...{ openEndLactation, closeEndLactation }} />
        <AddLacDialog {...{ openStartLac, closeStartLac }} />
    </>
}

const LactationInfo = ({ startLoading, stopLoading, reloadFlag, setReloadFlag }: DashboardInformationProps) => {
    return <DashboardInfoContainer className="flex flex-col gap-4">
        <div className="flex flex-row">
            <LongLactationAlert {...{ stopLoading, startLoading, reloadFlag }} />
        </div>
        <div className="grid grid-cols-[repeat(4,270px)_1fr] grid-rows-[180px_550px] gap-4">
            <MilkProductionCard {...{ stopLoading, startLoading, reloadFlag }} />
            <AverageMilkCard {...{ stopLoading, startLoading, reloadFlag }} />
            <LactatingCard {...{ startLoading, stopLoading, reloadFlag }} />
            <DryCard {...{ startLoading, stopLoading, reloadFlag }} />
            <TypesChart {...{ startLoading, stopLoading, reloadFlag, setReloadFlag }} />
            <LastEntriesTable {...{ startLoading, stopLoading, reloadFlag, setReloadFlag }} />
        </div>
        <div className="grid grid-rows-[500px] grid-cols-[1fr_850px] gap-4">
            <MilkProductionChart {...{ startLoading, stopLoading, reloadFlag }} />
            <LastGroupsTable {...{ startLoading, stopLoading, reloadFlag }} />
        </div>
        <div className="flex flex-col gap-4">
            <AnimalsRatingTable {...{ startLoading, stopLoading, reloadFlag }} />
            <ParentsRatingTable {...{ startLoading, stopLoading, reloadFlag }} />
        </div>
    </DashboardInfoContainer>
}

const LongLactationAlert = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultData: LactationHistFoot = useMemo(() => ({ totalLacs: 0 }), [])

    const [open, setOpen] = useState(false)
    const [data, setData] = useState(defaultData)

    const navigate = useNavigate()

    useEffect(() => {
        startLoading()
        getLongLactations()
            .then(res => {
                setData(res)
                setOpen(res.totalLacs > 0)
            })
            .catch(() => setData(defaultData))
            .finally(() => stopLoading())
    }, [reloadFlag, defaultData, startLoading, stopLoading])

    return <Collapse in={open}>
        <Alert severity="warning" onClose={() => setOpen(prev => !prev)}>
            <AlertTitle>{`${data.totalLacs} vacas possuem uma lactação maior que ${LONG_LACTATION_DAYS} dias.`}</AlertTitle>
            <Button
                variant="outlined"
                color="warning"
                onClick={() => navigate('long-lactations')}
            >
                Ver Mais...
            </Button>
        </Alert>
    </Collapse>

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
            .then(response => setStats(response))
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
                    height={90}
                    showHighlight
                    showTooltip
                    xAxis={{
                        data: stats.hist.map(item => new Date(item.entryDate)),
                        valueFormatter: (value: Date) => dateTransform(value)
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
            .then(response => setStats(response))
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
                    height={90}
                    showTooltip
                    xAxis={{
                        data: stats.hist.map(item => new Date(item.entryDate)),
                        valueFormatter: (value: Date) => dateTransform(value)
                    }}
                />
            )}
            trendProps={{ trend: stats.trend }}
        />
    </DashboardCard>
}

const LactatingCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

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
        getLastLactating()
            .then(response => setStats(response))
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
                    height={90}
                    color={yellow[800]}
                    showHighlight
                    showTooltip
                    xAxis={{
                        data: stats.hist.map(item => new Date(item.entryDate)),
                        valueFormatter: (value: Date) => dateTransform(value)
                    }}
                />
            )}
            trendProps={{ trend: stats.trend }}
        />
    </DashboardCard>
}

const DryCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

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
        getLastDry()
            .then(response => setStats(response))
            .catch(() => setStats(defaultValue))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [defaultValue, reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Secagem de Vacas"
            loading={loading}
            data={stats.current}
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.animalsNumber)}
                    height={90}
                    color={yellow[800]}
                    showHighlight
                    showTooltip
                    xAxis={{
                        data: stats.hist.map(item => new Date(item.entryDate)),
                        valueFormatter: (value: Date) => dateTransform(value)
                    }}
                />
            )}
            trendProps={{ trend: stats.trend, inverse: true, text: positiveTransform(stats.trend) }}
        />
    </DashboardCard>
}

type EditContextProps = {
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setWarning: Dispatch<SetStateAction<TimerYesNoDialogProps>>
    setRows: Dispatch<SetStateAction<LactationGroup[]>>
}

const EditContext = createContext<EditContextProps>(undefined!)

const LastGroupsTable = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [rows, setRows] = useState<LactationGroup[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<APIError>()
    const [warning, setWarning] = useState(DefaultTimerWarning)
    const navigate = useNavigate()

    useEffect(() => {
        startLoading()
        setLoading(true)
        getLastGroups()
            .then(response => setRows(response))
            .catch(() => setRows([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardDefaultTitle text="As Últimas Marcações" />
        <EditContext.Provider value={{ setError, setWarning, setRows }}>
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
                        dataset={rows}
                        loading={loading}
                        render={item => <GroupsRow {...{ loading, item }} />}
                    />
                </TableBody>
            </Table>
        </EditContext.Provider>
        <Button
            className="ml-auto"
            variant="text"
            endIcon={<ChevronRight />}
            onClick={() => navigate("milk/groups")}
        >
            Ver Mais...
        </Button>
        <ErrorDialog
            openError={!!error}
            title={error?.title}
            content={error?.message}
            onClose={() => setError(undefined)}
        />
        <TimerYesNoDialog {...warning} />
    </DashboardCard>
}

type GroupsRowProps = {
    item: LactationGroup
    loading: boolean
}

const GroupsRow = ({ item }: GroupsRowProps) => {

    const [rowData, setRowData] = useState<LactationGroup>(item)
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const { setError, setWarning, setRows } = useContext(EditContext)

    useEffect(() => setRowData(item), [item])

    if (editing) return <GroupsRowEditing {...{ rowData, setEditing, setRowData }} />

    const deleteGroup = () => {
        setLoading(true)
        deleteMilkGroup(rowData.entryDate)
            .then(() => {
                setRows(rows => rows.filter(item => item.entryDate != rowData.entryDate))
                setError(undefined)
            })
            .catch(err => setError(err))
            .finally(() => {
                setLoading(false)
                setWarning(DefaultTimerWarning)
            })
    }

    const onDelete = () => {
        setWarning({
            openYesNo: true,
            waitTime: 10,
            title: GROUP_DELETE_TITLE,
            content: `Ao confirmar, ${rowData.animalsNumber} registros de leite serão excluídos!`,
            onClose: () => setWarning(DefaultTimerWarning),
            onYes: () => deleteGroup()
        })
    }

    return <TableRow>
        <TableCell>
            <EditControlButtons
                setEditing={setEditing}
                onDelete={onDelete}
                loading={loading}
                onShow={() => {
                    const entryDate = new Date(rowData.entryDate)
                    const dateStr = dateToISO(entryDate)
                    navigate(`milk/${dateStr}`)
                }}
            />
        </TableCell>
        <TableCell>{dateTransform(rowData.entryDate)}</TableCell>
        <TableCell>
            <TrendValues
                value={rowData.animalsNumber}
                trendProps={{ trend: rowData.numberDifference, text: rowData.numberDifference.toString() }}
            />
        </TableCell>
        <TableCell>
            <TrendValues
                value={decimalTransform(rowData.totalMilk)}
                trendProps={{ trend: rowData.totalRate }}
            />
        </TableCell>
        <TableCell>
            <TrendValues
                value={decimalTransform(rowData.averageMilk)}
                trendProps={{ trend: rowData.averageRate }}
            />
        </TableCell>
    </TableRow>
}

type GroupsRowEditingProps = {
    rowData: LactationGroup
    setRowData: (rowData: LactationGroup) => void
    setEditing: (editing: boolean) => void
}

const GroupsRowEditing = ({ rowData, setRowData, setEditing }: GroupsRowEditingProps) => {

    const [loading, setLoading] = useState(false)

    const { control, handleSubmit } = useForm<LactationGroupSave>({ defaultValues: rowData })
    const { setError, setWarning } = useContext(EditContext)

    const onSubmit: SubmitHandler<LactationGroup> = (data: LactationGroupSave) => {
        setLoading(true)
        updateMilkGroup(rowData.entryDate, data)
            .then(response => {
                setRowData(response)
                setEditing(false)
            })
            .catch(err => setError(err))
            .finally(() => {
                setLoading(false)
                setWarning(DefaultTimerWarning)
            })
    }

    const onSave = () => {
        setWarning({
            openYesNo: true,
            title: GROUP_UPDATE_TITLE,
            content: `Ao confirmar, ${rowData.animalsNumber} registros terão a data modificada! Deseja continuar?`,
            waitTime: 10,
            onYes: handleSubmit(onSubmit),
            onClose: () => setWarning(DefaultTimerWarning),
        })
    }

    return <TableRow>
        <TableCell>
            <EditingControlButtons {...{ onSave, setEditing, loading }} />
        </TableCell>
        <TableCell>
            <FormDatePicker formProps={{ control, name: 'entryDate' }} />
        </TableCell>
        <TableCell>
            <TrendValues
                value={rowData.animalsNumber}
                trendProps={{ trend: rowData.numberDifference, text: rowData.numberDifference.toString() }}
            />
        </TableCell>
        <TableCell>
            <TrendValues
                value={decimalTransform(rowData.totalMilk)}
                trendProps={{ trend: rowData.totalRate }}
            />
        </TableCell>
        <TableCell>
            <TrendValues
                value={decimalTransform(rowData.averageMilk)}
                trendProps={{ trend: rowData.averageRate }}
            />
        </TableCell>
    </TableRow>
}

const LastEntriesTable = ({ reloadFlag, stopLoading, startLoading, setReloadFlag }: DashboardInformationProps) => {

    const [data, setData] = useState<MilkEntry[]>([])
    const [lastDate, setLastDate] = useState(new Date())
    const [textDate, setTextDate] = useState('Sem dados')
    const [loading, setLoading] = useState(false)
    const [addMilkEntryOpen, setAddMilkEntryOpen] = useState(false)
    const navigate = useNavigate()

    const onDelete = useCallback((id: string) => {
        if (!setReloadFlag) return
        deleteMilkEntry(id)
            .then(() => setReloadFlag(prev => prev + 1))
    }, [setReloadFlag])

    const onClose = useCallback(() => {
        if (!setReloadFlag) return
        setReloadFlag(prev => prev + 1)
        setAddMilkEntryOpen(false)
    }, [setReloadFlag])

    useEffect(() => {
        startLoading()
        setLoading(true)
        getLastLac()
            .then(response => {
                const entries: MilkEntry[] = response
                const entryDate = new Date(entries[0].entryDate ?? '')
                setLastDate(entryDate)
                setTextDate(dateTransform(entryDate))
                setData(entries)
            })
            .catch(() => {
                setLastDate(new Date())
                setTextDate('Sem dados')
                setData([])
            })
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard className="col-span-4">
        <CardDefaultTitle text={`Última Marcação de Leite - ${textDate}`} />
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
                        loading={loading}
                        dataset={data}
                        render={row => <EntriesRow {...{ row, onDelete }} />}
                    />
                </TableBody>
            </Table>
        </div>
        <div className="flex flex-row gap-4">
            <Button
                className="ml-auto"
                startIcon={<Add />}
                onClick={() => setAddMilkEntryOpen(true)}
            >
                Marcar Leite
            </Button>
            <Button
                endIcon={<ChevronRight />}
                onClick={() => navigate("milk")}
            >
                Ver Mais...
            </Button>
            <AddMilkEntryDialog {...{ addMilkEntryOpen, onClose, entryDate: lastDate }} />
        </div>
    </DashboardCard>
}

const EntriesRow = ({ row, onDelete }: TableRowProp<MilkEntry>) => {

    const [editing, setEditing] = useState(false)
    const [rowData, setRowData] = useState(row)

    useEffect(() => setRowData(row), [row])

    if (editing) return <EditingEntriesRow {...{ rowData, setRowData, setEditing }} />

    return <TableRow>
        <TableCell>
            <EditControlButtons
                setEditing={setEditing}
                onDelete={() => onDelete && onDelete(row.id)}
            />
        </TableCell>
        <TableCell>{rowData.animalInfo}</TableCell>
        <TableCell align="center">{rowData.pastureName}</TableCell>
        <TableCell align="center">{decimalTransform(rowData.quantity ?? 0, 1)}</TableCell>
    </TableRow>

}

const EditingEntriesRow = ({ rowData, setRowData, setEditing }: EditRowProps<MilkEntry>) => {

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
        <TableCell>{rowData.animalInfo}</TableCell>
        <TableCell align="center">{rowData.pastureName}</TableCell>
        <TableCell align="center">
            <FormTextField
                formProps={{ control, name: 'quantity' }}
                type="number"
            />
        </TableCell>
    </TableRow>
}

const TypesChart = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultDataset: DairyAnimalsType = useMemo(() => ({
        dry: 0,
        lactating: 0
    }), [])

    const [loading, setLoading] = useState(false)
    const [dataset, setDataset] = useState(defaultDataset)

    const navigate = useNavigate()

    useEffect(() => {
        startLoading()
        setLoading(true)
        getDairyTypes()
            .then(response => setDataset(response))
            .catch(() => setDataset(defaultDataset))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [defaultDataset, reloadFlag, startLoading, stopLoading])

    return <DashboardCard className="row-span-2">
        <CardDefaultTitle text="Divisão do Rebanho Leiteiro" />
        <PieChart
            loading={loading}
            localeText={{
                loading: LOADING_MSG,
                noData: NO_DATA_AVAILABLE
            }}
            slotProps={{
                legend: {
                    sx: {
                        fontSize: 16
                    },
                    direction: 'horizontal',
                    position: {
                        horizontal: 'center',
                        vertical: 'bottom'
                    }
                }
            }}
            onItemClick={(_, item) => {
                if (item.dataIndex === 1) navigate('dry-animals')
                if (item.dataIndex === 0) navigate('lac-animals')
            }}
            series={[{
                innerRadius: 180,
                outerRadius: 280,
                highlightScope: { fade: 'global', highlight: 'item' },
                faded: { additionalRadius: -30, color: 'gray' },
                data: [
                    { id: 'lactating', label: 'Lactando', value: dataset.lactating, },
                    { id: 'dry', label: 'Secas', value: dataset.dry, color: yellow[600] },
                ]
            }]}
        />
    </DashboardCard>
}

const MilkProductionChart = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const [dataset, setDataset] = useState<TotalMilkHist[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getMilkProduction()
            .then(results => setDataset(results))
            .catch(() => setDataset([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardDefaultTitle text="Produção de Leite por Mês" />
        <LineChart
            loading={loading}
            localeText={{
                loading: LOADING_MSG,
                noData: NO_DATA_AVAILABLE
            }}
            series={[{
                data: dataset.map(item => item.totalMilk),
                valueFormatter: value => decimalTransform(value),
                curve: 'linear',
                showMark: false,
                area: true
            }]}
            xAxis={[{
                data: dataset.map(item => new Date(item.entryDate)),
                scaleType: 'time',
                domainLimit: 'strict',
                valueFormatter: (value: Date) => value.toLocaleString('pt-BR', {
                    month: 'short',
                    year: 'numeric'
                })
            }]}
            yAxis={[
                { id: 'totalAxis', min: 0, label: 'Leite Produzido' },
            ]}
        />
    </DashboardCard>
}

const AnimalsRatingTable = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [data, setData] = useState<AnimalsRating[]>([])
    const [loading, setLoading] = useState(false)
    const [rankBy, setRankBy] = useState('worst-animals')
    const navigate = useNavigate()

    const rankByValues: ComboBoxItem[] = [
        { name: 'As Melhores Vacas', value: 'best-animals' },
        { name: 'As Piores Vacas', value: 'worst-animals' },
    ]

    useEffect(() => {
        startLoading()
        setLoading(true)
        getRankedAnimals(rankBy)
            .then(response => setData(response))
            .catch(() => setData([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading, rankBy])

    return <DashboardCard className="h-[500]">
        <div className="flex flex-row">
            <ComboBox
                className="w-[300px]"
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
                onClick={() => navigate("history")}
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
                    loading={loading}
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
    const navigate = useNavigate()

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
            .then(response => setData(response))
            .catch(() => setData([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading, rankBy])

    return <DashboardCard className="h-[500]">
        <div className="flex flex-row">
            <ComboBox
                className="w-[300px]"
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
                onClick={() => navigate("history")}
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
                    loading={loading}
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
