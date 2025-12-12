import { IFilters } from "@utils/Filter"
import dayjs, { Dayjs } from "dayjs"
import { useState } from "react"
import { AbstractFilterGroup } from "./AbstractFilterGroup"
import { DateComponent } from "@shared/common/DateComponent"

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

    const [maxDate, setMaxDate] = useState<Dayjs>()
    const [minDate, setMinDate] = useState<Dayjs>()

    return <AbstractFilterGroup mainTitle={mainTitle} className={className}>
        <div className={`flex flex-row gap-4`}>
            <DateComponent
                label='De'
                maxDate={maxDate}
                value={filter[minFieldName] ? dayjs(filter[minFieldName]) : null}
                onChange={(value) => {
                    if (!value) {
                        setMinDate(undefined)
                        setFilter({ ...filter, isFiltered: true, [minFieldName]: undefined })
                        return
                    }
                    setMinDate(value)
                    setFilter({ ...filter, isFiltered: true, [minFieldName]: value.toDate() })
                }}
            />
            <DateComponent 
                label='Até'
                minDate={minDate}
                value={filter[maxFieldName] ? dayjs(filter[maxFieldName]) : null}
                onChange={(value) => {
                    if (!value) {
                        setMaxDate(undefined)
                        setFilter({ ...filter, isFiltered: true, [maxFieldName]: undefined })
                        return
                    }
                    setMaxDate(value)
                    setFilter({ ...filter, isFiltered: true, [maxFieldName]: value.toDate() })
                }}
            />
        </div>
    </AbstractFilterGroup>
}
