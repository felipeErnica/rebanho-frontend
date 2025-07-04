/* eslint-disable react-hooks/exhaustive-deps */
import { IFilters } from "@/shared/interfaces/Filter"
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
}

export const TextFilter = ({
    onChange,
    label,
    filter,
    fieldName,
    className,
    setFilter,
}: TextFilterProps) => {

    const [inputValue, setInputValue] = useState<string>(filter[fieldName] || '')
    const [search, setSearch] = useState<string>('')

    const setDebouncedSearch = debounce(setSearch, 300)

    useEffect(() => {
        if (!search) {
            setFilter({ ...filter, isFiltered: true, [fieldName]: undefined })
            return
        }
        setFilter({ ...filter, isFiltered: true, [fieldName]: search })
    }, [search])

    useEffect(() => {
        if (!filter[fieldName]) setInputValue('')
    }, [filter])

    return <TextField
        size="small"
        variant="outlined"
        type="search"
        label={label}
        value={inputValue}
        className={className}
        onChange={(event) => {
            const value = event.currentTarget.value
            setInputValue(value)
            setDebouncedSearch(value)
            if (onChange) onChange(value)
        }}
    />
}
