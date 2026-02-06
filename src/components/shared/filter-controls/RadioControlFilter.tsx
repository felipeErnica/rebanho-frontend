import { IFilters } from "@/utils/Filter"
import { Dispatch, SetStateAction, useCallback } from "react"
import { RadioComponent } from "@shared/common/RadioComponent"
import { IconButton } from "@mui/material"

type RadioFilterControlProps = {
    label: string
    disabled?: boolean
    value: string
}

type RadioFilterProps = {
    filter: IFilters
    setFilter: Dispatch<SetStateAction<IFilters>>
    fieldName: string
    label: string
    controls: RadioFilterControlProps[]
    row?: boolean
    className?: string
}

export const RadioComponentFilter = ({
    filter,
    setFilter,
    fieldName,
    label,
    row,
    controls
}: RadioFilterProps) => {

    return <RadioComponent
        row={row}
        label={label}
        value={filter[fieldName]}
        onChange={(_, value) => setFilter({ ...filter, isFiltered: true, [fieldName]: value })}
        onReset={() => setFilter({ ...filter, [fieldName]: undefined })}
        controls={controls.map(item => ({
            label: item.label,
            value: item.value,
            disabled: item.disabled,
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
    disabled?: boolean
    label?: string
    row?: boolean
}

export const RadioFilterNullFields = ({
    setFilter,
    filter,
    disabled,
    fieldName,
    allLabel,
    hasLabel,
    noneLabel,
    label,
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
        label={label}
        disabled={disabled}
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
