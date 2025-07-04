import TextField from "@mui/material/TextField"
import { HTMLInputTypeAttribute } from "react"
import { Controller, FieldValues, UseControllerProps } from "react-hook-form"

type FormTextFieldProps<T extends FieldValues> = {
    label: string
    classname?: string
    formProps: UseControllerProps<T>
    multiline?: boolean
    rows?: number
    type?:HTMLInputTypeAttribute
    maxRows?: number
}

export const FormTextField = <T extends FieldValues>({ 
    label, 
    formProps, 
    classname,
    rows,
    maxRows,
    type,
    multiline
}: FormTextFieldProps<T>) => {
    return <Controller
        {...formProps}
        render={({ field, fieldState }) => (
            <TextField
                {...field}
                type={type}
                className={classname}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                label={label}
                variant="outlined"
                size="small"
                multiline={multiline}
                rows={rows}
                maxRows={maxRows}
                fullWidth
            />
        )}
    />
}
