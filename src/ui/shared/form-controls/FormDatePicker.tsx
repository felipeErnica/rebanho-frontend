import { TextFieldVariants } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import dayjs from "dayjs"
import { Controller, FieldValues, UseControllerProps } from "react-hook-form"

type FormDatePickerProps<T extends FieldValues> = {
    label?: string
    className?: string
    variant?: TextFieldVariants
    formProps: UseControllerProps<T>
}

export const FormDatePicker = <T extends FieldValues>({ label, className, variant, formProps }: FormDatePickerProps<T>) => {
    return <Controller
        {...formProps}
        render={({ field, fieldState: { error } }) => (
            <DatePicker
                {...field}
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) => field.onChange(date?.toDate())}
                label={label}
                className={className}
                views={['year', 'month', 'day']}
                localeText={{
                    fieldDayPlaceholder: () => 'dd',
                    fieldMonthPlaceholder: () => 'mm',
                    fieldYearPlaceholder: () => 'aaaa',
                }}
                slotProps={{
                    textField: { 
                        size: "small", 
                        error: !!error, 
                        variant: variant || 'outlined',
                        helperText: error?.message },
                    field: { clearable: true }
                }}
            />
        )}
    />
}
