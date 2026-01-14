import { DateFilter } from "@shared/filter-controls/DateFilter";
import { FilterPopover, FilterPopoverProps } from "@shared/filter-controls/FilterPopover";
import { NumberFilter } from "@shared/filter-controls/NumberFilter";
import { MultipleSearchBoxFilter } from "@shared/filter-controls/SearchBoxFilter";
import { useEffect, useState } from "react";
import { Animal, getAnimalLabel } from "@features/animals/Entities";
import { Pasture } from "@features/farm-area/Entities";
import { searchAnimal } from "@features/animals/Service";
import { searchPastures } from "@features/farm-area/Controller";

export const MilkEntriesFilter = ({
    setFilter: setFilter,
    filter,
    filterOpen,
    setFilterOpen,
    anchorEl
}: FilterPopoverProps) => {

    const [loading, setLoading] = useState(false)
    const [mothers, setMothers] = useState<Animal[]>([])
    const [pastures, setPastures] = useState<Pasture[]>([])

    useEffect(() => {
        setLoading(true)
        Promise.all([
            searchAnimal({ isFiltered: true, isOutsideAnimal: false, types: ['DAIRY_ANIMAL'] }),
            searchPastures()
        ])
            .then(values => {
                setMothers(values[0])
                setPastures(values[1])
            })
            .catch(() => {
                setMothers([])
                setPastures([])
            })
            .finally(() => setLoading(false))
    }, [])

    return <FilterPopover {...{ setFilterOpen, setFilter, filterOpen, anchorEl }}>
        <MultipleSearchBoxFilter
            label="Vacas"
            loading={loading}
            options={mothers.map(item => ({
                id: item.id,
                label: getAnimalLabel(item)
            }))}
            setFilter={setFilter}
            filter={filter}
            fieldName="animals"
        />
        <MultipleSearchBoxFilter
            label="Pastos"
            loading={loading}
            options={pastures.map(item => ({
                id: item.id,
                label: item.name
            }))}
            setFilter={setFilter}
            filter={filter}
            fieldName="pastures"
        />
        <DateFilter
            mainTitle="Data de Marcação"
            maxFieldName="maxEntryDate"
            minFieldName="minEntryDate"
            filter={filter}
            setFilter={setFilter}
        />
        <NumberFilter
            mainTitle="Quantidade"
            minFieldName="minQuantity"
            maxFieldName="maxQuantity"
            filter={filter}
            setFilter={setFilter}
        />
    </FilterPopover>

}
