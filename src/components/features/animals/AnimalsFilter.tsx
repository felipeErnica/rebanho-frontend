import { SexValues } from "@utils/enums"
import { AbstractFilterGroup } from "@shared/filter-controls/AbstractFilterGroup"
import { ComboBoxFilter } from "@shared/filter-controls/ComboBoxFilter"
import { DateFilter } from "@shared/filter-controls/DateFilter"
import { MultipleSearchBoxFilter } from "@shared/filter-controls/SearchBoxFilter"
import { TextFilter } from "@shared/filter-controls/TextFilter"
import { RefObject } from "react"
import { FilterPopover } from "@shared/filter-controls/FilterPopover"
import { searchFather, searchAllMothers, searchPastures } from "@utils/GlobalApiCalls"
import { animalTypeToComboBox, AnimalFilter } from "./Entities"

type AnimalsFilterProps = {
    filter: AnimalFilter
    setFilter: (filter: AnimalFilter) => void
    isFilterOpen: boolean
    setFilterOpen: (isFilterOpen: boolean) => void
    anchorEl: RefObject<HTMLButtonElement | null>
}

export const AnimalsFilter = ({
    filter,
    setFilter,
    setFilterOpen,
    isFilterOpen,
    anchorEl,
}: AnimalsFilterProps) => {

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
                <ComboBoxFilter
                    label="Tipo de Animal"
                    className="col-span-4"
                    items={animalTypeToComboBox()}
                    fieldName="animalType"
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
                    searchOptions={searchAllMothers}
                    fieldName="mothers"
                    className="col-span-6"
                />
                <MultipleSearchBoxFilter
                    label="Pastos"
                    limitTags={2}
                    filter={filter}
                    setFilter={setFilter}
                    searchOptions={searchPastures}
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
