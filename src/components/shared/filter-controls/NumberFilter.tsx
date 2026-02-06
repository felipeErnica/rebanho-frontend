import { IFilters } from "@utils/Filter"
import TextField from "@mui/material/TextField"
import { useState } from "react"
import { AbstractFilterGroup } from "./AbstractFilterGroup"

type NumberFilterProps = {
    mainTitle: string
    minFieldName: string
    maxFieldName: string
    filter: IFilters
    setFilter: (filter: IFilters) => void
    step?: string
    className?: string
    disabled?: boolean
}

export const NumberFilter = ({
    className,
    mainTitle,
    step,
    maxFieldName,
    minFieldName,
    filter,
    setFilter,
    disabled
}: NumberFilterProps) => {

    const [minError, setMinError] = useState(false)
    const [maxError, setMaxError] = useState(false)
    const [minValue, setMinValue] = useState<number>()
    const [maxValue, setMaxValue] = useState<number>()

    return <AbstractFilterGroup mainTitle={mainTitle} className={className}>
        <div className="flex flex-row gap-4">
            <TextField
                type="number"
                disabled={disabled}
                error={minError}
                value={filter[minFieldName] || ''}
                label='De'
                variant="standard"
                helperText={minError ? 'Insira um valor menor que o do campo abaixo' : null}
                size="small"
                fullWidth
                slotProps={{
                    htmlInput: { step },
                }}
                onChange={(event) => {
                    const newValue = Number(event.currentTarget.value)
                    if (!newValue) {
                        setMinValue(undefined)
                        setMinError(false)
                        setFilter({ ...filter, isFiltered: true, [minFieldName]: undefined })
                        return
                    }
                    setMinValue(newValue)
                    setMinError(false)
                    if (maxValue && newValue > maxValue) {
                        setMinError(true)
                        return
                    }
                    setFilter({ ...filter, isFiltered: true, [minFieldName]: newValue })
                }}
            />
            <TextField
                type="number"
                disabled={disabled}
                error={maxError}
                helperText={maxError ? 'Insira um valor maior que o do campo acima' : null}
                value={filter[maxFieldName] || null}
                variant="standard"
                label='Até'
                slotProps={{
                    htmlInput: { step },
                }}
                onChange={(event) => {
                    const newValue = Number(event.currentTarget.value)
                    setMaxError(false)
                    if (!newValue) {
                        setMaxValue(undefined)
                        setFilter({ ...filter, isFiltered: true, [maxFieldName]: undefined })
                        return
                    }
                    if (minValue && newValue < minValue) {
                        setMaxError(true)
                        return
                    }
                    setMaxValue(newValue)
                    setFilter({ ...filter, isFiltered: true, [maxFieldName]: newValue })
                }}
                size="small"
                fullWidth
            />
        </div>
    </AbstractFilterGroup>
}
