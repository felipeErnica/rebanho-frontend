import { FilterPopover, FilterPopoverProps } from "@shared/filter-controls/FilterPopover"
import { MultipleSearchBoxFilter } from "@shared/filter-controls/SearchBoxFilter"
import { BirthEntryFilter } from "./Entities"
import { ComboBoxFilter } from "@shared/filter-controls/ComboBoxFilter"
import { SexValues } from "@utils/enums"
import { DateFilter } from "@shared/filter-controls/DateFilter"
import { NumberFilter } from "@shared/filter-controls/NumberFilter"
import { useEffect, useState } from "react"
import { Animal, getAnimalLabel } from "@features/animals/Entities"
import { searchFathers, searchMothers } from "@features/animals/Service"

type BirthFilterProps = FilterPopoverProps & {
    filter: BirthEntryFilter
}

export const BirthFilter = (props: BirthFilterProps) => {

    const [loading, setLoading] = useState(false)
    const [mothers, setMothers] = useState<Animal[]>([])
    const [fathers, setFathers] = useState<Animal[]>([])

    useEffect(() => {
        setLoading(true)
        Promise.all([
            searchMothers({ isFiltered: true, minChildrenNumber: 1 }),
            searchFathers()
        ])
            .then(responses => {
                setMothers(responses[0])
                setFathers(responses[1])
            })
            .catch(() => {
                setMothers([])
                setFathers([])
            })
            .finally(() => setLoading(false))
    }, [])

    return <FilterPopover {...props}>
        <div className="grid grid-flow-row gap-10">
            <MultipleSearchBoxFilter
                className="col-span-2"
                loading={loading}
                label="Mães"
                limitTags={2}
                setFilter={props.setFilter}
                filter={props.filter}
                fieldName="mothers"
                options={mothers.map(item => ({
                    id: item.id,
                    label: getAnimalLabel(item)
                }))}
            />
            <MultipleSearchBoxFilter
                className="col-span-2"
                label="Pais"
                loading={loading}
                limitTags={2}
                setFilter={props.setFilter}
                filter={props.filter}
                fieldName="fathers"
                options={fathers.map(item => ({
                    id: item.id,
                    label: getAnimalLabel(item)
                }))}
            />
            <ComboBoxFilter
                label="Sexo"
                setFilter={props.setFilter}
                filter={props.filter}
                items={SexValues}
                fieldName="sex"
            />
            <DateFilter
                className="col-span-2"
                mainTitle="Data de Nascimento"
                maxFieldName="maxBirthDate"
                minFieldName="minBirthDate"
                filter={props.filter}
                setFilter={props.setFilter}
            />
            <NumberFilter
                className='col-span-2'
                mainTitle="Intervalo entre Partos"
                minFieldName="minBirthInterval"
                maxFieldName="maxBirthInterval"
                filter={props.filter}
                setFilter={props.setFilter}
            />
        </div>
    </FilterPopover>
}
