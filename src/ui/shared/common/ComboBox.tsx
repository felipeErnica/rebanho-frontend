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
    value?: ComboBoxItem | null
    inputValue?: string
    setInputValue?: (inputValue: string) => void
    error?: boolean
    className?: string
    name?: string;
    id?: string;
}

export const ComboBox = (props: ComboBoxProps) => {
    return <Autocomplete
        value={props.value}
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
                variant='outlined'
                label={props.label}
            />
        }}
        getOptionLabel={(option) => option?.name ?? ''}
        clearOnEscape
        autoHighlight
        openOnFocus
        defaultValue={props.defaultValue}
        onInputChange={(_, value, reason) => {
            if (props.setInputValue && reason == 'input') props.setInputValue(value)
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
