import Autocomplete from "@mui/material/Autocomplete"
import { useEffect, useState } from "react"
import TextField, { TextFieldVariants } from "@mui/material/TextField"
import { Controller, FieldValues, UseControllerProps } from "react-hook-form"
import { Checkbox, Chip, CircularProgress } from "@mui/material"
import CheckBoxIcon from '@mui/icons-material/CheckBox';

export type SearchBoxItem = {
    id: string
    label: string
}

type FormSearchBoxProps<T extends FieldValues> = {
    label?: string
    variant?: TextFieldVariants
    formProps: UseControllerProps<T>
    searchOptions: () => Promise<SearchBoxItem[]>
    args?: any[]
    className?: string
    onChange?: (id?: string, label?: string) => void
}

export function FormSearchBox<T extends FieldValues>({
    label,
    searchOptions,
    formProps,
    className,
    variant,
    onChange,
}: FormSearchBoxProps<T>) {

    const [options, setOptions] = useState<SearchBoxItem[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        searchOptions()
            .then(response => setOptions(response))
            .catch(() => setOptions([]))
            .finally(() => setLoading(false))
    }, [searchOptions])

    return <Controller
        {...formProps}
        render={({ field, fieldState: { error } }) => (
            <Autocomplete
                value={options.find(item => item.id === field.value) ?? null}
                multiple={false}
                onBlur={field.onBlur}
                className={className}
                loading={loading}
                loadingText="Carregando..."
                options={options}
                getOptionLabel={(option) => option.label}
                onChange={(_, newValue) => {
                    field.onChange(newValue?.id)
                    if (onChange) onChange(newValue?.id, newValue?.label)
                }}
                noOptionsText="Nenhum resultado encontrado!"
                fullWidth
                filterSelectedOptions
                autoHighlight
                autoSelect
                disabled={field.disabled}
                renderInput={(params) => <TextField
                    {...params}
                    name={field.name}
                    inputRef={field.ref}
                    error={!field.disabled && !!error}
                    disabled={field.disabled}
                    helperText={!field.disabled && error?.message}
                    size="small"
                    label={label}
                    variant={variant || 'standard'}
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading && <CircularProgress size={20} />}
                                    {params.InputProps.endAdornment}
                                </>
                            )
                        }
                    }}
                />}
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

    const [options, setOptions] = useState<SearchBoxItem[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        searchOptions()
            .then(response => setOptions(response))
            .catch(() => setOptions([]))
            .finally(() => setLoading(false))
    }, [searchOptions])

    return <Controller
        {...formProps}
        render={({ field, fieldState: { error } }) => (
            <Autocomplete
                multiple
                limitTags={limitTags}
                value={field.value ? options.filter(option => field.value.includes(option.id)) : []}
                onBlur={field.onBlur}
                className={className}
                loading={loading}
                loadingText="Carregando..."
                options={options}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_, newValue) => {
                    field.onChange(newValue.map(item => item.id))
                    if (onChange) onChange(newValue)
                }}
                noOptionsText="Nenhum resultado encontrado!"
                renderValue={(value, props) => {
                    if (noRenderValue) return
                    if (!limitTags) {
                        return value.map((option, index) => {
                            const itemProps = props({ index })
                            return <Chip label={option.label} {...itemProps} />
                        })
                    }
                    return <div className="gap-2">
                        {value.slice(0, limitTags).map((option, index) => {
                            const itemProps = props({ index })
                            return <Chip label={option.label} {...itemProps} />
                        })}
                        {value.length > limitTags && `+${value.length - limitTags}`}
                    </div>
                }}
                disabled={disabled}
                renderOption={(props, option, { selected }) => (
                    <li {...props}>
                        <Checkbox
                            style={{ marginRight: 8 }}
                            checkedIcon={<CheckBoxIcon />}
                            checked={selected}
                        />
                        {option.label}
                    </li>
                )}
                fullWidth
                disableCloseOnSelect
                renderInput={(params) => <TextField
                    {...params}
                    name={field.name}
                    ref={field.ref}
                    disabled={field.disabled}
                    error={!!error}
                    helperText={error?.message}
                    size="small"
                    label={label}
                    variant={variant || 'standard'}
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading && <CircularProgress size={20} />}
                                    {params.InputProps.endAdornment}
                                </>
                            )
                        }
                    }}
                />}
            />
        )}
    />

}
