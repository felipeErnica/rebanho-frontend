import { SexValues } from "@utils/enums"
import { FilterModelProps } from "@shared/display/Display"
import { AbstractFilterGroup } from "@shared/filter-controls/AbstractFilterGroup"
import { ComboBoxFilter } from "@shared/filter-controls/ComboBoxFilter"
import { DateFilter } from "@shared/filter-controls/DateFilter"
import { NumberFilter } from "@shared/filter-controls/NumberFilter"
import { MultipleSearchBoxFilter } from "@shared/filter-controls/SearchBoxFilter"
import { TextFilter } from "@shared/filter-controls/TextFilter"
import { useCallback, useState } from "react"
import { 
    searchFarm, 
    searchFather, 
    searchAllMothers, 
    searchPastureByFarm, 
} from "@utils/GlobalApiCalls"

export const AnimalFilterElement = ({ filter, setFilter }: FilterModelProps) => {

    const [farmsId, setFarmsId] = useState<string[]>([])
    const handlePastureSearch = useCallback(() => searchPastureByFarm(farmsId), [farmsId])

    return <>
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
                    className="col-start-1 col-span-3"
                />
                <MultipleSearchBoxFilter
                    label="Mães"
                    limitTags={1}
                    filter={filter}
                    setFilter={setFilter}
                    searchOptions={searchAllMothers}
                    fieldName="mothers"
                    className="col-span-3"
                />
                <MultipleSearchBoxFilter
                    label="Fazendas"
                    limitTags={2}
                    filter={filter}
                    setFilter={setFilter}
                    searchOptions={searchFarm}
                    fieldName="farms"
                    onChange={(value) => {
                        if (!value) {
                            setFarmsId([])
                            return
                        }
                        setFarmsId(value.map(farm => farm.id))
                    }}
                    className="col-span-6"
                />
                <MultipleSearchBoxFilter
                    label="Pastos"
                    disabled={farmsId.length === 0}
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
        <DateFilter
            mainTitle="Data de Morte"
            maxFieldName="maxDeathDate"
            minFieldName="minDeathDate"
            setFilter={setFilter}
            filter={filter}
        />
        <DateFilter
            mainTitle="Data de Desmame"
            maxFieldName="maxWeaningDate"
            minFieldName="minWeaningDate"
            setFilter={setFilter}
            filter={filter}
        />

        <NumberFilter
            mainTitle="Valor de Pico"
            maxFieldName="maxPeak"
            minFieldName="minPeak"
            setFilter={setFilter}
            filter={filter}
            step=".1"
        />
        <NumberFilter
            mainTitle="Intervalo entre Partos Médio"
            maxFieldName="maxAverageBirthInterval"
            minFieldName="minAverageBirthInterval"
            setFilter={setFilter}
            filter={filter}
            step=".1"
        />
        <NumberFilter
            mainTitle="I.S.R. Médio"
            maxFieldName="maxIsr"
            minFieldName="minIsr"
            setFilter={setFilter}
            filter={filter}
            step=".1"
        />
        <NumberFilter
            mainTitle="Produção Média"
            maxFieldName="maxAverageProd"
            minFieldName="minAverageProd"
            setFilter={setFilter}
            filter={filter}
            step=".1"
        />
        <NumberFilter
            mainTitle="Quantidade de Filho"
            maxFieldName="maxChildrenQuantity"
            minFieldName="minChildrenQuantity"
            setFilter={setFilter}
            filter={filter}
        />
    </>
}
