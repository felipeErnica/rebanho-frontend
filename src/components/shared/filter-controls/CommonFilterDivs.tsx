import { JSX, ReactNode, useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ComboBox, ComboBoxItem } from "@shared/common/ComboBox";

type OldNumberDateFilterProps = {
    mainTitle: string;
    step?: string;
}

type OldTextFilterProps = {
    label: string
    onChange?: (value: any) => void
}

type OldComboBoxFilterProps = {
    label: string
    onChange?: (value: any) => void
    items: ComboBoxItem[]
}

type AbstractFilterDivProps = {
    mainTitle: string;
    children: ReactNode | ReactNode[]
}

export const AbstractFilterDiv = (props: AbstractFilterDivProps): JSX.Element => {
    return <div className="flex flex-col gap-2">
        <Typography variant="subtitle1">{`${props.mainTitle}:`}</Typography>
        <div className="flex flex-col gap-3">
            {props.children}
        </div>
    </div >
}

export const OldTextFilterDiv = ({ onChange, label }: OldTextFilterProps): JSX.Element => {
    return <TextField
        size="small"
        variant="outlined"
        type="search"
        label={label}
        onChange={(event) => {
            if (!onChange) return
            const value = event.currentTarget.value
            onChange(value != '' ? value : undefined)
        }}
    />
}


export const OldComboBoxFilterDiv = (props: OldComboBoxFilterProps) => {
    return <ComboBox
        size="small"
        label={props.label}
        onChange={props.onChange}
        items={props.items}
    />
}


export const OldNumberFilterDiv = ({ mainTitle, step }: OldNumberDateFilterProps): JSX.Element => {

    const [minError, setMinError] = useState(false)
    const [maxError, setMaxError] = useState(false)
    const [minValue, setMinValue] = useState<number | undefined>()
    const [maxValue, setMaxValue] = useState<number | undefined>()

    return <AbstractFilterDiv mainTitle={mainTitle}>
        <TextField
            type="number"
            error={minError}
            label='De'
            helperText={minError ? 'Insira um valor menor que o do campo abaixo' : null}
            size="small"
            slotProps={{
                htmlInput: { step },
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
            label='Até'
            slotProps={{
                htmlInput: { step },
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
    </AbstractFilterDiv>
}

export const OldDateFilterDiv = (props: OldNumberDateFilterProps): JSX.Element => {

    const [maxError, setMaxError] = useState(false)
    const [minError, setMinError] = useState(false)

    return <AbstractFilterDiv mainTitle={props.mainTitle}>
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
    </AbstractFilterDiv>
}
