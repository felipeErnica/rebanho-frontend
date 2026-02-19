import Autocomplete, { AutocompleteInputChangeReason, createFilterOptions } from "@mui/material/Autocomplete"
import { FocusEventHandler, FormEventHandler, useEffect, useState } from "react"
import TextField, { TextFieldVariants } from "@mui/material/TextField"
import { Checkbox, Chip, CircularProgress } from "@mui/material"
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { RefCallBack } from "react-hook-form"
import React from "react";

export type SearchBoxItem = {
    id: string
    label: string
    addOption?: boolean
}

export type EmptyProps = {
    id: string
    title: string
    onEmpty: () => void
}

type SearchBoxProps = {
    label?: string
    loading?: boolean
    variant?: TextFieldVariants
    options: SearchBoxItem[]
    className?: string
    onChange?: (id?: string, label?: string) => void
    onBlur?: FocusEventHandler<HTMLDivElement>
    onInput?: (event: React.SyntheticEvent, value: string, reason: AutocompleteInputChangeReason) => void
    emptyProps?: EmptyProps[]
    disabled?: boolean
    helperText?: string
    ref?: RefCallBack
    name?: string
    error?: boolean
    value?: string
    autoFocus?: boolean
}

export const SearchBox = ({
    label,
    ref,
    loading,
    emptyProps,
    options,
    className,
    disabled,
    variant,
    onChange,
    onBlur,
    onInput,
    name,
    error,
    helperText,
    value,
    autoFocus
}: SearchBoxProps) => {

    const filter = createFilterOptions<SearchBoxItem>()
    const [formValue, setFormValue] = useState<SearchBoxItem | null>(null)

    useEffect(() => {
        setFormValue(options.find(item => item.id === value) ?? null)
    }, [options, value])

    return <Autocomplete
        value={formValue}
        autoFocus={autoFocus}
        multiple={false}
        onBlur={onBlur}
        className={className}
        loading={loading}
        loadingText="Carregando..."
        getOptionKey={option => option.id}
        options={options}
        getOptionLabel={(option) => option.label}
        onInputChange={onInput}
        onChange={(_, newValue) => {
            if (newValue?.addOption && emptyProps) {
                const selectedOpt = emptyProps.find(item => item.id === newValue.id)
                selectedOpt?.onEmpty()
                return
            }
            setFormValue(newValue)
            if (onChange) onChange(newValue?.id, newValue?.label)
        }}
        noOptionsText="Nenhum resultado encontrado!"
        fullWidth
        filterSelectedOptions
        autoHighlight
        autoSelect
        disabled={disabled}
        filterOptions={(options, state) => {
            const filtered = filter(options, state)
            if (filtered.length <= 0 && emptyProps) {
                const addOptions: SearchBoxItem[] = emptyProps.map(item => ({
                    id: item.id,
                    label: item.title,
                    addOption: true
                }))
                filtered.push(...addOptions)
            }
            return filtered
        }}
        renderInput={(params) => <TextField
            {...params}
            ref={ref}
            name={name}
            disabled={disabled}
            error={error}
            helperText={helperText}
            size="small"
            label={label}
            variant={variant || 'standard'}
            slotProps={{
                input: {
                    ...params.InputProps,
                    endAdornment: (
                        <>
                            {loading && <CircularProgress size={20} />}
                            {params.InputProps.endAdornment}
                        </>
                    )
                }
            }}
        />}
    />

}

type MultipleSearchBoxProps = {
    label?: string
    variant?: TextFieldVariants
    loading?: boolean
    options: SearchBoxItem[]
    className?: string
    onChange?: (items: SearchBoxItem[]) => void
    onBlur?: FocusEventHandler<HTMLDivElement>
    limitTags?: number
    value?: string[]
    noRenderValue?: boolean
    disabled?: boolean
    name?: string
    ref?: RefCallBack
    error?: boolean
    helperText?: string
}

export const MultipleSearchBox = React.forwardRef(({
    label,
    loading,
    limitTags,
    options,
    className,
    variant,
    onChange,
    onBlur,
    noRenderValue,
    value,
    name,
    disabled,
    error,
    helperText
}: MultipleSearchBoxProps, ref) => {

    const [selectedValues, setSelectedValues] = useState<SearchBoxItem[]>([])

    useEffect(() => {
        if (!value) {
            setSelectedValues([])
            return
        }
        setSelectedValues(options.filter(option => value.includes(option.id)))
    }, [options, value])

    return <Autocomplete
        multiple
        limitTags={limitTags}
        value={selectedValues}
        onBlur={onBlur}
        className={className}
        loading={loading}
        loadingText="Carregando..."
        options={options}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(_, newValue) => {
            setSelectedValues(newValue)
            if (onChange) onChange(newValue)
        }}
        noOptionsText="Nenhum resultado encontrado!"
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
        disabled={disabled}
        renderOption={(props, option, { selected }) => (
            <li {...props}>
                <Checkbox
                    style={{ marginRight: 8 }}
                    checkedIcon={<CheckBoxIcon />}
                    checked={selected}
                />
                {option.label}
            </li>
        )}
        fullWidth
        disableCloseOnSelect
        renderInput={(params) => <TextField
            {...params}
            inputRef={ref}
            name={name}
            disabled={disabled}
            error={error}
            helperText={disabled ? helperText : undefined}
            size="small"
            label={label}
            variant={variant || 'standard'}
            slotProps={{
                input: {
                    ...params.InputProps,
                    endAdornment: (
                        <>
                            {loading && <CircularProgress size={20} />}
                            {params.InputProps.endAdornment}
                        </>
                    )
                }
            }}
        />}
    />

})
