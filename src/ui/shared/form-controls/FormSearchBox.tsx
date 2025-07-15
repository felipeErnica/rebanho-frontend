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
    onChange?: (newValue?: SearchBoxItem | null) => void
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

    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState<SearchBoxItem[]>([])
    const [inputValue, setInputValue] = useState(valueLabel)
    const [value, setValue] = useState<SearchBoxItem | null>(null)
    const [loading, setLoading] = useState(false)
    const debounceInputValue = debounce(setInputValue, 300)

    const callFetchOptions = () => {
        setLoading(true)
        fetchOptions(inputValue ?? '')
            .then(response => setOptions(response.json))
            .catch(() => setOptions([]))
            .finally(() => setLoading(false))
    }

    useEffect(() => callFetchOptions(), [inputValue])

    const handleClose = () => {
        setOptions([])
        setOpen(false)
    }

    const handleOpen = () => {
        callFetchOptions()
        setOpen(true)
    }

    const findValue = (id?: string) => {
        if (!id) return null
        const selected = options.find(opt => opt.id === id) ?? null
        setValue(selected)
        return selected
    }

    return <Controller
        {...formProps}
        render={({ field, fieldState: { error } }) => {
            return <Autocomplete
                {...field}
                multiple={false}
                value={value ?? findValue(field.value)}
                open={open}
                onOpen={handleOpen}
                onClose={handleClose}
                loading={loading}
                filterOptions={(x) => x}
                onInputChange={(_, input) => debounceInputValue(input)}
                options={options}
                onChange={(_, newValue) => {
                    if (onChange) onChange(newValue)
                    setValue(newValue)
                    field.onChange(newValue?.id ?? undefined)
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
