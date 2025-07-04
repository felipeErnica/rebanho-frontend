import { IFilters } from "@/shared/interfaces/Filter"
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
}

export const NumberFilter = ({
    mainTitle,
    step,
    maxFieldName,
    minFieldName,
    filter,
    setFilter,
}: NumberFilterProps) => {

    const [minError, setMinError] = useState(false)
    const [maxError, setMaxError] = useState(false)
    const [minValue, setMinValue] = useState<number>()
    const [maxValue, setMaxValue] = useState<number>()

    return <AbstractFilterGroup mainTitle={mainTitle}>
        <div className="flex flex-row gap-2">
            <TextField
                type="number"
                error={minError}
                value={filter[minFieldName] || ''}
                label='De'
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
                error={maxError}
                helperText={maxError ? 'Insira um valor maior que o do campo acima' : null}
                value={filter[maxFieldName] || null}
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
