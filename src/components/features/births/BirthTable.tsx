import { useVirtuosoComponents, usePagination } from "@shared/table/PageTable"
import {
    FooterContent,
    TableBodyCell,
    TableFooterRow,
    TableHeadControlCell,
    TableHeadRow,
    TableLoadingCells,
    VirtuosoHeadCell,
    VirtuosoResizeHeadCell
} from "@shared/table/TableComponents"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import {
    createContext,
    Dispatch,
    RefObject,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from "react"
import { deleteBirth, findBirthsPage, findBirthsPageFooter, updateBirth } from "./Service"
import { ComboBoxItem } from "@shared/common/ComboBox"
import { BirthEntry, BirthEntryFilter, BirthEntrySave, BirthFooter } from "./Entities"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import { dateTransform, decimalTransform } from "@utils/Transformations"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@shared/form-controls/FormDatePicker"
import { FormComboBox } from "@shared/form-controls/FormComboBox"
import { SexValues } from "@utils/enums"
import { FormSearchBox } from "@shared/form-controls/FormSearchBox"
import { BirthFilter } from "./BirthFilter"
import { Button } from "@mui/material"
import Add from "@mui/icons-material/Add"
import { APIError } from "@utils/ApiRequest"
import { ErrorDialog, YesNoDialog, YesNoDialogProps } from "@shared/dialog/DialogComponents"
import { DefaultWarning, ERROR_TYPE } from "@shared/Globals"
import { AddBirthDialog } from "./AddBirthDialog"
import { FormTextField } from "@shared/form-controls/FormTextField"
import { Animal, getAnimalLabel } from "@features/animals/Entities"
import { searchAnimal } from "@features/animals/Service"

type ErrorContextProps = {
    setError: Dispatch<SetStateAction<APIError | undefined>>
    setWarningProps: Dispatch<SetStateAction<YesNoDialogProps>>
    setRows: Dispatch<SetStateAction<BirthEntry[]>>
    loadFoot: () => void
}

const ErrorContext = createContext<ErrorContextProps>(undefined!)

export const BirthTablePage = () => {

    const DEFAULT_SORT = 'mother_order,calf_birth_date'

    const [isLoading, setLoading] = useState(false)
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
            reloadProps={{ loading: isLoading, onReload }}
            otherProps={otherActions}
        />
        <ErrorContext.Provider value={{ setError, setWarningProps, setRows, loadFoot }}>
            <BirthTable {...{ rows, scrollRef, fetchNextPage, isLoading, footerData }} />
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
    isLoading: boolean
}

const BirthTable = ({ rows, scrollRef, fetchNextPage, isLoading, footerData }: BirthTableProps) => {

    return <TableVirtuoso
        ref={scrollRef}
        endReached={fetchNextPage}
        data={rows}
        components={useVirtuosoComponents(8)}
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
            return <TableFooterRow colSpan={8}>
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

    const { setError, setWarningProps, setRows, loadFoot } = useContext(ErrorContext)

    useEffect(() => setRowData(data), [data])

    const onDelete = useCallback((skipValidation: boolean) => {
        setLoadingControls(true)
        deleteBirth(data.id, skipValidation)
            .then(() => {
                setError(undefined)
                setWarningProps(DefaultWarning)
                setRows(prev => prev.filter(item => item.id != data.id))
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
            .finally(() => setLoadingControls(false))
    }, [data.id, loadFoot, setError, setRows, setWarningProps])

    if (isLoading) return <TableLoadingCells colSpan={8} />
    if (editing) return <BirthRowEdit {...{ setEditing, rowData, setRowData }} />

    return <>
        <TableBodyCell>
            <EditControlButtons
                loading={loadingControls}
                onDelete={() => onDelete(false)}
                setEditing={setEditing}
            />
        </TableBodyCell>
        <TableBodyCell>{rowData.motherInfo}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.calfBirthDate)}</TableBodyCell>
        <TableBodyCell align="center">{rowData.birthInterval ?? '1ª CRIA'}</TableBodyCell>
        <TableBodyCell align="center">{rowData.calfSex}</TableBodyCell>
        <TableBodyCell>{rowData.calfFather}</TableBodyCell>
        <TableBodyCell>{rowData.calfName}</TableBodyCell>
        <TableBodyCell>{rowData.observation}</TableBodyCell>
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

    const { handleSubmit, control, setValue } = useForm<BirthEntrySave>({
        defaultValues: {
            id: rowData.id,
            birthDate: rowData.calfBirthDate,
            sex: rowData.calfSex,
            motherId: rowData.motherId,
            fatherId: rowData.calfFatherId,
            observation: rowData.observation
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
                loading={loadingControls}
                options={fathers.map(item => ({
                    id: item.id,
                    label: getAnimalLabel(item)
                }))}
                formProps={{ control, name: 'fatherId' }}
            />
        </TableBodyCell>
        <TableBodyCell>{rowData.calfName}</TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'observation' }} />
        </TableBodyCell>
    </>
}
