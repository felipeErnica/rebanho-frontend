import {
    CardChartContent,
    CardDefaultTitle,
    DashboardCard,
    DashboardContainer,
    DashboardInfoContainer,
    DashboardTableBody,
    DashboardTopContainer,
} from "@/ui/shared/dashboard/DashboardComponents"
import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react"
import { DashboardInformationProps, DashboardTopBarProps } from "@/ui/shared/dashboard/Entities"
import { ReloadButton } from "@/ui/shared/table/TableTopBarComponents"
import {
    PerformanceRateCard,
    RateHist,
    SlaughterEntry,
    SlaughterGroup,
    TableRatings,
    WeightCardEntry,
    WeightHist
} from "./Entities"
import {
    getBestRatings,
    getLastAverageWeight,
    getLastDeadWeight,
    getLastEntries,
    getLastGroups,
    getLastPerformance,
    getRateHist,
    getWeightHist
} from "./Controller"
import { dateTransform, decimalTransform, percentageTransform } from "@/util/Transformations"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { TrendValues } from "@/ui/shared/table/TableComponents"
import Button from "@mui/material/Button"
import ChevronRight from "@mui/icons-material/ChevronRight"
import { ComboBox, ComboBoxItem } from "@/ui/shared/common/ComboBox"
import { LineChart } from "@mui/x-charts/LineChart"
import { LOADING_MSG, NO_DATA_AVAILABLE } from "@/ui/shared/Globals"
import { SparkLineChart } from "@mui/x-charts/SparkLineChart"
import { green, yellow } from "@mui/material/colors"
import { PageContext } from "@/ui/shared/main-page/PageContext"
import { SlaughterEntriesPage } from "./SlaughterPages"

export const SlaughterDashboard = () => {

    const [activeRequests, setActiveRequests] = useState(0)
    const [reloadFlag, setReloadFlag] = useState(0)

    const startLoading = useCallback(() => setActiveRequests(prev => prev + 1), [])
    const stopLoading = useCallback(() => setActiveRequests(prev => Math.max(prev - 1, 0)), [])

    return <DashboardContainer>
        <DashboardToolbar {...{ setReloadFlag, activeRequests }} />
        <DashboardInfo {...{ startLoading, stopLoading, reloadFlag }} />
    </DashboardContainer>
}

const DashboardToolbar = ({ setReloadFlag, activeRequests }: DashboardTopBarProps) => {

    const { setPageProps } = useContext(PageContext)

    return <DashboardTopContainer>
        <ReloadButton
            onReload={() => setReloadFlag(prev => prev + 1)}
            loading={activeRequests > 0}
        />
        <Button
            endIcon={<ChevronRight />}
            onClick={() => setPageProps && setPageProps(SlaughterEntriesPage)}
        >
            Marcações de Abate
        </Button>
    </DashboardTopContainer>
}

const DashboardInfo = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {
    return <DashboardInfoContainer className="flex flex-col gap-4">
        <div className="grid grid-cols-[280_280_280_1fr] grid-rows-[180_400] gap-4">
            <WeightCard {...{ reloadFlag, startLoading, stopLoading }} />
            <DeadWeightCard {...{ startLoading, stopLoading, reloadFlag }} />
            <PerformanceCard {...{ stopLoading, startLoading, reloadFlag }} />
            <BestRatingsTable {...{ startLoading, stopLoading, reloadFlag }} />
            <LastEntriesTable {...{ stopLoading, startLoading, reloadFlag }} />
        </div>
        <div className="grid grid-cols-[720_1fr] grid-rows-[360_360] gap-4">
            <WeightHistChart {...{ startLoading, stopLoading, reloadFlag }} />
            <LastGroupsTable {...{ startLoading, stopLoading, reloadFlag }} />
            <RateHistChart {...{ startLoading, stopLoading, reloadFlag }} />
        </div>
    </DashboardInfoContainer>
}

const WeightCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultValues: WeightCardEntry = {
        trend: 0,
        current: 0,
        hist: []
    }

    const [data, setData] = useState<WeightCardEntry>(defaultValues)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getLastAverageWeight()
            .then(results => setData(results.json))
            .catch(() => setData(defaultValues))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag])

    return <DashboardCard>
        <CardChartContent
            title="Peso Vivo Médio"
            loading={loading}
            data={decimalTransform(data.current)}
            trendProps={{ trend: data.trend }}
            chart={(
                <SparkLineChart
                    data={data.hist.map(item => item.averageWeight)}
                    valueFormatter={value => `${decimalTransform(value)} (${decimalTransform((value || 0) / 15)}@)`}
                    showTooltip
                    height={50}
                    xAxis={{
                        data: data.hist.map(item => new Date(item.entryDate)),
                        scaleType: 'time',
                        valueFormatter: (value: Date) => value.toLocaleDateString("pt-BR", { dateStyle: 'short' })
                    }}
                />
            )}
        />
    </DashboardCard>
}

const DeadWeightCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultValues: WeightCardEntry = {
        trend: 0,
        current: 0,
        hist: []
    }

    const [data, setData] = useState<WeightCardEntry>(defaultValues)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getLastDeadWeight()
            .then(results => setData(results.json))
            .catch(() => setData(defaultValues))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag])

    return <DashboardCard>
        <CardChartContent
            title="Peso de Abate Médio"
            loading={loading}
            data={decimalTransform(data.current)}
            trendProps={{ trend: data.trend }}
            chart={(
                <SparkLineChart
                    data={data.hist.map(item => item.averageWeight)}
                    valueFormatter={value => `${decimalTransform(value)} (${decimalTransform((value || 0) / 15)}@)`}
                    color={yellow[600]}
                    showTooltip
                    height={50}
                    xAxis={{
                        data: data.hist.map(item => new Date(item.entryDate)),
                        scaleType: 'time',
                        valueFormatter: (value: Date) => value.toLocaleDateString("pt-BR", { dateStyle: 'short' })
                    }}
                />
            )}
        />
    </DashboardCard>
}

const PerformanceCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultValues: PerformanceRateCard = {
        trend: 0,
        current: 0,
        hist: []
    }

    const [data, setData] = useState<PerformanceRateCard>(defaultValues)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getLastPerformance()
            .then(results => setData(results.json))
            .catch(() => setData(defaultValues))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag])

    return <DashboardCard>
        <CardChartContent
            title="Rendimento Médio"
            loading={loading}
            data={percentageTransform(data.current)}
            trendProps={{ trend: data.trend }}
            chart={(
                <SparkLineChart
                    data={data.hist.map(item => item.performanceRate)}
                    valueFormatter={value => `${decimalTransform(value)} (${decimalTransform((value || 0) / 15)}@)`}
                    showTooltip
                    color={green[600]}
                    height={50}
                    xAxis={{
                        data: data.hist.map(item => new Date(item.entryDate)),
                        scaleType: 'time',
                        valueFormatter: (value: Date) => value.toLocaleDateString("pt-BR", { dateStyle: 'short' })
                    }}
                />
            )}
        />
    </DashboardCard>
}

const LastEntriesTable = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const [results, setResults] = useState<SlaughterEntry[]>([])
    const [lastDate, setLastDate] = useState<string>("Sem Data")
    const [slaughterhouse, setSlaughterhouse] = useState<string>("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getLastEntries()
            .then(results => {
                const json: SlaughterEntry[] = results.json
                const entryDate = new Date(json[0].entryDate)
                const entrySlaugherhouse = json[0].slaughterhouse
                setSlaughterhouse(entrySlaugherhouse)
                setLastDate(dateTransform(entryDate))
                setResults(json)
            })
            .catch(() => {
                setResults([])
                setLastDate("Sem Data")
                setSlaughterhouse("")
            })
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [startLoading, stopLoading, reloadFlag])

    return <DashboardCard className="col-span-3">
        <CardDefaultTitle text={`Última Marcação de Peso - ${lastDate} (Frig.: ${slaughterhouse})`} />
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
    row: SlaughterEntry
}

const LastEntriesRow = ({ row }: LastEntriesRowProps) => {

    const [editing, setEditing] = useState(false)
    const [rowData, setRowData] = useState(row)

    useEffect(() => setRowData(row), [row])

    const onDelete = useCallback(() => console.log(rowData.id), [])

    if (editing) return <EditingLastEntriesRow {...{ setEditing, setRowData, rowData }} />

    return <TableRow>
        <TableCell>
            <EditControlButtons {...{ setEditing, onDelete }} />
        </TableCell>
        <TableCell>{rowData.animalName}</TableCell>
        <TableCell>
            {`${decimalTransform(rowData.weight)} (${decimalTransform(rowData.weight / 15)}@)`}
        </TableCell>
        <TableCell>
            {`${decimalTransform(rowData.discountWeight)} (${decimalTransform(rowData.discountWeight / 15)}@)`}
        </TableCell>
        <TableCell>{
            `${decimalTransform(rowData.deadWeight)} (${decimalTransform(rowData.deadWeight / 15)}@)`
        }</TableCell>
        <TableCell>{percentageTransform(rowData.performanceRate)}</TableCell>
    </TableRow>
}

type EditingLastEntriesRowProps = {
    setEditing: Dispatch<SetStateAction<boolean>>
    setRowData: Dispatch<SetStateAction<SlaughterEntry>>
    rowData: SlaughterEntry
}

const EditingLastEntriesRow = ({ setEditing, rowData, setRowData }: EditingLastEntriesRowProps) => {

    const { handleSubmit, control } = useForm<SlaughterEntry>({ defaultValues: rowData })

    const onSubmit: SubmitHandler<SlaughterEntry> = (data: SlaughterEntry) => {

        const discountWeight = data.discountRate ? data.weight * (1 - data.discountRate) : 0
        const performanceRate = (data.deadWeight / discountWeight) * 100

        console.log(`discountRate: ${data.discountRate} 
            discountWeight: ${discountWeight} 
            performanceRate:${performanceRate}
        `)

        setRowData({ ...data, performanceRate, discountWeight })
        setEditing(false)
    }

    const onSave = handleSubmit(onSubmit)

    return <TableRow>
        <TableCell>
            <EditingControlButtons {...{ setEditing, onSave }} />
        </TableCell>
        <TableCell>{rowData.animalName}</TableCell>
        <TableCell>
            <FormTextField
                formProps={{ control, name: 'weight' }}
                type="number"
            />
        </TableCell>
        <TableCell>
            {`${decimalTransform(rowData.discountWeight)} (${decimalTransform(rowData.discountWeight / 15)}@)`}
        </TableCell>
        <TableCell>
            <FormTextField
                formProps={{ control, name: 'deadWeight' }}
                type="number"
            />
        </TableCell>
        <TableCell>{percentageTransform(rowData.performanceRate)}</TableCell>
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
                        loadingProps={{ loading, rowSpan: 10 }}
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
                                        value={percentageTransform(item.performanceRate)}
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

    // const { setPageProps } = useContext(PageContext)

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
        <CardDefaultTitle text="As 15 Últimas Marcações" />
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
                        loadingProps={{ loading, rowSpan: 5 }}
                        dataset={results}
                        render={row => (
                            <TableRow>
                                <TableCell>
                                    <EditControlButtons />
                                </TableCell>
                                <TableCell>{dateTransform(row.entryDate)}</TableCell>
                                <TableCell>{row.slaughterhouse}</TableCell>
                                <TableCell>{row.animalsNumber}</TableCell>
                                <TableCell>
                                    <TrendValues
                                        value={decimalTransform(row.averageWeight)}
                                        trendProps={{ trend: row.weightVariation }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TrendValues
                                        value={percentageTransform(row.averageRate)}
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
            // onClick={() => setPageProps && setPageProps(WeightGroupsPage)}
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
                    valueFormatter: (value) => `${decimalTransform(value)} (${decimalTransform((value || 0) / 15)}@)`,
                    curve: 'linear',
                },
                {
                    id: "deadWeight",
                    label: "Peso de Abate",
                    showMark: false,
                    data: dataset.map(item => item.deadWeight),
                    valueFormatter: (value) => `${decimalTransform(value)} (${decimalTransform((value || 0) / 15)}@)`,
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

    const [dataset, setDataset] = useState<RateHist[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getRateHist()
            .then(results => setDataset(results.json))
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
                    color: green[600],
                    area: true,
                    data: dataset.map(item => item.averageRate),
                    valueFormatter: (value) => percentageTransform(value),
                    curve: 'linear',
                },
            ]}
            yAxis={[{
                min: 0,
                max: 100,
                scaleType: 'linear',
                valueFormatter: (value) => percentageTransform(value)
            }]}
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
