import { IFilters } from "@/shared/interfaces/Filter"
import { ComboBox, ComboBoxItem } from "../common/ComboBox"
import { useEffect, useState } from "react"

type ComboBoxFilterProps = {
    label: string
    fieldName: string
    filter: IFilters
    setFilter: (filter: IFilters) => void
    onChange?: (value: any) => void
    items: ComboBoxItem[]
    className?:string
}

export const ComboBoxFilter = ({ 
    label, 
    onChange, 
    items, 
    filter, 
    setFilter, 
    className,
    fieldName 
}: ComboBoxFilterProps) => {

    const [value, setValue] = useState<string>()
    const [inputValue, setInputValue] = useState('')

    useEffect(() => {
        const matchedItem = items.find(item => {
            const filterValue = filter[fieldName]
            if (!filterValue) return false
            if (item.value) return filterValue == item.value
            return filterValue == item.name
        })
        setValue(matchedItem?.value ?? matchedItem?.name)
        setInputValue(matchedItem?.name ?? '')
    }, [fieldName, filter, items])

    return <ComboBox
        size="small"
        className={className}
        value={value}
        inputValue={inputValue}
        onInputChange={setInputValue}
        label={label}
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
