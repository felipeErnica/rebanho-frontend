import { useEffect, useState } from "react"
import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import Checkbox from "@mui/material/Checkbox"
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { IFilters } from "@utils/Filter"
import Chip from "@mui/material/Chip"
import { SearchBox, SearchBoxItem } from "@shared/dialog/SearchBox";

export type MultipleSearchBoxFilterProps = {
    label: string
    loading?: boolean
    options: SearchBoxItem[]
    className?: string
    disabled?: boolean
    noRenderValue?: boolean
    limitTags?: number
    onChange?: (newValue: SearchBoxItem[] | null) => void
    filter: IFilters
    setFilter: (filter: IFilters) => void
    fieldName: string
}

export const MultipleSearchBoxFilter = ({
    options,
    onChange,
    loading,
    label,
    disabled,
    limitTags,
    className,
    setFilter,
    noRenderValue,
    filter,
    fieldName,
}: MultipleSearchBoxFilterProps) => {

    const [values, setValues] = useState<SearchBoxItem[]>([])

    useEffect(() => {
        const filterValues: string[] = filter[fieldName]
        if (!filterValues) {
            setValues([])
            return
        }
        const valueList = options.filter(option => filterValues.includes(option.id))
        setValues(valueList)
    }, [fieldName, filter, options])

    return <Autocomplete
        multiple
        disableCloseOnSelect
        loading={loading}
        value={values}
        className={className}
        limitTags={limitTags}
        getOptionLabel={(option) => option.label}
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
        renderValue={(value, props) => {
            if (noRenderValue) return
            if (!limitTags) {
                return value.map((option, index) => {
                    const itemProps = props({ index })
                    return <Chip label={option.label} {...itemProps} />
                })
            }
            return <div className="gap-2">
                {value.slice(0, limitTags).map((option, index) => {
                    const itemProps = props({ index })
                    return <Chip label={option.label} {...itemProps} />
                })}
                {value.length > limitTags && `+${value.length - limitTags}`}
            </div>
        }}
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
            variant='standard'
        />}
    />

}

type SearchBoxProps = {
    label: string
    options: SearchBoxItem[]
    className?: string
    disabled?: boolean
    onChange?: (newValue: SearchBoxItem | null) => void
    filter: IFilters
    setFilter: (filter: IFilters) => void
    fieldName: string
}

export const SearchBoxFilter = ({
    options,
    onChange,
    label,
    disabled,
    className,
    setFilter,
    filter,
    fieldName,
}: SearchBoxProps) => {

    return <SearchBox 
        className={className}
        options={options}
        value={filter[fieldName]}
        onChange={(id, label) => {
            if (!id) {
                setFilter({ ...filter, [fieldName]: undefined })
                return
            }
            setFilter({ ...filter, isFiltered: true, [fieldName]: id })
            if (onChange && label) onChange({id, label})
        }}
        disabled={disabled}
            label={label}
            variant="standard"
    />
}
