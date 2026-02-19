import { TextFieldVariants } from "@mui/material/TextField"
import { Controller, FieldError, FieldValues, UseControllerProps } from "react-hook-form"
import { REQUIRED_FIELD_MSG } from "@shared/Globals"
import { PercentageComponent } from "@shared/common/PercentageComponent"

type FormPercentageFieldProps<T extends FieldValues> = {
    label?: string
    size?: "small" | "medium"
    className?: string
    onChange?: (value: any) => void
    formProps: UseControllerProps<T>
    multiline?: boolean
    variant?: TextFieldVariants
}

export const FormPercentageField = <T extends FieldValues>({
    label,
    size,
    formProps,
    onChange,
    className,
    variant,
}: FormPercentageFieldProps<T>) => {

    const treatError = (error: FieldError | undefined) => {
        if (!error) return undefined
        switch (error.type) {
            case "min":
                return `O valor deve ser maior que 0%.`
            case "max":
                return `O valor deve ser menor que 100%.`
            case "required":
                return REQUIRED_FIELD_MSG
            default:
                return undefined
        }
    }

    return <Controller
        {...formProps}
        rules={{ ...formProps.rules, max: 1, min: 0 }}
        render={({ field, fieldState }) => (
            <PercentageComponent
                ref={field.ref}
                name={field.name}
                value={Math.round((field.value * 100) * 10000) / 10000}
                disabled={field.disabled}
                onBlur={field.onBlur}
                className={className}
                error={!!fieldState.error}
                helperText={treatError(fieldState.error)}
                onChange={(event) => {
                    const value = event.target.value
                    const parsedValue = parseFloat(value)
                    field.onChange(parsedValue / 100)
                    if (onChange) onChange(parsedValue / 100)
                }}
                size={size}
                label={label}
                variant={variant}
            />
        )}
    />
}
