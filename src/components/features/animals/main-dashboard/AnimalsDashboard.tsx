import {
    CardChartContent,
    CardDefaultTitle,
    DashboardCard,
    DashboardContainer,
    DashboardInfoContainer,
    DashboardTableBody,
    DashboardTopContainer
} from "@/components/shared/dashboard/DashboardComponents"
import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { DashboardInformationProps, DashboardTopBarProps, OptionMenuProps } from "@/components/shared/dashboard/Entities"
import { CardEntry } from "@/utils/Entities"
import { ReloadButton } from "@/components/shared/table/TableTopBarComponents"
import { AnimalByType, AnimalsByAge, AnimalsNumberHist } from "./Entities"
import { getAgeAndSex, getAnimalByTypes, getBirthHist, getDairyHist, getDeathHist, getLastDeaths, getSlaughterHist } from "./Controller"
import { SparkLineChart } from "@mui/x-charts/SparkLineChart"
import { dateToISO, dateTransform, decimalTransform, percentageTransform, positiveTransform, transformWeight } from "@/utils/Transformations"
import { green, lightBlue, pink, purple, red, yellow } from "@mui/material/colors"
import { BarChart, PieChart } from "@mui/x-charts"
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
import { useNavigate } from "react-router"
import { deleteMilkEntry, getLastLac } from "@features/lactation/Controller"
import Button from "@mui/material/Button"
import Add from "@mui/icons-material/Add"
import ChevronRight from "@mui/icons-material/ChevronRight"
import { AddMilkEntryDialog } from "@features/lactation/AddMilkEntryDialog"
import { EditRowProps, TableRowProp } from "@/components/shared/table/Entities"
import { EditControlButtons, EditingControlButtons } from "@/components/shared/table/ControlButtons"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@/components/shared/form-controls/FormTextField"
import ExpandMore from "@mui/icons-material/ExpandMore"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import Divider from "@mui/material/Divider"
import { AddBirthDialog } from "@features/reproduction/births/BirthAddDialog"
import { AddCowDialog } from "../AddCowDialog"
import { AddBullDialog } from "../AddBullDialog"
import { SlaughterEntry, SlaughterEntrySave } from "@features/slaughter/Entities"
import { APIError } from "@/utils/ApiRequest"
import { ErrorDialog } from "@/components/shared/dialog/DialogComponents"
import { deleteSlaughter, getLastSlaughter, updateSlaughter } from "@features/slaughter/Controller"
import { NextBirths } from "../../reproduction/pregnancy-test/Entities"
import { getNextBirths } from "../../reproduction/pregnancy-test/Controller"
import { Animal, transformAnimalType } from "../Entities"

type EditContextProps = { setReloadFlag: Dispatch<SetStateAction<number>> }

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

    const [openMenu, setOpenMenu] = useState(false)
    const menuAnchorEl = useRef<HTMLButtonElement>(null)

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
        <OptionsMenu
            openMenu={openMenu}
            menuAnchorEl={menuAnchorEl}
            closeMenu={() => setOpenMenu(false)}
            setReloadFlag={setReloadFlag}
        />
    </DashboardTopContainer>
}

const OptionsMenu = ({ openMenu, menuAnchorEl, closeMenu, setReloadFlag }: OptionMenuProps) => {

    const [addCowOpen, setAddCowOpen] = useState(false)
    const [addBullOpen, setAddBullOpen] = useState(false)
    const [addBirthOpen, setAddBirthOpen] = useState(false)

    const navigate = useNavigate()

    const closeAddCow = useCallback((added?: boolean) => {
        if (added) setReloadFlag(prev => prev + 1)
        setAddCowOpen(false)
    }, [setReloadFlag])

    const closeAddBull = useCallback((added?: boolean) => {
        if (added) setReloadFlag(prev => prev + 1)
        setAddBullOpen(false)
    }, [setReloadFlag])

    const closeBirthDialog = useCallback((added?: boolean) => {
        if (added) setReloadFlag(prev => prev + 1)
        setAddBirthOpen(false)
    }, [setReloadFlag])

    return <>
        <Menu
            open={openMenu}
            anchorEl={menuAnchorEl.current}
            onClose={closeMenu}
        >
            <MenuItem onClick={() => setAddBirthOpen(true)}>
                <ListItemIcon>
                    <Add />
                </ListItemIcon>
                Adicionar Parição
            </MenuItem>
            <MenuItem onClick={() => setAddBullOpen(true)}>
                <ListItemIcon>
                    <Add />
                </ListItemIcon>
                Adicionar Touro
            </MenuItem>
            <MenuItem onClick={() => setAddCowOpen(true)}>
                <ListItemIcon>
                    <Add />
                </ListItemIcon>
                Adicionar Vaca
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => navigate("animals")}>
                <ListItemIcon>
                    <ChevronRight />
                </ListItemIcon>
                Tabela de Animais
            </MenuItem>
            <AddBirthDialog {...{ closeBirthDialog, addBirthOpen }} />
            <AddCowDialog {...{ addCowOpen, closeAddCow }} />
            <AddBullDialog {...{ addBullOpen, closeAddBull }} />
        </Menu>
    </>
}

const AnimalsContent = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    return <DashboardInfoContainer className="h-full flex flex-col gap-4">
        <div className="grid grid-cols-[repeat(4,230px)_1fr] grid-rows-[180px_500px] gap-4">
            <BirthsCard {...{ stopLoading, reloadFlag, startLoading }} />
            <DeathsCard {...{ stopLoading, reloadFlag, startLoading }} />
            <DairyCard {...{ stopLoading, reloadFlag, startLoading }} />
            <SlaughterCard {...{ stopLoading, reloadFlag, startLoading }} />
            <LastEntries {...{ startLoading, stopLoading, reloadFlag }} />
            <TypesChart {...{ startLoading, reloadFlag, stopLoading }} />
        </div>
        <div className="h-full grid grid-cols-[1fr_500px] grid-rows-[500px] gap-4">
            <AgeChart {...{ startLoading, stopLoading, reloadFlag }} />
            <NextBirthsTable {...{ stopLoading, startLoading, reloadFlag }} />
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
            case 'last-death':
                return <LastDeathsTable {...{ startLoading, stopLoading, reloadFlag }} />
            case 'last-slaughter':
                return <LastSlaughterTable {...{ startLoading, stopLoading, reloadFlag }} />
            case 'last-lac':
                return <LastLacTable {...{ startLoading, stopLoading, reloadFlag }} />
        }
    }, [reloadFlag, startLoading, stopLoading, table])

    return <DashboardCard className="row-span-2">
        <ComboBox
            className="w-[300px]"
            items={tableValues}
            value={table}
            onChange={(value) => {
                if (!value) {
                    setTable('last-birth')
                    return
                }
                setTable(value)
            }}
        />
        <SelectedTable />
    </DashboardCard>
}

const LastBirthsTable = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const [data, setData] = useState<BirthEntry[]>([])
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

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

    return <>
        <div className="overflow-auto">
            <Table stickyHeader size="small">
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
        </div>
        <Button
            className="ml-auto"
            endIcon={<ChevronRight />}
            onClick={() => navigate('/main/reproduction/births/entries')}
        >
            Ver Mais...
        </Button>
    </>
}

const LastDeathsTable = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const [data, setData] = useState<Animal[]>([])
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        startLoading()
        setLoading(true)
        getLastDeaths()
            .then(response => setData(response))
            .catch(() => setData([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <>
        <div className="overflow-auto">
            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Animal</TableCell>
                        <TableCell align="center">Data da Morte</TableCell>
                        <TableCell align="center">Tipo de Animal</TableCell>
                        <TableCell>Observações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <DashboardTableBody
                        dataset={data}
                        colSpan={4}
                        loading={loading}
                        render={row => (
                            <TableRow>
                                <TableCell>{row.name}</TableCell>
                                <TableCell align="center">{dateTransform(row.deathDate)}</TableCell>
                                <TableCell align="center">{transformAnimalType(row.animalType, row.sex)}</TableCell>
                                <TableCell>{row.observation}</TableCell>
                            </TableRow>
                        )}
                    />
                </TableBody>
            </Table>
        </div>
        <Button
            className="ml-auto"
            endIcon={<ChevronRight />}
            onClick={() => navigate('/main/animals/deaths')}
        >
            Ver Mais...
        </Button>
    </>
}

const LastSlaughterTable = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const [results, setResults] = useState<SlaughterEntry[]>([])
    const [entryDate, setEntryDate] = useState<Date>()
    const [butcher, setButcher] = useState<string>("")
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState<APIError>()
    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true)
        startLoading()
        getLastSlaughter()
            .then((results: SlaughterEntry[]) => {
                const entryDate = new Date(results[0].entryDate)
                setEntryDate(entryDate)
                setButcher(results[0].butcher)
                setResults(results)
            })
            .catch(() => {
                setResults([])
                setEntryDate(undefined)
                setButcher("")
            })
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [startLoading, stopLoading, reloadFlag])

    const TableTitle = useCallback(() => {
        if (!entryDate) return
        return <div className="mt-4 flex flex-row gap-8">
            <CardDefaultTitle text={`Data: ${dateTransform(entryDate)}`} />
            <CardDefaultTitle text={`Frig.: ${butcher}`} />
        </div>
    }, [butcher, entryDate])

    return <>
        <TableTitle />
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
                        loading={loading}
                        dataset={results}
                        render={row => <SlaughterRow {...{ row, setError }} />}
                    />
                </TableBody>
            </Table>
            <ErrorDialog
                openError={!!error}
                title={error?.title}
                content={error?.message}
                onClose={() => setError(undefined)}
            />
        </div>
        <Button
            className="ml-auto"
            endIcon={<ChevronRight />}
            onClick={() => {
                if (!entryDate) return
                const dateStr = dateToISO(entryDate)
                navigate(`slaughter/groups/${dateStr}`)
            }}
        >
            Ver Mais...
        </Button>
    </>
}

type LastEntriesRowProps = {
    row: SlaughterEntry
    setError: Dispatch<SetStateAction<APIError | undefined>>
}

const SlaughterRow = ({ row, setError }: LastEntriesRowProps) => {

    const [editing, setEditing] = useState(false)
    const [rowData, setRowData] = useState(row)
    const [loadingControls, setLoadingControls] = useState(false)

    useEffect(() => setRowData(row), [row])

    const onDelete = useCallback(() => {
        setLoadingControls(true)
        deleteSlaughter(rowData.id)
            .then(() => {
                setError(undefined)
            })
            .catch(err => setError(err))
            .finally(() => setLoadingControls(false))
    }, [rowData.id, setError])

    if (editing) return <EditingSlaughterRow {...{ setEditing, setRowData, rowData, setError }} />

    return <TableRow>
        <TableCell>
            <EditControlButtons {...{ setEditing, onDelete, loading: loadingControls }} />
        </TableCell>
        <TableCell>{rowData.animalInfo}</TableCell>
        <TableCell> {transformWeight(rowData.weight)} </TableCell>
        <TableCell> {transformWeight(rowData.discountWeight)} </TableCell>
        <TableCell> {transformWeight(rowData.deadWeight)} </TableCell>
        <TableCell>{percentageTransform(rowData.performanceRate)}</TableCell>
    </TableRow>
}

type EditingLastEntriesRowProps = {
    setEditing: Dispatch<SetStateAction<boolean>>
    setError: Dispatch<SetStateAction<APIError | undefined>>
    rowData: SlaughterEntry
    setRowData: Dispatch<SetStateAction<SlaughterEntry>>
}

const EditingSlaughterRow = ({ setEditing, rowData, setRowData, setError }: EditingLastEntriesRowProps) => {

    const [loading, setLoading] = useState(false)

    const { handleSubmit, control } = useForm<SlaughterEntrySave>({ defaultValues: rowData })

    const onSubmit: SubmitHandler<SlaughterEntrySave> = (data: SlaughterEntrySave) => {
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
        <TableCell>{rowData.animalInfo}</TableCell>
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
        <TableCell>{percentageTransform(rowData.performanceRate)}</TableCell>
    </TableRow>

}

const LastLacTable = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [data, setData] = useState<MilkEntry[]>([])
    const [lastDate, setLastDate] = useState(new Date())
    const [loading, setLoading] = useState(false)
    const [addMilkEntryOpen, setAddMilkEntryOpen] = useState(false)
    const navigate = useNavigate()
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
        getLastLac()
            .then(response => {
                const entries: MilkEntry[] = response
                const entryDate = new Date(entries[0].entryDate ?? '')
                setLastDate(entryDate)
                setData(entries)
            })
            .catch(() => {
                setLastDate(new Date())
                setData([])
            })
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <>
        <CardDefaultTitle className="mt-4" text={`Data: ${dateTransform(lastDate)}`} />
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
                    const dateStr = dateToISO(lastDate)
                    navigate(`/main/lactation/milk/${dateStr}`)
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
                faded: { additionalRadius: -30, color: 'gray' },
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

const AgeChart = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const [dataset, setDataset] = useState<AnimalsByAge[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getAgeAndSex()
            .then(response => setDataset(response))
            .catch(() => setDataset([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardDefaultTitle text="Animais por Idade e Sexo" />
        <BarChart
            loading={loading}
            dataset={dataset}
            layout="horizontal"
            series={[
                {
                    label: 'Machos',
                    color: lightBlue[600],
                    dataKey: 'male'
                },
                {
                    label: 'Fêmeas',
                    color: pink[600],
                    dataKey: 'female'
                }
            ]}
            yAxis={[{ dataKey: 'category', scaleType: 'band', width: 120 }]}
        />
    </DashboardCard>

}

const NextBirthsTable = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<NextBirths[]>([])

    const navigate = useNavigate()

    useEffect(() => {
        startLoading()
        setLoading(true)
        getNextBirths()
            .then((response: NextBirths[]) => setData(response))
            .catch(() => setData([]))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardDefaultTitle text="Próximas Parições" />
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Mês</TableCell>
                    <TableCell>Parições Previstas</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <DashboardTableBody
                    loading={loading}
                    colSpan={2}
                    dataset={data}
                    render={item => (
                        <TableRow>
                            <TableCell>
                                {item.birthForecast.toLocaleString('pt-BR', {
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </TableCell>
                            <TableCell>{item.birthNumbers}</TableCell>
                        </TableRow>
                    )}
                />
            </TableBody>
        </Table>
        <Button
            className="ml-auto"
            endIcon={<ChevronRight />}
            onClick={() => navigate('/main/reproduction/birth-test')}
        >
            Ver Mais...
        </Button>
    </DashboardCard>
}
