import { IFilters } from "@/utils/Filter"
import { Dispatch, SetStateAction, useCallback } from "react"
import { RadioComponent } from "@shared/common/RadioComponent"

type RadioFilterControlProps = {
    fieldName: string
    label: string
    disabled?: boolean
}

type RadioFilterProps = {
    filter: IFilters
    setFilter: Dispatch<SetStateAction<IFilters>>
    controls: RadioFilterControlProps[]
    row?: boolean
    className?: string
}

export const RadioComponentFilter = ({
    filter,
    setFilter,
    controls
}: RadioFilterProps) => {

    return <RadioComponent
        controls={controls.map(item => ({
            label: item.label,
            value: filter[item.fieldName],
            disabled: item.disabled,
            onChange: (_, value) => setFilter({ ...filter, isFiltered: true, [item.fieldName]: value })
        }))}
    />
}

type RadioFilterHasFieldsProps = {
    filter: IFilters
    setFilter: Dispatch<SetStateAction<IFilters>>
    fieldName: string
    allLabel: string
    hasLabel: string
    noneLabel: string
    row?: boolean
}

export const RadioFilterNullFields = ({
    setFilter,
    filter,
    fieldName,
    allLabel,
    hasLabel,
    noneLabel,
    row,
}: RadioFilterHasFieldsProps) => {

    const getValue = useCallback(() => {
        if (!filter.isFiltered) return null
        switch (filter[fieldName]) {
            case undefined:
                return 'ALL'
            case true:
                return 'HAS_FIELD'
            case false:
                return 'NONE_FIELD'
        }
    }, [fieldName, filter])

    return <RadioComponent
        row={row}
        controls={[
            { label: allLabel, value: 'ALL' },
            { label: hasLabel, value: 'HAS_FIELD' },
            { label: noneLabel, value: 'NONE_FIELD' },
        ]}
        value={getValue()}
        onChange={(_, value) => {
            switch (value) {
                case 'ALL':
                    setFilter({ ...filter, [fieldName]: undefined })
                    break
                case 'HAS_FIELD':
                    setFilter({ ...filter, isFiltered: true, [fieldName]: true })
                    break
                case 'NONE_FIELD':
                    setFilter({ ...filter, isFiltered: true, [fieldName]: false })
                    break
            }
        }}
    />
}
