import { DateFilter } from "@shared/filter-controls/DateFilter";
import { FilterPopover, FilterPopoverProps } from "@shared/filter-controls/FilterPopover";
import { NumberFilter } from "@shared/filter-controls/NumberFilter";
import { MultipleSearchBoxFilter } from "@shared/filter-controls/SearchBoxFilter";
import { TextFilter } from "@shared/filter-controls/TextFilter";
import { useEffect, useState } from "react";
import { Animal, getAnimalLabel } from "@features/animals/Entities";
import { searchAnimal } from "../animals/Service";
import { RadioFilterNullFields } from "@/components/shared/filter-controls/RadioControlFilter";

export const LacHistFilter = ({
    setFilter,
    filter,
    filterOpen,
    setFilterOpen,
    anchorEl
}: FilterPopoverProps) => {

    const [loading, setLoading] = useState(false)
    const [mothers, setMothers] = useState<Animal[]>([])

    useEffect(() => {
        setLoading(true)
        searchAnimal({ isFiltered: true, sex: 'F', types: ['REPRODUCTION_ANIMAL', 'DAIRY_ANIMAL'] })
            .then(response => {
                setMothers(response)
            })
            .catch(() => setMothers([]))
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
        <RadioFilterNullFields
            row
            filter={filter}
            setFilter={setFilter}
            fieldName="hasEndDate"
            allLabel="Todas"
            hasLabel="Já Finalizadas"
            noneLabel="Em Lactação"
        />
        <RadioFilterNullFields
            row
            filter={filter}
            setFilter={setFilter}
            fieldName="hasCalf"
            allLabel="Todas"
            hasLabel="Com Parição"
            noneLabel="Sem Parição"
        />
        <DateFilter
            mainTitle="Data de Início"
            maxFieldName="maxStartDate"
            minFieldName="minStartDate"
            filter={filter}
            setFilter={setFilter}
        />
        <DateFilter
            mainTitle="Data de Fim"
            maxFieldName="maxEndDate"
            minFieldName="minEndDate"
            filter={filter}
            setFilter={setFilter}
        />
        <DateFilter
            mainTitle="Data de Nascimento do Bezerro"
            maxFieldName="maxCalfBirthDate"
            minFieldName="minCalfBirthDate"
            filter={filter}
            setFilter={setFilter}
        />
        <NumberFilter
            mainTitle="Intervalo entre Lactações"
            minFieldName="minLacInterval"
            maxFieldName="maxLacInterval"
            filter={filter}
            setFilter={setFilter}
        />
        <NumberFilter
            mainTitle="Período em Lactação"
            minFieldName="minLacPeriod"
            maxFieldName="maxLacPeriod"
            filter={filter}
            setFilter={setFilter}
        />
        <NumberFilter
            mainTitle="Média Diária"
            minFieldName="minAverageProduction"
            maxFieldName="maxAverageProduction"
            filter={filter}
            setFilter={setFilter}
        />
        <NumberFilter
            mainTitle="Pico de Produção"
            minFieldName="minPeak"
            maxFieldName="maxPeak"
            filter={filter}
            setFilter={setFilter}
        />
        <NumberFilter
            mainTitle="Total Produzido"
            minFieldName="minTotalProduction"
            maxFieldName="maxTotalProduction"
            filter={filter}
            setFilter={setFilter}
        />
        <TextFilter
            label="Observações"
            fieldName="observation"
            setFilter={setFilter}
            filter={filter}
            multiline
            maxRows={5}
            rows={5}
        />
    </FilterPopover>

}
