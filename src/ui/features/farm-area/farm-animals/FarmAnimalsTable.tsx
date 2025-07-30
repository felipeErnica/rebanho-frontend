import { Ref, useEffect, useRef, useState } from "react"
import { AnimalFarm } from "./Entities"
import { EditRow, NormalRow } from "@/ui/shared/table/Entities"
import { dateTransformToLocale } from "@/util/Transformations"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { useForm } from "react-hook-form"
import {
    VirtuosoResizeHeadCell,
    TableBodyCell,
    TableHeadRow,
    TableLoadingCells,
    VirtuosoHeadCell,
    TableFooterRow,
    TableFooterTitleCell,
    TableFooterCell
} from "@/ui/shared/table/TableComponents"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { searchPasture, searchPastureById } from "@/shared/GlobalApiCalls"
import { transformAnimalType } from "../../animals/shared/AnimalEntities"
import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso"
import { VirtuosoTableComponents } from "@/ui/shared/table/PageTable"

type FarmAnimalsTableProps = {
    rows: AnimalFarm[]
    isLoading: boolean
    scrollRef: Ref<VirtuosoHandle>
    fetchNextPage: () => void
    total: number
}

export const FarmAnimalsTable = ({ 
    rows, 
    isLoading, 
    scrollRef, 
    fetchNextPage, 
    total 
}: FarmAnimalsTableProps) => {

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
        components={VirtuosoTableComponents}
        ref={scrollRef}
        scrollerRef={(ref) => tableRef.current = ref as HTMLDivElement}
        data={rows}
        endReached={fetchNextPage}
        fixedHeaderContent={() => {
            const unit = tableWidth/100
            return <TableHeadRow>
                <VirtuosoHeadCell width={unit*10} />
                <VirtuosoResizeHeadCell width={unit*5}>Brinco</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit*15}>Nome</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit*5}>Sexo</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit*15}>Data de Nascimento</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit*15}>Mãe</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit*10}>Pai</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit*15}>Tipo de Animal</VirtuosoResizeHeadCell>
                <VirtuosoResizeHeadCell width={unit*20}>Pasto</VirtuosoResizeHeadCell>
            </TableHeadRow>
        }}
        fixedFooterContent={() => (
            <TableFooterRow>
                <TableFooterTitleCell colSpan={2}>Total de Animais</TableFooterTitleCell>
                <TableFooterCell colSpan={7}>{total}</TableFooterCell>
            </TableFooterRow>
        )}
        itemContent={(_, row) => isLoading ? <TableLoadingCells colSpan={9} /> : <AnimalFarmRow {...row} />}
    />
}

const AnimalFarmRow = (row: AnimalFarm) => {

    const [isEditing, setEditing] = useState(false)
    const [rowValue, setRowValue] = useState(row)

    if (isEditing) return <AnimalFarmEditRow {...{ setRowValue, setEditing, rowValue }} />
    return <AnimalFarmNormalRow {...{ setEditing, rowValue }} />
}

const AnimalFarmNormalRow = ({ rowValue, setEditing }: NormalRow<AnimalFarm>) => {
    return <>
        <TableBodyCell>
            <EditControlButtons
                setEditing={setEditing}
                onDelete={() => console.log("delete", rowValue.name)}
            />
        </TableBodyCell>
        <TableBodyCell>{rowValue.ringNumber}</TableBodyCell>
        <TableBodyCell>{rowValue.name}</TableBodyCell>
        <TableBodyCell>{rowValue.sex}</TableBodyCell>
        <TableBodyCell>{dateTransformToLocale(rowValue.birthDate)}</TableBodyCell>
        <TableBodyCell>{rowValue.motherName}</TableBodyCell>
        <TableBodyCell>{rowValue.fatherName}</TableBodyCell>
        <TableBodyCell>{transformAnimalType(rowValue.animalType, rowValue.sex)}</TableBodyCell>
        <TableBodyCell>{rowValue.pastureName}</TableBodyCell>
    </>
}

const AnimalFarmEditRow = ({ rowValue, setEditing, setRowValue }: EditRow<AnimalFarm>) => {

    const { handleSubmit, control, setValue } = useForm({ defaultValues: rowValue })

    const onSubmit = (data: AnimalFarm) => {
        console.log("data", data)
        setRowValue(data)
    }

    const handlePastureSearch = (input?: string) => searchPasture(input, rowValue.farmId)
    const handlePastureSearchById = (id?: string) => searchPastureById(id, rowValue.farmId)

    return <>
        <TableBodyCell>
            <EditingControlButtons
                setEditing={setEditing}
                onSave={handleSubmit(onSubmit)}
            />
        </TableBodyCell>
        <TableBodyCell>{rowValue.ringNumber}</TableBodyCell>
        <TableBodyCell>{rowValue.name}</TableBodyCell>
        <TableBodyCell>{rowValue.sex}</TableBodyCell>
        <TableBodyCell>{dateTransformToLocale(rowValue.birthDate)}</TableBodyCell>
        <TableBodyCell>{rowValue.motherName}</TableBodyCell>
        <TableBodyCell>{rowValue.fatherName}</TableBodyCell>
        <TableBodyCell>{transformAnimalType(rowValue.animalType, rowValue.sex)}</TableBodyCell>
        <TableBodyCell>
            <FormSearchBox
                searchByInput={handlePastureSearch}
                searchById={handlePastureSearchById}
                onChange={(_, label) => setValue('pastureName', label)}
                formProps={{
                    control,
                    name: 'pastureId'
                }}
            />
        </TableBodyCell>
    </>
}
