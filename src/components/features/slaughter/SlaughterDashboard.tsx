import {
    CardChartContent,
    CardDefaultTitle,
    DashboardCard,
    DashboardContainer,
    DashboardInfoContainer,
    DashboardTableBody,
    DashboardTopContainer,
} from "@shared/dashboard/DashboardComponents"
import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useRef, useState } from "react"
import { DashboardInformationProps, DashboardTopBarProps, OptionMenuProps } from "@shared/dashboard/Entities"
import { ReloadButton } from "@shared/table/TableTopBarComponents"
import { Slaughter, SlaughterSave, SlaughterGroup, TableRatings, WeightHist } from "./Entities"
import {
    deleteSlaughter,
    getBestRatings,
    getLastAverageWeight,
    getLastDeadWeight,
    getLastSlaughter,
    getLastGroups,
    getLastPerformance,
    getRateHist,
    getWeightHist,
    updateSlaughter
} from "./Service"
import { dateToISO, dateTransform, decimalTransform, toPercentage, transformWeight } from "@utils/Transformations"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { TrendValues } from "@shared/table/TableComponents"
import Button from "@mui/material/Button"
import ChevronRight from "@mui/icons-material/ChevronRight"
import { ComboBox, ComboBoxItem } from "@shared/common/ComboBox"
import { LineChart } from "@mui/x-charts/LineChart"
import { LOADING_MSG, NO_DATA_AVAILABLE } from "@shared/Globals"
import { SparkLineChart } from "@mui/x-charts/SparkLineChart"
import { green, yellow } from "@mui/material/colors"
import { useNavigate } from "react-router"
import { APIError } from "@utils/ApiRequest"
import { ErrorDialog } from "@shared/dialog/DialogComponents"
import ExpandMore from "@mui/icons-material/ExpandMore"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import Add from "@mui/icons-material/Add"
import Divider from "@mui/material/Divider"
import { AddSlaughterDialog } from "./AddSlaughterDialog"
import { AddButcherDialog } from "../butchers/AddButcherDialog"
import { CardEntry, DefaultCard, GraphData } from "@utils/Entities"
import { getAnimalBirthLabel } from "@features/animals/Entities"

type DashboardContextProps = {
    setReloadFlag: Dispatch<SetStateAction<number>>
}

const DashboardContext = createContext<DashboardContextProps>(undefined!)

export const SlaughterDashboard = () => {

    const [activeRequests, setActiveRequests] = useState(0)
    const [reloadFlag, setReloadFlag] = useState(0)

    const startLoading = useCallback(() => setActiveRequests(prev => prev + 1), [])
    const stopLoading = useCallback(() => setActiveRequests(prev => Math.max(prev - 1, 0)), [])

    return <DashboardContainer>
        <DashboardToolbar {...{ setReloadFlag, activeRequests }} />
        <DashboardContext.Provider value={{setReloadFlag}}>
            <DashboardInfo {...{ startLoading, stopLoading, reloadFlag }} />
        </DashboardContext.Provider>
    </DashboardContainer>
}

const DashboardToolbar = ({ setReloadFlag, activeRequests }: DashboardTopBarProps) => {

    const [openMenu, setOpenMenu] = useState(false)
    const menuAnchorEl = useRef<HTMLButtonElement>(null)

    const closeMenu = () => setOpenMenu(false)

    return <DashboardTopContainer>
        <ReloadButton
            onReload={() => setReloadFlag(prev => prev + 1)}
            loading={activeRequests > 0}
        />
        <Button
            className="ml-auto"
            ref={menuAnchorEl}
            endIcon={<ExpandMore />}
            onClick={() => setOpenMenu(true)}
        >
            Opções
        </Button>
        <OptionsMenu {...{ openMenu, menuAnchorEl, closeMenu, setReloadFlag }} />
    </DashboardTopContainer>
}

const OptionsMenu = ({ openMenu, menuAnchorEl, closeMenu, setReloadFlag }: OptionMenuProps) => {

    const [addSlaughterOpen, setAddSlaughterOpen] = useState(false)
    const [addButcherOpen, setAddButcherOpen] = useState(false)
    const navigate = useNavigate()

    const closeAddSlaughter = (added?: boolean) => {
        if (added) setReloadFlag(prev => prev + 1)
        setAddSlaughterOpen(false)
    }

    const closeAddButcher = (added?: boolean) => {
        if (added) setReloadFlag(prev => prev + 1)
        setAddButcherOpen(false)
    }

    return <>
        <Menu
            open={openMenu}
            anchorEl={menuAnchorEl.current}
            onClose={closeMenu}
        >
            <MenuItem onClick={() => setAddSlaughterOpen(true)} >
                <ListItemIcon>
                    <Add />
                </ListItemIcon>
                Adicionar Abate
            </MenuItem>
            <MenuItem onClick={() => setAddButcherOpen(true)} >
                <ListItemIcon>
                    <Add />
                </ListItemIcon>
                Adicionar Novo Frigorífico
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => navigate("entries")}>
                <ListItemIcon>
                    <ChevronRight />
                </ListItemIcon>
                Histórico Geral
            </MenuItem>
            <MenuItem onClick={() => navigate("groups")}>
                <ListItemIcon>
                    <ChevronRight />
                </ListItemIcon>
                Datas de Abate
            </MenuItem>
            <MenuItem onClick={() => navigate("butchers")}>
                <ListItemIcon>
                    <ChevronRight />
                </ListItemIcon>
                Frigoríficos
            </MenuItem>
        </Menu>
        <AddSlaughterDialog {...{ addSlaughterOpen, closeAddSlaughter }} />
        <AddButcherDialog {...{ addButcherOpen, closeAddButcher }} />
    </>
}

const DashboardInfo = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {
    return <DashboardInfoContainer className="flex flex-col gap-4">
        <div className="grid grid-cols-[repeat(3,280px)_1fr] grid-rows-[190px_500px] gap-4">
            <WeightCard {...{ reloadFlag, startLoading, stopLoading }} />
            <DeadWeightCard {...{ startLoading, stopLoading, reloadFlag }} />
            <PerformanceCard {...{ stopLoading, startLoading, reloadFlag }} />
            <LastEntriesTable {...{ stopLoading, startLoading, reloadFlag }} />
            <BestRatingsTable {...{ startLoading, stopLoading, reloadFlag }} />
        </div>
        <div className="grid grid-cols-[720px_1fr] grid-rows-[repeat(2,360px)] gap-4">
            <WeightHistChart {...{ startLoading, stopLoading, reloadFlag }} />
            <LastGroupsTable {...{ startLoading, stopLoading, reloadFlag }} />
            <RateHistChart {...{ startLoading, stopLoading, reloadFlag }} />
        </div>
    </DashboardInfoContainer>
}

const WeightCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const [data, setData] = useState<CardEntry>(DefaultCard)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getLastAverageWeight()
            .then(results => setData(results))
            .catch(() => setData(DefaultCard))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Peso Vivo Médio"
            loading={loading}
            data={decimalTransform(data.current)}
            trendProps={{ trend: data.trend }}
            chart={(
                <SparkLineChart
                    data={data.hist.map(item => item.value)}
                    valueFormatter={value => transformWeight(value)}
                    showTooltip
                    showHighlight
                    height={90}
                    xAxis={{
                        data: data.hist.map(item => new Date(item.date)),
                        valueFormatter: (value: Date) => dateTransform(value)
                    }}
                />
            )}
        />
    </DashboardCard>
}

const DeadWeightCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const [data, setData] = useState<CardEntry>(DefaultCard)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getLastDeadWeight()
            .then(results => setData(results))
            .catch(() => setData(DefaultCard))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Peso de Abate Médio"
            loading={loading}
            data={decimalTransform(data.current)}
            trendProps={{ trend: data.trend }}
            chart={(
                <SparkLineChart
                    data={data.hist.map(item => item.value)}
                    valueFormatter={value => transformWeight(value)}
                    color={yellow[800]}
                    height={90}
                    showTooltip
                    showHighlight
                    xAxis={{
                        data: data.hist.map(item => new Date(item.date)),
                        valueFormatter: (value: Date) => dateTransform(value)
                    }}
                />
            )}
        />
    </DashboardCard>
}

const PerformanceCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const [data, setData] = useState<CardEntry>(DefaultCard)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getLastPerformance()
            .then(results => setData(results))
            .catch(() => setData(DefaultCard))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Rendimento Médio"
            loading={loading}
            data={toPercentage(data.current)}
            trendProps={{ trend: data.trend }}
            chart={(
                <SparkLineChart
                    data={data.hist.map(item => item.value)}
                    valueFormatter={value => transformWeight(value)}
                    height={90}
                    showTooltip
                    showHighlight
                    color={green[800]}
                    xAxis={{
                        data: data.hist.map(item => new Date(item.date)),
                        valueFormatter: (value: Date) => value.toLocaleDateString("pt-BR", { dateStyle: 'short' })
                    }}
                />
            )}
        />
    </DashboardCard>
}

const LastEntriesTable = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const [results, setResults] = useState<Slaughter[]>([])
    const [entryDate, setEntryDate] = useState<Date>()
    const [lastDate, setLastDate] = useState<string>("Sem Data")
    const [butcher, setButcher] = useState<string>("")
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState<APIError>()
    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true)
        startLoading()
        getLastSlaughter()
            .then((results: Slaughter[]) => {
                const entries = results
                const entryDate = new Date(entries[0].entryDate)
                const butcherName = entries[0].butcher.name
                setEntryDate(entryDate)
                setButcher(butcherName)
                setLastDate(dateTransform(entryDate))
                setResults(entries)
            })
            .catch(() => {
                setResults([])
                setEntryDate(undefined)
                setLastDate("Sem Data")
                setButcher("")
            })
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [startLoading, stopLoading, reloadFlag])

    return <DashboardCard className="row-span-2">
        <CardDefaultTitle text={`Último Abate - ${lastDate} (Frig.: ${butcher})`} />
        <div className="overflow-auto">
            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Animal</TableCell>
                        <TableCell>Peso</TableCell>
                        <TableCell>Peso (c/ Desconto)</TableCell>
                        <TableCell>Peso Morto</TableCell>
                        <TableCell>Rendimento</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <DashboardTableBody
                        colSpan={6}
                        loading={loading}
                        dataset={results}
                        render={row => <LastEntriesRow {...{ row, setError }} />}
                    />
                </TableBody>
            </Table>
            <ErrorDialog
                openError={!!error}
                title={error?.title}
                message={error?.message}
                onClose={() => setError(undefined)}
            />
        </div>
        <Button
            className="ml-auto"
            endIcon={<ChevronRight />}
            onClick={() => {
                if (!entryDate) return
                const dateStr = dateToISO(entryDate)
                navigate(`groups/${dateStr}`)
            }}
        >
            Ver Mais...
        </Button>
    </DashboardCard>
}

type LastEntriesRowProps = {
    row: Slaughter
    setError: Dispatch<SetStateAction<APIError | undefined>>
}

const LastEntriesRow = ({ row, setError }: LastEntriesRowProps) => {

    const [editing, setEditing] = useState(false)
    const [rowData, setRowData] = useState(row)
    const [loading, setLoading] = useState(false)

    const { setReloadFlag } = useContext(DashboardContext)

    useEffect(() => setRowData(row), [row])

    const onDelete = useCallback(() => {
        setLoading(true)
        deleteSlaughter(rowData.id)
            .then(() => {
                setError(undefined)
                setReloadFlag(prev => prev + 1)
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }, [])

    if (editing) return <EditingLastEntriesRow {...{ setEditing, setRowData, rowData, setError }} />

    return <TableRow>
        <TableCell>
            <EditControlButtons {...{ setEditing, onDelete, loading }} />
        </TableCell>
        <TableCell>{getAnimalBirthLabel(rowData.animal)}</TableCell>
        <TableCell> {transformWeight(rowData.weight)} </TableCell>
        <TableCell> {transformWeight(rowData.discountWeight)} </TableCell>
        <TableCell> {transformWeight(rowData.deadWeight)} </TableCell>
        <TableCell>{toPercentage(rowData.performanceRate)}</TableCell>
    </TableRow>
}

type EditingLastEntriesRowProps = {
    setEditing: Dispatch<SetStateAction<boolean>>
    setError: Dispatch<SetStateAction<APIError | undefined>>
    rowData: Slaughter
    setRowData: Dispatch<SetStateAction<Slaughter>>
}

const EditingLastEntriesRow = ({ setEditing, rowData, setRowData, setError }: EditingLastEntriesRowProps) => {

    const [loading, setLoading] = useState(false)

    const { handleSubmit, control } = useForm<SlaughterSave>({
        defaultValues: {
            ...rowData,
            animalId: rowData.animal?.id,
            butcherId: rowData.butcher.id,
        }
    })

    const onSubmit: SubmitHandler<SlaughterSave> = (data: SlaughterSave) => {
        setLoading(true)
        updateSlaughter(data)
            .then(response => {
                setRowData(response)
                setEditing(false)
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }

    const onSave = handleSubmit(onSubmit)

    return <TableRow>
        <TableCell>
            <EditingControlButtons {...{ setEditing, onSave, loading }} />
        </TableCell>
        <TableCell>{getAnimalBirthLabel(rowData.animal)}</TableCell>
        <TableCell>
            <FormTextField
                formProps={{ control, name: 'weight' }}
                type="number"
            />
        </TableCell>
        <TableCell> {transformWeight(rowData.discountWeight)} </TableCell>
        <TableCell>
            <FormTextField
                formProps={{ control, name: 'deadWeight' }}
                type="number"
            />
        </TableCell>
        <TableCell>{toPercentage(rowData.performanceRate)}</TableCell>
    </TableRow>

}

const BestRatingsTable = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const [rows, setRows] = useState<TableRatings[]>([])
    const [loading, setLoading] = useState(false)
    const [rateType, setRateType] = useState('best-fathers')

    const rateItems: ComboBoxItem[] = [
        { name: "Os Melhores Pais", value: "best-fathers" },
        { name: "As Melhores Mães", value: "best-mothers" },
        { name: "Os Melhores Frigoríficos", value: "best-slaughterhouses" },
    ]

    useEffect(() => {
        startLoading()
        setLoading(true)
        getBestRatings(rateType)
            .then(results => setRows(results))
            .catch(() => setRows([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [startLoading, stopLoading, reloadFlag, rateType])

    return <DashboardCard className="col-span-3">
        <ComboBox
            className="w-[300px]"
            variant="standard"
            value={rateType}
            items={rateItems}
            onChange={(value) => setRateType(value || 'best-fathers')}
        />
        <div className="overflow-auto">
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Nome</TableCell>
                        <TableCell align="center">
                            {rateType === "best-slaughterhouses" ? 'Nº de Animais' : 'Nº de Filhos'}
                        </TableCell>
                        <TableCell>Peso Médio</TableCell>
                        <TableCell>Rend. Médio</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <DashboardTableBody
                        dataset={rows}
                        colSpan={4}
                        loading={loading}
                        render={item => (
                            <TableRow>
                                <TableCell>{item.name}</TableCell>
                                <TableCell align="center">{item.animalsNumber}</TableCell>
                                <TableCell>
                                    <TrendValues
                                        value={decimalTransform(item.averageWeight)}
                                        trendProps={{ trend: item.weightComparison }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TrendValues
                                        value={toPercentage(item.performanceRate)}
                                        trendProps={{ trend: item.rateComparison }}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    />
                </TableBody>
            </Table>
        </div>
    </DashboardCard >
}


const LastGroupsTable = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const [results, setResults] = useState<SlaughterGroup[]>([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true)
        startLoading()
        getLastGroups()
            .then(results => setResults(results))
            .catch(() => setResults([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [startLoading, stopLoading, reloadFlag])

    return <DashboardCard className="row-span-2">
        <CardDefaultTitle text="Os Últimos Abates" />
        <div className="overflow-auto">
            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Data</TableCell>
                        <TableCell>Frigorífico</TableCell>
                        <TableCell>Nº de Animais</TableCell>
                        <TableCell align="center">Peso de Abate Médio</TableCell>
                        <TableCell align="center">Rend. Médio</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <DashboardTableBody
                        colSpan={6}
                        loading={loading}
                        dataset={results}
                        render={row => (
                            <TableRow>
                                <TableCell>
                                    <EditControlButtons
                                        onShow={() => {
                                            const entryDate = new Date(row.entryDate)
                                            const dateStr = dateToISO(entryDate)
                                            navigate(`groups/${dateStr}`)
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{dateTransform(row.entryDate)}</TableCell>
                                <TableCell>{row.butcher.name}</TableCell>
                                <TableCell>{row.animalsNumber}</TableCell>
                                <TableCell>
                                    <TrendValues
                                        value={decimalTransform(row.averageWeight)}
                                        trendProps={{ trend: row.weightVariation }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TrendValues
                                        value={toPercentage(row.averageRate)}
                                        trendProps={{ trend: row.rateVariation }}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    />
                </TableBody>
            </Table>
        </div>
        <div className="flex flex-row-reverse">
            <Button
                endIcon={<ChevronRight />}
                onClick={() => navigate("groups")}
            >
                Ver Mais...
            </Button>
        </div>
    </DashboardCard>
}

const WeightHistChart = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const [dataset, setDataset] = useState<WeightHist[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getWeightHist()
            .then(results => setDataset(results))
            .catch(() => setDataset([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [startLoading, stopLoading, reloadFlag])

    return <DashboardCard>
        <CardDefaultTitle text="Histórico de Peso" />
        <LineChart
            loading={loading}
            localeText={{
                loading: LOADING_MSG,
                noData: NO_DATA_AVAILABLE
            }}
            series={[
                {
                    id: "weight",
                    label: "Peso",
                    showMark: false,
                    data: dataset.map(item => item.weight),
                    valueFormatter: (value) => transformWeight(value || 0),
                    curve: 'linear',
                },
                {
                    id: "deadWeight",
                    label: "Peso de Abate",
                    showMark: false,
                    data: dataset.map(item => item.deadWeight),
                    valueFormatter: (value) => transformWeight(value || 0),
                    curve: 'linear',
                },
            ]}
            xAxis={[{
                domainLimit: 'strict',
                data: dataset.map(item => new Date(item.entryDate)),
                scaleType: 'time',
                valueFormatter: (value: Date) => value.toLocaleString('pt-BR', {
                    month: 'short',
                    year: 'numeric'
                })
            }]}
        />
    </DashboardCard>
}

const RateHistChart = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const [dataset, setDataset] = useState<GraphData[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getRateHist()
            .then(results => setDataset(results))
            .catch(() => setDataset([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [startLoading, stopLoading, reloadFlag])

    return <DashboardCard>
        <CardDefaultTitle text="Histórico de Rendimento" />
        <LineChart
            loading={loading}
            localeText={{
                loading: LOADING_MSG,
                noData: NO_DATA_AVAILABLE
            }}
            series={[
                {
                    id: "rate",
                    label: "Rend. Médio",
                    showMark: false,
                    color: green[800],
                    area: true,
                    data: dataset.map(item => item.value),
                    valueFormatter: (value) => toPercentage(value),
                    curve: 'linear',
                },
            ]}
            yAxis={[{
                min: 0,
                max: 1,
                scaleType: 'linear',
                valueFormatter: (value) => toPercentage(value)
            }]}
            xAxis={[{
                domainLimit: 'strict',
                data: dataset.map(item => new Date(item.date)),
                scaleType: 'time',
                valueFormatter: (value: Date) => dateTransform(value, { month: 'short', year: 'numeric' })
            }]}
        />
    </DashboardCard>
}
