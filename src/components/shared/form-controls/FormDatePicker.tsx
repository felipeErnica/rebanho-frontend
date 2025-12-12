import { TextFieldVariants } from "@mui/material"
import dayjs, { Dayjs } from "dayjs"
import { Controller, FieldValues, UseControllerProps } from "react-hook-form"
import { DateComponent } from "@shared/common/DateComponent"
import { PickerValue } from "@mui/x-date-pickers/internals"

type FormDatePickerProps<T extends FieldValues> = {
    label?: string
    className?: string
    variant?: TextFieldVariants
    formProps: UseControllerProps<T>
    disablePast?: boolean
    disableFuture?: boolean
    maxDate?: Dayjs
    minDate?: Dayjs
    onChange?: (value: PickerValue) => void
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}

export const FormDatePicker = <T extends FieldValues>({
    label,
    className,
    variant,
    formProps,
    disablePast,
    disableFuture,
    maxDate,
    minDate,
    onChange,
    onBlur
}: FormDatePickerProps<T>) => {

    return <Controller
        {...formProps}
        render={({ field, fieldState: { error } }) => (
            <DateComponent
                {...field}
                disableFuture={disableFuture}
                onBlur={(event) => {
                    field.onBlur()
                    if (onBlur) onBlur(event)
                }}
                disablePast={disablePast}
                maxDate={maxDate}
                minDate={minDate}
                variant={variant}
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) => {
                    field.onChange(date ? date.toDate() : null)
                    if (onChange) onChange(date)
                }}
                label={label}
                error={error?.message}
                className={className}
                disabled={field.disabled}
            />
        )}
    />
}
