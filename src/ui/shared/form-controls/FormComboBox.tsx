import { Controller, FieldValues, UseControllerProps } from "react-hook-form"
import { ComboBoxItem } from "../common/ComboBox"
import Autocomplete from "@mui/material/Autocomplete"
import { useState } from "react"
import TextField from "@mui/material/TextField"

type FormComboBox<T extends FieldValues> = {
    label: string
    className?: string
    items: ComboBoxItem[]
    formProps: UseControllerProps<T>
}

export const FormComboBox = <T extends FieldValues>({
    label,
    className,
    items,
    formProps
}: FormComboBox<T>) => {

    const [inputValue, setInputValue] = useState<string>('')

    return <Controller
        {...formProps}
        render={({ field, fieldState: { error } }) => (
            <Autocomplete
                {...field}
                value={items.find(item => item.value === field.value) || null}
                inputValue={inputValue}
                options={items}
                noOptionsText='Nenhum resultado encontrado'
                isOptionEqualToValue={(option, value) => option.value === value.value}
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
                    field.onChange(value.value)
                }}
                renderInput={(params) => {
                    return <TextField
                        {...params}
                        error={!!error}
                        className={className}
                        size="small"
                        variant='outlined'
                        label={label}
                    />
                }}
            />
        )}
    />
}
