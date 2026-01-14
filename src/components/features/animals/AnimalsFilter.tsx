import { SexValues } from "@utils/enums"
import { AbstractFilterGroup } from "@shared/filter-controls/AbstractFilterGroup"
import { ComboBoxFilter } from "@shared/filter-controls/ComboBoxFilter"
import { DateFilter } from "@shared/filter-controls/DateFilter"
import { MultipleSearchBoxFilter } from "@shared/filter-controls/SearchBoxFilter"
import { TextFilter } from "@shared/filter-controls/TextFilter"
import { RefObject, useEffect, useState } from "react"
import { FilterPopover } from "@shared/filter-controls/FilterPopover"
import { animalTypeToComboBox, AnimalFilter, Animal, getAnimalLabel } from "./Entities"
import { searchAnimal } from "./Service"

type AnimalsFilterProps = {
    filter: AnimalFilter
    setFilter: (filter: AnimalFilter) => void
    filterOpen: boolean
    setFilterOpen: (filterOpen: boolean) => void
    anchorEl: RefObject<HTMLButtonElement | null>
}

export const AnimalsFilter = ({
    filter,
    setFilter,
    setFilterOpen,
    filterOpen,
    anchorEl,
}: AnimalsFilterProps) => {

    const [fathers, setFathers] = useState<Animal[]>([])
    const [mothers, setMothers] = useState<Animal[]>([])

    useEffect(() => {
        Promise.all([
            searchAnimal({ isFiltered: true, sex: 'F', types: ['REPRODUCTION_ANIMAL', 'DAIRY_ANIMAL'] }),
            searchAnimal({ isFiltered: true, sex: 'M', types: ['REPRODUCTION_ANIMAL'] }),
        ])
            .then(values => {
                setMothers(values[0])
                setFathers(values[1])
            })
            .catch(() => {
                setFathers([])
                setMothers([])
            })
    }, [])

    return <FilterPopover
        setFilter={setFilter}
        anchorEl={anchorEl}
        setFilterOpen={setFilterOpen}
        filterOpen={filterOpen}
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
                    options={fathers.map(item => ({
                        id: item.id,
                        label: getAnimalLabel(item)
                    }))}
                    fieldName="fathers"
                    className="col-span-6"
                />
                <MultipleSearchBoxFilter
                    label="Mães"
                    limitTags={1}
                    filter={filter}
                    setFilter={setFilter}
                    options={mothers.map(item => ({
                        id: item.id,
                        label: getAnimalLabel(item)
                    }))}
                    fieldName="mothers"
                    className="col-span-6"
                />
                {/* <MultipleSearchBoxFilter */}
                {/*     label="Pastos" */}
                {/*     limitTags={2} */}
                {/*     filter={filter} */}
                {/*     setFilter={setFilter} */}
                {/*     fieldName="pastures" */}
                {/*     className="col-span-6" */}
                {/* /> */}
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
