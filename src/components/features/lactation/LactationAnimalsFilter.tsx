import { DateFilter } from "@shared/filter-controls/DateFilter";
import { FilterPopover, FilterPopoverProps } from "@shared/filter-controls/FilterPopover";
import { NumberFilter } from "@shared/filter-controls/NumberFilter";
import { MultipleSearchBoxFilter } from "@shared/filter-controls/SearchBoxFilter";
import { TextFilter } from "@shared/filter-controls/TextFilter";
import { useEffect, useState } from "react";
import { Animal, getAnimalLabel } from "@features/animals/Entities";
import { searchAnimal } from "../animals/Service";
import { RadioFilterNullFields } from "@/components/shared/filter-controls/RadioControlFilter";

export const LactationAnimalsFilter = ({
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
        searchAnimal({
            isFiltered: true,
            types: ['DAIRY_ANIMAL'],
            isAlive: true,
            isLactating: filter['isLactating']
        })
            .then(response => {
                setMothers(response)
            })
            .catch(() => setMothers([]))
            .finally(() => setLoading(false))
    }, [filter])

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
            label="Lactação:"
            row
            disabled={filter['isLactating']}
            filter={filter}
            setFilter={setFilter}
            fieldName="hasLactation"
            allLabel="Todas"
            hasLabel="Já Lactaram"
            noneLabel="Nunca Lactaram"
        />
        <RadioFilterNullFields
            label="Parição:"
            row
            disabled={filter['hasLactation'] == false}
            filter={filter}
            setFilter={setFilter}
            fieldName="hasCalf"
            allLabel="Todas"
            hasLabel="Com Parição"
            noneLabel="Sem Parição"
        />
        <DateFilter
            disabled={filter['hasLactation'] == false}
            mainTitle="Data de Início"
            maxFieldName="maxStartDate"
            minFieldName="minStartDate"
            filter={filter}
            setFilter={setFilter}
        />
        <DateFilter
            disabled={filter['isLactating'] || filter['hasLactation'] == false}
            mainTitle="Data de Fim"
            maxFieldName="maxEndDate"
            minFieldName="minEndDate"
            filter={filter}
            setFilter={setFilter}
        />
        <DateFilter
            disabled={filter['hasCalf'] == false || filter['hasLactation'] == false}
            mainTitle="Data de Nascimento do Bezerro"
            maxFieldName="maxCalfBirthDate"
            minFieldName="minCalfBirthDate"
            filter={filter}
            setFilter={setFilter}
        />
        <NumberFilter
            disabled={filter['hasLactation'] == false}
            mainTitle="Intervalo entre Lactações"
            minFieldName="minLacInterval"
            maxFieldName="maxLacInterval"
            filter={filter}
            setFilter={setFilter}
        />
        <NumberFilter
            disabled={filter['hasLactation'] == false}
            mainTitle="Período em Lactação"
            minFieldName="minLacPeriod"
            maxFieldName="maxLacPeriod"
            filter={filter}
            setFilter={setFilter}
        />
        <NumberFilter
            disabled={filter['hasLactation'] == false}
            mainTitle="Média Diária"
            minFieldName="minAverageProduction"
            maxFieldName="maxAverageProduction"
            filter={filter}
            setFilter={setFilter}
        />
        <NumberFilter
            disabled={filter['hasLactation'] == false}
            mainTitle="Pico de Produção"
            minFieldName="minPeak"
            maxFieldName="maxPeak"
            filter={filter}
            setFilter={setFilter}
        />
        <NumberFilter
            disabled={filter['hasLactation'] == false}
            mainTitle="Total Produzido"
            minFieldName="minTotalProduction"
            maxFieldName="maxTotalProduction"
            filter={filter}
            setFilter={setFilter}
        />
        <TextFilter
            disabled={filter['hasLactation'] == false}
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
