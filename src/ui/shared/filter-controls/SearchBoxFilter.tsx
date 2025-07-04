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

type SearchBoxProps = {
    label: string
    fetchOptions: (input: string) => Promise<ApiResponse>
    className?: string
    disabled?: boolean
    onChange?: (newValue: SearchBoxItem | null) => void
    filter: IFilters
    setFilter: (filter: IFilters) => void
    fieldName: string
}

export type MultipleSearchBoxFilterProps = {
    label: string
    fetchOptions: (input: string) => Promise<ApiResponse>
    className?: string
    disabled?: boolean
    limitTags?: number
    onChange?: (newValue: SearchBoxItem[] | null) => void
    filter: IFilters
    setFilter: (filter: IFilters) => void
    fieldName: string
}

export const MultipleSearchBoxFilter = ({
    fetchOptions,
    onChange,
    label,
    disabled,
    limitTags,
    className,
    setFilter,
    filter,
    fieldName,
}: MultipleSearchBoxFilterProps) => {

    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState<SearchBoxItem[]>([])
    const [selected, setSelected] = useState<SearchBoxItem[]>(filter[fieldName + "Item"] || [])
    const [inputValue, setInputValue] = useState('')

    const setDebouncedInputValue = useMemo(() => debounce(setInputValue, 300), [setInputValue])

    const handleOpen = () => {
        setOpen(true)
        fetchOptions(inputValue)
            .then(response => {
                const list: SearchBoxItem[] = response.json
                const options = list.filter(item => !selected.includes(item))
                setOptions(options)
            })
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
        fetchOptions(inputValue)
            .then(response => {
                const list: SearchBoxItem[] = response.json
                const options = list.filter(item => !selected.some(selectedItem => selectedItem.id === item.id))
                setOptions(options)
            })
            .catch(() => setOptions([]))
    }, [inputValue])

    useEffect(() => {
        if (!filter[fieldName + "Item"]) setSelected([])
    }, [filter])

    return <Autocomplete
        multiple
        disableCloseOnSelect
        className={className}
        forcePopupIcon={false}
        value={selected}
        limitTags={limitTags}
        onClose={handleClose}
        onOpen={handleOpen}
        filterOptions={(x) => x}
        getOptionLabel={(option) => option.label}
        onInputChange={(_, input) => setDebouncedInputValue(input)}
        open={open}
        options={options}
        onChange={(_, newValue) => {
            if (!newValue) {
                setFilter({ ...filter, [fieldName]: undefined, [fieldName + "Item"]: undefined })
                return
            }
            const values = Array.isArray(newValue) ? [...newValue] : [newValue]
            setSelected(values)
            if (values.length == 0) {
                setFilter({ ...filter, [fieldName]: undefined })
                return
            }
            const idList = values.map(option => option.id)
            setFilter({ ...filter, isFiltered: true, [fieldName]: idList, [fieldName + "Item"]: values })
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

export const SearchBoxFilter = ({
    fetchOptions,
    onChange,
    label,
    disabled,
    className,
    setFilter,
    filter,
    fieldName,
}: SearchBoxProps) => {

    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState<SearchBoxItem[]>([])
    const [selected, setSelected] = useState<SearchBoxItem | null>(filter[fieldName + "Item"] || null)
    const [inputValue, setInputValue] = useState('')

    const setDebouncedInputValue = useMemo(() => debounce(setInputValue, 300), [setInputValue])

    const handleOpen = () => {
        setOpen(true)
        fetchOptions(inputValue)
            .then(response => setOptions(response.json))
            .catch(() => setOptions([]))
    }

    const handleClose = () => {
        setOpen(false)
        setOptions([])
    }

    useEffect(() => {
        if (!filter[fieldName + "Item"]) setSelected(null)
    }, [filter])

    useEffect(() => {
        if (inputValue === '') {
            return
        }
        fetchOptions(inputValue)
            .then(response => setOptions(response.json))
            .catch(() => setOptions([]))
    }, [inputValue])

    return <Autocomplete
        onClose={handleClose}
        value={selected}
        onOpen={handleOpen}
        className={className}
        filterOptions={(x) => x}
        getOptionLabel={(option) => option.label}
        onInputChange={(_, input) => setDebouncedInputValue(input)}
        open={open}
        options={options}
        onChange={(_, newValue) => {
            setSelected(newValue)
            if (!newValue) {
                setFilter({ ...filter, [fieldName]: undefined })
                return
            }
            setFilter({ ...filter, isFiltered: true, [fieldName]: newValue.id, [fieldName + "Item"]: newValue })
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
