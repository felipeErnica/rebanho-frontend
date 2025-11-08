import { SexValues } from "@/shared/entities/enums"
import { AbstractFilterGroup } from "@/ui/shared/filter-controls/AbstractFilterGroup"
import { ComboBoxFilter } from "@/ui/shared/filter-controls/ComboBoxFilter"
import { DateFilter } from "@/ui/shared/filter-controls/DateFilter"
import { MultipleSearchBoxFilter } from "@/ui/shared/filter-controls/SearchBoxFilter"
import { TextFilter } from "@/ui/shared/filter-controls/TextFilter"
import { RefObject, useCallback } from "react"
import { FilterPopover } from "@/ui/shared/filter-controls/FilterPopover"
import { IFilters } from "@/shared/interfaces/Filter"
import { searchFather, searchMother, searchPastureByFarm } from "@/shared/GlobalApiCalls"

type FarmAnimalsFilterProps = {
    farmId: string
    filter: IFilters
    setFilter: (filter: IFilters) => void
    isFilterOpen: boolean
    setFilterOpen: (isFilterOpen: boolean) => void
    anchorEl: RefObject<HTMLButtonElement | null>
}

export const FarmAnimalsFilter = ({
    filter,
    setFilter,
    setFilterOpen,
    isFilterOpen,
    farmId,
    anchorEl,
}: FarmAnimalsFilterProps) => {

    const handlePastureSearch = useCallback(() => searchPastureByFarm(farmId), [farmId])

    return <FilterPopover
        setFilter={setFilter}
        anchorEl={anchorEl}
        setFilterOpen={setFilterOpen}
        filterOpen={isFilterOpen}
    >
        <AbstractFilterGroup mainTitle="Informações principais">
            <div className="grid grid-cols-6 grid-flow-row gap-4">
                <TextFilter
                    label="Brinco"
                    fieldName="ringNumber"
                    className="col-span-2"
                    filter={filter}
                    setFilter={setFilter}
                />
                <TextFilter
                    label="Nome"
                    fieldName="name"
                    filter={filter}
                    setFilter={setFilter}
                    className="col-span-4"
                />
                <ComboBoxFilter
                    label="Sexo"
                    className="col-span-2"
                    items={SexValues}
                    fieldName="sex"
                    filter={filter}
                    setFilter={setFilter}
                />
                <MultipleSearchBoxFilter
                    label="Pais"
                    limitTags={1}
                    filter={filter}
                    setFilter={setFilter}
                    searchOptions={searchFather}
                    fieldName="fathers"
                    className="col-span-6"
                />
                <MultipleSearchBoxFilter
                    label="Mães"
                    limitTags={1}
                    filter={filter}
                    setFilter={setFilter}
                    searchOptions={searchMother}
                    fieldName="mothers"
                    className="col-span-6"
                />
                <MultipleSearchBoxFilter
                    label="Pastos"
                    limitTags={2}
                    filter={filter}
                    setFilter={setFilter}
                    searchOptions={handlePastureSearch}
                    fieldName="pastures"
                    className="col-span-6"
                />
            </div>
        </AbstractFilterGroup>

        <DateFilter
            mainTitle="Data de Nascimento"
            maxFieldName="maxBirthDate"
            minFieldName="minBirthDate"
            setFilter={setFilter}
            filter={filter}
        />
    </FilterPopover>
}
