/* eslint-disable react-hooks/exhaustive-deps */
import Autocomplete from "@mui/material/Autocomplete"
import { useEffect, useState } from "react"
import TextField from "@mui/material/TextField"
import { ApiResponse } from "@/shared/entities/ApiResponse"
import { Controller, FieldValues, UseControllerProps } from "react-hook-form"

type FormSearchBoxProps<T extends FieldValues> = {
    label: string
    formProps: UseControllerProps<T>
    fetchOptions: (input: string) => Promise<ApiResponse>
    args?: any[]
    className?: string
    disabled?: boolean
    onChange?: (newValue: SearchBoxItem | null) => void 
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
    onChange,
}: FormSearchBoxProps<T>) {

    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState<SearchBoxItem[]>([])
    const [inputValue, setInputValue] = useState('')

    const handleOpen = () => {
        setOpen(true)
        fetchOptions(inputValue).then(response => setOptions(response.json))
            .catch(() => setOptions([]))
    }

    const handleClose = () => {
        setOpen(false)
        setOptions([])
    }

    useEffect(() => {
        if (inputValue === '') {
            return
        }
        fetchOptions(inputValue).then(response => setOptions(response.json))
            .catch(() => setOptions([]))
    }, [inputValue])

    return <Controller
        {...formProps}
        render={({ field, fieldState: { error } }) => (
            <Autocomplete
                {...field}
                multiple={false}
                onClose={handleClose}
                onOpen={handleOpen}
                filterOptions={(x) => x}
                getOptionLabel={(option) => option.label}
                onInputChange={(_, input) => setInputValue(input)}
                open={open}
                options={options}
                onChange={(_, newValue) => {
                    if (!newValue) {
                        field.onChange(null)
                        return
                    }
                    field.onChange(newValue.id)
                    if (onChange) onChange(newValue)
                }}
                noOptionsText="Nenhum resultado encontrado!"
                disabled={disabled}
                renderInput={(params) => <TextField
                    {...params}
                    error={!!error}
                    helperText={error?.message}
                    size="small"
                    className={className}
                    label={label}
                    variant="outlined"
                />}
            />
        )}
    />

}
