/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import Autocomplete from "@mui/material/Autocomplete"
import { useCallback, useEffect, useState } from "react"
import TextField, { TextFieldVariants } from "@mui/material/TextField"
import { ApiResponse } from "@/shared/entities/ApiResponse"
import { Controller, FieldValues, UseControllerProps } from "react-hook-form"
import { CircularProgress, debounce } from "@mui/material"

export type SearchBoxItem = {
    id: string
    label: string
}

type FormSearchBoxProps<T extends FieldValues> = {
    label?: string
    variant?: TextFieldVariants
    formProps: UseControllerProps<T>
    searchByInput: (input?: string) => Promise<ApiResponse>
    searchById: (id?: string) => Promise<ApiResponse>
    args?: any[]
    className?: string
    disabled?: boolean
    onChange?: (id?: string, label?: string) => void
}

export function FormSearchBox<T extends FieldValues>({
    label,
    searchByInput,
    searchById,
    formProps,
    className,
    disabled,
    variant,
    onChange,
}: FormSearchBoxProps<T>) {

    const [options, setOptions] = useState<SearchBoxItem[]>([])
    const [value, setValue] = useState<SearchBoxItem | null>(null)
    const [inputValue, setInputValue] = useState('')
    const [loading, setLoading] = useState(false)

    const searchInput = useCallback((input?: string) => {
        setLoading(true)
        searchByInput(input)
            .then(response => setOptions(response.json))
            .catch(() => setOptions([]))
            .finally(() => setLoading(false))
    }, [])

    const debounceInputValue = useCallback(debounce(searchInput, 300), [])
    return <Controller
        {...formProps}
        render={({ field, fieldState: { error } }) => {

            useEffect(() => {
                const id = field.value
                if (id === undefined && value?.id === undefined) {
                    setLoading(true)
                    searchById()
                        .then(response => setOptions(response.json))
                        .catch(() => setOptions([]))
                        .finally(() => setLoading(false))
                }

                if (id === value?.id) return
                setLoading(true)
                searchById(id)
                    .then(response => {
                        const options: SearchBoxItem[] = response.json
                        setOptions(options)
                        if (!id) {
                            setValue(null)
                            return
                        }
                        const value = options.find(option => option.id === id)
                        setValue(value ?? null)
                    })
                    .catch(() => setOptions([]))
                    .finally(() => setLoading(false))
            }, [field.value])

            return <Autocomplete
                multiple={false}
                value={value}
                onBlur={field.onBlur}
                inputValue={inputValue}
                className={className}
                loading={loading}
                loadingText="Carregando..."
                filterOptions={(x) => x}
                onInputChange={(_, input) => {
                    setInputValue(input)
                    debounceInputValue(input)
                }}
                options={options}
                getOptionLabel={(option) => option.label}
                onChange={(_, newValue) => {
                    field.onChange(newValue?.id)
                    setValue(newValue)
                    if (onChange) onChange(newValue?.id, newValue?.label)
                }}
                noOptionsText="Nenhum resultado encontrado!"
                disabled={disabled}
                fullWidth
                filterSelectedOptions
                renderInput={(params) => <TextField
                    {...params}
                    name={field.name}
                    inputRef={field.ref}
                    error={!!error}
                    disabled={field.disabled}
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

type MultipleFormSearchBoxProps<T extends FieldValues> = {
    label?: string
    variant?: TextFieldVariants
    formProps: UseControllerProps<T>
    searchByInput: (input?: string) => Promise<ApiResponse>
    searchById: (id?: string | string[]) => Promise<ApiResponse>
    args?: any[]
    className?: string
    disabled?: boolean
    onChange?: (items: SearchBoxItem[]) => void
    limitTags?: number
}

export function FormMultipleSearchBox<T extends FieldValues>({
    label,
    limitTags,
    searchByInput,
    searchById,
    formProps,
    className,
    disabled,
    variant,
    onChange,
}: MultipleFormSearchBoxProps<T>) {

    const [options, setOptions] = useState<SearchBoxItem[]>([])
    const [inputValue, setInputValue] = useState<string>('')
    const [value, setValue] = useState<SearchBoxItem[]>([])
    const [loading, setLoading] = useState(false)

    const searchInput = useCallback((input?: string) => {
        setLoading(true)
        searchByInput(input)
            .then(response => setOptions(response.json))
            .catch(() => setOptions([]))
            .finally(() => setLoading(false))
    }, [])

    const debouncedSearch = useCallback(debounce(searchInput, 300), [])

    function allElementsEqual<T>(arr1: T[], arr2: T[]): boolean {
        arr1.forEach(el => {
            if (!arr2.includes(el)) {
                return false
            }
        })
        return true
    }

    return <Controller
        {...formProps}
        render={({ field, fieldState: { error } }) => {

            useEffect(() => {
                const id: string[] = field.value
                if (value.length == 0 && id.length == 0) {
                    searchById()
                        .then(response => setOptions(response.json))
                        .catch(() => setOptions([]))
                        .finally(() => setLoading(false))
                }
                if (allElementsEqual(id, value.map(item => item.id))) return

                setLoading(true)
                searchById(id)
                    .then(response => {
                        const options: SearchBoxItem[] = response.json
                        setOptions(options)
                        if (!id) {
                            setValue([])
                            return
                        }
                        const values = options.filter(option => id.includes(option.id))
                        setValue(values)
                    })
                    .catch(() => setOptions([]))
                    .finally(() => setLoading(false))
            }, [])

            return <Autocomplete
                multiple={true}
                onBlur={field.onBlur}
                limitTags={limitTags}
                value={value}
                inputValue={inputValue}
                className={className}
                loading={loading}
                loadingText="Carregando..."
                filterOptions={(x) => x}
                onInputChange={(_, input) => {
                    setInputValue(input)
                    debouncedSearch(input)
                }}
                options={options}
                getOptionLabel={(option) => option.label}
                onChange={(_, newValue) => {
                    field.onChange(newValue.map(item => item.id))
                    setValue(newValue)
                    if (onChange) onChange(newValue)
                }}
                noOptionsText="Nenhum resultado encontrado!"
                disabled={disabled}
                filterSelectedOptions
                fullWidth
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
        }}
    />

}
