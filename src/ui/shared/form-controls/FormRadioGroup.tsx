import { Controller, FieldValues, UseControllerProps } from "react-hook-form"
import { RadioComponent, RadioControlProps } from "../common/RadioComponent"

type FormRadioGroupProps<T extends FieldValues> = {
    label: string
    classname?: string
    row?: boolean
    onChange?: (value: string) => void
    formProps: UseControllerProps<T>
    controls: RadioControlProps[]
}

export const FormRadioGroup = <T extends FieldValues>({
    label,
    classname,
    row,
    controls,
    onChange,
    formProps,
}: FormRadioGroupProps<T>) => {

    return <Controller
        {...formProps}
        render={({ field, fieldState: { error } }) => (
            <RadioComponent 
                {...field}
                error={!!error}
                errorText={error?.message}
                label={label}
                className={classname}
                controls={controls}
                row={row}
                onChange={(_, value) => {
                    field.onChange(value)
                    if (onChange) onChange(value)
                }}
            />
        )}
    />
}
