import { TextFieldVariants } from "@mui/material/TextField"
import { HTMLInputTypeAttribute, ReactNode } from "react"
import { Controller, FieldError, FieldValues, UseControllerProps } from "react-hook-form"
import { TextComponent } from "@controls/common/TextComponent"
import { REQUIRED_FIELD_MSG } from "@controls/Globals"

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

    const treatError = (error: FieldError | undefined) => {
        if (!error) return undefined
        switch (error.type) {
            case "pattern":
                return "Formato Inválido."
            case "min":
                return `O valor deve ser maior que ${formProps.rules?.min}.`
            case "max":
                return `O valor deve ser menor que ${formProps.rules?.max}.`
            case "required":
                return REQUIRED_FIELD_MSG
            case "maxLength":
                return `O valor deve ter menos que ${formProps.rules?.maxLength} caracteres.`
            case "minLength":
                return `O valor deve ter mais que ${formProps.rules?.minLength} caracteres.`
            default:
                return undefined
        }
    }

    return <Controller
        {...formProps}
        render={({ field, fieldState }) => (
            <TextComponent
                {...field}
                value={field.value}
                type={type}
                className={className}
                error={!!fieldState.error}
                helperText={treatError(fieldState.error)}
                onChange={(event) => {
                    if (type == 'number') {
                        const value = event.target.value
                        const parsedValue = parseFloat(value)
                        field.onChange(parsedValue)
                        if (onChange) onChange(parsedValue)
                        return
                    }
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
