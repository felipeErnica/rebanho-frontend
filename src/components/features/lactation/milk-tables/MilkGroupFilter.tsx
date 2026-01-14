import { DateFilter } from "@shared/filter-controls/DateFilter"
import { FilterPopover, FilterPopoverProps } from "@shared/filter-controls/FilterPopover"

export const MilkGroupFilter = ({ filter, setFilter: setFilter, filterOpen, setFilterOpen, anchorEl }: FilterPopoverProps) => {
    return <FilterPopover {...{ filterOpen, setFilterOpen, setFilter, anchorEl }}>
        <DateFilter 
            mainTitle="Data da Marcação"
            maxFieldName="maxEntryDate"
            minFieldName="minEntryDate"
            filter={filter}
            setFilter={setFilter}
        />
    </FilterPopover>
}
