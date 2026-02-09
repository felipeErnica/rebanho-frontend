import { Animal, getAnimalLabel } from "@features/animals/Entities"
import { searchAnimal } from "@features/animals/Service"
import Add from "@mui/icons-material/Add"
import { Button } from "@mui/material"
import { ComboBoxItem } from "@shared/common/ComboBox"
import { ErrorDialog, YesNoDialog, YesNoDialogProps } from "@shared/dialog/DialogComponents"
import { FormComboBox } from "@shared/form-controls/FormComboBox"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { DefaultWarning, ERROR_TYPE } from "@shared/Globals"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { usePagination, useVirtuosoComponents } from "@shared/table/PageTable"
import {
    FooterContent,
    TableBodyCell,
    TableFooterRow,
    TableHeadControlCell,
    TableHeadRow,
    VirtuosoHeadCell,
    VirtuosoResizeHeadCell,
    VirtuosoRowRender
} from "@shared/table/TableComponents"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import { APIError } from "@utils/ApiRequest"
import { SexValues } from "@utils/enums"
import { dateTransform, decimalTransform } from "@utils/Transformations"
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
import { SubmitHandler, useForm } from "react-hook-form"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import { AddBirthDialog } from "./AddBirthDialog"
import { BirthFilter } from "./BirthFilter"
import { BirthEntry, BirthEntryFilter, BirthEntrySave, BirthFooter } from "./Entities"
import { deleteBirth, findBirthsPage, findBirthsPageFooter, updateBirth } from "./Service"

type ErrorContextProps = {
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setWarningProps: Dispatch<SetStateAction<YesNoDialogProps>>
    setRows: Dispatch<SetStateAction<BirthEntry[]>>
    loadFoot: () => void
}

const ErrorContext = createContext<ErrorContextProps>(undefined!)

export const BirthTablePage = () => {

    const DEFAULT_SORT = 'mother_order,calf_birth_date'

    const [loading, setLoading] = useState(false)
    const [sort, setSort] = useState(DEFAULT_SORT)
    const [order, setOrder] = useState('asc')
    const [filter, setFilter] = useState<BirthEntryFilter>({ isFiltered: false })
    const [filterOpen, setFilterOpen] = useState(false)
    const [footerData, setFooterData] = useState<BirthFooter>({ total: 0, intervalAverage: 0 })

    const [addBirthOpen, setAddBirthOpen] = useState(false)
    const [error, setError] = useState<APIError>()
    const [warningProps, setWarningProps] = useState<YesNoDialogProps>(DefaultWarning)
    const anchorEl = useRef<HTMLButtonElement>(null)

    const loadFoot = useCallback(() => {
        findBirthsPageFooter(filter)
            .then(response => setFooterData(response))
            .catch(() => setFooterData({ total: 0, intervalAverage: 0 }))
    }, [filter])

    const fetchPage = useCallback((cursor?: string) => {
        setLoading(true)
        loadFoot()
        return findBirthsPage(sort, order, filter, cursor)
    }, [loadFoot, sort, order, filter])

    const otherActions = (
        <Button
            startIcon={<Add />}
            onClick={() => setAddBirthOpen(true)}
        >
            Adicionar Parição
        </Button>
    )

    const { rows, scrollRef, fetchNextPage, setRows, onReload } = usePagination<BirthEntry>({ fetchPage, setLoading })
    const sortColumns: ComboBoxItem[] = [
        { name: 'Brinco da Mãe', value: DEFAULT_SORT },
        { name: 'Nome da Mãe', value: 'mother_name, calf_birth_date' },
        { name: 'Data de Nascimento', value: 'calf_birth_date, mother_order' },
        { name: 'Intervalo entre Partos', value: 'birth_interval, mother_order' },
    ]

    const closeBirthDialog = useCallback((added?: boolean) => {
        setAddBirthOpen(false)
        if (!added) return
        onReload()
    }, [onReload])

    return <div className="w-full h-full flex flex-col">
        <TableTopBar
            sortProps={{ defaultSort: DEFAULT_SORT, sort, setSort, sortColumns }}
            filterProps={{ setFilterOpen, anchorEl }}
            orderProps={{ order, setOrder }}
            reloadProps={{ loading, onReload }}
            otherProps={otherActions}
        />
        <ErrorContext.Provider value={{ setError, setWarningProps, setRows, loadFoot }}>
            <BirthTable {...{ rows, scrollRef, fetchNextPage, loading, footerData }} />
        </ErrorContext.Provider>
        <BirthFilter {...{ setFilterOpen, filterOpen, filter, setFilter, anchorEl }} />
        <ErrorDialog
            openError={!!error}
            onClose={() => setError(undefined)}
            title={error?.title}
            message={error?.message}
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
    loading: boolean
}

const COLUMN_COUNT = 8

const BirthTable = ({ rows, scrollRef, fetchNextPage, loading, footerData }: BirthTableProps) => {

    console.log(rows)

    return <TableVirtuoso
        ref={scrollRef}
        endReached={fetchNextPage}
        data={rows.map(item => ({ ...item, id: item.calf.id }))}
        components={useVirtuosoComponents(COLUMN_COUNT)}
        fixedHeaderContent={() => (
            <TableHeadRow>
                <TableHeadControlCell />
                <VirtuosoResizeHeadCell width={300}>Mãe</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={200}>Data de Nascimento</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={180}>Intervalo entre Partos</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={80}>Sexo</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={250}>Pai</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={250}>Informações da Cria</VirtuosoResizeHeadCell>
                <VirtuosoHeadCell width={600}>Observações</VirtuosoHeadCell>
            </TableHeadRow>
        )}
        fixedFooterContent={() => {
            return <TableFooterRow colSpan={COLUMN_COUNT}>
                <FooterContent title="Total" content={footerData.total} />
                <FooterContent title="Intervalo Médio" content={decimalTransform(footerData.intervalAverage)} />
            </TableFooterRow>
        }}
        itemContent={index => (
            <VirtuosoRowRender
                colSpan={COLUMN_COUNT}
                loading={loading}
                render={() => {
                    const data = rows[index]
                    return <BirthRow {...{ data }} />
                }}
            />
        )}
    />
}

type BirthRowProps = {
    data: BirthEntry
}

const BirthRow = ({ data }: BirthRowProps) => {

    const [editing, setEditing] = useState(false)
    const [rowData, setRowData] = useState<BirthEntry>(data)
    const [loading, setLoading] = useState(false)

    const { setError, setWarningProps, setRows, loadFoot } = useContext(ErrorContext)

    useEffect(() => setRowData(data), [data])

    const calfName = useMemo(() => {
        if (!data.calf.name) return "-"
        return getAnimalLabel(data.calf)
    }, [data])

    const onDelete = useCallback((skipValidation: boolean) => {
        setLoading(true)
        deleteBirth(data.calf.id, skipValidation)
            .then(() => {
                setError(undefined)
                setWarningProps(DefaultWarning)
                setRows(prev => prev.filter(item => item.calf.id != data.calf.id))
                loadFoot()
            })
            .catch((error: APIError) => {
                if (error.errType === ERROR_TYPE) {
                    setError(error)
                    return
                }
                setWarningProps({
                    openYesNo: true,
                    title: error.title,
                    message: error.message,
                    onYes: () => onDelete(true),
                    onClose: () => setWarningProps(DefaultWarning)
                })
            })
            .finally(() => setLoading(false))
    }, [data, loadFoot, setError, setRows, setWarningProps])

    if (editing) return <BirthRowEdit {...{ setEditing, rowData, setRowData }} />

    return <>
        <TableBodyCell>
            <EditControlButtons
                loading={loading}
                onDelete={() => onDelete(false)}
                setEditing={setEditing}
            />
        </TableBodyCell>
        <TableBodyCell>{getAnimalLabel(rowData.mother)}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.calf.birthDate)}</TableBodyCell>
        <TableBodyCell align="center">{rowData.birthInterval ?? '1ª CRIA'}</TableBodyCell>
        <TableBodyCell align="center">{rowData.calf.sex}</TableBodyCell>
        <TableBodyCell>{getAnimalLabel(rowData.father)}</TableBodyCell>
        <TableBodyCell>{calfName}</TableBodyCell>
        <TableBodyCell>{rowData.calf.observation}</TableBodyCell>
    </>
}

type BirthRowEditProps = {
    rowData: BirthEntry
    setRowData: (rowData: BirthEntry) => void
    setEditing: (editing: boolean) => void
}

const BirthRowEdit = ({ rowData, setEditing, setRowData }: BirthRowEditProps) => {

    const [loading, setLoading] = useState(false)
    const [loadingControls, setLoadingControls] = useState(false)
    const [fathers, setFathers] = useState<Animal[]>([])

    useEffect(() => {
        setLoadingControls(true)
        searchAnimal({ isFiltered: true, sex: 'M', types: ['REPRODUCTION_ANIMAL'] })
            .then(response => setFathers(response))
            .catch(() => setFathers([]))
            .finally(() => setLoadingControls(false))
    }, [])

    const calfName = useMemo(() => {
        if (!rowData.calf.name) return "-"
        return getAnimalLabel(rowData.calf)
    }, [rowData])

    const { handleSubmit, control, setValue } = useForm<BirthEntrySave>({
        defaultValues: {
            id: rowData.calf.id,
            birthDate: rowData.calf.birthDate,
            sex: rowData.calf.sex,
            motherId: rowData.mother.id,
            fatherId: rowData.father?.id,
            observation: rowData.calf.observation
        }
    })
    const { setError, setWarningProps, loadFoot } = useContext(ErrorContext)

    const onSave: SubmitHandler<BirthEntrySave> = (data: BirthEntrySave) => {
        setLoading(true)
        updateBirth(data)
            .then(res => {
                setRowData(res)
                setError(undefined)
                setWarningProps(DefaultWarning)
                loadFoot()
                setEditing(false)
            })
            .catch((error: APIError) => {
                if (error.errType === ERROR_TYPE) {
                    setError(error)
                    return
                }
                setWarningProps({
                    openYesNo: true,
                    title: error.title,
                    message: error.message,
                    onClose: () => setWarningProps(DefaultWarning),
                    onYes: () => {
                        setValue('ignoreTag', true)
                        handleSubmit(onSave)
                    }
                })
            })
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
        <TableBodyCell>{getAnimalLabel(rowData.mother)}</TableBodyCell>
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
                loading={loadingControls}
                options={fathers.map(item => ({
                    id: item.id,
                    label: getAnimalLabel(item)
                }))}
                formProps={{ control, name: 'fatherId' }}
            />
        </TableBodyCell>
        <TableBodyCell>{calfName}</TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'observation' }} />
        </TableBodyCell>
    </>
}
