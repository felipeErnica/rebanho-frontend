import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { HTMLAttributes, ReactNode } from "react";

export type ComboSize = 'small' | 'medium'

export type ComboBoxItem = {
    name: string;
    value: string;
}

interface ComboBoxProps {
    size?: ComboSize
    label?: string;
    defaultValue?: ComboBoxItem;
    items: readonly ComboBoxItem[];
    onChange?: (value?: string) => void
    value?: string
    error?: boolean
    className?: string
    name?: string;
    id?: string;
    variant?: 'outlined' | 'standard' | 'filled'
    renderOption?: (props: HTMLAttributes<HTMLLIElement> & { key: any }, option: ComboBoxItem) => ReactNode
    renderValue?: (value: ComboBoxItem, getItemProps: (args?: { index?: number }) => {
        className: string
        disabled: boolean
        tabIndex: -1
        "data-item-index": number
        onDelete: (event: any) => void
    }) => ReactNode
}

export const ComboBox = (props: ComboBoxProps) => {

    return <Autocomplete
        value={props.items.find(item => item.value === props.value) ?? null}
        className={props.className}
        options={props.items}
        noOptionsText='Nenhum resultado encontrado'
        renderOption={props.renderOption}
        renderValue={props.renderValue}
        renderInput={(params) => {
            return <TextField
                {...params}
                error={props.error}
                name={props.name}
                size={props.size ? props.size : 'small'}
                variant={props.variant ?? 'standard'}
                label={props.label}
            />
        }}
        getOptionLabel={(option) => option?.name ?? ''}
        clearOnEscape
        autoHighlight
        openOnFocus
        defaultValue={props.defaultValue}
        onChange={(_, value) => {
            if (!value) {
                if (props.onChange) props.onChange()
                return
            }
            if (props.onChange) props.onChange(value.value)
        }}
    />
}
