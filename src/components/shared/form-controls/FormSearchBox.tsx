import { TextFieldVariants } from "@mui/material/TextField"
import { Controller, FieldValues, UseControllerProps } from "react-hook-form"
import { EmptyProps, MultipleSearchBox, SearchBox, SearchBoxItem } from "@shared/common/SearchBox"
import { AutocompleteInputChangeReason } from "@mui/material"

type FormSearchBoxProps<T extends FieldValues> = {
    label?: string
    loading?: boolean
    variant?: TextFieldVariants
    formProps: UseControllerProps<T>
    options: SearchBoxItem[]
    className?: string
    onChange?: (id?: string, label?: string) => void
    onInput?: (event: React.SyntheticEvent, value: string, reason: AutocompleteInputChangeReason) => void
    emptyProps?: EmptyProps[]
    autoFocus?: boolean
}

export function FormSearchBox<T extends FieldValues>({
    label,
    loading,
    options,
    formProps,
    className,
    variant,
    onChange,
    onInput,
    emptyProps,
    autoFocus
}: FormSearchBoxProps<T>) {

    return <Controller
        {...formProps}
        render={({ field, fieldState: { error } }) => (
            <SearchBox
                autoFocus={autoFocus}
                ref={field.ref}
                value={field.value}
                loading={loading}
                options={options}
                onBlur={field.onBlur}
                onInput={onInput}
                emptyProps={emptyProps}
                error={!field.disabled && !!error}
                disabled={field.disabled}
                helperText={!field.disabled ? error?.message : undefined}
                label={label}
                variant={variant || 'standard'}
                className={className}
                name={field.name}
                onChange={(id, label) => {
                    field.onChange(id)
                    if (onChange) onChange(id, label)
                }}
            />
        )}
    />

}

type MultipleFormSearchBoxProps<T extends FieldValues> = {
    label?: string
    variant?: TextFieldVariants
    formProps: UseControllerProps<T>
    options: SearchBoxItem[]
    className?: string
    disabled?: boolean
    onChange?: (items: SearchBoxItem[]) => void
    limitTags?: number
    noRenderValue?: boolean
}

export function FormMultipleSearchBox<T extends FieldValues>({
    label,
    limitTags,
    options,
    formProps,
    className,
    disabled,
    variant,
    onChange,
    noRenderValue
}: MultipleFormSearchBoxProps<T>) {

    return <Controller
        {...formProps}
        render={({ field, fieldState: { error } }) => (
            <MultipleSearchBox
                limitTags={limitTags}
                error={!!error}
                noRenderValue={noRenderValue}
                helperText={error?.message}
                variant={variant}
                label={label}
                value={field.value}
                onBlur={field.onBlur}
                className={className}
                options={options}
                onChange={items => {
                    field.onChange(items.map(item => item.id))
                    if (onChange) onChange(items)
                }}
                disabled={disabled}
            />
        )}
    />

}
