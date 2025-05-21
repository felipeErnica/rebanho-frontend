import { ChangeEventHandler, JSX, ReactNode, useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ComboBox, ComboBoxItem } from "./ComboBox";

type NumberDateFilterProps = {
    mainTitle: string;
    step?: string;
}

type TextFilterProps = {
    label: string
    onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

type ComboBoxFilterProps = {
    label: string
    onChange?: (value: string) => void
    items: ComboBoxItem[]
}

type AbstractFilterDivProps = {
    mainTitle: string;
    children: ReactNode | ReactNode[]
}

export const AbstractFilterDiv = (props: AbstractFilterDivProps): JSX.Element => {
    return <div className="flex flex-col gap-2">
        <Typography variant="subtitle1">{`${props.mainTitle}:`}</Typography>
        <div className="flex flex-col gap-1">
            {props.children}
        </div>
    </div >
}

export const TextFilterDiv = (props: TextFilterProps): JSX.Element => {
    return <TextField
        size="small"
        variant="outlined"
        type="search"
        label={props.label}
        onChange={props.onChange}
    />
}

export const ComboBoxFilterDiv = (props: ComboBoxFilterProps) => {
    return <ComboBox
        size="small"
        label={props.label}
        onChange={props.onChange}
        items={props.items}
    />
}

export const NumberFilterDiv = (props: NumberDateFilterProps): JSX.Element => {

    const [minError, setMinError] = useState(false)
    const [maxError, setMaxError] = useState(false)
    const [minValue, setMinValue] = useState<number | undefined>()
    const [maxValue, setMaxValue] = useState<number | undefined>()

    return <AbstractFilterDiv mainTitle={props.mainTitle}>
        <div className="grid grid-rows-2 gap-2">
            <TextField
                type="number"
                error={minError}
                label='De:'
                helperText={minError ? 'Insira um valor menor que o do campo abaixo' : null}
                size="small"
                slotProps={{
                    htmlInput: { step: props.step },
                }}
                onChange={(event) => {
                    const newValue = Number(event.currentTarget.value)
                    setMinValue(newValue)
                    setMinError(false)
                    if (!maxValue) return
                    if (newValue > maxValue) {
                        setMinError(true)
                        return
                    }
                }}
            />
            <TextField
                type="number"
                error={maxError}
                helperText={maxError ? 'Insira um valor maior que o do campo acima' : null}
                label='Até:'
                slotProps={{
                    htmlInput: { step: props.step },
                }}
                onChange={(event) => {
                    const newValue = Number(event.currentTarget.value)
                    setMaxValue(newValue)
                    setMaxError(false)
                    if (!minValue) return
                    if (newValue < minValue) {
                        setMaxError(true)
                        return
                    }
                }}
                size="small"
            />
        </div>
    </AbstractFilterDiv>
}

export const DateFilterDiv = (props: NumberDateFilterProps): JSX.Element => {

    const [maxError, setMaxError] = useState(false)
    const [minError, setMinError] = useState(false)

    return <AbstractFilterDiv mainTitle={props.mainTitle}>
        <div className="grid grid-rows-2 gap-2">
            <DatePicker
                label='De:'
                onError={(error) => setMinError(error ? true : false)}
                views={['year', 'month', 'day']}
                localeText={{
                    fieldDayPlaceholder: () => 'dd',
                    fieldMonthPlaceholder: () => 'mm',
                    fieldYearPlaceholder: () => 'aaaa',
                }}
                slotProps={{
                    textField: {
                        size: "small",
                        helperText: minError ? 'Insira um valor de data válido' : null,
                    },
                    field: { clearable: true }
                }}
            />
            <DatePicker
                label='Até:'
                onError={(error) => setMaxError(error ? true : false)}
                views={['year', 'month', 'day']}
                localeText={{
                    fieldDayPlaceholder: () => 'dd',
                    fieldMonthPlaceholder: () => 'mm',
                    fieldYearPlaceholder: () => 'aaaa',
                }}
                slotProps={{
                    textField: {
                        size: "small",
                        helperText: maxError ? 'Insira um valor de data válido' : null,
                    },
                    field: { clearable: true }
                }}
            />
        </div>
    </AbstractFilterDiv>
}
