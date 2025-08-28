import { searchMother } from "@/shared/GlobalApiCalls"
import { ComboBoxFilter } from "@/ui/shared/filter-controls/ComboBoxFilter"
import { FilterPopover, FilterPopoverProps } from "@/ui/shared/filter-controls/FilterPopover"
import { SearchBoxFilter } from "@/ui/shared/filter-controls/SearchBoxFilter"
import { statusMapToComboBox } from "../insemination/Entities"
import { DateFilter } from "@/ui/shared/filter-controls/DateFilter"

export const BirthTestFilter = ({
    filterOpen,
    setFilterOpen,
    anchorEl,
    setFilter,
    filter
}: FilterPopoverProps) => {
    return <FilterPopover {...{ filterOpen, setFilterOpen, anchorEl, setFilter }}>
        <div className="grid grid-cols-2 gap-4">
            <SearchBoxFilter
                className="col-span-2"
                label="Vacas"
                searchOptions={searchMother}
                filter={filter}
                setFilter={setFilter}
                fieldName="animals"
            />
            <ComboBoxFilter
                label="Prenhez"
                items={statusMapToComboBox()}
                fieldName="pregnancyStatus"
                filter={filter}
                setFilter={setFilter}
            />
            <ComboBoxFilter
                label="Nascimento"
                items={statusMapToComboBox()}
                fieldName="birthStatus"
                filter={filter}
                setFilter={setFilter}
            />
            <DateFilter 
                className="col-span-2"
                mainTitle="Data de Exame"
                maxFieldName="maxTestDate"
                minFieldName="minTestDate"
                filter={filter}
                setFilter={setFilter}
            />
            <DateFilter 
                className="col-span-2"
                mainTitle="Data de Previsão"
                maxFieldName="maxBirthForecast"
                minFieldName="minBirthForecast"
                filter={filter}
                setFilter={setFilter}
            />
        </div>
    </FilterPopover>
}
