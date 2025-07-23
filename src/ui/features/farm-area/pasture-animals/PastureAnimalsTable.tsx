
import { Skeleton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import { useState } from "react"
import { EditRow, NormalRow } from "@/ui/shared/table/Entities"
import { dateTransformToLocale } from "@/util/Transformations"
import { EditControlButtons, EditingControlButtons } from "@/ui/shared/table/ControlButtons"
import { useForm } from "react-hook-form"
import { animalTypeToComboBox, transformAnimalType } from "../../animals/shared/AnimalEntities"
import { 
    ResizableTableHeadCell, 
    TableBodyCell, 
    TableBodyRow, 
    TableHeadCell, 
    TableHeadRow 
} from "@/ui/shared/table/TableComponents"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"
import { FormComboBox } from "@/ui/shared/form-controls/FormComboBox"
import { SexValues } from "@/shared/entities/enums"
import { FormDatePicker } from "@/ui/shared/form-controls/FormDatePicker"
import { FormSearchBox } from "@/ui/shared/form-controls/FormSearchBox"
import { PastureAnimal } from "./Entities"
import { searchFather, searchMother } from "@/shared/GlobalApiCalls"

type PastureAnimalsTableProps = {
    rows: PastureAnimal[]
    isLoading: boolean
}

export const PastureAnimalsTable = ({ rows, isLoading }: PastureAnimalsTableProps) => {
    return <div className="h-full w-full overflow-auto">
        <Table stickyHeader className="w-max min-w-full">
            <TableHead className="bg-gray-700">
                <TableHeadRow>
                    <TableHeadCell />
                    <ResizableTableHeadCell>Brinco</ResizableTableHeadCell>
                    <ResizableTableHeadCell>Nome</ResizableTableHeadCell>
                    <ResizableTableHeadCell>Sexo</ResizableTableHeadCell>
                    <ResizableTableHeadCell>Data de Nascimento</ResizableTableHeadCell>
                    <ResizableTableHeadCell>Data de Morte</ResizableTableHeadCell>
                    <ResizableTableHeadCell>Mãe</ResizableTableHeadCell>
                    <ResizableTableHeadCell>Pai</ResizableTableHeadCell>
                    <ResizableTableHeadCell>Tipo de Animal</ResizableTableHeadCell>
                </TableHeadRow>
            </TableHead>
            <TableBody>
                {isLoading &&
                    <TableCell colSpan={10}>
                        <Skeleton animation='pulse' variant="rectangular" />
                    </TableCell>
                }
                {!isLoading && rows.map(row => <PastureAnimalRow {...row} />)}
            </TableBody>
        </Table>
    </div>
}

const PastureAnimalRow = (row: PastureAnimal) => {

    const [isEditing, setEditing] = useState(false)
    const [rowValue, setRowValue] = useState(row)

    if (isEditing) return <PastureAnimalEditRow {...{ setRowValue, setEditing, rowValue }} />
    return <PastureAnimalNormalRow {...{ setEditing, rowValue }} />
}

const PastureAnimalNormalRow = ({ rowValue, setEditing }: NormalRow<PastureAnimal>) => {
    return <TableBodyRow>
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
        <TableBodyCell>{dateTransformToLocale(rowValue.deathDate)}</TableBodyCell>
        <TableBodyCell>{rowValue.motherName}</TableBodyCell>
        <TableBodyCell>{rowValue.fatherName}</TableBodyCell>
        <TableBodyCell>{transformAnimalType(rowValue.animalType, rowValue.sex)}</TableBodyCell>
    </TableBodyRow>
}

const PastureAnimalEditRow = ({ rowValue, setEditing, setRowValue }: EditRow<PastureAnimal>) => {

    const { handleSubmit, control, setValue } = useForm({ defaultValues: rowValue })

    const onSubmit = (data: PastureAnimal) => {
        console.log("data", data)
        setRowValue(data)
    }

    return <TableRow>
        <TableBodyCell>
            <EditingControlButtons
                setEditing={setEditing}
                onSave={handleSubmit(onSubmit)}
            />
        </TableBodyCell>
        <TableBodyCell>
            <FormTextField
                formProps={{
                    control,
                    name: 'ringNumber'
                }}
            />
        </TableBodyCell>
        <TableBodyCell>
            <FormTextField
                formProps={{
                    control,
                    name: 'name'
                }}
            />
        </TableBodyCell>
        <TableBodyCell>
            <FormComboBox
                items={SexValues}
                formProps={{
                    control,
                    name: 'sex'
                }}
            />
        </TableBodyCell>
        <TableBodyCell>
            <FormDatePicker
                formProps={{
                    control,
                    name: 'birthDate'
                }}
            />
        </TableBodyCell>
        <TableBodyCell>
            <FormDatePicker
                formProps={{
                    control,
                    name: 'deathDate'
                }}
            />
        </TableBodyCell>
        <TableBodyCell>
            <FormSearchBox
                fetchOptions={searchMother}
                valueLabel={rowValue.motherName}
                onChange={(_, label) => setValue('motherName', label)}
                formProps={{
                    control,
                    name: 'motherId'
                }}
            />
        </TableBodyCell>
        <TableBodyCell>
            <FormSearchBox
                fetchOptions={searchFather}
                valueLabel={rowValue.fatherName}
                onChange={(_, label) => setValue('fatherName', label)}
                formProps={{
                    control,
                    name: 'fatherId'
                }}
            />
        </TableBodyCell>
        <TableBodyCell>
            <FormComboBox
                items={animalTypeToComboBox()}
                formProps={{
                    control,
                    name: 'animalType'
                }}
            />
        </TableBodyCell>
    </TableRow>
}
