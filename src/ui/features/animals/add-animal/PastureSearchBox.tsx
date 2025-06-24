import Autocomplete from "@mui/material/Autocomplete"
import { useCallback, useEffect, useState } from "react"
import TextField from "@mui/material/TextField"
import { Controller, FieldValues, UseControllerProps } from "react-hook-form"
import { searchPasture } from "./api/AddAnimalController"
import { SearchBoxItem } from "@/ui/shared/form-controls/FormSearchBox"

type FormSearchBoxProps<T extends FieldValues> = {
    label: string
    formProps: UseControllerProps<T>
    className?: string
    disabled?: boolean
    farmId?: string
}

export function PastureSearchBox<T extends FieldValues>({
    label,
    formProps,
    className,
    disabled,
    farmId,
}: FormSearchBoxProps<T>) {

    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState<SearchBoxItem[]>([])
    const [inputValue, setInputValue] = useState('')

    const handleOpen = useCallback(() => {
        setOpen(true)
        searchPasture(farmId, inputValue).then(response => setOptions(response.json))
            .catch(() => setOptions([]))
    }, [farmId, inputValue])

    const handleClose = () => {
        setOpen(false)
        setOptions([])
    }

    useEffect(() => {
        if (inputValue === '') {
            return
        }
        searchPasture(farmId, inputValue).then(response => setOptions(response.json))
            .catch(() => setOptions([]))
    }, [inputValue, farmId])

    return <Controller
        {...formProps}
        render={({ field, fieldState: { error } }) => (
            <Autocomplete
                {...field}
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
