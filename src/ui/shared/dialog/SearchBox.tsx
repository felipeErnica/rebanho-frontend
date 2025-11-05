import Autocomplete from "@mui/material/Autocomplete"
import { useEffect, useState } from "react"
import TextField, { TextFieldVariants } from "@mui/material/TextField"
import { ApiResponse } from "@/shared/entities/ApiResponse"
import { CircularProgress } from "@mui/material"

export type SearchBoxItem = {
    id: string
    label: string
}

type SearchBoxProps = {
    label?: string
    variant?: TextFieldVariants
    searchOptions: () => Promise<ApiResponse>
    args?: any[]
    className?: string
    disabled?: boolean
    onChange?: (id: string | undefined, label: string | undefined) => void
}

export function SearchBox({
    label,
    searchOptions,
    className,
    disabled,
    variant,
    onChange,
}: SearchBoxProps) {

    const [options, setOptions] = useState<SearchBoxItem[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        searchOptions()
            .then(response => setOptions(response.json))
            .catch(() => setOptions([]))
            .finally(() => setLoading(false))
    }, [searchOptions])

    return <Autocomplete
        multiple={false}
        className={className}
        loading={loading}
        loadingText="Carregando..."
        options={options}
        getOptionLabel={(option) => option.label}
        onChange={(_, newValue) => {
            if (onChange) onChange(newValue?.id, newValue?.label)
        }}
        noOptionsText="Nenhum resultado encontrado!"
        disabled={disabled}
        fullWidth
        filterSelectedOptions
        autoHighlight
        autoSelect
        renderInput={(params) => <TextField
            {...params}
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

}

type MultipleSearchBoxProps = {
    label?: string
    variant?: TextFieldVariants
    searchOptions: () => Promise<ApiResponse>
    args?: any[]
    className?: string
    disabled?: boolean
    onChange?: (items: SearchBoxItem[]) => void
    limitTags?: number
}

export function MultipleSearchBox({
    label,
    limitTags,
    searchOptions,
    className,
    disabled,
    variant,
    onChange,
}: MultipleSearchBoxProps) {

    const [options, setOptions] = useState<SearchBoxItem[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        searchOptions()
            .then(response => setOptions(response.json))
            .catch(() => setOptions([]))
            .finally(() => setLoading(false))
    }, [searchOptions])

    return <Autocomplete
        multiple={true}
        limitTags={limitTags}
        className={className}
        loading={loading}
        loadingText="Carregando..."
        options={options}
        getOptionLabel={(option) => option.label}
        onChange={(_, newValue) => {
            if (onChange) onChange(newValue)
        }}
        noOptionsText="Nenhum resultado encontrado!"
        disabled={disabled}
        filterSelectedOptions
        fullWidth
        renderInput={(params) => <TextField
            {...params}
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

}
