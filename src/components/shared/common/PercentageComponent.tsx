import { InputAdornment } from "@mui/material"
import TextField from "@mui/material/TextField"
import React from "react"
import { ChangeEventHandler, FocusEventHandler } from "react"

type PercentageComponentProps = {
    value?: any
    name?: string
    className?: string
    disabled?: boolean
    error?: boolean
    helperText?: string
    onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    onBlur?: FocusEventHandler<HTMLTextAreaElement | HTMLInputElement>
    size?: 'small' | 'medium'
    label?: string
    variant?: 'outlined' | 'standard' | 'filled'
}

export const PercentageComponent = React.forwardRef<HTMLInputElement, PercentageComponentProps>(({
    value,
    name,
    className,
    disabled,
    error,
    helperText,
    onChange,
    onBlur,
    size,
    label,
    variant,
}, ref) => {

    return <TextField
        value={value ?? '-'}
        type='number'
        name={name}
        inputRef={ref}
        className={className}
        onBlur={onBlur}
        error={!disabled && error}
        helperText={!disabled ? helperText : undefined}
        onChange={onChange}
        size={size ?? 'small'}
        label={label}
        variant={variant || 'standard'}
        disabled={disabled}
        fullWidth
        slotProps={{
            input: {
                sx: { color: !disabled && error ? 'red' : undefined },
                endAdornment: <InputAdornment position="end">%</InputAdornment>
            }
        }}
    />
})
