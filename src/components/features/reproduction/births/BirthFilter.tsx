import { FilterPopover, FilterPopoverProps } from "@shared/filter-controls/FilterPopover"
import { MultipleSearchBoxFilter } from "@shared/filter-controls/SearchBoxFilter"
import { BirthEntryFilter } from "./Entities"
import { searchFather, searchAllMothers } from "@utils/GlobalApiCalls"
import { ComboBoxFilter } from "@shared/filter-controls/ComboBoxFilter"
import { SexValues } from "@utils/enums"
import { DateFilter } from "@shared/filter-controls/DateFilter"
import { NumberFilter } from "@shared/filter-controls/NumberFilter"

type BirthFilterProps = FilterPopoverProps & {
    filter: BirthEntryFilter
}

export const BirthFilter = (props: BirthFilterProps) => {
    return <FilterPopover {...props}>
        <div className="grid grid-flow-row gap-10">
            <MultipleSearchBoxFilter 
                className="col-span-2"
                label="Mães"
                limitTags={2}
                setFilter={props.setFilter}
                filter={props.filter}
                fieldName="mothers"
                searchOptions={searchAllMothers}
            />
            <MultipleSearchBoxFilter 
                className="col-span-2"
                label="Pais"
                limitTags={2}
                setFilter={props.setFilter}
                filter={props.filter}
                fieldName="fathers"
                searchOptions={searchFather}
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
