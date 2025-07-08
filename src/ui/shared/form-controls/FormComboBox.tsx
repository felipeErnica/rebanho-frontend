import { Controller, FieldValues, UseControllerProps } from "react-hook-form"
import { ComboBoxItem } from "../common/ComboBox"
import Autocomplete from "@mui/material/Autocomplete"
import { useState } from "react"
import TextField, { TextFieldVariants } from "@mui/material/TextField"

type FormComboBox<T extends FieldValues> = {
    label?: string
    className?: string
    variant?: TextFieldVariants
    items: ComboBoxItem[]
    formProps: UseControllerProps<T>
}

export const FormComboBox = <T extends FieldValues>({
    label,
    className,
    items,
    variant,
    formProps
}: FormComboBox<T>) => {

    const [inputValue, setInputValue] = useState<string>('')

    return <Controller
        {...formProps}
        render={({ field, fieldState: { error } }) => (
            <Autocomplete
                {...field}
                value={items.find(item => {
                    const itemValue = item.value || item.name
                    return itemValue === field.value
                })}
                multiple={false}
                inputValue={inputValue}
                options={items}
                noOptionsText='Nenhum resultado encontrado'
                getOptionLabel={(option) => option?.name}
                clearOnEscape
                autoHighlight
                openOnFocus
                autoSelect
                onInputChange={(_, value: string) => setInputValue(value)}
                onChange={(_, value) => {
                    if (!value) {
                        field.onChange('')
                        return
                    }
                    field.onChange(value.value || value.name)
                }}
                renderInput={(params) => {
                    return <TextField
                        {...params}
                        error={!!error}
                        className={className}
                        size="small"
                        variant={variant || 'outlined'}
                        label={label}
                    />
                }}
            />
        )}
    />
}
