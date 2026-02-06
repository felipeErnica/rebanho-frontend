import { IFilters } from "@utils/Filter"
import dayjs, { Dayjs } from "dayjs"
import { useState } from "react"
import { AbstractFilterGroup } from "./AbstractFilterGroup"
import { DateComponent } from "@shared/common/DateComponent"
import { FieldValues, UseControllerProps } from "react-hook-form"
import { FormDatePicker } from "../form-controls/FormDatePicker"

type DateFilterProps = {
    mainTitle: string
    minFieldName: string
    maxFieldName: string
    filter: IFilters
    setFilter: (filter: IFilters) => void
    className?: string
    disabled?: boolean
}

export const DateFilter = ({
    mainTitle,
    maxFieldName,
    minFieldName,
    setFilter,
    className,
    disabled,
    filter
}: DateFilterProps) => {

    const [maxDate, setMaxDate] = useState<Dayjs>()
    const [minDate, setMinDate] = useState<Dayjs>()

    return <AbstractFilterGroup mainTitle={mainTitle} className={className}>
        <div className={`flex flex-row gap-4`}>
            <DateComponent
                label='De'
                disabled={disabled}
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
                disabled={disabled}
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

type DateFilterFormProps<T extends FieldValues> = {
    mainTitle: string
    minProps: UseControllerProps<T>
    maxProps: UseControllerProps<T>
    className?: string
}

export const DateFormFilter = <T extends FieldValues>({
    mainTitle,
    minProps,
    maxProps,
    className,
}: DateFilterFormProps<T>) => {

    const [maxDate, setMaxDate] = useState<Dayjs>()
    const [minDate, setMinDate] = useState<Dayjs>()

    return <AbstractFilterGroup mainTitle={mainTitle} className={className}>
        <div className={`flex flex-row gap-4`}>
            <FormDatePicker
                label='De'
                formProps={minProps}
                maxDate={maxDate}
                onChange={(value) => {
                    if (!value) {
                        setMinDate(undefined)
                        return
                    }
                    setMinDate(value)
                }}
            />
            <FormDatePicker
                label='Até'
                formProps={maxProps}
                minDate={minDate}
                onChange={(value) => {
                    if (!value) {
                        setMaxDate(undefined)
                        return
                    }
                    setMaxDate(value)
                }}
            />
        </div>
    </AbstractFilterGroup>
}
