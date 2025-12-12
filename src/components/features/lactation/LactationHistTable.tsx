import {
    createContext,
    Dispatch,
    RefObject,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react"
import { LactationHist, LactationHistFilter, LactationHistFoot } from "./Entities"
import {
    deleteLactation,
    deleteLactationAndEntries,
    findLactationsPage,
    getLactationsPageFoot,
    searchCalfs,
    updateLactation
} from "./Controller"
import { ComboBoxItem } from "@shared/common/ComboBox"
import { useVirtuosoComponents, usePagination } from "@shared/table/PageTable"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import {
    FooterContent,
    TableBodyCell,
    TableFooterRow,
    TableHeadRow,
    TableLoadingCells,
    VirtuosoHeadCell,
    VirtuosoResizeHeadCell
} from "@shared/table/TableComponents"
import { dateTransform, decimalTransform } from "@utils/Transformations"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { LacHistFilter } from "./LacHistFilter"
import { PageProps } from "@shared/main-page/PageDisplay"
import { LactationEntriesTablePage } from "./LactationEntriesTable"
import { HomePage } from "../home/HomePage"
import { LactationHistPage, MilkDashboardPage } from "./LactationPages"
import { PageContext } from "@shared/main-page/PageContext"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { APIError } from "@utils/ApiRequest"
import { ErrorDialog, YesNoDialog } from "@shared/dialog/DialogComponents"
import { CONFLICT_WARNING } from "@shared/Globals"
import { Button, ListItemIcon, Menu, MenuItem } from "@mui/material"
import ExpandMore from "@mui/icons-material/ExpandMore"
import { OptionMenuProps } from "@shared/dashboard/Entities"
import Add from "@mui/icons-material/Add"
import CalendarMonth from "@mui/icons-material/CalendarMonth"
import { EndLactationDialog } from "./EndLactationDialog"
import { AddLacDialog } from "./AddLactationDialog"

type EditContextProps = {
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setDeleteId: Dispatch<SetStateAction<string | undefined>>
}

const ErrorContext = createContext<EditContextProps>(undefined!)

export const LactationHistTablePage = () => {

    const defaultSort = "animal_order, start_date"

    const DEFAULT_FOOT: LactationHistFoot = useMemo(() => ({
        totalLacs: 0,
        averageTotal: 0,
        averageInterval: 0,
        averagePeriod: 0,
        averagePeak: 0,
        averageProduction: 0,
    }), [])

    const [filter, setFilter] = useState<LactationHistFilter>({ isFiltered: false })
    const [filterOpen, setFilterOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sort, setSort] = useState(defaultSort)
    const [order, setOrder] = useState('asc')
    const [foot, setFoot] = useState(DEFAULT_FOOT)
    const [error, setError] = useState<APIError>()
    const [warning, setWarning] = useState<APIError>()
    const [deleteId, setDeleteId] = useState<string>()

    const [menuOpen, setMenuOpen] = useState(false)
    const [reloadFlag, setReloadFlag] = useState(0)

    const anchorEl = useRef<HTMLButtonElement>(null)
    const menuAnchor = useRef<HTMLButtonElement>(null)

    const fetchPage = useCallback((cursor?: string) => {
        getLactationsPageFoot(filter)
            .then(response => setFoot(response))
            .catch(() => setFoot(DEFAULT_FOOT))
        return findLactationsPage(filter, sort, order, cursor)
    }, [DEFAULT_FOOT, filter, order, sort])

    const onReload = useCallback(() => setFilter({ isFiltered: false }), [])
    const { rows, scrollRef, fetchNextPage, setRows } = usePagination<LactationHist>({ setLoading, fetchPage })

    useEffect(() => onReload(), [onReload, reloadFlag])

    useEffect(() => {
        if (!deleteId) return
        deleteLactation(deleteId)
            .then(() => {
                setRows(prev => prev.filter(item => item.id != deleteId))
                setError(undefined)
                setWarning(undefined)
                setDeleteId(undefined)
            })
            .catch((err) => {
                if (err.kind == CONFLICT_WARNING) {
                    setWarning(err)
                    return
                }
                setError(err)
            })
    }, [deleteId, setRows])

    const deleteWithEntries = useCallback(() => {
        if (!deleteId) return
        deleteLactationAndEntries(deleteId)
            .then(() => {
                setRows(prev => prev.filter(item => item.id != deleteId))
                setError(undefined)
                setWarning(undefined)
            })
            .catch((error) => setError(error))
            .finally(() => setDeleteId(undefined))
    }, [deleteId, setRows])

    const sortColumns: ComboBoxItem[] = [
        { name: 'Brinco da Vaca', value: defaultSort },
        { name: 'Nome da Vaca', value: 'name, start_date' },
        { name: 'Início de Lactação', value: 'start_date, animal_order' },
        { name: 'Fim de Lactação', value: 'end_date, animal_order' },
        { name: 'Nascimento do Bezerro', value: 'calf_birth_date, start_date, animal_order' },
        { name: 'Produção Média', value: 'avg_production, start_date, animal_order' },
        { name: 'Período em Lactação', value: 'lac_period, start_date, animal_order' },
        { name: 'Produção Total', value: 'total_production, start_date, animal_order' },
        { name: 'Intervalo de Lactação', value: 'lac_interval, start_date, animal_order' },
    ]

    return <div className="w-full h-full flex flex-col">
        <TableTopBar
            reloadProps={{ onReload, loading }}
            filterProps={{ setFilterOpen, anchorEl }}
            orderProps={{ order, setOrder }}
            sortProps={{ sort, sortColumns, setSort, defaultSort }}
            otherProps={(
                <>
                    <Button
                        onClick={() => setMenuOpen(prev => !prev)}
                        endIcon={<ExpandMore />}
                        ref={menuAnchor}
                    >
                        Opções
                    </Button>
                    <OptionsMenu
                        openMenu={menuOpen}
                        menuAnchorEl={menuAnchor.current}
                        closeMenu={() => setMenuOpen(prev => !prev)}
                        setReloadFlag={setReloadFlag}
                    />
                </>
            )}
        />
        <ErrorContext.Provider value={{ setError, setDeleteId }}>
            <LacTable {...{ rows, foot, loading, scrollRef, fetchNextPage }} />
        </ErrorContext.Provider>
        <LacHistFilter {...{ setFilter, filter, filterOpen, setFilterOpen, anchorEl }} />
        <ErrorDialog
            title={error?.title}
            content={error?.message}
            onClose={() => setError(undefined)}
            openError={!!error}
        />
        <YesNoDialog
            openYesNo={!!warning}
            title={warning?.title}
            content={warning?.message}
            onClose={() => {
                setWarning(undefined)
                setDeleteId(undefined)
            }}
            onYes={deleteWithEntries}
        />
    </div>
}

const OptionsMenu = ({ openMenu, menuAnchorEl, closeMenu }: OptionMenuProps) => {

    const [openEndLactation, setOpenEndLactation] = useState(false)
    const [openStartLac, setOpenStartLac] = useState(false)

    const closeEndLactation = useCallback(() => {
        setOpenEndLactation(false)
    }, [])

    const closeStartLac = useCallback(() => {
        setOpenStartLac(false)
    }, [])

    return <>
        <Menu
            open={openMenu}
            anchorEl={menuAnchorEl}
            onClose={closeMenu}
        >
            <MenuItem onClick={() => setOpenStartLac(true)}>
                <ListItemIcon>
                    <Add />
                </ListItemIcon>
                Iniciar Lactações
            </MenuItem>
            <MenuItem onClick={() => setOpenEndLactation(true)}>
                <ListItemIcon>
                    <CalendarMonth />
                </ListItemIcon>
                Secar Vacas
            </MenuItem>
        </Menu>
        <EndLactationDialog {...{ openEndLactation, closeEndLactation }} />
        <AddLacDialog {...{ openStartLac, closeStartLac }} />
    </>
}

type EntriesTableProps = {
    rows: LactationHist[]
    foot: LactationHistFoot
    loading: boolean
    scrollRef: RefObject<VirtuosoHandle | null>
    fetchNextPage: () => void
}

const LacTable = ({ rows, loading, scrollRef, fetchNextPage, foot }: EntriesTableProps) => {

    const [tableWidth, setTableWidth] = useState(0)
    const tableRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleResize = () => {
            if (!tableRef.current) return
            const table = tableRef.current
            setTableWidth(table.offsetWidth)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return <TableVirtuoso
        scrollerRef={(ref) => tableRef.current = ref as HTMLDivElement}
        ref={scrollRef}
        data={rows}
        components={useVirtuosoComponents(11)}
        endReached={fetchNextPage}
        fixedHeaderContent={() => {

            const unit = tableWidth / 100

            return <TableHeadRow>
                <VirtuosoHeadCell width={unit * 10} />
                <VirtuosoResizeHeadCell width={unit * 15}>Vaca</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Bezerro</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 10}>Início de Lactação</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 10}>Fim de Lactação</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 18}>Intervalo entre Lactações (dias)</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 15}>Período em Lactação (dias)</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 15}>Média de Produção Diária</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 10}>Pico de Produção</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 10}>Total Produzido</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 25}>Observações</VirtuosoResizeHeadCell>
            </TableHeadRow>

        }}
        fixedFooterContent={() => (
            <TableFooterRow colSpan={11}>
                <FooterContent title="Total" content={foot.totalLacs} />
                <FooterContent title="Intervalo Médio" content={decimalTransform(foot.averageInterval)} />
                <FooterContent title="Período Médio" content={decimalTransform(foot.averagePeriod)} />
                <FooterContent title="Média Diária Geral" content={decimalTransform(foot.averageProduction)} />
                <FooterContent title="Pico Médio" content={decimalTransform(foot.averagePeak)} />
                <FooterContent title="Produção Média" content={decimalTransform(foot.averageTotal)} />
            </TableFooterRow>
        )}
        itemContent={(_, item) => <LacRow {...{ item: item as LactationHist, loading }} />}
    />

}

type LacRowProps = {
    item: LactationHist
    loading: boolean
}

const LacRow = ({ item, loading }: LacRowProps) => {

    const [rowData, setRowData] = useState<LactationHist>(item)
    const [editing, setEditing] = useState(false)
    const { setPageProps } = useContext(PageContext)
    const { setDeleteId } = useContext(ErrorContext)

    useEffect(() => setRowData(item), [item])

    if (loading) return <TableLoadingCells colSpan={11} />
    if (editing) return <LacRowEditing {...{ rowData, setEditing, setRowData }} />

    const onDelete = () => setDeleteId(rowData.id)

    return <>
        <TableBodyCell>
            <EditControlButtons
                setEditing={setEditing}
                onDelete={onDelete}
                onShow={() => {
                    const startDate = dateTransform(rowData.startDate)
                    const endDate = rowData.endDate ? ` Fim: ${dateTransform(rowData.endDate)}` : ""
                    const page: PageProps = {
                        title: `Leite - ${rowData.animalName} - (Início: ${startDate}${endDate})`,
                        page: <LactationEntriesTablePage {...{ lacId: rowData.id }} />,
                        previousPages: [HomePage, MilkDashboardPage, LactationHistPage]
                    }
                    if (setPageProps) setPageProps(page)
                }}
            />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalName}</TableBodyCell>
        <TableBodyCell>{rowData.calfInfo}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.startDate)}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.endDate)}</TableBodyCell>
        <TableBodyCell align="center">{rowData.lacInterval ?? "1ª Lactação"}</TableBodyCell>
        <TableBodyCell align="center">{rowData.lacPeriod}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.averageProduction ?? 0)}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.peak ?? 0, 1)}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.totalProduction ?? 0)}</TableBodyCell>
        <TableBodyCell>{rowData.observation}</TableBodyCell>
    </>
}

type LacRowEditingProps = {
    rowData: LactationHist
    setRowData: (rowData: LactationHist) => void
    setEditing: (editing: boolean) => void
}

const LacRowEditing = ({ rowData, setRowData, setEditing }: LacRowEditingProps) => {

    const [loading, setLoading] = useState(false)
    const { control, handleSubmit } = useForm<LactationHist>({ defaultValues: rowData })
    const { setError } = useContext(ErrorContext)

    const onSubmit: SubmitHandler<LactationHist> = (data: LactationHist) => {
        setLoading(true)
        updateLactation(data)
            .then(res => {
                setRowData(res)
                setEditing(false)
            })
            .catch((error) => setError(error))
            .finally(() => setLoading(false))
    }

    const onSave = handleSubmit(onSubmit)

    return <>
        <TableBodyCell>
            <EditingControlButtons {...{ onSave, setEditing, loading }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.animalName}</TableBodyCell>
        <TableBodyCell>
            <FormSearchBox
                formProps={{ control, name: 'calfId' }}
                searchOptions={searchCalfs}
            />
        </TableBodyCell>
        <TableBodyCell align="center">
            <FormDatePicker formProps={{ control, name: 'startDate' }} />
        </TableBodyCell>
        <TableBodyCell align="center">
            <FormDatePicker formProps={{ control, name: 'endDate' }} />
        </TableBodyCell>
        <TableBodyCell align="center">{rowData.lacInterval ?? "1ª Lactação"}</TableBodyCell>
        <TableBodyCell align="center">{rowData.lacPeriod}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.averageProduction ?? 0)}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.peak ?? 0, 1)}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.totalProduction ?? 0)}</TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'observation' }} />
        </TableBodyCell>
    </>
}
