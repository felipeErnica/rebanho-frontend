import { IFilters } from "@/shared/interfaces/Filter"
import dayjs, { Dayjs } from "dayjs"
import { useCallback, useState } from "react"
import { AbstractFilterGroup } from "./AbstractFilterGroup"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"

type DateFilterProps = {
    mainTitle: string
    minFieldName: string
    maxFieldName: string
    filter: IFilters
    setFilter: (filter: IFilters) => void
    className?: string
}

export const DateFilter = ({
    mainTitle,
    maxFieldName,
    minFieldName,
    setFilter,
    className,
    filter
}: DateFilterProps) => {

    const [maxDate, setMaxDate] = useState<Dayjs | null>()
    const [minDate, setMinDate] = useState<Dayjs | null>()
    const [maxError, setMaxError] = useState(false)
    const [minError, setMinError] = useState(false)
    const [maxErrorDate, setMaxErrorDate] = useState(false)
    const [minErrorDate, setMinErrorDate] = useState(false)

    const INVALID_DATE_MSG = 'Insira um valor de data válido'

    const maxHelperText = useCallback(() => {
        if (maxError) return INVALID_DATE_MSG
        if (maxErrorDate) return 'Insira uma data maior que a do campo acima'
    }, [maxError, maxErrorDate])

    const minHelperText = useCallback(() => {
        if (minError) return INVALID_DATE_MSG
        if (minErrorDate) return 'Insira uma data menor que a do campo abaixo'
    }, [minError, minErrorDate])

    return <AbstractFilterGroup mainTitle={mainTitle} className={className}>
        <div className={`flex flex-row gap-4`}>
            <DatePicker
                label='De'
                onError={(error) => setMinError(!!error)}
                value={filter[minFieldName] ? dayjs(filter[minFieldName]): null}
                views={['year', 'month', 'day']}
                localeText={{
                    fieldDayPlaceholder: () => 'dd',
                    fieldMonthPlaceholder: () => 'mm',
                    fieldYearPlaceholder: () => 'aaaa',
                }}
                onChange={(value) => {
                    setMinError(false)
                    setMinErrorDate(false)
                    if (!value) {
                        setMinDate(null)
                        setFilter({ ...filter, isFiltered: true, [minFieldName]: undefined })
                        return
                    }
                    if (maxDate && maxDate.isBefore(value)) {
                        setMinErrorDate(true)
                        return
                    }
                    setMinDate(value)
                    setFilter({ ...filter, isFiltered: true, [minFieldName]: value.toDate() })
                }}
                slotProps={{
                    textField: {
                        size: "small",
                        variant: 'standard',
                        helperText: minHelperText(),
                        fullWidth: true,
                        error: minError || minErrorDate
                    },
                    field: { clearable: true }
                }}
            />
            <DatePicker
                label='Até'
                onError={(error) => setMaxError(!!error)}
                value={filter[maxFieldName] ? dayjs(filter[maxFieldName]): null}
                views={['year', 'month', 'day']}
                localeText={{
                    fieldDayPlaceholder: () => 'dd',
                    fieldMonthPlaceholder: () => 'mm',
                    fieldYearPlaceholder: () => 'aaaa',
                }}
                onChange={(value) => {
                    setMaxError(false)
                    setMaxErrorDate(false)
                    if (!value) {
                        setMaxDate(null)
                        setFilter({ ...filter, isFiltered: true, [maxFieldName]: undefined })
                        return
                    }
                    if (minDate && minDate.isAfter(value)) {
                        setMaxErrorDate(true)
                        return
                    }
                    setMaxDate(value)
                    setFilter({ ...filter, isFiltered: true, [maxFieldName]: value.toDate() })
                }}
                slotProps={{
                    textField: {
                        variant: 'standard',
                        size: "small",
                        helperText: maxHelperText(),
                        fullWidth: true,
                        error: maxError || maxErrorDate
                    },
                    field: { clearable: true }
                }}
            />
        </div>
    </AbstractFilterGroup>
}
