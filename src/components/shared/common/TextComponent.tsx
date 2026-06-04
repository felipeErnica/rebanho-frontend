import TextField from "@mui/material/TextField"
import React from "react"
import{ ChangeEventHandler, FocusEventHandler, HTMLInputTypeAttribute, ReactNode } from "react"

type TextComponentProps = {
    value?: any 
    name?: string
    type?: HTMLInputTypeAttribute
    className?: string
    disabled?: boolean
    error?: boolean
    helperText?: string
    onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    onBlur?: FocusEventHandler<HTMLTextAreaElement | HTMLInputElement>
    size?: 'small' | 'medium'
    label?: string
    variant?: 'outlined' | 'standard' | 'filled'
    multiline?: boolean
    rows?: number
    maxRows?: number
    endAdornment?: ReactNode
}

export const TextComponent = React.forwardRef<HTMLInputElement, TextComponentProps>(({
    value,
    name,
    type,
    className,
    disabled,
    error,
    helperText,
    onChange,
    onBlur,
    size,
    label,
    variant,
    multiline,
    rows,
    maxRows,
    endAdornment,
}, ref) => {

    return <TextField
        value={value ?? ''}
        type={type}
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
        multiline={multiline}
        rows={rows}
        maxRows={maxRows}
        disabled={disabled}
        fullWidth
        slotProps={{
            input: {
                sx: { color: !disabled && error ? 'red' : undefined },
                endAdornment: endAdornment
            }
        }}
    />
})
