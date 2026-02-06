import { Animal, getAnimalLabel } from "@features/animals/Entities"
import { DateFilter } from "@shared/filter-controls/DateFilter"
import { FilterPopover, FilterPopoverProps } from "@shared/filter-controls/FilterPopover"
import { MultipleSearchBoxFilter } from "@shared/filter-controls/SearchBoxFilter"
import { useEffect, useState } from "react"
import { InseminationEntryFilter, InseminationsItens } from "./Entities"
import { searchInseminationBulls } from "./Service"
import { searchAllMothers } from "@features/animals/Service"
import { RadioComponentFilter } from "@shared/filter-controls/RadioControlFilter"

type InseminationFilterProps = FilterPopoverProps & {
    filter: InseminationEntryFilter
}

export const InseminationFilter = ({
    filter,
    setFilter: setFilter,
    filterOpen,
    setFilterOpen,
    anchorEl,
}: InseminationFilterProps) => {

    const [bulls, setBulls] = useState<Animal[]>([])
    const [mothers, setMothers] = useState<Animal[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        Promise.all([
            searchInseminationBulls(),
            searchAllMothers()
        ])
            .then(resps => {
                setBulls(resps[0])
                setMothers(resps[1])
            })
            .catch(() => {
                setBulls([])
                setMothers([])
            })
            .finally(() => setLoading(false))
    }, [])

    return <FilterPopover {...{ setFilterOpen, setFilter, filterOpen, anchorEl }}>
        <MultipleSearchBoxFilter
            label="Touros"
            loading={loading}
            fieldName="bulls"
            options={bulls.map(item => ({
                id: item.id,
                label: getAnimalLabel(item)
            }))}
            filter={filter}
            setFilter={setFilter}
        />
        <MultipleSearchBoxFilter
            label="Vacas"
            loading={loading}
            fieldName="animals"
            options={mothers.map(item => ({
                id: item.id,
                label: getAnimalLabel(item)
            }))}
            filter={filter}
            setFilter={setFilter}
        />
        <DateFilter
            mainTitle="Data de Inseminação"
            maxFieldName="maxInseminationDate"
            minFieldName="minInseminationDate"
            setFilter={setFilter}
            filter={filter}
        />
        <RadioComponentFilter
            label="Nascimento"
            row
            filter={filter}
            setFilter={setFilter}
            fieldName="birthStatus"
            controls={InseminationsItens.map(item => ({
                label: item.name,
                value: item.value
            }))}
        />
        <RadioComponentFilter
            row
            label="Prenhez"
            filter={filter}
            setFilter={setFilter}
            fieldName="pregnancyStatus"
            controls={InseminationsItens.map(item => ({
                label: item.name,
                value: item.value
            }))}
        />
    </FilterPopover>
}
