import { Animal, getAnimalBirthLabel, getAnimalLabel } from "@features/animals/Entities";
import { searchAllMothers, searchFathers, searchInternalAnimals } from "@features/animals/Service";
import { Butcher } from "@features/butchers/Entities";
import { findButchers } from "@features/butchers/Service";
import { DateFilter } from "@shared/filter-controls/DateFilter";
import { FilterPopover, FilterPopoverProps } from "@shared/filter-controls/FilterPopover";
import { NumberFilter } from "@shared/filter-controls/NumberFilter";
import { MultipleSearchBoxFilter } from "@shared/filter-controls/SearchBoxFilter";
import { useEffect, useState } from "react";

export const SlaughterFilterPopover = ({
    setFilter: setFilter,
    filter,
    setFilterOpen,
    filterOpen,
    anchorEl
}: FilterPopoverProps) => {

    const [butchers, setButchers] = useState<Butcher[]>([])
    const [animals, setAnimals] = useState<Animal[]>([])
    const [mothers, setMothers] = useState<Animal[]>([])
    const [fathers, setFathers] = useState<Animal[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        Promise.all([
            findButchers(),
            searchInternalAnimals(),
            searchAllMothers(),
            searchFathers(),
        ])
        .then(resp => {
            setButchers(resp[0])
            setAnimals(resp[1])
            setMothers(resp[2])
            setFathers(resp[2])
        })
        .catch(() => {
            setButchers([])
            setAnimals([])
            setMothers([])
            setFathers([])
        })
        .finally(() => setLoading(false))
    }, [])

    return <FilterPopover {...{ filterOpen, setFilterOpen, setFilter, filter, anchorEl }}>
        <MultipleSearchBoxFilter 
            label="Animais"
            fieldName="animals"
            loading={loading}
            options={animals.map(item => ({
                id: item.id,
                label: getAnimalBirthLabel(item)
            }))}
            setFilter={setFilter}
            filter={filter}
        />
        <MultipleSearchBoxFilter 
            label="Pais"
            fieldName="fathers"
            loading={loading}
            options={fathers.map(item => ({
                id: item.id,
                label: getAnimalLabel(item)
            }))}
            setFilter={setFilter}
            filter={filter}
        />
        <MultipleSearchBoxFilter 
            label="Mães"
            fieldName="mothers"
            loading={loading}
            options={mothers.map(item => ({
                id: item.id,
                label: getAnimalLabel(item)
            }))}
            setFilter={setFilter}
            filter={filter}
        />
        <MultipleSearchBoxFilter 
            label="Frigorífico"
            fieldName="butchers"
            options={butchers.map(item => ({
                id: item.id,
                label: item.name
            }))}
            setFilter={setFilter}
            filter={filter}
        />
        <DateFilter 
            mainTitle="Data de Nascimento"
            maxFieldName="maxBirthDate"
            minFieldName="minBirthDate"
            filter={filter}
            setFilter={setFilter}
        />
        <DateFilter 
            mainTitle="Data de Abate"
            maxFieldName="maxEntryDate"
            minFieldName="minEntryDate"
            filter={filter}
            setFilter={setFilter}
        />
        <NumberFilter 
            mainTitle="Peso"
            minFieldName="minWeight"
            maxFieldName="maxWeight"
            filter={filter}
            setFilter={setFilter}
        />
        <NumberFilter 
            mainTitle="Peso de Abate"
            minFieldName="minDeadWeight"
            maxFieldName="maxDeadWeight"
            filter={filter}
            setFilter={setFilter}
        />
    </FilterPopover>
}
