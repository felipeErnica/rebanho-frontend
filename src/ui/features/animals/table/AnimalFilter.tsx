import { AbstractFilterDiv, ComboBoxFilterDiv, DateFilterDiv, NumberFilterDiv, TextFilterDiv } from "@/ui/shared/common/CommonFilterDivs"
import { FilterModelProps } from "@/ui/shared/display/Display"
import { activateFilter } from "@/util/Filter"
import { JSX } from "react"

export const AnimalFilterElement = ({ setFilter, filter }: FilterModelProps): JSX.Element => {
    return <>
        <AbstractFilterDiv mainTitle="Informações principais">
            <TextFilterDiv label="Brinco:" />
            <TextFilterDiv
                label="Nome:"
                onChange={(event) => {
                    const newFilter = activateFilter(filter)
                    newFilter['name'] = event.currentTarget.value
                    setFilter(newFilter)
                }}
            />
            <ComboBoxFilterDiv
                label="Sexo:"
                items={[{ name: 'M' }, { name: 'F' }]}
            />
        </AbstractFilterDiv>

        <DateFilterDiv mainTitle="Data de Nascimento" />
        <DateFilterDiv mainTitle="Data de Morte" />
        <NumberFilterDiv mainTitle="Valor de Pico" step=".1" />
        <NumberFilterDiv mainTitle="Intervalo entre Partos Médio" step=".1" />
        <NumberFilterDiv mainTitle="I.S.R. Médio" step=".1" />
        <NumberFilterDiv mainTitle="Produção Média" step=".1" />
        <NumberFilterDiv mainTitle="Quantidade de Filho" />
    </>
}
