import { IFilters } from "@/interfaces/Filter"
import { AnimalFilter } from "@/types/Animal"
import { ComboBox } from "@/ui/components/common/ComboBox"
import { AbstractFilterDiv, DateFilterDiv, NumberFilterDiv } from "@/ui/components/common/CommonFilterDivs"
import { activateFilter } from "@/util/Filter"
import TextField from "@mui/material/TextField"
import { JSX } from "react"

type FilterProps<T extends IFilters> = {
    filter: T
    setFilter: (filter: T) => void
}

export const AnimalFilterElement = ({ setFilter, filter }: FilterProps<AnimalFilter>): JSX.Element => {
    return <div className="grid grid-cols-1 grid-rows-[auto] gap-16">

        <AbstractFilterDiv mainTitle="Informações principais">
            <div className="grid grid-cols-1 grid-rows-3 gap-4">
                <TextField
                    variant="outlined"
                    size="small"
                    type="search"
                    label="Brinco"
                />
                <TextField
                    size="small"
                    variant="outlined"
                    onChange={(event) => {
                        const newFilter = activateFilter(filter)
                        newFilter.name = event.currentTarget.value
                        setFilter(newFilter)
                    }}
                    type="search"
                    label="Nome"
                />
                <ComboBox
                    size="small"
                    label="Sexo"
                    emptyValue="Nenhum"
                    items={[{name: 'M'}, {name: 'F'}]}
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
