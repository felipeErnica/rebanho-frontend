import { IFilters } from "@/shared/interfaces/Filter"
import TextField from "@mui/material/TextField"
import { debounce } from "@mui/material/utils"
import { useState } from "react"

type TextFilterProps = {
    label: string
    onChange?: (value: any) => void
    fieldName: string
    filter: IFilters
    setFilter: (filter: IFilters) => void
    className?: string
}

export const TextFilter = ({
    onChange,
    label,
    filter,
    fieldName,
    className,
    setFilter,
}: TextFilterProps) => {

    const [inputValue, setInputValue] = useState<string>(filter[fieldName])
    const setDebouncedFilter = debounce(setFilter, 300)

    return <TextField
        size="small"
        variant="standard"
        type="search"
        label={label}
        value={inputValue ?? ''}
        className={className}
        onChange={(event) => {
            const value = event.currentTarget.value
            setInputValue(value)
            setDebouncedFilter({...filter, isFiltered: true, [fieldName]: value})
            if (onChange) onChange(value)
        }}
    />
}
