import { TextFieldVariants } from "@mui/material"
import dayjs, { Dayjs } from "dayjs"
import { Controller, FieldValues, UseControllerProps } from "react-hook-form"
import { DateComponent } from "../common/DateComponent"

type FormDatePickerProps<T extends FieldValues> = {
    label?: string
    className?: string
    variant?: TextFieldVariants
    formProps: UseControllerProps<T>
    disablePast?: boolean
    disableFuture?: boolean
    maxDate?: Dayjs
    minDate?: Dayjs
}

export const FormDatePicker = <T extends FieldValues>({
    label,
    className,
    variant,
    formProps,
    disablePast,
    disableFuture,
    maxDate,
    minDate
}: FormDatePickerProps<T>) => {

    return <Controller
        {...formProps}
        render={({ field, fieldState: { error } }) => (
            <DateComponent
                {...field}
                disableFuture={disableFuture}
                disablePast={disablePast}
                maxDate={maxDate}
                minDate={minDate}
                variant={variant}
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) => field.onChange(date ? date.toDate() : null)}
                label={label}
                error={error?.message}
                className={className}
                disabled={field.disabled}
            />
        )}
    />
}
