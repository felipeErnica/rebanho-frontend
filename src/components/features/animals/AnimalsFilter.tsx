import { getPastureLabel, Pasture } from "@features/farm-area/Entities"
import { searchPastures } from "@features/farm-area/Service"
import { AbstractFilterGroup } from "@shared/filter-controls/AbstractFilterGroup"
import { ComboBoxFilter } from "@shared/filter-controls/ComboBoxFilter"
import { DateFilter } from "@shared/filter-controls/DateFilter"
import { FilterPopover } from "@shared/filter-controls/FilterPopover"
import { MultipleSearchBoxFilter } from "@shared/filter-controls/SearchBoxFilter"
import { TextFilter } from "@shared/filter-controls/TextFilter"
import { SexValues } from "@utils/enums"
import { RefObject, useEffect, useState } from "react"
import { Animal, AnimalFilter, animalTypeToComboBox, getAnimalLabel } from "./Entities"
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
    const [pastures, setPastures] = useState<Pasture[]>([])

    useEffect(() => {
        Promise.all([
            searchAnimal({ isFiltered: true, sex: 'F', types: ['REPRODUCTION_ANIMAL', 'DAIRY_ANIMAL'] }),
            searchAnimal({ isFiltered: true, sex: 'M', types: ['REPRODUCTION_ANIMAL'] }),
            searchPastures()
        ])
            .then(values => {
                setMothers(values[0])
                setFathers(values[1])
                setPastures(values[2])
            })
            .catch(() => {
                setFathers([])
                setMothers([])
                setPastures([])
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
                <MultipleSearchBoxFilter
                    label="Pastos"
                    limitTags={2}
                    filter={filter}
                    setFilter={setFilter}
                    options={pastures.map(item => ({
                        id: item.id,
                        label: getPastureLabel(item)
                    }))}
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
