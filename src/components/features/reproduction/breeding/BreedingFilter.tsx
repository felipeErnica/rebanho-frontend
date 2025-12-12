import { FilterPopover, FilterPopoverProps } from "@shared/filter-controls/FilterPopover"
import { BreedingEntryFilter, StatusItens } from "./Entities"
import { DateFilter } from "@shared/filter-controls/DateFilter"
import { ComboBoxFilter } from "@shared/filter-controls/ComboBoxFilter"
import { MultipleSearchBoxFilter } from "@shared/filter-controls/SearchBoxFilter"
import { searchAllMothers } from "@utils/GlobalApiCalls"
import { Chip } from "@mui/material"
import { ChipColorScheme } from "@shared/Globals"
import { searchBreedingBulls } from "./Controller"

type BreedingFilterProps = FilterPopoverProps & {
    filter: BreedingEntryFilter
}

export const BreedingFilter = ({
    filter,
    setFilter,
    filterOpen,
    setFilterOpen,
    anchorEl,
}: BreedingFilterProps) => {
    return <FilterPopover {...{ setFilterOpen, setFilter, filterOpen, anchorEl }}>
        <div className="grid grid-cols-2 gap-4">
            <MultipleSearchBoxFilter
                label="Touros"
                className="col-span-2"
                fieldName="bulls"
                searchOptions={searchBreedingBulls}
                filter={filter}
                setFilter={setFilter}
            />
            <MultipleSearchBoxFilter
                label="Vacas"
                className="col-span-2"
                fieldName="animals"
                searchOptions={searchAllMothers}
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
                items={StatusItens}
                filter={filter}
                setFilter={setFilter}
                fieldName="birthStatus"
                renderValue={value => (
                    <Chip
                        color={ChipColorScheme.get(value.value)}
                        label={value.name}
                    />
                )}
                renderOption={(props, option) => (
                    <li {...props}>
                        <Chip
                            color={ChipColorScheme.get(option.value)}
                            label={option.name}
                        />
                    </li>
                )}
            />
            <ComboBoxFilter
                label="Prenhez"
                items={StatusItens}
                filter={filter}
                setFilter={setFilter}
                fieldName="pregnancyStatus"
                renderValue={value => (
                    <Chip
                        color={ChipColorScheme.get(value.value)}
                        label={value.name}
                    />
                )}
                renderOption={(props, option) => (
                    <li {...props}>
                        <Chip
                            color={ChipColorScheme.get(option.value)}
                            label={option.name}
                        />
                    </li>
                )}
            />
        </div>
    </FilterPopover>
}
