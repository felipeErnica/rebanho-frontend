import { IFilters } from "@/utils/Filter"
import { CheckboxGroup } from "@shared/common/CheckboxGroup"
import { Dispatch, SetStateAction } from "react"

type CheckboxFilterControlProps = {
    fieldName: string
    label: string
    disabled?: boolean
}

type CheckboxFilterProps = {
    filter: IFilters
    setFilter: Dispatch<SetStateAction<IFilters>>
    controls: CheckboxFilterControlProps[]
    row?: boolean
    className?: string
}

export const CheckboxFilter = ({
    filter,
    setFilter,
    controls,
    className
}: CheckboxFilterProps) => {

    return <CheckboxGroup
        className={className}
        controls={controls.map(item => ({
            label: item.label,
            value: filter[item.fieldName],
            disabled: item.disabled,
            onChange: (_, value) => setFilter({ ...filter, isFiltered: true, [item.fieldName]: value })
        }))}
    />
}
