import IconButton from "@mui/material/IconButton";
import { RowsProps } from "../TableRows";
import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import { Control, SubmitHandler, useForm, UseFormSetValue } from "react-hook-form";
import { IData } from "@/shared/interfaces/Filter";
import { ColumnProps } from "../TableCustom";
import { FormDatePicker } from "../../form-controls/FormDatePicker";
import { FormComboBox } from "../../form-controls/FormComboBox";
import { FormTextField } from "../../form-controls/FormTextField";
import { TableCell } from "@mui/material";

type EditableRowProps = RowsProps & {
    setEditableRow: (isEditableRow: boolean) => void
}

type EditableControlsProps = {
    value: any
    column: ColumnProps
    control: Control<IData>
    setValue: UseFormSetValue<IData>
}

const EditableControls = ({ value, column, control, setValue }: EditableControlsProps) => {

    if (!column.isEditable) return <span>{value}</span>
    if (column.editComponent) return column.editComponent(control, setValue)
    if (!column.type) return <span>{value}</span>

    if (column.type === 'date' || column.type === 'datetime-local') {
        return <FormDatePicker
            variant="standard"
            formProps={{
                control,
                name: column.name
            }}
        />
    }

    if (column.type === 'combobox') {
        if (!column.items) return <span>{value}</span>
        return <FormComboBox
            items={column.items}
            variant="standard"
            formProps={{
                control,
                name: column.name
            }}
        />
    }

    return <FormTextField
        type={column.type}
        variant="standard"
        formProps={{
            control,
            name: column.name,
        }}
    />

}

export function EditableRow({ row, columns, onSaveRow, setEditableRow }: EditableRowProps) {

    const { handleSubmit, control, setValue } = useForm({ defaultValues: row })

    const onSubmit: SubmitHandler<IData> = (data: IData) => {
        if (onSaveRow) {
            onSaveRow(data)
            Object.keys(row).forEach(entry => row[entry] = data[entry])
        }
        setEditableRow(false)
    }

    const EditButtons = () => {
        return <div className="flex flex-row gap-2">
            <IconButton onClick={handleSubmit(onSubmit)} >
                <Check />
            </IconButton>
            <IconButton onClick={() => setEditableRow(false)} >
                <Close />
            </IconButton>
        </div>
    }

    return columns.map((column, index) => {
        const value = column.format ? column.format(row[column.name]) : row[column.name]
        return <TableCell
            align={column.align}
            className="border-b border-b-gray-400 overflow-hidden text-nowrap overflow-ellipsis"
        >
            <div className="flex flex-row gap-6 items-center">
                {index === 0 && EditButtons()}
                <EditableControls {...{ value, column, control, setValue }} />
            </div>
        </TableCell>
    })
}
