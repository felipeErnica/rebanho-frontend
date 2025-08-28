/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { SearchBoxItem } from "../form-controls/FormSearchBox"
import { ApiResponse } from "@/shared/entities/ApiResponse"
import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import Checkbox from "@mui/material/Checkbox"
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { IFilters } from "@/shared/interfaces/Filter"

export type MultipleSearchBoxFilterProps = {
    label: string
    searchOptions: () => Promise<ApiResponse>
    className?: string
    disabled?: boolean
    limitTags?: number
    onChange?: (newValue: SearchBoxItem[] | null) => void
    filter: IFilters
    setFilter: (filter: IFilters) => void
    fieldName: string
}

export const MultipleSearchBoxFilter = ({
    searchOptions,
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

    useEffect(() => {
        searchOptions()
            .then(response => setOptions(response.json))
            .catch(() => setOptions([]))
    }, [filter, fieldName])


    return <Autocomplete
        multiple
        disableCloseOnSelect
        className={className}
        forcePopupIcon={false}
        limitTags={limitTags}
        getOptionLabel={(option) => option.label}
        filterSelectedOptions
        options={options}
        onChange={(_, newValue) => {
            if (!newValue) {
                setFilter({ ...filter, [fieldName]: undefined })
                return
            }
            const values = Array.isArray(newValue) ? [...newValue] : [newValue]
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
    searchOptions: () => Promise<ApiResponse>
    className?: string
    disabled?: boolean
    onChange?: (newValue: SearchBoxItem | null) => void
    filter: IFilters
    setFilter: (filter: IFilters) => void
    fieldName: string
}

export const SearchBoxFilter = ({
    searchOptions,
    onChange,
    label,
    disabled,
    className,
    setFilter,
    filter,
    fieldName,
}: SearchBoxProps) => {

    const [options, setOptions] = useState<SearchBoxItem[]>([])

    useEffect(() => {
        searchOptions()
            .then(response => setOptions(response.json)) 
            .catch(() => setOptions([]))
    }, [])

    return <Autocomplete
        className={className}
        getOptionLabel={(option) => option.label}
        filterSelectedOptions
        options={options}
        onChange={(_, newValue) => {
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
