import { Controller, FieldValues, UseControllerProps } from "react-hook-form"
import { RadioComponent, RadioControlProps } from "@shared/common/RadioComponent"

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
                ref={field.ref}
                value={field.value}
                disabled={field.disabled}
                onBlur={field.onBlur}
                error={!!error}
                errorText={error?.message}
                label={label}
                name={field.name}
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
