import TextField, { TextFieldVariants } from "@mui/material/TextField"
import { HTMLInputTypeAttribute, useEffect, useState } from "react"
import { Controller, FieldValues, UseControllerProps } from "react-hook-form"

type FormTextFieldProps<T extends FieldValues> = {
    label?: string
    classname?: string
    onChange?: (value: any) => void
    formProps: UseControllerProps<T>
    multiline?: boolean
    rows?: number
    type?: HTMLInputTypeAttribute
    variant?: TextFieldVariants
    maxRows?: number
}

export const FormTextField = <T extends FieldValues>({
    label,
    formProps,
    onChange,
    classname,
    rows,
    maxRows,
    type,
    variant,
    multiline
}: FormTextFieldProps<T>) => {

    const [value, setValue] = useState<any>()

    return <Controller
        {...formProps}
        render={({ field, fieldState }) => {

            useEffect(() => setValue(field.value), [])

            return <TextField
                {...field}
                value={value}
                type={type}
                className={classname}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                onChange={(event) => {
                    setValue(event.target.value)
                    if (onChange) onChange(event.target.value)
                    field.onChange(event)
                }}
                label={label}
                variant={variant || 'standard'}
                size="small"
                multiline={multiline}
                rows={rows}
                maxRows={maxRows}
                fullWidth
            />
        }}
    />
}
