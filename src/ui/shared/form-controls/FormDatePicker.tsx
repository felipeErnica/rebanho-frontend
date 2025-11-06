import { IconButton, InputAdornment, TextField, TextFieldVariants } from "@mui/material"
import { CalendarIcon, ClearIcon, DateValidationError } from "@mui/x-date-pickers"
import { DatePicker, DatePickerFieldProps } from "@mui/x-date-pickers/DatePicker"
import { useParsedFormat, usePickerContext, useSplitFieldProps } from "@mui/x-date-pickers/hooks"
import { useValidation, validateDate } from "@mui/x-date-pickers/validation"
import dayjs from "dayjs"
import { useEffect, useMemo,  useRef,  useState } from "react"
import { Controller, FieldValues, UseControllerProps } from "react-hook-form"

type FormDatePickerProps<T extends FieldValues> = {
    label?: string
    className?: string
    variant?: TextFieldVariants
    formProps: UseControllerProps<T>
    disabled?: boolean
}

export const FormDatePicker = <T extends FieldValues>({ label, className, variant, formProps, disabled }: FormDatePickerProps<T>) => {

    const [validationError, setError] = useState<DateValidationError | null>(null)

    const errorMessage = useMemo(() => {
        switch (validationError) {
            case 'maxDate': {
                return 'Inválido: Selecione uma data menor'
            }
            case 'minDate': {
                return 'Inválido: Selecione uma data menor';
            }
            case 'invalidDate': {
                return 'Inválido: formato incorreto';
            }
            case 'disablePast': {
                return 'Inválido: O campo não aceita datas passadas'
            }
            case 'disableFuture': {
                return 'Inválido: O campo não aceita datas futuras'
            }
            default: {
                return '';
            }
        }
    }, [validationError]);

    return <Controller
        {...formProps}
        render={({ field, fieldState: { error } }) => (
            <DatePicker
                {...field}
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) => field.onChange(date ? date.toDate() : null)}
                label={label}
                onError={error => setError(error)}
                className={className}
                disabled={disabled}
                showDaysOutsideCurrentMonth
                dayOfWeekFormatter={date => date.format('ddd')}
                views={['year', 'month', 'day']}
                localeText={{
                    fieldDayPlaceholder: () => 'dd',
                    fieldMonthPlaceholder: () => 'mm',
                    fieldYearPlaceholder: () => 'aaaa',
                }}
                format="DD/MM/YYYY"
                slots={{ field: CustomDateField }}
                slotProps={{
                    field: {
                        clearable: true,
                        error: !!error,
                        variant: variant || 'standard',
                        helperText: error?.message ?? errorMessage,
                    } as CustomDateFieldProps
                }}
            />
        )}
    />
}

interface CustomDateFieldProps extends DatePickerFieldProps {
    clearable: boolean
    variant: TextFieldVariants
    helperText?: string
    error?: boolean
}

function CustomDateField(props: CustomDateFieldProps) {

    const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');

    const pickerContext = usePickerContext();
    const placeholder = useParsedFormat();
    const [inputValue, setInputValue] = useState('')

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const dateValue = pickerContext.value
        if (dateValue == null || !dateValue.isValid()) return
        setInputValue(dateValue.format(pickerContext.fieldFormat))
    }, [pickerContext.fieldFormat, pickerContext.value])


    const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const newInputValue = event.target.value.trim();
        if (!newInputValue) {
            pickerContext.setValue(null)
            return
        }
        const parsedValue = parsedDate(newInputValue)
        const newValue = dayjs(parsedValue, pickerContext.fieldFormat)
        pickerContext.setValue(newValue)
    }

    // Check if the current value is valid or not.
    const { hasValidationError } = useValidation({
        value: pickerContext.value,
        timezone: pickerContext.timezone,
        props: internalProps,
        validator: validateDate,
    });


    return <TextField
        {...forwardedProps}
        placeholder={placeholder}
        size="small"
        value={inputValue}
        onChange={event => setInputValue(event.target.value)}
        onBlur={onBlur}
        inputRef={inputRef}
        error={hasValidationError || forwardedProps.error}
        focused={pickerContext.open}
        label={pickerContext.label}
        name={pickerContext.name}
        className={pickerContext.rootClassName}
        sx={pickerContext.rootSx}
        ref={pickerContext.rootRef}
        fullWidth
        slotProps={{
            input: {
                ref: pickerContext.triggerRef,
                endAdornment: (
                    <InputAdornment position="end">
                        {inputValue &&
                            <IconButton
                                tabIndex={-1}
                                onClick={() => {
                                    pickerContext.setValue(null)
                                    setInputValue('')
                                    inputRef.current?.focus()
                                }}
                            >
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        }
                        <IconButton
                            tabIndex={-1}
                            onClick={() => pickerContext.setOpen((prev) => !prev)}
                            edge="end"
                        >
                            <CalendarIcon fontSize="small" />
                        </IconButton>
                    </InputAdornment>

                ),
            }
        }}
    />

}

function parsedDate(date: string) {

    const YEAR_SHORTCUT = 50
    const parts = date.split(/[-/.]/)

    let day: number
    let month: number
    let year: number

    if (parts.length < 2) return date
    if (parts.length == 2) {
        const [dayRaw, monthRaw] = parts
        day = parseInt(dayRaw)
        month = parseInt(monthRaw)
        year = dayjs().year()
        return `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`
    }

    const [dayRaw, monthRaw, yearRaw] = parts
    day = parseInt(dayRaw)
    month = parseInt(monthRaw)
    year = parseInt(yearRaw)

    if (isNaN(day) || isNaN(month) || isNaN(year)) return date

    if (year < 100) {
        const currentYear = dayjs().year()
        const currentSuffix = currentYear % 100
        if (year <= currentSuffix + YEAR_SHORTCUT) {
            year += 2000
        } else {
            year += 1900
        }
    }

    return `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`
}
