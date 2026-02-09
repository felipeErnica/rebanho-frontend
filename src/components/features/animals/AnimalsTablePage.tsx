import { useCallback, useMemo, useRef, useState } from "react"
import { TableTopBar } from "@shared/table/TableTopBarComponents"
import { findAnimals, getAnimalsFoot, searchAnimal } from "./Service"
import { ComboBoxItem } from "@shared/common/ComboBox"
import { AnimalsFilter } from "./AnimalsFilter"
import { usePagination } from "@shared/table/PageTable"
import { Animal, AnimalFoot, AnimalSave, AnimalFilter, getAnimalLabel } from "./Entities"
import { Ref, useEffect } from "react"
import { transformAnimalType } from "./Entities"
import { dateTransform, decimalTransform } from "@utils/Transformations"
import { EditControlButtons, EditingControlButtons } from "@shared/table/ControlButtons"
import {
    VirtuosoResizeHeadCell,
    TableBodyCell,
    TableHeadRow,
    TableLoadingCells,
    TableFooterRow,
    FooterContent,
    TableHeadControlCell,
} from "@shared/table/TableComponents"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import { useVirtuosoComponents } from "@shared/table/PageTable"
import { EditRowProps, TableRowProp } from "@/components/shared/table/Entities"
import { SubmitHandler, useForm } from "react-hook-form"
import { FormTextField } from "@/components/shared/form-controls/FormTextField"
import { FormDatePicker } from "@/components/shared/form-controls/FormDatePicker"
import { FormSearchBox } from "@/components/shared/form-controls/FormSearchBox"
import { getPastureLabel } from "@features/farm-area/Entities"

export const AnimalsTablePage = () => {

    const defaultFoot: AnimalFoot = useMemo(() => ({ total: 0 }), [])
    const defaultSort = 'animal_order, birth_date'

    const [foot, setTotal] = useState(defaultFoot)
    const [order, setOrder] = useState('asc')
    const [sort, setSort] = useState(defaultSort)
    const [loading, setLoading] = useState(false)
    const [filterOpen, setFilterOpen] = useState(false)
    const [filter, setFilter] = useState<AnimalFilter>({ isFiltered: false })

    const fetchPage = useCallback((cursor?: string) => {
        const tableFilter = { ...filter, isFiltered: true, isOutsideAnimal: false }
        getAnimalsFoot(tableFilter)
            .then((response) => setTotal(response))
            .catch(() => setTotal(defaultFoot))
        return findAnimals(tableFilter, sort, order, cursor)
    }, [filter, sort, order, defaultFoot])

    const anchorEl = useRef<HTMLButtonElement>(null)
    const { rows, fetchNextPage, scrollRef } = usePagination<Animal>({ fetchPage, setLoading })

    const onReload = useCallback(() => setFilter({ isFiltered: false }), [])

    const sortColumns: ComboBoxItem[] = [
        { name: 'Brinco', value: defaultSort },
        { name: 'Nome', value: 'name, birth_date' },
        { name: 'Data de Nascimento', value: 'birth_date, animal_order' },
        { name: 'Data de Morte', value: 'death_date, animal_order' },
        { name: 'Intervalo de Partos Médio', value: 'average_birth_interval, animal_order' },
        { name: 'Intervalo de Lactações Médio', value: 'average_lac_interval, animal_order' },
        { name: 'Prod. Total Média', value: 'average_prod, animal_order' },
        { name: 'Média de Leite', value: 'average_milk, animal_order' },
        { name: 'Pico de Leite Médio', value: 'average_peak, animal_order' },
    ]

    return <div className="h-full w-full flex flex-col">
        <TableTopBar
            orderProps={{ order, setOrder }}
            sortProps={{ sort, setSort, sortColumns, defaultSort }}
            filterProps={{ anchorEl, setFilterOpen }}
            reloadProps={{ onReload, loading }}
        />
        <AnimalsTable {...{ rows, loading, fetchNextPage, scrollRef, foot }} />
        <AnimalsFilter {...{
            anchorEl,
            filterOpen,
            setFilterOpen,
            filter,
            setFilter,
        }} />
    </div>
}

type AnimalsTableProps = {
    rows: Animal[]
    loading: boolean
    scrollRef: Ref<VirtuosoHandle>
    fetchNextPage: () => void
    foot: AnimalFoot
}

const COL_COUNT = 13

export const AnimalsTable = ({
    rows,
    loading,
    scrollRef,
    fetchNextPage,
    foot
}: AnimalsTableProps) => {

    return <TableVirtuoso
        components={useVirtuosoComponents(COL_COUNT)}
        ref={scrollRef}
        data={rows}
        endReached={fetchNextPage}
        fixedHeaderContent={() => (
            <TableHeadRow>
                <TableHeadControlCell />
                <VirtuosoResizeHeadCell width={100}>Brinco</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={200}>Nome</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={180} align="center">Data de Nascimento</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={200}>Pai</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={200}>Mãe</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={200}>Pasto</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={200}>Tipo de Animal</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={150} align="center">Data de Morte</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={120} align="center">Prod. Média</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={150} align="center">Int. de Lac. Médio</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={180} align="center">Int. de Parto Médio</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={120} align="center">Pico Médio</VirtuosoResizeHeadCell>
            </TableHeadRow>
        )}
        fixedFooterContent={() => (
            <TableFooterRow colSpan={COL_COUNT}>
                <FooterContent title="Total de Animais" content={foot.total} />
                <FooterContent title="Prod. Média" content={decimalTransform(foot.averageProd)} />
                <FooterContent title="Int. de Lac. Médio" content={decimalTransform(foot.averageLacInterval)} />
                <FooterContent title="Int. de Parto Médio" content={decimalTransform(foot.averageBirthInterval)} />
                <FooterContent title="Pico Médio" content={decimalTransform(foot.averagePeak)} />
            </TableFooterRow>
        )}
        itemContent={(_, row: Animal) => <AnimalRow {...{ row, loading }} />}
    />
}

const AnimalRow = ({ row, loading }: TableRowProp<Animal>) => {

    const [loadingControls, setLoadingControls] = useState(false)
    const [editing, setEditing] = useState(false)
    const [rowData, setRowData] = useState(row)

    useEffect(() => setRowData(row), [row])

    const onDelete = () => {
        setLoadingControls(false)
        console.log("delete: ", rowData.id)
    }

    if (editing) return <EditingRow {...{ rowData, setEditing, setRowData }} />
    if (loading) return <TableLoadingCells colSpan={COL_COUNT} />

    return <>
        <TableBodyCell>
            <EditControlButtons {...{ onDelete, setEditing, loading: loadingControls }} />
        </TableBodyCell>
        <TableBodyCell>{rowData.tag}</TableBodyCell>
        <TableBodyCell>{rowData.name}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.birthDate)}</TableBodyCell>
        <TableBodyCell>{getAnimalLabel(rowData.father)}</TableBodyCell>
        <TableBodyCell>{getAnimalLabel(rowData.mother)}</TableBodyCell>
        <TableBodyCell>{getPastureLabel(rowData.pasture)}</TableBodyCell>
        <TableBodyCell>{transformAnimalType(rowData.animalType, rowData.sex)}</TableBodyCell>
        <TableBodyCell align="center">{dateTransform(rowData.deathDate)}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.averageProd)}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.averageProdInterval)}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.averageBirthInterval)}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.averagePeak)}</TableBodyCell>
    </>
}

const EditingRow = ({ rowData, setRowData, setEditing }: EditRowProps<Animal>) => {

    const [loading, setLoading] = useState(false)
    const [fathers, setFathers] = useState<Animal[]>([])
    const [mothers, setMothers] = useState<Animal[]>([])

    const { handleSubmit, control } = useForm<AnimalSave>({ defaultValues: rowData })

    const onSubmit: SubmitHandler<AnimalSave> = (data: AnimalSave) => {
        setLoading(true)
        setRowData(data as Animal)
        setLoading(false)
    }

    const onSave = handleSubmit(onSubmit)

    useEffect(() => {
        setLoading(true)
        Promise.all([
            searchAnimal({ isFiltered: true, sex: 'F', types: ['REPRODUCTION_ANIMAL'] }),
            searchAnimal({ isFiltered: true, sex: 'M', types: ['REPRODUCTION_ANIMAL'] }),
        ])
            .then(values => {
                setMothers(values[0])
                setFathers(values[1])
            })
            .catch(() => {
                setFathers([])
                setMothers([])
            })
            .finally(() => setLoading(false))
    }, [])

    return <>
        <TableBodyCell>
            <EditingControlButtons {...{ setEditing, loading, onSave }} />
        </TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'ringNumber' }} />
        </TableBodyCell>
        <TableBodyCell>
            <FormTextField formProps={{ control, name: 'name' }} />
        </TableBodyCell>
        <TableBodyCell align="center">
            <FormDatePicker formProps={{ control, name: 'birthDate' }} />
        </TableBodyCell>
        <TableBodyCell>
            <FormSearchBox
                formProps={{ control, name: 'fatherId' }}
                options={fathers.map(item => ({
                    id: item.id,
                    label: [item.tag, item.name].join(' - ')
                }))}
            />
        </TableBodyCell>
        <TableBodyCell>
            <FormSearchBox
                formProps={{ control, name: 'motherId' }}
                options={mothers.map(item => ({
                    id: item.id,
                    label: [item.tag, item.name].join(' - ')
                }))}
            />
        </TableBodyCell>
        <TableBodyCell>{transformAnimalType(rowData.animalType, rowData.sex)}</TableBodyCell>
        <TableBodyCell>{getPastureLabel(rowData.pasture)}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.averageProd, 1)}</TableBodyCell>
        <TableBodyCell align="center">{rowData.averageProdInterval}</TableBodyCell>
        <TableBodyCell align="center">{rowData.averageBirthInterval}</TableBodyCell>
        <TableBodyCell align="center">{decimalTransform(rowData.averagePeak, 1)}</TableBodyCell>
    </>
}
