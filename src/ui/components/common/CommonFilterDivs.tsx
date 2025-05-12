import { JSX, ReactNode, useState } from "react";
import Typography from "@mui/material/Typography";
import TextField  from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers";

export const AbstractFilterDiv = (props: AbstractFilterDivProps): JSX.Element => {
    return <div className="grid grid-cols-1 grid-rows-[auto_1fr] gap-4">
        <Typography variant="subtitle1">{`${props.mainTitle}:`}</Typography>
        {props.children}
    </div>
}

export const NumberFilterDiv = (props: NumberDateFilterProps): JSX.Element => {
    
    const [minError, setMinError] = useState(false)
    const [maxError, setMaxError] = useState(false)

    return <AbstractFilterDiv mainTitle={props.mainTitle}>
        <div className="grid grid-rows-2 gap-3">
            <TextField
                error={minError}
                label='De:'
                helperText={minError ? 'Insira um valor numérico' : null}
                size="small"
                slotProps={{
                    inputLabel:{shrink: true},
                }}
                onChange={(event) => {
                    const numberTyped = parseFloat(event.currentTarget.value)
                    setMinError(isNaN(numberTyped) && event.currentTarget.value !== '')
                }}
            />
            <TextField
                error={maxError}
                helperText={maxError ? 'Insira um valor numérico' : null}
                label='Até:'
                slotProps={{
                    inputLabel:{shrink: true}
                }}
                onChange={(event) => {
                    const numberTyped = parseFloat(event.currentTarget.value)
                    setMaxError(isNaN(numberTyped) && event.currentTarget.value !== '')
                }}
                size="small"
                inputMode="numeric"
            />
        </div>
    </AbstractFilterDiv>
}

export const DateFilterDiv = (props: NumberDateFilterProps): JSX.Element => {
    return <AbstractFilterDiv mainTitle={props.mainTitle}>
        <div className="grid grid-rows-2 gap-2">
            <DatePicker
                label='De:' 
            />
            <DatePicker 
                label='Até:' 
            />
        </div>
    </AbstractFilterDiv>
}

interface NumberDateFilterProps {
    mainTitle: string;
    step?: string;
}

interface AbstractFilterDivProps {
    mainTitle: string;
    children: ReactNode | ReactNode[]
}
