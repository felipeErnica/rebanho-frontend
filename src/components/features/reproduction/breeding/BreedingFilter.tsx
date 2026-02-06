import { FilterPopover, FilterPopoverProps } from "@shared/filter-controls/FilterPopover"
import { BreedingEntryFilter, StatusItens } from "./Entities"
import { DateFilter } from "@shared/filter-controls/DateFilter"
import { ComboBoxFilter } from "@shared/filter-controls/ComboBoxFilter"
import { MultipleSearchBoxFilter } from "@shared/filter-controls/SearchBoxFilter"
import { Chip } from "@mui/material"
import { ChipColorScheme } from "@shared/Globals"
import { searchBreedingBulls } from "./Service"
import { useEffect, useState } from "react"
import { Animal, getAnimalLabel } from "@features/animals/Entities"
import { searchAllMothers } from "@features/animals/Service"

type BreedingFilterProps = FilterPopoverProps & {
    filter: BreedingEntryFilter
}

export const BreedingFilter = ({
    filter,
    setFilter: setFilter,
    filterOpen,
    setFilterOpen,
    anchorEl,
}: BreedingFilterProps) => {

    const [mothers, setMothers] = useState<Animal[]>([])
    const [bulls, setBulls] = useState<Animal[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        Promise.all([
            searchBreedingBulls(),
            searchAllMothers()
        ])
            .then(responses => {
                setBulls(responses[0])
                setMothers(responses[1])
            })
            .catch(() => {
                setBulls([])
                setMothers([])
            })
            .finally(() => setLoading(false))
    }, [])

    return <FilterPopover {...{ setFilterOpen, setFilter, filterOpen, anchorEl }}>
        <div className="grid grid-cols-2 gap-4">
            <MultipleSearchBoxFilter
                label="Touros"
                loading={loading}
                className="col-span-2"
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
                className="col-span-2"
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
                className="col-span-2"
                setFilter={setFilter}
                filter={filter}
            />
            <ComboBoxFilter
                label="Nascimento"
                items={StatusItens}
                filter={filter}
                setFilter={setFilter}
                fieldName="birthStatus"
                renderValue={value => (
                    <Chip
                        color={ChipColorScheme.get(value.value)}
                        label={value.name}
                    />
                )}
                renderOption={(props, option) => (
                    <li {...props}>
                        <Chip
                            color={ChipColorScheme.get(option.value)}
                            label={option.name}
                        />
                    </li>
                )}
            />
            <ComboBoxFilter
                label="Prenhez"
                items={StatusItens}
                filter={filter}
                setFilter={setFilter}
                fieldName="pregnancyStatus"
                renderValue={value => (
                    <Chip
                        color={ChipColorScheme.get(value.value)}
                        label={value.name}
                    />
                )}
                renderOption={(props, option) => (
                    <li {...props}>
                        <Chip
                            color={ChipColorScheme.get(option.value)}
                            label={option.name}
                        />
                    </li>
                )}
            />
        </div>
    </FilterPopover>
}
