import { searchAllMothers } from "@utils/GlobalApiCalls"
import { ComboBoxFilter } from "@shared/filter-controls/ComboBoxFilter"
import { FilterPopover, FilterPopoverProps } from "@shared/filter-controls/FilterPopover"
import { MultipleSearchBoxFilter } from "@shared/filter-controls/SearchBoxFilter"
import { DateFilter } from "@shared/filter-controls/DateFilter"
import { BirthStatusItems, PregnancyStatusItems } from "./Entities"
import { Chip } from "@mui/material"
import { ChipColorScheme } from "@shared/Globals"

export const BirthTestFilter = ({
    filterOpen,
    setFilterOpen,
    anchorEl,
    setFilter,
    filter
}: FilterPopoverProps) => {
    return <FilterPopover {...{ filterOpen, setFilterOpen, anchorEl, setFilter }}>
        <div className="grid grid-cols-2 gap-4">
            <MultipleSearchBoxFilter
                className="col-span-2"
                label="Vacas"
                searchOptions={searchAllMothers}
                filter={filter}
                setFilter={setFilter}
                fieldName="animals"
            />
            <ComboBoxFilter
                label="Prenhez"
                items={PregnancyStatusItems}
                fieldName="pregnancyStatus"
                renderValue={(value) => (
                    <Chip 
                        label={value.name} 
                        color={ChipColorScheme.get(value.value)} 
                    />
                )}
                renderOption={(props, option) => (
                    <li {...props}>
                        <Chip label={option.name} color={ChipColorScheme.get(option.value)} />
                    </li>
                )}
                filter={filter}
                setFilter={setFilter}
            />
            <ComboBoxFilter
                label="Nascimento"
                items={BirthStatusItems}
                fieldName="birthStatus"
                renderValue={(value) => (
                    <Chip 
                        label={value.name} 
                        color={ChipColorScheme.get(value.value)} 
                    />
                )}
                renderOption={(props, option) => (
                    <li {...props}>
                        <Chip label={option.name} color={ChipColorScheme.get(option.value)} />
                    </li>
                )}
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
