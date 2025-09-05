import { usePagination, VirtuosoTableComponents } from "@/ui/shared/table/PageTable"
import {
    FooterContent,
    TableBodyCell,
    TableFooterCell,
    TableFooterRow,
    TableHeadRow,
    TableLoadingCells,
    VirtuosoHeadCell,
    VirtuosoResizeHeadCell
} from "@/ui/shared/table/TableComponents"
import { TableTopBar } from "@/ui/shared/table/TableTopBarComponents"
import { RefObject, useCallback, useEffect, useRef, useState } from "react"
import { findBirthsPage, findBirthsPageFooter } from "./Controller"
import { ComboBoxItem } from "@/ui/shared/common/ComboBox"
import { BirthEntry, BirthEntryFilter, BirthFooter } from "./Entities"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { dateTransform, decimalTransform } from "@/util/Transformations"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { FormComboBox } from "@/ui/shared/form-controls/FormComboBox"
import { SexValues } from "@/shared/entities/enums"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { searchFather } from "@/shared/GlobalApiCalls"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { BirthFilter } from "./BirthFilter"
import { Button } from "@mui/material"
import Add from "@mui/icons-material/Add"

export const BirthTablePage = () => {

    const DEFAULT_SORT = 'mother_order,calf_birth_date'

    const [isLoading, setLoading] = useState(false)
    const [sort, setSort] = useState(DEFAULT_SORT)
    const [order, setOrder] = useState('asc')
    const [filter, setFilter] = useState<BirthEntryFilter>({ isFiltered: false })
    const [isFilterOpen, setFilterOpen] = useState(false)
    const [footerData, setFooterData] = useState<BirthFooter>({ total: 0, intervalAverage: 0 })

    const anchorEl = useRef<HTMLButtonElement>(null)

    const fetchPage = useCallback((cursor?: string) => {
        setLoading(true)
        findBirthsPageFooter(filter)
            .then(response => setFooterData(response.json))
            .catch(() => setFooterData({ total: 0, intervalAverage: 0 }))
        return findBirthsPage(sort, order, filter, cursor)
    }, [order, sort, filter])

    const onReload = useCallback(() => setFilter({ isFiltered: false }), [])
    const otherActions = (
        <Button startIcon={<Add />} variant="outlined">
            Adicionar Parição
        </Button>
    )

    const { rows, scrollRef, fetchNextPage } = usePagination<BirthEntry>({ fetchPage, setLoading })
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
        <BirthTable {...{ rows, scrollRef, fetchNextPage, isLoading, footerData }} />
        <BirthFilter {...{ setFilterOpen, filterOpen: isFilterOpen, filter, setFilter, anchorEl }} />
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
        components={VirtuosoTableComponents}
        fixedHeaderContent={() => {

            const unit = tableWidth / 100

            return <TableHeadRow>
                <VirtuosoHeadCell width={unit * 10}></VirtuosoHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Mãe</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 10}>Data de Nascimento</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 10}>Intervalo entre Partos</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell align="center" width={unit * 5}>Sexo</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 10}>Pai</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 15}>Informações da Cria</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit * 25}>Observações da Parição</VirtuosoResizeHeadCell>
            </TableHeadRow>
        }}
        fixedFooterContent={() => {
            return <TableFooterRow>
                <TableFooterCell>
                    <FooterContent title="Total" content={footerData.total} />
                </TableFooterCell>
                <TableFooterCell colSpan={2} />
                <TableFooterCell>
                    <FooterContent title="Intervalo Médio" content={decimalTransform(footerData.intervalAverage)} />
                </TableFooterCell>
                <TableFooterCell colSpan={4} />
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

    useEffect(() => setRowData(data), [data])
    const onDelete = useCallback(() => console.log(data), [data])

    if (isLoading) return <TableLoadingCells colSpan={8} />
    if (editing) return <BirthRowEdit {...{ setEditing, rowData, setRowData }} />

    return <>
        <TableBodyCell>
            <EditControlButtons
                onDelete={onDelete}
                setEditing={setEditing}
            />
        </TableBodyCell>
        <TableBodyCell>{rowData.motherName}</TableBodyCell>
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

    const { handleSubmit, control, setValue } = useForm<BirthEntry>({ defaultValues: rowData })

    const onSave: SubmitHandler<BirthEntry> = (data: BirthEntry) => {
        setRowData(data)
    }

    return <>
        <TableBodyCell>
            <EditingControlButtons setEditing={setEditing} onSave={handleSubmit(onSave)} />
        </TableBodyCell>
        <TableBodyCell>{rowData.motherName}</TableBodyCell>
        <TableBodyCell>
            <FormDatePicker
                formProps={{
                    control,
                    name: 'calfBirthDate'
                }}
            />
        </TableBodyCell>
        <TableBodyCell>{rowData.birthInterval ?? '1ª CRIA'}</TableBodyCell>
        <TableBodyCell>
            <FormComboBox
                items={SexValues}
                formProps={{
                    control,
                    name: 'calfSex'
                }}
            />
        </TableBodyCell>
        <TableBodyCell>
            <FormSearchBox
                searchOptions={searchFather}
                onChange={(_, value) => setValue('calfFather', value)}
                formProps={{
                    control,
                    name: 'calfFatherId'
                }}
            />
        </TableBodyCell>
        <TableBodyCell>{rowData.calfName}</TableBodyCell>
        <TableBodyCell>
            <FormTextField
                formProps={{
                    control,
                    name: 'observation'
                }}
            />
        </TableBodyCell>
    </>
}
