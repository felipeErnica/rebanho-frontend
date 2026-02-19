import { InputAdornment } from "@mui/material"
import TextField from "@mui/material/TextField"
import { ChangeEventHandler, FocusEventHandler, Ref } from "react"

type PercentageComponentProps = {
    value?: any
    name?: string
    ref?: Ref<HTMLInputElement>
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

export const PercentageComponent = ({
    value,
    ref,
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
}: PercentageComponentProps) => {

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
}
