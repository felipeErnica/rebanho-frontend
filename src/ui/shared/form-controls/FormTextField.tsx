import { TextFieldVariants } from "@mui/material/TextField"
import { HTMLInputTypeAttribute, ReactNode } from "react"
import { Controller, FieldValues, UseControllerProps } from "react-hook-form"
import { TextComponent } from "../common/TextComponent"

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
            <TextComponent
                {...field}
                value={field.value}
                type={type}
                className={className}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                onChange={(event) => {
                    field.onChange(event)
                    if (onChange) onChange(event.target.value)
                }}
                size={size}
                label={label}
                variant={variant}
                multiline={multiline}
                rows={rows}
                maxRows={maxRows}
                endAdornment={endAdornment}
            />
        )}
    />
}
