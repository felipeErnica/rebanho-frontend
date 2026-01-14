import { IFilters } from "@/utils/Filter"
import TextField from "@mui/material/TextField"
import { debounce } from "@mui/material/utils"
import { useEffect, useState } from "react"

type TextFilterProps = {
    label: string
    onChange?: (value: any) => void
    fieldName: string
    filter: IFilters
    setFilter: (filter: IFilters) => void
    className?: string
    multiline?: boolean
    maxRows?: number
    rows?: number
}

export const TextFilter = ({
    onChange,
    label,
    filter,
    fieldName,
    className,
    setFilter,
    multiline,
    maxRows,
    rows
}: TextFilterProps) => {

    const [inputValue, setInputValue] = useState<string>(filter[fieldName])
    const setDebouncedFilter = debounce(setFilter, 300)

    useEffect(() => setInputValue(filter[fieldName]), [fieldName, filter])

    return <TextField
        size="small"
        variant="standard"
        type="search"
        label={label}
        multiline={multiline}
        maxRows={maxRows}
        rows={rows}
        value={inputValue ?? ''}
        className={className}
        onChange={(event) => {
            const value = event.currentTarget.value
            setInputValue(value)
            setDebouncedFilter({ ...filter, isFiltered: true, [fieldName]: value })
            if (onChange) onChange(value)
        }}
    />
}
