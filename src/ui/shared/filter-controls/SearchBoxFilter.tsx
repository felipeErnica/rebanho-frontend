/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react"
import { SearchBoxItem } from "../form-controls/FormSearchBox"
import { ApiResponse } from "@/shared/entities/ApiResponse"
import { debounce } from "@mui/material/utils"
import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import Checkbox from "@mui/material/Checkbox"
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { IFilters } from "@/shared/interfaces/Filter"

export type MultipleSearchBoxFilterProps = {
    label: string
    searchByInput: (input?: string) => Promise<ApiResponse>
    searchById: (id?: string) => Promise<ApiResponse>
    className?: string
    disabled?: boolean
    limitTags?: number
    onChange?: (newValue: SearchBoxItem[] | null) => void
    filter: IFilters
    setFilter: (filter: IFilters) => void
    fieldName: string
}

export const MultipleSearchBoxFilter = ({
    searchByInput,
    searchById,
    onChange,
    label,
    disabled,
    limitTags,
    className,
    setFilter,
    filter,
    fieldName,
}: MultipleSearchBoxFilterProps) => {

    const [options, setOptions] = useState<SearchBoxItem[]>([])
    const [value, setValue] = useState<SearchBoxItem[]>([])
    const [inputValue, setInputValue] = useState('')

    const searchValue = (search: string) => {
        searchByInput(search)
            .then(response => setOptions(response.json))
            .catch(() => setOptions([]))
    }
    const setDebouncedSearch = useMemo(() => debounce(searchValue, 300), [searchValue])

    useEffect(() => {
        searchById(filter[fieldName])
            .then(response => {
                const options: SearchBoxItem[] = response.json
                setOptions(options)
                const selected: string[] = filter[fieldName]
                if (!selected) {
                    setValue([])
                    return
                }
                const values = options.filter(item => selected.includes(item.id))
                setValue(values)
            })
            .catch(() => setOptions([]))
    }, [filter, fieldName])


    return <Autocomplete
        multiple
        value={value}
        inputValue={inputValue}
        disableCloseOnSelect
        className={className}
        forcePopupIcon={false}
        limitTags={limitTags}
        filterOptions={(x) => x}
        getOptionLabel={(option) => option.label}
        onInputChange={(_, input) => {
            setInputValue(input)
            setDebouncedSearch(input)
        }}
        filterSelectedOptions
        options={options}
        onChange={(_, newValue) => {
            if (!newValue) {
                setFilter({ ...filter, [fieldName]: undefined })
                setValue([])
                return
            }
            const values = Array.isArray(newValue) ? [...newValue] : [newValue]
            setValue(values)
            if (values.length == 0) {
                setFilter({ ...filter, [fieldName]: undefined })
                return
            }
            const idList = values.map(option => option.id)
            setFilter({ ...filter, isFiltered: true, [fieldName]: idList })
            if (onChange) onChange(newValue)
        }}
        noOptionsText="Nenhum resultado encontrado!"
        disabled={disabled}
        renderOption={(props, option, { selected }) => {
            return (
                <li {...props}>
                    <Checkbox
                        style={{ marginRight: 8 }}
                        checkedIcon={<CheckBoxIcon />}
                        checked={selected}
                    />
                    {option.label}
                </li>
            );
        }}
        renderInput={(params) => <TextField
            {...params}
            size="small"
            label={label}
            variant="outlined"
        />}
    />

}

type SearchBoxProps = {
    label: string
    searchByInput: (input?: string) => Promise<ApiResponse>
    searchById: (id?: string) => Promise<ApiResponse>
    className?: string
    disabled?: boolean
    onChange?: (newValue: SearchBoxItem | null) => void
    filter: IFilters
    setFilter: (filter: IFilters) => void
    fieldName: string
}

export const SearchBoxFilter = ({
    searchByInput,
    searchById,
    onChange,
    label,
    disabled,
    className,
    setFilter,
    filter,
    fieldName,
}: SearchBoxProps) => {

    const [options, setOptions] = useState<SearchBoxItem[]>([])
    const [selected, setSelected] = useState<SearchBoxItem | null>()
    const [inputValue, setInputValue] = useState('')

    const searchInput = (search: string) => {
        searchByInput(search)
            .then(response => { setOptions(response.json) })
            .catch(() => setOptions([]))
    }
    const setDebouncedSearch = useMemo(() => debounce(searchInput, 300), [searchInput])

    useEffect(() => {
        searchById(filter[fieldName])
            .then(response => {
                const options: SearchBoxItem[] = response.json
                setOptions(options)
                if (!filter[fieldName]) {
                    setSelected(null)
                    return
                }
                const value = options.find(option => option.id === filter[fieldName])
                setSelected(value)
            })
            .catch(() => setOptions([]))
    }, [])

    return <Autocomplete
        value={selected}
        inputValue={inputValue}
        className={className}
        filterOptions={(x) => x}
        getOptionLabel={(option) => option.label}
        onInputChange={(_, input) => {
            setInputValue(input)
            setDebouncedSearch(input)
        }}
        options={options}
        onChange={(_, newValue) => {
            setSelected(newValue)
            if (!newValue) {
                setFilter({ ...filter, [fieldName]: undefined })
                return
            }
            setFilter({ ...filter, isFiltered: true, [fieldName]: newValue.id })
            if (onChange) onChange(newValue)
        }}
        noOptionsText="Nenhum resultado encontrado!"
        disabled={disabled}
        renderInput={(params) => <TextField
            {...params}
            size="small"
            label={label}
            variant="outlined"
        />}
    />

}
