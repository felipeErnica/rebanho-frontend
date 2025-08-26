import { searchMother, searchMotherById } from "@/shared/GlobalApiCalls";
import { DateFilter } from "@/ui/shared/filter-controls/DateFilter";
import { FilterPopover, FilterPopoverProps } from "@/ui/shared/filter-controls/FilterPopover";
import { MultipleSearchBoxFilter } from "@/ui/shared/filter-controls/SearchBoxFilter";

export const LossFilterPopover = ({ filter, filterOpen, setFilter, setFilterOpen, anchorEl }: FilterPopoverProps) => {

    return <FilterPopover
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        setFilter={setFilter}
        anchorEl={anchorEl}
    >
        <MultipleSearchBoxFilter 
            label="Vacas"
            limitTags={2}
            filter={filter}
            setFilter={setFilter}
            fieldName="animals"
            searchById={searchMotherById}
            searchByInput={searchMother}
        />
        <DateFilter 
            mainTitle="Data de Interrupção"
            maxFieldName="maxLossDate"
            minFieldName="minLossDate"
            filter={filter}
            setFilter={setFilter}
        />
    </FilterPopover>

}
