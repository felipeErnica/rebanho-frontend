import Autocomplete from "@mui/material/Autocomplete"
import { useEffect, useState } from "react"
import TextField from "@mui/material/TextField"
import { AnimalParent } from "./api/AddAnimalEntities"
import { ApiResponse } from "@/types/ApiResponse"

type ParentsSearchBoxProps = {
    label: string
    required?: boolean
    fetchOptions: (input: string) => Promise<ApiResponse>
    name?: string
}

export const ParentsSearchBox = ({ required, label, fetchOptions, name }: ParentsSearchBoxProps) => {

    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState<AnimalParent[]>([])
    const [inputValue, setInputValue] = useState('')
    const [value, setValue] = useState<string>()

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

    return <Autocomplete
        onClose={handleClose}
        onOpen={handleOpen}
        filterOptions={(x) => x}
        getOptionLabel={(option) => option.publicName}
        onInputChange={(_, input) => setInputValue(input)}
        open={open}
        options={options}
        value={value ? options.find(option => option.id === value) : null}
        onChange={(_, newValue) => {
            if (!newValue) {
                setValue(undefined)
                return
            }
            setValue(newValue.id)
        }}
        noOptionsText="Nenhum resultado encontrado!"
        renderInput={(params) => <TextField
            {...params}
            name={name}
            required={required}
            size="small"
            label={label}
            variant="outlined"
        />}
    />

}
