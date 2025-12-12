import { Controller, FieldValues, UseControllerProps } from "react-hook-form"
import { ComboBoxItem } from "@shared/common/ComboBox"
import Autocomplete from "@mui/material/Autocomplete"
import { HTMLAttributes, ReactNode, useState } from "react"
import TextField, { TextFieldVariants } from "@mui/material/TextField"

type FormComboBox<T extends FieldValues> = {
    label?: string
    className?: string
    variant?: TextFieldVariants
    items: ComboBoxItem[]
    formProps: UseControllerProps<T>
    onChange?: (value?: string) => void
    renderOption?: (props: HTMLAttributes<HTMLLIElement> & { key: any }, option: ComboBoxItem) => ReactNode
    renderValue?: (value: ComboBoxItem, getItemProps: (args?: { index?: number }) => {
        className: string
        disabled: boolean
        tabIndex: -1
        "data-item-index": number
        onDelete: (event: any) => void
    }) => ReactNode
}

export const FormComboBox = <T extends FieldValues>({
    label,
    className,
    items,
    variant,
    formProps,
    onChange,
    renderOption,
    renderValue
}: FormComboBox<T>) => {

    const [inputValue, setInputValue] = useState<string>('')

    return <Controller
        {...formProps}
        render={({ field, fieldState: { error } }) => (
            <Autocomplete
                {...field}
                value={items.find(item => item.value === field.value) ?? null}
                multiple={false}
                inputValue={inputValue}
                options={items}
                noOptionsText='Nenhum resultado encontrado'
                getOptionLabel={(option) => option?.name}
                clearOnEscape
                autoHighlight
                openOnFocus
                autoSelect
                renderValue={renderValue}
                renderOption={renderOption}
                onInputChange={(_, value: string) => setInputValue(value)}
                fullWidth
                onChange={(_, value) => {
                    field.onChange(value?.value)
                    if (onChange) onChange(value?.value)
                }}
                renderInput={(params) => {
                    return <TextField
                        {...params}
                        error={!!error}
                        className={className}
                        size="small"
                        variant={variant || 'standard'}
                        label={label}
                    />
                }}
            />
        )}
    />
}
