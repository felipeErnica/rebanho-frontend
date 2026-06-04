import { dateTransform } from "@utils/Transformations"
import { IconButton, InputAdornment, TextField, TextFieldVariants } from "@mui/material"
import { CalendarIcon, ClearIcon, DateValidationError, PickerChangeHandlerContext } from "@mui/x-date-pickers"
import { DatePicker, DatePickerFieldProps } from "@mui/x-date-pickers/DatePicker"
import { useParsedFormat, usePickerContext, useSplitFieldProps } from "@mui/x-date-pickers/hooks"
import { PickerValue } from "@mui/x-date-pickers/internals"
import { useValidation, validateDate } from "@mui/x-date-pickers/validation"
import dayjs, { Dayjs } from "dayjs"
import React, { useCallback, useEffect, useMemo, useState } from "react"

type DateComponentProps = {
    label?: string
    name?: string
    value?: Dayjs | null
    disabled?: boolean
    className?: string
    variant?: TextFieldVariants
    disablePast?: boolean
    disableFuture?: boolean
    maxDate?: Dayjs
    minDate?: Dayjs
    error?: string
    onChange?: (value: PickerValue, context: PickerChangeHandlerContext<DateValidationError>) => void
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}

export const DateComponent = React.forwardRef<HTMLInputElement, DateComponentProps>(({
    label,
    value,
    name,
    error,
    onChange,
    onBlur,
    className,
    disabled,
    variant,
    disablePast,
    disableFuture,
    maxDate,
    minDate
}, ref) => {

    const [validationError, setValidationError] = useState<DateValidationError | null>(null)
    const [dateValue, setDateValue] = useState<Dayjs | null>(value ?? null)
    const [calendarAnchor, setCalendarAnchor] = useState<HTMLElement | null>(null)

    const calendarRef = useCallback((node: HTMLElement) => {
        if (node !== null) {
            setCalendarAnchor(node)
        }
    }, [])
    
    useEffect(() => setDateValue(value ?? null), [dateValue, value])

    const errorMessage = useMemo(() => {
        switch (validationError) {
            case 'maxDate': {
                return `Inválido: A data não pode ser maior que ${dateTransform(maxDate?.toDate())}.`
            }
            case 'minDate': {
                return `Inválido: A data não pode ser menor que ${dateTransform(minDate?.toDate())}.`;
            }
            case 'invalidDate': {
                return 'Inválido: Formato incorreto.';
            }
            case 'disablePast': {
                return 'Inválido: O campo não aceita datas passadas.'
            }
            case 'disableFuture': {
                return 'Inválido: O campo não aceita datas futuras.'
            }
            default: {
                return '';
            }
        }
    }, [maxDate, minDate, validationError]);

    return <DatePicker
        disableFuture={disableFuture}
        disablePast={disablePast}
        name={name}
        ref={calendarRef}
        inputRef={ref}
        maxDate={maxDate}
        minDate={minDate}
        value={dateValue}
        onChange={onChange}
        label={label}
        onError={error => setValidationError(error)}
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
            popper: { anchorEl: calendarAnchor },
            field: {
                error: !!error || !!validationError,
                variant: variant || 'standard',
                helperText: error ?? errorMessage,
                onBlur: onBlur,
                disabled: disabled
            } as CustomDateFieldProps,
        }}
    />
})

interface CustomDateFieldProps extends DatePickerFieldProps {
    name?: string
    variant: TextFieldVariants
    helperText?: string
    error?: boolean
    disabled?: boolean
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}

const CustomDateField = (props: CustomDateFieldProps) => {

    const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');

    const pickerContext = usePickerContext();
    const placeholder = useParsedFormat();
    const [inputValue, setInputValue] = useState('')

    useEffect(() => {
        const dateValue = pickerContext.value
        if (dateValue == null || !dateValue.isValid()) return
        setInputValue(dateValue.format(pickerContext.fieldFormat))
    }, [pickerContext.fieldFormat, pickerContext.value])

    const transformDate = (event: React.FocusEvent<HTMLInputElement>) => {
        const newInputValue = event.target.value.trim();
        if (!newInputValue) {
            pickerContext.setValue(null)
            return
        }
        const parsedValue = parsedDate(newInputValue)
        const newValue = dayjs(parsedValue, 'DD-MM-YYYY', true)
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
        disabled={props.disabled}
        size="small"
        value={inputValue}
        onChange={event => setInputValue(event.target.value)}
        onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
            transformDate(event)
            if (props.onBlur) props.onBlur(event)
        }}
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
                sx: { color: props.error ? 'red' : undefined },
                endAdornment: (
                    <InputAdornment position="end">
                        {inputValue &&
                            <IconButton
                                disabled={props.disabled}
                                tabIndex={-1}
                                onClick={() => {
                                    pickerContext.setValue(null)
                                    setInputValue('')
                                }}
                            >
                                <ClearIcon
                                    fontSize="small"
                                    color={props.error ? 'error' : undefined}
                                />
                            </IconButton>
                        }
                        <IconButton
                            tabIndex={-1}
                            disabled={props.disabled}
                            onClick={() => pickerContext.setOpen((prev) => !prev)}
                            edge="end"
                        >
                            <CalendarIcon
                                fontSize="small"
                                color={props.error ? 'error' : undefined}
                            />
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
