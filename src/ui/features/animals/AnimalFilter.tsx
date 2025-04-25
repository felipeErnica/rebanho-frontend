import { IFilters } from "@/interfaces/Filter"
import { AnimalFilter } from "@/types/Animal"
import { ComboBox } from "@/ui/components/common/ComboBox"
import { AbstractFilterDiv, DateFilterDiv, NumberFilterDiv } from "@/ui/components/common/CommonFilterDivs"
import { InputBox } from "@/ui/components/common/InputBox"
import { activateFilter } from "@/util/Filter"
import { JSX } from "react"

type FilterProps<T extends IFilters> = {
    filter: T
    setFilter: (filter: T) => void
}

export const AnimalFilterElement = ({ setFilter, filter }: FilterProps<AnimalFilter>): JSX.Element => {
    return <div className="grid grid-cols-1 grid-rows-[auto] gap-16">

        <AbstractFilterDiv mainTitle="Informações principais">
            <div className="grid grid-cols-1 grid-rows-3 gap-2">
                <InputBox
                    type="search"
                    placeholder="Pesquisar brinco..."
                />
                <InputBox
                    onInput={(event) => {
                        const newFilter = activateFilter(filter)
                        newFilter.name = event.currentTarget.value
                        setFilter(newFilter)
                    }}
                    type="search"
                    placeholder="Pesquisar nome..."
                />
                <ComboBox 
                    placeholder="Selecionar sexo..." 
                    items={[{ name: "M" }, { name: "F" }]} 
                />
            </div>
        </AbstractFilterDiv>

        <DateFilterDiv mainTitle="Data de Nascimento" />
        <DateFilterDiv mainTitle="Data de Morte" />
        <NumberFilterDiv mainTitle="Valor de Pico" step=".1" />
        <NumberFilterDiv mainTitle="Intervalo entre Partos Médio" step=".1" />
        <NumberFilterDiv mainTitle="I.S.R. Médio" step=".1" />
        <NumberFilterDiv mainTitle="Produção Média" step=".1" />
        <NumberFilterDiv mainTitle="Quantidade de Filho" />
    </div>
}
