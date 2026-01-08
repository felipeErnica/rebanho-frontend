import { DateFilter } from "@shared/filter-controls/DateFilter";
import { FilterPopover, FilterPopoverProps } from "@shared/filter-controls/FilterPopover";
import { NumberFilter } from "@shared/filter-controls/NumberFilter";
import { MultipleSearchBoxFilter } from "@shared/filter-controls/SearchBoxFilter";
import { searchAllPastures } from "./Controller";

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
            searchOptions={searchAllMothers}
            setFilter={setFilter}
            filter={filter}
            fieldName="animals"
        />
        <MultipleSearchBoxFilter 
            label="Pastos"
            searchOptions={searchAllPastures}
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
