import TextField, { TextFieldVariants } from "@mui/material/TextField"
import { HTMLInputTypeAttribute, ReactNode } from "react"
import { Controller, FieldValues, UseControllerProps } from "react-hook-form"

type FormTextFieldProps<T extends FieldValues> = {
    label?: string
    size?: "small" | "medium"
    className?: string
    onChange?: (value: any) => void
    formProps: UseControllerProps<T>
    multiline?: boolean
    rows?: number
    type?: HTMLInputTypeAttribute
    variant?: TextFieldVariants
    maxRows?: number
    endAdornment?: ReactNode
}

export const FormTextField = <T extends FieldValues>({
    label,
    size,
    formProps,
    onChange,
    className,
    rows,
    maxRows,
    type,
    variant,
    multiline,
    endAdornment
}: FormTextFieldProps<T>) => {

    return <Controller
        {...formProps}
        render={({ field, fieldState }) => (
            <TextField
                {...field}
                value={field.value ?? ''}
                type={type}
                className={className}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                onChange={(event) => {
                    field.onChange(event)
                    if (onChange) onChange(event.target.value)
                }}
                size={size ?? 'small'}
                label={label}
                variant={variant || 'standard'}
                multiline={multiline}
                rows={rows}
                maxRows={maxRows}
                fullWidth
                slotProps={{
                    input: {
                        endAdornment: endAdornment
                    }
                }}
            />
        )}
    />
}
