import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormHelperText from "@mui/material/FormHelperText"
import FormLabel from "@mui/material/FormLabel"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import { Controller, FieldValues, UseControllerProps } from "react-hook-form"

export type RadioControlProps = {
    value: string
    label?: string
    disabled?: boolean
}

type FormRadioGroupProps<T extends FieldValues> = {
    label: string
    classname?: string
    row?: boolean
    onChange?: (value: string) => void
    formProps: UseControllerProps<T>
    controls: RadioControlProps[]
}

const RadioControl = ({ value, label, disabled }: RadioControlProps) => {
    return <FormControlLabel
        value={value}
        label={label || value}
        control={<Radio />}
        disabled={disabled}
    />
}

export const FormRadioGroup = <T extends FieldValues>({
    label,
    classname,
    row,
    controls,
    onChange,
    formProps,
}: FormRadioGroupProps<T>) => {
    return <Controller
        {...formProps}
        render={({ field, fieldState: { error } }) => (
            <FormControl error={!!error} className={classname}>
                <FormLabel>{label}</FormLabel>
                <FormHelperText>{error?.message}</FormHelperText>
                <RadioGroup
                    {...field}
                    onChange={(event, value) => {
                        if (onChange) {
                            onChange(value)
                            field.onChange(event.currentTarget.value)
                        }
                    }}
                    row={row}
                    className="flex flex-wrap gap-2"
                >
                    {controls.map(props => <RadioControl {...props} />)}
                </RadioGroup>
            </FormControl>
        )}
    />
}
