import Autocomplete from "@mui/material/Autocomplete"
import { useCallback, useState } from "react"
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

    const [firstRender, setFirstRender] = useState(true)
    const [options, setOptions] = useState<SearchBoxItem[]>([])
    const [value, setValue] = useState<SearchBoxItem | null>(null)
    const [inputValue, setInputValue] = useState('')
    const [loading, setLoading] = useState(false)

    const searchInput = (input?: string) => {
        setLoading(true)
        searchByInput(input)
            .then(response => setOptions(response.json))
            .catch(() => setOptions([]))
            .finally(() => setLoading(false))
    }
    const debounceInputValue = debounce(searchInput, 300)

    const searchValue = (id?: string) => {
        console.log("field id: ", id)
        if (!firstRender) return
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
            .finally(() => {
                setFirstRender(false)
                setLoading(false)
            })
    }

    return <Controller
        {...formProps}
        render={({ field, fieldState: { error } }) => {
            searchValue(field.value)
            return <Autocomplete
                {...field}
                multiple={false}
                value={value}
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
                    field.onChange(newValue)
                    setValue(newValue)
                    if (onChange) onChange(newValue?.id, newValue?.label)
                }}
                noOptionsText="Nenhum resultado encontrado!"
                disabled={disabled}
                fullWidth
                filterSelectedOptions
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
    const [isFirstRender, setFirstRender] = useState(true)
    const [inputValue, setInputValue] = useState<string>('')
    const [value, setValue] = useState<SearchBoxItem[]>([])
    const [loading, setLoading] = useState(false)

    const searchInput = (input?: string) => {
        setLoading(true)
        searchByInput(input)
            .then(response => setOptions(response.json))
            .catch(() => setOptions([]))
            .finally(() => setLoading(false))
    }
    const debouncedSearch = debounce(searchInput, 300)

    const findValue = useCallback((id?: string | string[]) => {
        if (!isFirstRender) return
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
            .finally(() => {
                setLoading(false)
                setFirstRender(false)
            })
    }, [searchById, isFirstRender])

    return <Controller
        {...formProps}
        render={({ field, fieldState: { error } }) => {
            findValue(field.value)
            return <Autocomplete
                {...field}
                multiple={true}
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
                    field.onChange(newValue)
                    setValue(newValue)
                    if (onChange) onChange(newValue)
                }}
                noOptionsText="Nenhum resultado encontrado!"
                disabled={disabled}
                filterSelectedOptions
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
