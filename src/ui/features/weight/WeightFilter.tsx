import { searchAnimal } from "@/shared/GlobalApiCalls";
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
        <DateFilter 
            mainTitle="Data de Pesagem"
            maxFieldName="maxEntryDate"
            minFieldName="minEntryDate"
            filter={filter}
            setFilter={setFilter}
        />
    </FilterPopover>

}
