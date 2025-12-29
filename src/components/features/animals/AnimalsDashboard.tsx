import {
    CardChartContent,
    CardDefaultTitle,
    DashboardCard,
    DashboardContainer,
    DashboardInfoContainer,
    DashboardTableBody,
    DashboardTopContainer
} from "@/components/shared/dashboard/DashboardComponents"
import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { DashboardInformationProps, DashboardTopBarProps } from "@/components/shared/dashboard/Entities"
import { CardEntry } from "@/utils/Entities"
import { ReloadButton } from "@/components/shared/table/TableTopBarComponents"
import { AnimalByType, AnimalsNumberHist } from "./Entities"
import { getAnimalByTypes, getBirthHist, getDairyHist, getDeathHist, getSlaughterHist } from "./Controller"
import { SparkLineChart } from "@mui/x-charts/SparkLineChart"
import { dateTransform, decimalTransform, positiveTransform } from "@/utils/Transformations"
import { green, purple, red, yellow } from "@mui/material/colors"
import { PieChart } from "@mui/x-charts"
import { LOADING_MSG, NO_DATA_AVAILABLE } from "@/components/shared/Globals"
import { ComboBox, ComboBoxItem } from "@/components/shared/common/ComboBox"
import { getLastBirths } from "@features/reproduction/births/Controller"
import { BirthEntry } from "@features/reproduction/births/Entities"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import TableBody from "@mui/material/TableBody"
import { MilkEntry } from "@features/lactation/Entities"
import { PageContext } from "@/components/shared/main-page/PageContext"
import { deleteMilkEntry, getLastEntries } from "@features/lactation/Controller"
import Button from "@mui/material/Button"
import Add from "@mui/icons-material/Add"
import ChevronRight from "@mui/icons-material/ChevronRight"
import { AppRoute } from "@/components/shared/main-page/PageDisplay"
import { GroupEntriesTablePage } from "@features/lactation/GroupEntriesTable"
import { MilkDashboardPage } from "@/components/features/lactation/Routes"
import { AddMilkEntryDialog } from "@features/lactation/AddMilkEntryDialog"
import { EditRowProps, TableRowProp } from "@/components/shared/table/Entities"
import { EditControlButtons, EditingControlButtons } from "@/components/shared/table/ControlButtons"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@/components/shared/form-controls/FormTextField"
import { HomePage } from "@features/home/HomePage"

type EditContextProps = {
    setReloadFlag: Dispatch<SetStateAction<number>>
}

const EditContext = createContext<EditContextProps>(undefined!)

export const AnimalsDashboard = () => {

    const [reloadFlag, setReloadFlag] = useState(0)
    const [activeRequests, setActiveRequests] = useState(0)

    const startLoading = useCallback(() => setActiveRequests(prev => prev + 1), [])
    const stopLoading = useCallback(() => setActiveRequests(prev => Math.max(prev - 1)), [])

    return <DashboardContainer>
        <AnimalsTopBar  {...{ setReloadFlag, activeRequests }} />
        <EditContext.Provider value={{ setReloadFlag }}>
            <AnimalsContent {...{ reloadFlag, startLoading, stopLoading }} />
        </EditContext.Provider>
    </DashboardContainer>
}

const AnimalsTopBar = ({ activeRequests, setReloadFlag }: DashboardTopBarProps) => {

    return <DashboardTopContainer>
        <ReloadButton
            onReload={() => setReloadFlag(prev => prev + 1)}
            loading={activeRequests > 0}
        />
    </DashboardTopContainer>
}

const AnimalsContent = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    return <DashboardInfoContainer className="h-full flex flex-col gap-4">
        <div className="h-full grid grid-cols-[repeat(4,230px)_1fr]  grid-rows-[180px_1fr] gap-4">
            <BirthsCard {...{ stopLoading, reloadFlag, startLoading }} />
            <DeathsCard {...{ stopLoading, reloadFlag, startLoading }} />
            <DairyCard {...{ stopLoading, reloadFlag, startLoading }} />
            <SlaughterCard {...{ stopLoading, reloadFlag, startLoading }} />
            <LastEntries {...{ startLoading, stopLoading, reloadFlag }} />
            <TypesChart {...{ startLoading, reloadFlag, stopLoading }} />
        </div>
    </DashboardInfoContainer>
}

const BirthsCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

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
        getBirthHist()
            .then(response => setStats(response))
            .catch(() => setStats(defaultValue))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [defaultValue, reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Nascimentos"
            loading={loading}
            data={stats.current}
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.animalsNumber)}
                    height={80}
                    showHighlight
                    showTooltip
                    xAxis={{
                        data: stats.hist.map(item => new Date(item.entryDate)),
                        valueFormatter: (value: Date) => dateTransform(value, { month: 'short', year: 'numeric' })
                    }}
                />
            )}
            trendProps={{ trend: stats.trend, text: positiveTransform(stats.trend) }}
        />
    </DashboardCard>
}

const DeathsCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

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
        getDeathHist()
            .then(response => setStats(response))
            .catch(() => setStats(defaultValue))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [defaultValue, reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Mortes"
            loading={loading}
            data={stats.current}
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.animalsNumber)}
                    height={80}
                    showHighlight
                    showTooltip
                    color={red[600]}
                    xAxis={{
                        data: stats.hist.map(item => new Date(item.entryDate)),
                        valueFormatter: (value: Date) => dateTransform(value, { month: 'short', year: 'numeric' })
                    }}
                />
            )}
            trendProps={{ trend: stats.trend, text: positiveTransform(stats.trend) }}
        />
    </DashboardCard>
}

const DairyCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

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
        getDairyHist()
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
                    height={80}
                    color={yellow[600]}
                    showHighlight
                    showTooltip
                    xAxis={{
                        data: stats.hist.map(item => new Date(item.entryDate)),
                        valueFormatter: (value: Date) => dateTransform(value, { month: 'short', year: 'numeric' })
                    }}
                />
            )}
            trendProps={{ trend: stats.trend }}
        />
    </DashboardCard>
}

const SlaughterCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

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
        getSlaughterHist()
            .then(response => setStats(response))
            .catch(() => setStats(defaultValue))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [defaultValue, reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Abates"
            loading={loading}
            data={stats.current}
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.animalsNumber)}
                    height={80}
                    color={purple[600]}
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

const LastEntries = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const [table, setTable] = useState('last-birth')

    const tableValues: ComboBoxItem[] = [
        { value: 'last-birth', name: 'Os Últimos Nascimentos' },
        { value: 'last-death', name: 'As Últimas Mortes' },
        { value: 'last-slaughter', name: 'Último Abate' },
        { value: 'last-lac', name: 'Última Marcação de Leite' },
    ]

    const SelectedTable = useCallback(() => {
        switch (table) {
            case 'last-birth':
                return <LastBirthsTable {...{ startLoading, stopLoading, reloadFlag }} />
            case 'last-lac':
                return <LastLacTable {...{ startLoading, stopLoading, reloadFlag }} />
        }
    }, [reloadFlag, startLoading, stopLoading, table])

    return <DashboardCard className="row-span-2">
        <ComboBox
            className="w-[300px]"
            items={tableValues}
            value={table}
            onChange={(value) => setTable(value)}
        />
        <SelectedTable />
    </DashboardCard>
}

const LastBirthsTable = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const [data, setData] = useState<BirthEntry[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        startLoading()
        setLoading(true)
        getLastBirths()
            .then(response => setData(response))
            .catch(() => setData([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <Table size="small">
        <TableHead>
            <TableRow>
                <TableCell>Mãe</TableCell>
                <TableCell align="center">Data de Nascimento</TableCell>
                <TableCell align="center">Intervalo de Parição</TableCell>
                <TableCell align="center">Sexo</TableCell>
                <TableCell>Pai</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            <DashboardTableBody
                dataset={data}
                colSpan={5}
                loading={loading}
                render={row => (
                    <TableRow>
                        <TableCell>{row.motherInfo}</TableCell>
                        <TableCell align="center">{dateTransform(row.calfBirthDate)}</TableCell>
                        <TableCell align="center">
                            {row.birthInterval ?? '1ª Cria'}
                        </TableCell>
                        <TableCell align="center">{row.calfSex}</TableCell>
                        <TableCell>{row.calfFather}</TableCell>
                    </TableRow>
                )}
            />
        </TableBody>
    </Table>
}

const LastLacTable = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [data, setData] = useState<MilkEntry[]>([])
    const [lastDate, setLastDate] = useState(new Date())
    const [textDate, setTextDate] = useState('Sem dados')
    const [loading, setLoading] = useState(false)
    const [addMilkEntryOpen, setAddMilkEntryOpen] = useState(false)

    const { setPageProps } = useContext(PageContext)
    const { setReloadFlag } = useContext(EditContext)

    const onDelete = useCallback((id: string) => {
        deleteMilkEntry(id)
            .then(() => setReloadFlag(prev => prev + 1))
    }, [setReloadFlag])

    const onClose = useCallback(() => {
        setReloadFlag(prev => prev + 1)
        setAddMilkEntryOpen(false)
    }, [setReloadFlag])

    useEffect(() => {
        startLoading()
        setLoading(true)
        getLastEntries()
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

    return <>
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
                onClick={() => {
                    const page: AppRoute = {
                        title: `Leite - ${textDate}`,
                        page: <GroupEntriesTablePage {...{ entryDate: lastDate }} />,
                        previousPages: [HomePage, MilkDashboardPage]
                    }
                    setPageProps(page)
                }}
            >
                Ver Mais...
            </Button>
            <AddMilkEntryDialog {...{ addMilkEntryOpen, onClose, entryDate: lastDate }} />
        </div>
    </>

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

    const defaultTypes: AnimalByType = useMemo(() => ({
        reproductionAnimals: 0,
        beefAnimals: 0,
        dairyAnimals: 0,
        offspring: 0
    }), [])

    const [dataset, setDataset] = useState<AnimalByType>(defaultTypes)

    useEffect(() => {
        startLoading()
        getAnimalByTypes()
            .then(results => setDataset(results))
            .catch(() => setDataset(defaultTypes))
            .finally(() => stopLoading())
    }, [defaultTypes, reloadFlag, startLoading, stopLoading])

    return <DashboardCard className="col-span-4">
        <CardDefaultTitle text="Tipo de Animais" />
        <PieChart
            localeText={{
                loading: LOADING_MSG,
                noData: NO_DATA_AVAILABLE
            }}
            series={[{
                innerRadius: 100,
                outerRadius: 200,
                highlightScope: { fade: 'global', highlight: 'item' },
                data: [
                    { id: 0, label: 'Animais Jovens', value: dataset.offspring },
                    { id: 1, label: 'Vacas Leiteiras', value: dataset.dairyAnimals, color: yellow[600] },
                    { id: 2, label: 'Animais de Abate', value: dataset.beefAnimals, color: purple[600] },
                    { id: 3, label: 'Matrizes e Touros', value: dataset.reproductionAnimals, color: green[600] },
                ]
            }]}
        />
    </DashboardCard>
} 
