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
import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from "react"
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
import { Button, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import { TrendValues } from "@shared/table/TableComponents"
import { dateTransform, decimalTransform, positiveTransform } from "@utils/Transformations"
import { DashboardInformationProps, DashboardTopBarProps } from "@shared/dashboard/Entities"
import { ReloadButton } from "@shared/table/TableTopBarComponents"
import { LineChart, SparkLineChart } from "@mui/x-charts"
import { ComboBox, ComboBoxItem } from "@shared/common/ComboBox"
import { yellow } from "@mui/material/colors"
import { LOADING_MSG, NO_DATA_AVAILABLE } from "@shared/Globals"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@shared/form-controls/FormTextField"
import ChevronRight from "@mui/icons-material/ChevronRight"
import { PageContext } from "@shared/main-page/PageContext"
import { WeightEntriesPage, WeightGroupsPage, WeightMainPage } from "./WeightPages"
import { PageProps } from "@shared/main-page/PageDisplay"
import { WeightGroupEntriesTable } from "./WeightGroupEntriesTable"
import { HomePage } from "../home/HomePage"

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

    const { setPageProps } = useContext(PageContext)

    return <DashboardTopContainer>
        <ReloadButton
            onReload={() => setReloadFlag(prev => prev + 1)}
            loading={activeRequests > 0}
        />
        <Button
            className="ml-auto"
            startIcon={<ChevronRight />}
            onClick={() => setPageProps && setPageProps(WeightEntriesPage)}
        >
            Marcações de Peso
        </Button>
    </DashboardTopContainer>
}

const DashboardInfo = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {
    return <DashboardInfoContainer className="flex flex-col gap-4">
        <div className="grid gap-4 grid-cols-[420_420_1fr] grid-rows-[180_400]">
            <LastWeightCard {...{ startLoading, stopLoading, reloadFlag }} />
            <LastGainCard {...{ startLoading, stopLoading, reloadFlag }} />
            <BestAnimalsTable {...{ startLoading, stopLoading, reloadFlag }} />
            <LastEntriesTable {...{ startLoading, stopLoading, reloadFlag }} />
        </div>
        <div className="grid grid-cols-[800_1fr] gap-4">
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
            .then(response => setData(response.json))
            .catch(() => setData(defaultValue))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [startLoading, stopLoading, reloadFlag, defaultValue])

    return <DashboardCard>
        <CardChartContent
            title="Peso Médio (Kg)"
            data={`${decimalTransform(data.current)} (${decimalTransform(data.current / 15)}@)`}
            trendProps={{ trend: data.trend }}
            loading={loading}
            chart={(
                <SparkLineChart
                    data={data.hist.map(item => item.averageWeight)}
                    height={80}
                    valueFormatter={(value) => `${decimalTransform(value || 0)} (${decimalTransform((value || 0) / 15)}@)`}
                    color={yellow[800]}
                    area
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
            .then(response => setData(response.json))
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
                    height={80}
                    valueFormatter={(value) => decimalTransform(value || 0)}
                    showTooltip
                    showHighlight
                    area
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
            .then(results => setRows(results.json))
            .catch(() => setRows([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [startLoading, stopLoading, reloadFlag, rateType])

    return <DashboardCard className="row-span-2">
        <ComboBox
            className="w-[300]"
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
                    loadingProps={{ loading, rowSpan: 10 }}
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
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getLastEntries()
            .then(results => {
                const json: WeightEntry[] = results.json
                const entryDate = new Date(json[0].entryDate)
                setLastDate(dateTransform(entryDate))
                setResults(json)
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

    return <DashboardCard className="col-span-2">
        <CardDefaultTitle text={`Última Marcação de Peso - ${lastDate}`} />
        <div className="overflow-auto">
            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Animal</TableCell>
                        <TableCell>Peso</TableCell>
                        <TableCell align="center">Ganho de Peso (Kg/dia)</TableCell>
                        <TableCell>Variação de Peso</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <DashboardTableBody
                        colSpan={5}
                        loadingProps={{ loading: loading, rowSpan: 10 }}
                        dataset={results}
                        render={row => <LastEntriesRow {...{ row }} />}
                    />
                </TableBody>
            </Table>
        </div>
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
        <TableCell>{
            `${decimalTransform(data.weight)} (${decimalTransform(data.weight / 15)}@)`
        }</TableCell>
        <TableCell align="center">{decimalTransform(data.weightGain)}</TableCell>
        <TableCell>
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
            .then(results => setDataset(results.json))
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

    const { setPageProps } = useContext(PageContext)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getLastGroups()
            .then(results => setResults(results.json))
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
                    <TableCell>Nº de Animais</TableCell>
                    <TableCell align="center">Peso</TableCell>
                    <TableCell align="center">Ganho de Peso (Kg/dia)</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <DashboardTableBody
                    colSpan={5}
                    loadingProps={{ loading, rowSpan: 5 }}
                    dataset={results}
                    render={row => (
                        <TableRow>
                            <TableCell>
                                <EditControlButtons
                                    onShow={() => {
                                        const entryDate = new Date(row.entryDate)
                                        const dateStr = entryDate.toLocaleDateString("pt-BR", { dateStyle: 'short' })
                                        const newPage: PageProps = {
                                            title: `Peso - ${dateStr}`,
                                            page: <WeightGroupEntriesTable {...{entryDate}} />,
                                            previousPages: [HomePage, WeightMainPage]
                                        }
                                        if (setPageProps) setPageProps(newPage)
                                    }}
                                />
                            </TableCell>
                            <TableCell>{dateTransform(row.entryDate)}</TableCell>
                            <TableCell>{row.animalsNumber}</TableCell>
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
                onClick={() => setPageProps && setPageProps(WeightGroupsPage)}
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
            .then(results => setDataset(results.json))
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
