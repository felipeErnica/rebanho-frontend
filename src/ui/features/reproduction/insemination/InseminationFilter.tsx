import { FilterPopover, FilterPopoverProps } from "@/ui/shared/filter-controls/FilterPopover"
import { InseminationEntryFilter, statusMapToComboBox } from "./Entities"
import { DateFilter } from "@/ui/shared/filter-controls/DateFilter"
import { ComboBoxFilter } from "@/ui/shared/filter-controls/ComboBoxFilter"
import { MultipleSearchBoxFilter } from "@/ui/shared/filter-controls/SearchBoxFilter"
import { searchMother, searchMotherById } from "@/shared/GlobalApiCalls"
import { searchInseminationBulls, searchInseminationBullsById } from "./Controller"

type InseminationFilterProps = FilterPopoverProps & {
    filter: InseminationEntryFilter
}

export const InseminationFilter = ({
    filter,
    setFilter,
    filterOpen,
    setFilterOpen,
    anchorEl,
}: InseminationFilterProps) => {
    return <FilterPopover {...{ setFilterOpen, setFilter, filterOpen, anchorEl }}>
        <div className="grid grid-cols-2 gap-4">
            <MultipleSearchBoxFilter 
                label="Touros"
                className="col-span-2"
                fieldName="bulls"
                searchById={searchInseminationBullsById}
                searchByInput={searchInseminationBulls}
                filter={filter}
                setFilter={setFilter}
            />
            <MultipleSearchBoxFilter 
                label="Vacas"
                className="col-span-2"
                fieldName="animals"
                searchById={searchMotherById}
                searchByInput={searchMother}
                filter={filter}
                setFilter={setFilter}
            />
            <DateFilter
                mainTitle="Data de Inseminação"
                maxFieldName="maxInseminationDate"
                minFieldName="minInseminationDate"
                className="col-span-2"
                setFilter={setFilter}
                filter={filter}
            />
            <ComboBoxFilter
                label="Nascimento"
                items={statusMapToComboBox()}
                filter={filter}
                setFilter={setFilter}
                fieldName="status"
            />
            <ComboBoxFilter
                label="Prenhez"
                items={statusMapToComboBox()}
                filter={filter}
                setFilter={setFilter}
                fieldName="pregnancyStatus"
            />
        </div>
    </FilterPopover>
}
