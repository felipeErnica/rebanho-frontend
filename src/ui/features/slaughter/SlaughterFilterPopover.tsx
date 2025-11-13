import { searchAnimal, searchFather, searchAllMothers } from "@/shared/GlobalApiCalls";
import { DateFilter } from "@/ui/shared/filter-controls/DateFilter";
import { FilterPopover, FilterPopoverProps } from "@/ui/shared/filter-controls/FilterPopover";
import { NumberFilter } from "@/ui/shared/filter-controls/NumberFilter";
import { MultipleSearchBoxFilter } from "@/ui/shared/filter-controls/SearchBoxFilter";
import { searchSlaughterhouses } from "./Controller";

export const SlaughterFilterPopover = ({
    setFilter,
    filter,
    setFilterOpen,
    filterOpen,
    anchorEl
}: FilterPopoverProps) => {

    return <FilterPopover {...{ filterOpen, setFilterOpen, setFilter, filter, anchorEl }}>
        <MultipleSearchBoxFilter 
            label="Animais"
            fieldName="animals"
            searchOptions={searchAnimal}
            setFilter={setFilter}
            filter={filter}
        />
        <MultipleSearchBoxFilter 
            label="Pais"
            fieldName="fathers"
            searchOptions={searchFather}
            setFilter={setFilter}
            filter={filter}
        />
        <MultipleSearchBoxFilter 
            label="Mães"
            fieldName="mothers"
            searchOptions={searchAllMothers}
            setFilter={setFilter}
            filter={filter}
        />
        <MultipleSearchBoxFilter 
            label="Frigorífico"
            fieldName="slaughterhouses"
            searchOptions={searchSlaughterhouses}
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
