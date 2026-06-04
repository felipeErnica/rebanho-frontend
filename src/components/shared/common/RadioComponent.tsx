import Close from "@mui/icons-material/Close"
import { FormControlLabel, FormHelperText, IconButton, Radio, RadioGroup } from "@mui/material"
import { red } from "@mui/material/colors"
import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"
import React from "react"
import { ChangeEvent, FocusEventHandler, useCallback, useEffect, useState } from "react"

export type RadioControlProps = {
    value: string
    label?: string
    disabled?: boolean
    error?: boolean
}

function RadioControl({ value, label, disabled, error }: RadioControlProps) {
    return <FormControlLabel
        value={value}
        sx={{ color: error ? red[700] : undefined }}
        label={label || value}
        control={(
            <Radio
                key={value}
                sx={{
                    color: error ? red[700] : undefined,
                    '&.Mui-checked': { color: error ? red[700] : undefined }
                }}
            />
        )}
        disabled={disabled}
    />
}

type RadioComponentProps = {
    error?: boolean
    value?: string
    className?: string
    name?: string
    label?: string
    controls: RadioControlProps[]
    disabled?: boolean
    row?: boolean
    errorText?: string
    onChange?: (event: ChangeEvent<HTMLInputElement>, value: string) => void
    onBlur?: FocusEventHandler<HTMLDivElement>
    onReset?: () => void
}

export const RadioComponent = React.forwardRef<unknown, RadioComponentProps>(({
    value,
    error,
    className,
    name,
    disabled,
    label,
    controls,
    row,
    errorText,
    onChange,
    onBlur,
    onReset
}, ref) => {

    const [radioValue, setRadioValue] = useState(value)

    useEffect(() => setRadioValue(value), [value])

    const ResetButton = useCallback(() => {
        if (!onReset) return
        if (!radioValue) return
        return <div>
            <IconButton
                size="small"
                onClick={onReset}
            >
                <Close />
            </IconButton>
        </div>
    }, [radioValue, onReset])

    return <FormControl
        error={error}
        className={className}
        disabled={disabled}
    >
        {label && <FormLabel>{label}</FormLabel>}
        <RadioGroup
            value={radioValue ?? null}
            name={name}
            ref={ref}
            onChange={(event, value) => {
                setRadioValue(value)
                onChange(event, value)
            }}
            onBlur={onBlur}
            row={row}
            className="flex flex-wrap gap-2"
        >
            {controls.map(props => (
                <RadioControl
                    {...props}
                    error={!!error}
                />
            ))}
            <ResetButton />
        </RadioGroup>
        <FormHelperText>{errorText}</FormHelperText>
    </FormControl>
})
