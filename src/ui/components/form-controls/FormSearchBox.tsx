import Autocomplete from "@mui/material/Autocomplete"
import { useEffect, useState } from "react"
import TextField from "@mui/material/TextField"
import { ApiResponse } from "@/shared/entities/ApiResponse"
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form"

type FormSearchBoxProps<T extends FieldValues> = {
    label: string
    required?: string
    fetchOptions: (input: string) => Promise<ApiResponse>
    control: Control<T, any, T>
    name: FieldPath<T>
}

type SearchBoxItem = {
    id: string
    label: string
}

export function FormSearchBox<T extends FieldValues>({ required, label, fetchOptions, control, name }: FormSearchBoxProps<T>) {

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
    }, [inputValue, fetchOptions])

    return <Controller
        control={control}
        name={name}
        rules={{ required }}
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
                value={field.value ? options.find(option => field.value === option.id) : null}
                onChange={(_, newValue) => {
                    if (!newValue) {
                        field.onChange(null)
                        return
                    }
                    field.onChange(newValue.id)
                }}
                noOptionsText="Nenhum resultado encontrado!"
                renderInput={(params) => <TextField
                    {...params}
                    error={!!error}
                    helperText={error?.message}
                    size="small"
                    label={label}
                    variant="outlined"
                />}
            />
        )}
    />

}
