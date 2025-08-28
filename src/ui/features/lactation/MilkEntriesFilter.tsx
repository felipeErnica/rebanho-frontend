import { searchMother } from "@/shared/GlobalApiCalls";
import { DateFilter } from "@/ui/shared/filter-controls/DateFilter";
import { FilterPopover, FilterPopoverProps } from "@/ui/shared/filter-controls/FilterPopover";
import { NumberFilter } from "@/ui/shared/filter-controls/NumberFilter";
import { MultipleSearchBoxFilter } from "@/ui/shared/filter-controls/SearchBoxFilter";

export const MilkEntriesFilter = ({ 
    setFilter, 
    filter, 
    filterOpen, 
    setFilterOpen, 
    anchorEl 
}: FilterPopoverProps) => {

    return <FilterPopover {...{ setFilterOpen, setFilter, filterOpen, anchorEl }}>
        <MultipleSearchBoxFilter 
            label="Vacas"
            searchOptions={searchMother}
            setFilter={setFilter}
            filter={filter}
            fieldName="animals"
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
