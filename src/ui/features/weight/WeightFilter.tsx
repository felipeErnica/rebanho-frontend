import { searchAnimal, searchFather, searchAllMothers } from "@/shared/GlobalApiCalls";
import { DateFilter } from "@/ui/shared/filter-controls/DateFilter";
import { FilterPopover, FilterPopoverProps } from "@/ui/shared/filter-controls/FilterPopover";
import { MultipleSearchBoxFilter } from "@/ui/shared/filter-controls/SearchBoxFilter";

export const WeightFilterPopover = ({
    filter,
    setFilter,
    filterOpen,
    setFilterOpen,
    anchorEl,
}: FilterPopoverProps) => {

    return <FilterPopover {...{ anchorEl, filterOpen, setFilter, setFilterOpen }} >
        <MultipleSearchBoxFilter
            searchOptions={searchAnimal}
            label="Animais"
            setFilter={setFilter}
            filter={filter}
            fieldName="animals"
        />
        <MultipleSearchBoxFilter
            searchOptions={searchFather}
            label="Pais"
            setFilter={setFilter}
            filter={filter}
            fieldName="fathers"
        />
        <MultipleSearchBoxFilter
            searchOptions={searchAllMothers}
            label="Mães"
            setFilter={setFilter}
            filter={filter}
            fieldName="mothers"
        />
        <DateFilter 
            mainTitle="Data de Pesagem"
            maxFieldName="maxEntryDate"
            minFieldName="minEntryDate"
            filter={filter}
            setFilter={setFilter}
        />
    </FilterPopover>

}
