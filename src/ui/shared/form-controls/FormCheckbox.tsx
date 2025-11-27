import { Checkbox, FormControlLabel, FormGroup, FormHelperText } from "@mui/material"
import { red } from "@mui/material/colors"
import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"
import { ChangeEvent, FocusEventHandler } from "react"
import { Controller, FieldValues, UseControllerProps } from "react-hook-form"

export type FormCheckboxControlProps<T extends FieldValues> = {
    formProps: UseControllerProps<T>
    label?: string
    disabled?: boolean
    onChange?: (event: ChangeEvent<HTMLInputElement>, value: boolean) => void
    onBlur?: FocusEventHandler<HTMLButtonElement>
}

type FormCheckboxGroupProps<T extends FieldValues> = {
    error?: boolean
    className?: string
    label?: string
    controls: FormCheckboxControlProps<T>[]
    disabled?: boolean
    row?: boolean
    errorText?: string
}

export const FormCheckboxGroup = <T extends FieldValues>({
    error,
    className,
    disabled,
    label,
    controls,
    row,
    errorText,
}: FormCheckboxGroupProps<T>) => {

    return <FormControl
        error={error}
        className={className}
        disabled={disabled}
    >
        {label && <FormLabel>{label}</FormLabel>}
        <FormGroup
            row={row}
            className="flex flex-wrap gap-2"
        >
            {controls.map(props => (
                <CheckboxControl
                    {...props}
                />
            ))}
        </FormGroup>
        <FormHelperText>{errorText}</FormHelperText>
    </FormControl>
}

const CheckboxControl = <T extends FieldValues>({
    formProps,
    label,
    disabled,
    onChange,
    onBlur,
}: FormCheckboxControlProps<T>) => {

    return <Controller
        {...formProps}
        render={({ field, fieldState: { error } }) => (
            <FormControlLabel
                sx={{ color: error ? red[700] : undefined }}
                label={label}
                control={(
                    <Checkbox
                        {...field}
                        sx={{
                            color: error ? red[700] : undefined,
                            '&.Mui-checked': { color: error ? red[700] : undefined }
                        }}
                        onChange={(event, value) => {
                            field.onChange(value)
                            if (onChange) onChange(event, value)
                        }}
                        checked={field.value}
                        onBlur={(event) => {
                            field.onBlur()
                            if (onBlur) onBlur(event)
                        }}
                    />
                )}
                disabled={disabled}
            />
        )}
    />
}

