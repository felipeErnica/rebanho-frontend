import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export type ComboSize = 'small' | 'medium'

export type ComboBoxItem = {
    name: string;
    value?: string;
}

interface ComboBoxProps {
    size?: ComboSize
    label?: string;
    defaultValue?: ComboBoxItem;
    items: readonly ComboBoxItem[];
    onChange?: (value?: string) => void
    value?: string
    inputValue?: string
    onInputChange?: (inputValue: string) => void
    error?: boolean
    className?: string
    name?: string;
    id?: string;
    variant?: 'outlined' | 'standard' | 'filled'
}

export const ComboBox = (props: ComboBoxProps) => {
    return <Autocomplete
        value={props.items.find(item => {
            const itemValue = item.value ?? item.name
            return itemValue === props.value
        })}
        inputValue={props.inputValue}
        className={props.className}
        options={props.items}
        noOptionsText='Nenhum resultado encontrado'
        renderInput={(params) => {
            return <TextField
                {...params}
                error={props.error}
                name={props.name}
                size={props.size ? props.size : 'small'}
                variant={props.variant}
                label={props.label}
            />
        }}
        getOptionLabel={(option) => option?.name ?? ''}
        clearOnEscape
        autoHighlight
        openOnFocus
        defaultValue={props.defaultValue}
        onInputChange={(_, value) => {
            if (props.onInputChange) props.onInputChange(value)
        }}
        onChange={(_, value) => {
            if (!value) {
                if (props.onChange) props.onChange()
                return
            }
            if (props.onChange) props.onChange(value.value ?? value.name)
        }}
    />
}
