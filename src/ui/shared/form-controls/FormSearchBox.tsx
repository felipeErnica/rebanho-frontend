/* eslint-disable react-hooks/exhaustive-deps */
import Autocomplete from "@mui/material/Autocomplete"
import { useEffect, useState } from "react"
import TextField, { TextFieldVariants } from "@mui/material/TextField"
import { ApiResponse } from "@/shared/entities/ApiResponse"
import { Controller, FieldValues, UseControllerProps } from "react-hook-form"
import { CircularProgress, debounce } from "@mui/material"

type FormSearchBoxProps<T extends FieldValues> = {
    label?: string
    variant?: TextFieldVariants
    formProps: UseControllerProps<T>
    fetchOptions: (input: string) => Promise<ApiResponse>
    args?: any[]
    className?: string
    disabled?: boolean
    value?: string
    onChange?: (newValue?: SearchBoxItem) => void
}

export type SearchBoxItem = {
    id: string
    label: string
}

export function FormSearchBox<T extends FieldValues>({
    label,
    fetchOptions,
    formProps,
    className,
    disabled,
    variant,
    value,
    onChange,
}: FormSearchBoxProps<T>) {

    const [options, setOptions] = useState<SearchBoxItem[]>([])
    const [inputValue, setInputValue] = useState(value ?? '')
    const [loading, setLoading] = useState(false)
    const debouncedSetInput = debounce(setInputValue, 300)

    const callFetchOptions = () => {
        setLoading(true)
        fetchOptions(inputValue)
            .then(response => setOptions(response.json))
            .catch(() => setOptions([]))
            .finally(() => setLoading(false))
    }

    useEffect(() => { 
        if (!disabled) callFetchOptions() 
    }, [fetchOptions])

    useEffect(() => callFetchOptions(), [inputValue])

    return <Controller
        {...formProps}
        render={({ field, fieldState: { error } }) => {
            return <Autocomplete
                {...field}
                multiple={false}
                value={field.value ? options.find(opt => opt.id === field.value) ?? null : null}
                loading={loading}
                filterOptions={(x) => x}
                getOptionLabel={(option) => option.label}
                onInputChange={(_, input) => debouncedSetInput(input)}
                options={options}
                isOptionEqualToValue={(opt, value) => opt.id === value.id}
                onChange={(_, newValue) => {
                    if (onChange) onChange(newValue ?? undefined)
                    field.onChange(newValue ? newValue.id : undefined)
                }}
                noOptionsText="Nenhum resultado encontrado!"
                disabled={disabled}
                fullWidth
                renderInput={(params) => <TextField
                    {...params}
                    error={!!error}
                    helperText={error?.message}
                    size="small"
                    className={className}
                    label={label}
                    variant={variant || 'outlined'}
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading && <CircularProgress />}
                                    {params.InputProps.endAdornment}
                                </>
                            )
                        }
                    }}
                />}
            />
        }}
    />

}
