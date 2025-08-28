import { FilterPopover } from "@/ui/shared/filter-controls/FilterPopover"
import { RefObject } from "react"
import { TextFilter } from "@/ui/shared/filter-controls/TextFilter"
import { AbstractFilterGroup } from "@/ui/shared/filter-controls/AbstractFilterGroup"
import { DateFilter } from "@/ui/shared/filter-controls/DateFilter"
import { PastureEntriesFilter } from "./Entities"
import { MultipleSearchBoxFilter } from "@/ui/shared/filter-controls/SearchBoxFilter"
import { searchFather, searchMother } from "@/shared/GlobalApiCalls"

type PastureEntriesFilterProps = {
    filter: PastureEntriesFilter
    setFilter: (filter: PastureEntriesFilter) => void
    anchorEl: RefObject<HTMLButtonElement | null>
    isFilterOpen: boolean
    setFilterOpen: (isFilterOpen: boolean) => void
}

export const PastureEntriesFilterPopover = ({
    filter,
    setFilter,
    isFilterOpen,
    anchorEl,
    setFilterOpen
}: PastureEntriesFilterProps) => {
    return <FilterPopover {...{ filterOpen: isFilterOpen, setFilterOpen, anchorEl, setFilter }}>
        <AbstractFilterGroup mainTitle="Informações do Animal">
            <div className="grid grid-cols-3 gap-4">
                <TextFilter
                    label="Brinco"
                    fieldName="animalRingNumber"
                    filter={filter}
                    setFilter={setFilter}
                />
                <TextFilter
                    label="Nome"
                    className="col-span-2"
                    fieldName="animalName"
                    filter={filter}
                    setFilter={setFilter}
                />
                <MultipleSearchBoxFilter
                    label="Mães"
                    fieldName="mothers"
                    searchOptions={searchMother}
                    filter={filter}
                    setFilter={setFilter}
                />
                <MultipleSearchBoxFilter
                    label="Pais"
                    fieldName="fathers"
                    searchOptions={searchFather}
                    filter={filter}
                    setFilter={setFilter}
                />
            </div>
        </AbstractFilterGroup>
        <DateFilter
            mainTitle="Data de Nascimento"
            className='col-span-3'
            maxFieldName="maxAnimalBirthDate"
            minFieldName="minAnimalBirthDate"
            filter={filter}
            setFilter={setFilter}
        />
        <DateFilter
            mainTitle="Data de Entrada"
            maxFieldName="maxEntryDate"
            minFieldName="minEntryDate"
            filter={filter}
            setFilter={setFilter}
        />
    </FilterPopover >
}
