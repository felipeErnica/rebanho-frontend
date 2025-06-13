import { JSX, SyntheticEvent, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export type ComboSize = 'small' | 'medium'

export const ComboBox = (props: ComboBoxProps): JSX.Element => {

    const [value, setValue] = useState<ComboBoxItem>()
    const [inputValue, setInputValue] = useState<string>()

    return <Autocomplete
        inputValue={inputValue}
        value={value}
        options={props.items}
        noOptionsText='Nenhum resultado encontrado'
        renderInput={(params) => {
            return <TextField
                {...params}
                name={props.name}
                size={props.size ? props.size : 'small'}
                variant="outlined"
                label={props.label}
            />
        }}
        getOptionLabel={(option) => option ? option.name : ''}
        clearOnEscape
        clearOnBlur
        autoHighlight
        openOnFocus
        autoSelect
        defaultValue={props.defaultValue}
        onInputChange={(_, value: string) => setInputValue(value)}
        onChange={(_event: SyntheticEvent, value: ComboBoxItem | undefined | null) => {
            if (!value) return
            setValue(value)
            setInputValue(value.value ? value.value : value.name)
            if (props.onChange) props.onChange(value.value ? value.value : value.name)
        }}
    >
    </Autocomplete>
}

interface ComboBoxProps {
    size?: ComboSize
    label?: string;
    defaultValue?: ComboBoxItem;
    items: readonly ComboBoxItem[];
    onChange?: (value: string) => void
    name?: string;
    id?: string;
}

export type ComboBoxItem = {
    name: string;
    value?: string;
}
