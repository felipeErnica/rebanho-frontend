import { IFilters } from "@utils/Filter"
import { ComboBox, ComboBoxItem } from "@shared/common/ComboBox"
import { HTMLAttributes, ReactNode, useEffect, useState } from "react"

type ComboBoxFilterProps = {
    label: string
    fieldName: string
    filter: IFilters
    setFilter: (filter: IFilters) => void
    onChange?: (value: any) => void
    items: ComboBoxItem[]
    className?: string
    renderOption?: (props: HTMLAttributes<HTMLLIElement> & { key: any }, option: ComboBoxItem) => ReactNode
    renderValue?: (value: ComboBoxItem, getItemProps: (args?: { index?: number }) => {
        className: string
        disabled: boolean
        tabIndex: -1
        "data-item-index": number
        onDelete: (event: any) => void
    }) => ReactNode
}

export const ComboBoxFilter = ({
    label,
    onChange,
    items,
    filter,
    setFilter,
    className,
    fieldName,
    renderOption,
    renderValue
}: ComboBoxFilterProps) => {

    const [value, setValue] = useState<string>(filter[fieldName])

    useEffect(() => {
        if (filter[fieldName] === value) return
        setValue(filter[fieldName])
    }, [fieldName, filter, items, value])

    return <ComboBox
        size="small"
        className={className}
        value={value}
        label={label}
        renderOption={renderOption}
        renderValue={renderValue}
        onChange={(value) => {
            if (!value) {
                setFilter({ ...filter, isFiltered: true, [fieldName]: undefined })
                return
            }
            setFilter({ ...filter, isFiltered: true, [fieldName]: value })
            if (onChange) onChange(value)
        }}
        items={items}
    />
}
