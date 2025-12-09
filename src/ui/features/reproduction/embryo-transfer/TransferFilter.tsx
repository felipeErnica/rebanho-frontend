import { FilterPopover, FilterPopoverProps } from "@/ui/shared/filter-controls/FilterPopover"
import { TransferEntryFilter, StatusItens } from "./Entities"
import { DateFilter } from "@/ui/shared/filter-controls/DateFilter"
import { ComboBoxFilter } from "@/ui/shared/filter-controls/ComboBoxFilter"
import { MultipleSearchBoxFilter } from "@/ui/shared/filter-controls/SearchBoxFilter"
import { searchAllMothers } from "@/shared/GlobalApiCalls"
import { Chip } from "@mui/material"
import { ChipColorScheme } from "@/ui/shared/Globals"
import { searchTransferBulls } from "./Controller"

type TransferFilterProps = FilterPopoverProps & {
    filter: TransferEntryFilter
}

export const TransferFilter = ({
    filter,
    setFilter,
    filterOpen,
    setFilterOpen,
    anchorEl,
}: TransferFilterProps) => {
    return <FilterPopover {...{ setFilterOpen, setFilter, filterOpen, anchorEl }}>
        <div className="grid grid-cols-2 gap-4">
            <MultipleSearchBoxFilter
                label="Touros"
                className="col-span-2"
                fieldName="bulls"
                searchOptions={searchTransferBulls}
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
                mainTitle="Data de Transferência"
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
