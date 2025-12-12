import { TextFieldVariants } from "@mui/material/TextField"
import { Controller, FieldValues, UseControllerProps } from "react-hook-form"
import { EmptyProps, MultipleSearchBox, SearchBox, SearchBoxItem } from "@shared/dialog/SearchBox"

type FormSearchBoxProps<T extends FieldValues> = {
    label?: string
    reload?: number
    variant?: TextFieldVariants
    formProps: UseControllerProps<T>
    searchOptions: () => Promise<SearchBoxItem[]>
    args?: any[]
    className?: string
    onChange?: (id?: string, label?: string) => void
    emptyProps?: EmptyProps[]
}

export function FormSearchBox<T extends FieldValues>({
    label,
    reload,
    searchOptions,
    formProps,
    className,
    variant,
    onChange,
    emptyProps
}: FormSearchBoxProps<T>) {

    return <Controller
        {...formProps}
        render={({ field, fieldState: { error } }) => (
            <SearchBox
                reload={reload}
                value={field.value}
                searchOptions={searchOptions}
                onBlur={field.onBlur}
                emptyProps={emptyProps}
                error={!field.disabled && !!error}
                disabled={field.disabled}
                helperText={!field.disabled ? error?.message : undefined}
                label={label}
                variant={variant || 'standard'}
                className={className}
                name={field.name}
                ref={field.ref}
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
    searchOptions: () => Promise<SearchBoxItem[]>
    args?: any[]
    className?: string
    disabled?: boolean
    onChange?: (items: SearchBoxItem[]) => void
    limitTags?: number
    noRenderValue?: boolean
}

export function FormMultipleSearchBox<T extends FieldValues>({
    label,
    limitTags,
    searchOptions,
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
                searchOptions={searchOptions}
                onChange={items => {
                    field.onChange(items.map(item => item.id))
                    if (onChange) onChange(items)
                }}
                disabled={disabled}
            />
        )}
    />

}
