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
import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import {
    AnimalRating,
    AverageWeight,
    AverageWeightGain,
    CardWeight,
    CardWeightGain,
    WeightEntry,
    WeightGroup
} from "./Entities"
import {
    getAnimalsRating,
    getGainHist,
    getLastEntries,
    getLastGroups,
    getLastWeight,
    getLastWeightGain,
    getWeightHist
} from "./Controller"
import Table from "@mui/material/Table"
import { Button, Divider, ListItemIcon, Menu, MenuItem, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import { TrendValues } from "@shared/table/TableComponents"
import { dateTransform, decimalTransform, positiveTransform, transformWeight } from "@utils/Transformations"
import { DashboardInformationProps, DashboardTopBarProps, OptionMenuProps } from "@shared/dashboard/Entities"
import { ReloadButton } from "@shared/table/TableTopBarComponents"
import { LineChart, SparkLineChart } from "@mui/x-charts"
import { ComboBox, ComboBoxItem } from "@shared/common/ComboBox"
import { yellow } from "@mui/material/colors"
import { LOADING_MSG, NO_DATA_AVAILABLE } from "@shared/Globals"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@shared/form-controls/FormTextField"
import ChevronRight from "@mui/icons-material/ChevronRight"
import { useNavigate } from "react-router"
import Add from "@mui/icons-material/Add"
import { AddWeightDialog } from "./AddWeightDialog"
import ExpandMore from "@mui/icons-material/ExpandMore"

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

    const [openMenu, setOpenMenu] = useState(false)

    const menuAnchorEl = useRef<HTMLButtonElement>(null)
    const closeMenu = () => setOpenMenu(false)

    return <DashboardTopContainer>
        <ReloadButton
            onReload={() => setReloadFlag(prev => prev + 1)}
            loading={activeRequests > 0}
        />
        <Button
            ref={menuAnchorEl}
            className="ml-auto"
            endIcon={<ExpandMore />}
            onClick={() => setOpenMenu(true)}
        >
            Opções
        </Button>
        <OptionsMenu {...{ openMenu, menuAnchorEl, setReloadFlag, closeMenu }} />
    </DashboardTopContainer>
}

const OptionsMenu = ({ openMenu, menuAnchorEl, closeMenu, setReloadFlag }: OptionMenuProps) => {

    const [addWeightOpen, setAddWeightOpen] = useState(false)
    const navigate = useNavigate()

    const closeAddWeight = (added?: boolean) => {
        if (added) setReloadFlag(prev => prev + 1)
        setAddWeightOpen(false)
    }

    return <>
        <Menu
            open={openMenu}
            anchorEl={menuAnchorEl.current}
            onClose={closeMenu}
        >
            <MenuItem onClick={() => setAddWeightOpen(true)} >
                <ListItemIcon>
                    <Add />
                </ListItemIcon>
                Adicionar Pesagem
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
                Datas de Pesagem
            </MenuItem>
        </Menu>
        <AddWeightDialog {...{ addWeightOpen, closeAddWeight }} />
    </>
}


const DashboardInfo = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {
    return <DashboardInfoContainer className="flex flex-col gap-4">
        <div className="grid gap-4 grid-cols-[repeat(2,350px)_1fr] grid-rows-[180px_400px]">
            <LastWeightCard {...{ startLoading, stopLoading, reloadFlag }} />
            <LastGainCard {...{ startLoading, stopLoading, reloadFlag }} />
            <LastEntriesTable {...{ startLoading, stopLoading, reloadFlag }} />
            <BestAnimalsTable {...{ startLoading, stopLoading, reloadFlag }} />
        </div>
        <div className="grid grid-cols-[800px_1fr] gap-4">
            <GainHistChart {...{ startLoading, stopLoading, reloadFlag }} />
            <LastGroupsTable {...{ startLoading, stopLoading, reloadFlag }} />
            <WeightHistChart {...{ startLoading, stopLoading, reloadFlag }} />
        </div>
    </DashboardInfoContainer>
}

const LastWeightCard = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultValue: CardWeight = useMemo(() => ({
        trend: 0,
        current: 0,
        hist: []
    }), [])

    const [data, setData] = useState<CardWeight>(defaultValue)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getLastWeight()
            .then(response => setData(response))
            .catch(() => setData(defaultValue))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [startLoading, stopLoading, reloadFlag, defaultValue])

    return <DashboardCard>
        <CardChartContent
            title="Peso Médio (Kg)"
            data={transformWeight(data.current)}
            trendProps={{ trend: data.trend }}
            loading={loading}
            chart={(
                <SparkLineChart
                    data={data.hist.map(item => item.averageWeight)}
                    height={90}
                    valueFormatter={(value) => transformWeight(value)}
                    color={yellow[800]}
                    showTooltip
                    showHighlight
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

    const defaultValue: CardWeightGain = useMemo(() => ({
        trend: 0,
        current: 0,
        hist: []
    }), [])

    const [data, setData] = useState<CardWeightGain>(defaultValue)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getLastWeightGain()
            .then(response => setData(response))
            .catch(() => setData(defaultValue))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [startLoading, stopLoading, reloadFlag, defaultValue])

    return <DashboardCard>
        <CardChartContent
            title="Ganho de Peso Diário (Kg/Dia)"
            data={decimalTransform(data.current)}
            trendProps={{ trend: data.trend }}
            loading={loading}
            chart={(
                <SparkLineChart
                    data={data.hist.map(item => item.averageGain)}
                    height={90}
                    valueFormatter={(value) => decimalTransform(value || 0)}
                    showTooltip
                    showHighlight
                    xAxis={{
                        data: data.hist.map(item => new Date(item.entryDate)),
                        valueFormatter: (value: Date) => dateTransform(value)
                    }}
                />
            )}
        />
    </DashboardCard>
}

const BestAnimalsTable = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const [rows, setRows] = useState<AnimalRating[]>([])
    const [loading, setLoading] = useState(false)
    const [rateType, setRateType] = useState('best-fathers')

    const rateItems: ComboBoxItem[] = [
        { name: "Os Melhores Pais", value: "best-fathers" },
        { name: "As Melhores Mães", value: "best-mothers" },
    ]

    useEffect(() => {
        startLoading()
        setLoading(true)
        getAnimalsRating(rateType)
            .then(results => setRows(results))
            .catch(() => setRows([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [startLoading, stopLoading, reloadFlag, rateType])

    return <DashboardCard className="col-span-2">
        <ComboBox
            className="w-[300px]"
            variant="standard"
            size="small"
            value={rateType}
            items={rateItems}
            onChange={(value) => setRateType(value || 'best-fathers')}
        />
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell align="center">Nº de Crias</TableCell>
                    <TableCell>Ganho de Peso Diário Médio (kg/Dia)</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <DashboardTableBody
                    dataset={rows}
                    colSpan={3}
                    loading={loading}
                    render={item => (
                        <TableRow>
                            <TableCell>{item.animalName}</TableCell>
                            <TableCell align="center">{item.childrenNumber}</TableCell>
                            <TableCell>
                                <TrendValues
                                    value={decimalTransform(item.averageGain)}
                                    trendProps={{ trend: item.gainTrend }}
                                />
                            </TableCell>
                        </TableRow>
                    )}
                />
            </TableBody>
        </Table>
    </DashboardCard>
}

const LastEntriesTable = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const [results, setResults] = useState<WeightEntry[]>([])
    const [lastDate, setLastDate] = useState<string>("Sem Data")
    const [entryDate, setEntryDate] = useState<Date>()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true)
        startLoading()
        getLastEntries()
            .then(results => {
                const entryDate = new Date(results[0].entryDate)
                setLastDate(dateTransform(entryDate))
                setEntryDate(entryDate)
                setResults(results)
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

    return <DashboardCard className="row-span-2">
        <CardDefaultTitle text={`Última Marcação de Peso - ${lastDate}`} />
        <div className="overflow-auto">
            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Animal</TableCell>
                        <TableCell align="center">Peso</TableCell>
                        <TableCell align="center">Ganho de Peso (Kg/dia)</TableCell>
                        <TableCell align="center">Variação de Peso</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <DashboardTableBody
                        colSpan={5}
                        loading={loading}
                        dataset={results}
                        render={row => <LastEntriesRow {...{ row }} />}
                    />
                </TableBody>
            </Table>
        </div>
        <Button
            className="ml-auto"
            endIcon={<ChevronRight />}
            onClick={() => {
                if (!entryDate) return
                const dateStr = entryDate.toISOString().split('T')[0]
                navigate(`groups/${dateStr}`)
            }}
        >
            Ver Mais...
        </Button>
    </DashboardCard>
}

type LastEntriesRowProps = {
    row: WeightEntry
}

const LastEntriesRow = ({ row }: LastEntriesRowProps) => {

    const [editing, setEditing] = useState(false)
    const [data, setData] = useState(row)

    useEffect(() => setData(row), [row])

    const onDelete = useCallback(() => console.log(data.id), [data.id])

    if (editing) return <EditingLastEntriesRow {...{ setEditing, setData, data }} />

    return <TableRow>
        <TableCell>
            <EditControlButtons {...{ setEditing, onDelete }} />
        </TableCell>
        <TableCell>{data.animalInfo}</TableCell>
        <TableCell align="center">{transformWeight(data.weight)}</TableCell>
        <TableCell align="center">{decimalTransform(data.weightGain)}</TableCell>
        <TableCell align="center">
            <TrendComponent
                trend={data.weightVariation}
                text={positiveTransform(data.weightVariation)}
            />
        </TableCell>
    </TableRow>
}

type EditingLastEntriesRowProps = {
    setEditing: Dispatch<SetStateAction<boolean>>
    setData: Dispatch<SetStateAction<WeightEntry>>
    data: WeightEntry
}

const EditingLastEntriesRow = ({ setEditing, data, setData }: EditingLastEntriesRowProps) => {

    const { handleSubmit, control } = useForm<WeightEntry>({
        defaultValues: data
    })

    const onSubmit: SubmitHandler<WeightEntry> = (newData: WeightEntry) => {
        setData(newData)
        setEditing(false)
    }

    const onSave = handleSubmit(onSubmit)

    return <TableRow>
        <TableCell>
            <EditingControlButtons {...{ setEditing, onSave }} />
        </TableCell>
        <TableCell>{data.animalInfo}</TableCell>
        <TableCell>
            <FormTextField
                formProps={{
                    control,
                    name: 'weight'
                }}
                type="number"
            />
        </TableCell>
        <TableCell align="center">{decimalTransform(data.weightGain)}</TableCell>
        <TableCell>
            <TrendComponent
                trend={data.weightVariation}
                text={positiveTransform(data.weightVariation)}
            />
        </TableCell>
    </TableRow>

}

const GainHistChart = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const [dataset, setDataset] = useState<AverageWeightGain[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getGainHist()
            .then(results => setDataset(results))
            .catch(() => setDataset([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [startLoading, stopLoading, reloadFlag])

    return <DashboardCard>
        <CardDefaultTitle text="Histórico de Ganho de Peso" />
        <LineChart
            height={250}
            loading={loading}
            localeText={{
                loading: LOADING_MSG,
                noData: NO_DATA_AVAILABLE
            }}
            series={[{
                id: "gain",
                data: dataset.map(item => item.averageGain),
                valueFormatter: (value) => decimalTransform(value || 0),
                label: "Ganho de Peso Médio (Kg/dia)",
                curve: "linear",
                showMark: false,
                area: true,
            }]}
            xAxis={[{
                id: "dateAxis",
                data: dataset.map(item => new Date(item.entryDate)),
                label: "Data",
                scaleType: 'time',
                domainLimit: 'strict',
                valueFormatter: (value: Date) => value.toLocaleString("pt-BR", {
                    month: 'short',
                    year: 'numeric'
                })
            }]}
        />
    </DashboardCard>
}

const LastGroupsTable = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const [results, setResults] = useState<WeightGroup[]>([])
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
        <CardDefaultTitle text="As Últimas Marcações" />
        <Table stickyHeader size="small">
            <TableHead>
                <TableRow>
                    <TableCell />
                    <TableCell>Data</TableCell>
                    <TableCell align="center">Nº de Animais</TableCell>
                    <TableCell>Peso</TableCell>
                    <TableCell>Ganho de Peso (Kg/dia)</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <DashboardTableBody
                    colSpan={5}
                    loading={loading}
                    dataset={results}
                    render={row => (
                        <TableRow>
                            <TableCell>
                                <EditControlButtons
                                    onShow={() => {
                                        const entryDate = new Date(row.entryDate)
                                        const dateStr = entryDate.toISOString().split('T')[0]
                                        navigate(`groups/${dateStr}`)
                                    }}
                                />
                            </TableCell>
                            <TableCell>{dateTransform(row.entryDate)}</TableCell>
                            <TableCell align="center">{row.animalsNumber}</TableCell>
                            <TableCell>
                                <TrendValues
                                    value={decimalTransform(row.averageWeight)}
                                    trendProps={{ trend: row.weightVariation }}
                                />
                            </TableCell>
                            <TableCell>
                                <TrendValues
                                    value={decimalTransform(row.averageGain)}
                                    trendProps={{ trend: row.gainVariation }}
                                />
                            </TableCell>
                        </TableRow>
                    )}
                />
            </TableBody>
        </Table>
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

    const [dataset, setDataset] = useState<AverageWeight[]>([])
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
            height={250}
            loading={loading}
            localeText={{
                loading: LOADING_MSG,
                noData: NO_DATA_AVAILABLE
            }}
            series={[{
                id: "weight",
                data: dataset.map(item => item.averageWeight),
                valueFormatter: (value) => `${decimalTransform(value || 0)} (${decimalTransform((value || 0) / 15)}@)`,
                label: "Peso Médio",
                color: yellow[800],
                curve: 'linear',
                showMark: false,
                area: true,
            }]}
            xAxis={[{
                id: "dateAxis",
                data: dataset.map(item => new Date(item.entryDate)),
                label: "Data",
                domainLimit: 'strict',
                scaleType: 'time',
                valueFormatter: (value: Date) => value.toLocaleString("pt-BR", {
                    month: 'short',
                    year: 'numeric'
                })
            }]}
        />
    </DashboardCard>
}
