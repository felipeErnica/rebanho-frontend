import { Checkbox, FormControlLabel, FormGroup, FormHelperText } from "@mui/material"
import { red } from "@mui/material/colors"
import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"
import React from "react"
import { ChangeEvent, FocusEventHandler } from "react"

export type CheckboxControlProps = {
    value: boolean
    label?: string
    disabled?: boolean
    error?: boolean
    name?: string
    onChange?: (event: ChangeEvent<HTMLInputElement>, value: boolean) => void
    onBlur?: FocusEventHandler<HTMLButtonElement>
}

type CheckboxGroupProps = {
    error?: boolean
    className?: string
    label?: string
    controls: CheckboxControlProps[]
    disabled?: boolean
    row?: boolean
    errorText?: string
}

export const CheckboxGroup = ({
    error,
    className,
    disabled,
    label,
    controls,
    row,
    errorText,
}: CheckboxGroupProps) => {

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
                    error={!!error}
                />
            ))}
        </FormGroup>
        <FormHelperText>{errorText}</FormHelperText>
    </FormControl>
}

const CheckboxControl = React.forwardRef<HTMLButtonElement, CheckboxControlProps>(({
    value,
    label,
    disabled,
    error,
    name,
    onChange,
    onBlur,
}: CheckboxControlProps, ref) => {

    return <FormControlLabel
        sx={{ color: error ? red[700] : undefined }}
        label={label || value}
        control={(
            <Checkbox
                name={name}
                ref={ref}
                sx={{
                    color: error ? red[700] : undefined,
                    '&.Mui-checked': { color: error ? red[700] : undefined }
                }}
                checked={value}
                onChange={onChange}
                onBlur={onBlur}
            />
        )}
        disabled={disabled}
    />
})

