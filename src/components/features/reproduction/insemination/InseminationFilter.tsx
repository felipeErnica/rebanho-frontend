import { FilterPopover, FilterPopoverProps } from "@shared/filter-controls/FilterPopover"
import { InseminationEntryFilter, InseminationsItens } from "./Entities"
import { DateFilter } from "@shared/filter-controls/DateFilter"
import { ComboBoxFilter } from "@shared/filter-controls/ComboBoxFilter"
import { MultipleSearchBoxFilter } from "@shared/filter-controls/SearchBoxFilter"
import { searchAllMothers } from "@utils/GlobalApiCalls"
import { searchInseminationBulls } from "./Controller"
import { Chip } from "@mui/material"
import { ChipColorScheme } from "@shared/Globals"

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
                searchOptions={searchInseminationBulls}
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
                items={InseminationsItens}
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
                items={InseminationsItens}
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
