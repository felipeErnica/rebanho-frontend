import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { JSX } from "react";
import MenuItem from "@mui/material/MenuItem";

export type ComboSize = 'small' | 'medium'

export const ComboBox = (props: ComboBoxProps): JSX.Element => {
    return (
        <FormControl size={props.size ? props.size : 'medium'} variant="outlined">
            {props.label ? <InputLabel>{props.label}</InputLabel> : null}
            <Select
                label={props.label}
                defaultValue={props.defaultValue}
                onChange={props.onChange}
            >
                {props.emptyValue ? <MenuItem><i>{props.emptyValue}</i></MenuItem> : null}
                {props.items.map(item => {
                    return <MenuItem value={item.value ? item.value : item.name} >
                        {item.name}
                    </MenuItem>
                })}
            </Select>
        </FormControl>
    )
}

interface ComboBoxProps {
    size?: ComboSize
    label?: string;
    defaultValue?: string;
    emptyValue?: string;
    items: ComboBoxItem[];
    onChange?: (event: SelectChangeEvent) => void
    id?: string;
}

export interface ComboBoxItem {
    name: string;
    value?: string;
}
