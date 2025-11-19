import { FormControlLabel, FormHelperText, Radio, RadioGroup } from "@mui/material"
import { red } from "@mui/material/colors"
import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"
import { ChangeEvent, FocusEventHandler } from "react"
import { RefCallBack } from "react-hook-form"

export type RadioControlProps = {
    value: string
    label?: string
    disabled?: boolean
    error?: boolean
}

function RadioControl({ value, label, disabled, error }: RadioControlProps) {
    return <FormControlLabel
        value={value}
        sx={{ color: error ? red[700] : undefined }}
        label={label || value}
        control={(
            <Radio
                sx={{
                    color: error ? red[700] : undefined,
                    '&.Mui-checked': { color: error ? red[700] : undefined }
                }}
            />
        )}
        disabled={disabled}
    />
}

type RadioComponentProps = {
    error?: boolean
    value?: string
    className?: string
    name?: string
    ref?: RefCallBack
    label?: string
    controls: RadioControlProps[]
    disabled?: boolean
    row?: boolean
    errorText?: string
    onChange?: (event: ChangeEvent<HTMLInputElement>, value: string) => void
    onBlur?: FocusEventHandler<HTMLDivElement>
}

export function RadioComponent({ 
    value,
    error, 
    className,
    name, 
    ref,
    disabled,
    label,
    controls,
    row,
    errorText,
    onChange,
    onBlur,
}: RadioComponentProps) {

    return <FormControl 
        error={error} 
        className={className}
        disabled={disabled}
    >
        {label && <FormLabel>{label}</FormLabel>}
        <RadioGroup
            value={value ?? null}
            name={name}
            ref={ref}
            onChange={onChange}
            onBlur={onBlur}
            row={row}
            className="flex flex-wrap gap-2"
        >
            {controls.map(props => (
                <RadioControl
                    {...props}
                    error={!!error}
                />
            ))}
        </RadioGroup>
        <FormHelperText>{errorText}</FormHelperText>
    </FormControl>
}
