import { ComboBoxFilter } from "@shared/filter-controls/ComboBoxFilter"
import { FilterPopover, FilterPopoverProps } from "@shared/filter-controls/FilterPopover"
import { MultipleSearchBoxFilter } from "@shared/filter-controls/SearchBoxFilter"
import { DateFilter } from "@shared/filter-controls/DateFilter"
import { BirthStatusItems, PregnancyStatusItems } from "./Entities"
import { Chip } from "@mui/material"
import { ChipColorScheme } from "@shared/Globals"
import { useEffect, useState } from "react"
import { Animal, getAnimalLabel } from "@features/animals/Entities"
import { searchMothers } from "@features/animals/Service"

export const BirthTestFilter = ({
    filterOpen,
    setFilterOpen,
    anchorEl,
    setFilter: setFilter,
    filter
}: FilterPopoverProps) => {

    const [mothers, setMothers] = useState<Animal[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        searchMothers()
            .then(response => setMothers(response))
            .catch(() => setMothers([]))
            .finally(() => setLoading(false))
    }, [])

    return <FilterPopover {...{ filterOpen, setFilterOpen, anchorEl, setFilter }}>
        <div className="grid grid-cols-2 gap-4">
            <MultipleSearchBoxFilter
                loading={loading}
                className="col-span-2"
                label="Vacas"
                options={mothers.map(item => ({
                    id: item.id,
                    label: getAnimalLabel(item)
                }))}
                filter={filter}
                setFilter={setFilter}
                fieldName="animals"
            />
            <ComboBoxFilter
                label="Prenhez"
                items={PregnancyStatusItems}
                fieldName="pregnancyStatus"
                renderValue={(value) => (
                    <Chip
                        label={value.name}
                        color={ChipColorScheme.get(value.value)}
                    />
                )}
                renderOption={(props, option) => (
                    <li {...props}>
                        <Chip label={option.name} color={ChipColorScheme.get(option.value)} />
                    </li>
                )}
                filter={filter}
                setFilter={setFilter}
            />
            <ComboBoxFilter
                label="Nascimento"
                items={BirthStatusItems}
                fieldName="birthStatus"
                renderValue={(value) => (
                    <Chip
                        label={value.name}
                        color={ChipColorScheme.get(value.value)}
                    />
                )}
                renderOption={(props, option) => (
                    <li {...props}>
                        <Chip label={option.name} color={ChipColorScheme.get(option.value)} />
                    </li>
                )}
                filter={filter}
                setFilter={setFilter}
            />
            <DateFilter
                className="col-span-2"
                mainTitle="Data de Exame"
                maxFieldName="maxTestDate"
                minFieldName="minTestDate"
                filter={filter}
                setFilter={setFilter}
            />
            <DateFilter
                className="col-span-2"
                mainTitle="Data de Previsão"
                maxFieldName="maxBirthForecast"
                minFieldName="minBirthForecast"
                filter={filter}
                setFilter={setFilter}
            />
        </div>
    </FilterPopover>
}
