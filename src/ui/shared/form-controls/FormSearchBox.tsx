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
    valueLabel?: string
    onChange?: (id?: string, label?: string) => void
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
    valueLabel,
    onChange,
}: FormSearchBoxProps<T>) {

    const [options, setOptions] = useState<SearchBoxItem[]>([])
    const [inputValue, setInputValue] = useState(valueLabel ?? '')
    const [loading, setLoading] = useState(false)
    const debounceInputValue = debounce(setInputValue, 300)

    const callFetchOptions = (input: string) => {
        setLoading(true)
        fetchOptions(input)
            .then(response => setOptions(response.json))
            .catch(() => setOptions([]))
            .finally(() => setLoading(false))
    }

    useEffect(() => callFetchOptions(inputValue), [inputValue])

    return <Controller
        {...formProps}
        render={({ field, fieldState: { error } }) => {
            return <Autocomplete
                {...field}
                multiple={false}
                className={className}
                loading={loading}
                loadingText="Carregando..."
                filterOptions={(x) => x}
                onInputChange={(_, input) => debounceInputValue(input)}
                options={options.map(opt => opt.id)}
                getOptionLabel={(option) => {
                    const selected = options.find(item => item.id === option)
                    return selected?.label ?? ''
                }}
                onChange={(_, newId) => {
                    field.onChange(newId)
                    const selected = options.find(option => option.id === newId)
                    if (onChange) onChange(selected?.id, selected?.label)
                }}
                noOptionsText="Nenhum resultado encontrado!"
                disabled={disabled}
                fullWidth
                renderInput={(params) => <TextField
                    {...params}
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
        }}
    />

}
