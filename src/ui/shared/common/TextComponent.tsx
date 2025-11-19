import TextField from "@mui/material/TextField"
import { ChangeEventHandler, FocusEventHandler, HTMLInputTypeAttribute, ReactNode } from "react"
import { RefCallBack } from "react-hook-form"

type TextComponentProps = {
    value?: any 
    name?: string
    ref?: RefCallBack
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

export function TextComponent({
    value,
    name,
    ref,
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
    endAdornment
}: TextComponentProps) {

    return <TextField
        value={value ?? ''}
        type={type}
        name={name}
        ref={ref}
        className={className}
        onBlur={onBlur}
        error={error}
        helperText={helperText}
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
                sx: { color: error ? 'red' : undefined },
                endAdornment: endAdornment
            }
        }}
    />
}
