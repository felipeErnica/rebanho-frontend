import { useVirtuosoComponents, usePagination } from "@/ui/shared/table/PageTable"
import {
    FooterContent,
    TableBodyCell,
    TableFooterRow,
    TableHeadRow,
    TableLoadingCells,
    VirtuosoHeadCell,
    VirtuosoResizeHeadCell
} from "@/ui/shared/table/TableComponents"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
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
import { deleteBirth, deleteBirthNoValidation, findBirthsPage, findBirthsPageFooter, updateBirth } from "./Controller"
import { ComboBoxItem } from "@/ui/shared/common/ComboBox"
import { BirthEntry, BirthEntryFilter, BirthEntrySave, BirthFooter } from "./Entities"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { dateTransform, decimalTransform } from "@/util/Transformations"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { FormComboBox } from "@/ui/shared/form-controls/FormComboBox"
import { SexValues } from "@/shared/entities/enums"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { searchFather } from "@/shared/GlobalApiCalls"
import { BirthFilter } from "./BirthFilter"
import { Button } from "@mui/material"
import Add from "@mui/icons-material/Add"
import { APIError } from "@/util/ApiRequest"
import { ErrorDialog, YesNoDialog, YesNoDialogProps } from "@/ui/shared/dialog/DialogComponents"
import { ERROR_TYPE } from "@/ui/shared/Globals"
import { AddBirthDialog } from "./BirthAddDialog"

type ErrorContextProps = {
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setWarningProps: Dispatch<SetStateAction<YesNoDialogProps>>
    defaultWarning: YesNoDialogProps
    setRows: Dispatch<SetStateAction<BirthEntry[]>>
}

const ErrorContext = createContext<ErrorContextProps>(undefined!)

export const BirthTablePage = () => {

    const DEFAULT_SORT = 'mother_order,calf_birth_date'

    const defaultWarning: YesNoDialogProps = useMemo(() => ({
        openYesNo: false,
        title: undefined,
        content: undefined,
        onYes: undefined,
        onClose: undefined
    }), [])

    const [isLoading, setLoading] = useState(false)
    const [sort, setSort] = useState(DEFAULT_SORT)
    const [order, setOrder] = useState('asc')
    const [filter, setFilter] = useState<BirthEntryFilter>({ isFiltered: false })
    const [filterOpen, setFilterOpen] = useState(false)
    const [footerData, setFooterData] = useState<BirthFooter>({ total: 0, intervalAverage: 0 })

    const [addBirthOpen, setAddBirthOpen] = useState(false)
    const [error, setError] = useState<APIError>()
    const [warningProps, setWarningProps] = useState<YesNoDialogProps>(defaultWarning)
    const anchorEl = useRef<HTMLButtonElement>(null)

    const fetchPage = useCallback((cursor?: string) => {
        setLoading(true)
        findBirthsPageFooter(filter)
            .then(response => setFooterData(response))
            .catch(() => setFooterData({ total: 0, intervalAverage: 0 }))
        return findBirthsPage(sort, order, filter, cursor)
    }, [order, sort, filter])

    const onReload = useCallback(() => setFilter({ isFiltered: false }), [])

    const closeBirthDialog = useCallback((added?: boolean) => {
        setAddBirthOpen(false)
        if (!added) return
        onReload()
    }, [onReload])

    const otherActions = (
        <Button
            startIcon={<Add />}
            onClick={() => setAddBirthOpen(true)}
        >
            Adicionar Parição
        </Button>
    )

    const { rows, scrollRef, fetchNextPage, setRows } = usePagination<BirthEntry>({ fetchPage, setLoading })
    const sortColumns: ComboBoxItem[] = [
        { name: 'Brinco da Mãe', value: DEFAULT_SORT },
        { name: 'Nome da Mãe', value: 'mother_name, calf_birth_date' },
        { name: 'Data de Nascimento', value: 'calf_birth_date, mother_order' },
        { name: 'Intervalo entre Partos', value: 'birth_interval, mother_order' },
    ]

    return <div className="w-full h-full flex flex-col">
        <TableTopBar
            sortProps={{ defaultSort: DEFAULT_SORT, sort, setSort, sortColumns }}
            filterProps={{ setFilterOpen, anchorEl }}
            orderProps={{ order, setOrder }}
            reloadProps={{ loading: isLoading, onReload }}
            otherProps={otherActions}
        />
        <ErrorContext value={{ setError, setWarningProps, defaultWarning, setRows }}>
            <BirthTable {...{ rows, scrollRef, fetchNextPage, isLoading, footerData }} />
        </ErrorContext>
        <BirthFilter {...{ setFilterOpen, filterOpen, filter, setFilter, anchorEl }} />
        <ErrorDialog
            openError={!!error}
            onClose={() => setError(undefined)}
            title={error?.title}
            content={error?.message}
        />
        <YesNoDialog {...warningProps} />
        <AddBirthDialog {...{ addBirthOpen, closeBirthDialog }} />
    </div>
}

type BirthTableProps = {
    rows: BirthEntry[]
    footerData: BirthFooter
    scrollRef: RefObject<VirtuosoHandle | null>
    fetchNextPage: () => void
    isLoading: boolean
}

const BirthTable = ({ rows, scrollRef, fetchNextPage, isLoading, footerData }: BirthTableProps) => {

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
        endReached={fetchNextPage}
        data={rows}
        components={useVirtuosoComponents(7)}
        fixedHeaderContent={() => {

            const unit = tableWidth / 100

            return <TableHeadRow>
                <VirtuosoHeadCell width={unit * 10}></VirtuosoHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Mãe</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 15}>Data de Nascimento</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 15}>Intervalo entre Partos</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 10}>Sexo</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Pai</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Informações da Cria</VirtuosoResizeHeadCell>
            </TableHeadRow>
        }}
        fixedFooterContent={() => {
            return <TableFooterRow colSpan={7}>
                <FooterContent title="Total" content={footerData.total} />
                <FooterContent title="Intervalo Médio" content={decimalTransform(footerData.intervalAverage)} />
            </TableFooterRow>
        }}
        itemContent={(_, data) => <BirthRow {...{ data: data as BirthEntry, isLoading }} />}
    />
}

type BirthRowProps = {
    data: BirthEntry
    isLoading: boolean
}

const BirthRow = ({ data, isLoading }: BirthRowProps) => {

    const [editing, setEditing] = useState(false)
    const [rowData, setRowData] = useState<BirthEntry>(data)
    const [loadingControls, setLoadingControls] = useState(false)

    const { setError, setWarningProps, defaultWarning, setRows } = useContext(ErrorContext)

    useEffect(() => setRowData(data), [data])

    const onDeleteNoValidation = useCallback(() => {
        deleteBirthNoValidation(data.id)
            .then(() => {
                setError(undefined)
                setRows(prev => prev.filter(item => item.id != data.id))
            })
            .catch(err => setError(err))
            .finally(() => setWarningProps(defaultWarning))
    }, [data.id, defaultWarning, setError, setRows, setWarningProps])

    const onDelete = useCallback(() => {
        setLoadingControls(true)
        deleteBirth(data.id)
            .then(() => {
                setError(undefined)
                setWarningProps(defaultWarning)
                setRows(prev => prev.filter(item => item.id != data.id))
            })
            .catch((error: APIError) => {
                if (error.errType === ERROR_TYPE) {
                    setError(error)
                    return
                }
                setWarningProps({
                    openYesNo: true,
                    title: error.title,
                    content: error.message,
                    onYes: onDeleteNoValidation,
                    onClose: () => setWarningProps(defaultWarning)
                })
            })
            .finally(() => setLoadingControls(false))
    }, [data.id, defaultWarning, onDeleteNoValidation, setError, setRows, setWarningProps])

    if (isLoading) return <TableLoadingCells colSpan={7} />
    if (editing) return <BirthRowEdit {...{ setEditing, rowData, setRowData }} />

    return <>
        <TableBodyCell>
            <EditControlButtons
                loading={loadingControls}
                onDelete={onDelete}
                setEditing={setEditing}
            />
        </TableBodyCell>
        <TableBodyCell>{rowData.motherInfo}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.calfBirthDate)}</TableBodyCell>
        <TableBodyCell align="center">{rowData.birthInterval ?? '1ª CRIA'}</TableBodyCell>
        <TableBodyCell align="center">{rowData.calfSex}</TableBodyCell>
        <TableBodyCell>{rowData.calfFather}</TableBodyCell>
        <TableBodyCell>{rowData.calfName}</TableBodyCell>
    </>
}

type BirthRowEditProps = {
    rowData: BirthEntry
    setRowData: (rowData: BirthEntry) => void
    setEditing: (editing: boolean) => void
}

const BirthRowEdit = ({ rowData, setEditing, setRowData }: BirthRowEditProps) => {

    const [loading, setLoading] = useState(false)

    const { handleSubmit, control } = useForm<BirthEntrySave>({
        defaultValues: {
            id: rowData.id,
            birthDate: rowData.calfBirthDate,
            sex: rowData.calfSex,
            fatherId: rowData.calfFatherId,
            observation: rowData.observation
        }
    })
    const { setError } = useContext(ErrorContext)

    const onSave: SubmitHandler<BirthEntrySave> = (data: BirthEntrySave) => {
        setLoading(true)
        updateBirth(data)
            .then(res => {
                setRowData(res)
                setError(undefined)
                setEditing(false)
            })
            .catch((error: APIError) => setError(error))
            .finally(() => setLoading(false))
    }

    return <>
        <TableBodyCell>
            <EditingControlButtons
                setEditing={setEditing}
                onSave={handleSubmit(onSave)}
                loading={loading}
            />
        </TableBodyCell>
        <TableBodyCell>{rowData.motherInfo}</TableBodyCell>
        <TableBodyCell>
            <FormDatePicker formProps={{ control, name: 'birthDate' }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.birthInterval ?? '1ª CRIA'}</TableBodyCell>
        <TableBodyCell>
            <FormComboBox
                items={SexValues}
                formProps={{ control, name: 'sex' }}
            />
        </TableBodyCell>
        <TableBodyCell>
            <FormSearchBox
                searchOptions={searchFather}
                formProps={{ control, name: 'fatherId' }}
            />
        </TableBodyCell>
        <TableBodyCell>{rowData.calfName}</TableBodyCell>
    </>
}
