import { SexValues } from "@/shared/entities/enums"
import { AbstractFilterDiv, ComboBoxFilterDiv, DateFilterDiv, NumberFilterDiv, TextFilterDiv } from "@/ui/shared/common/CommonFilterDivs"
import { FilterModelProps } from "@/ui/shared/display/Display"
import { activateFilter } from "@/util/Filter"

export const LactationFilter = ({ filter, setFilter }: FilterModelProps) => {
    return <>
        <AbstractFilterDiv mainTitle="Informações principais">
            <TextFilterDiv
                label="Brinco"
                onChange={(event) => {
                    const newFilter = activateFilter(filter)
                    newFilter['name'] = event.currentTarget.value
                    setFilter(newFilter)
                }}
            />
            <TextFilterDiv
                label="Nome da Vaca:"
                onChange={(event) => {
                    const newFilter = activateFilter(filter)
                    newFilter['name'] = event.currentTarget.value
                    setFilter(newFilter)
                }}
            />
            <TextFilterDiv
                label="Pasto:"
                onChange={(event) => {
                    const newFilter = activateFilter(filter)
                    newFilter['name'] = event.currentTarget.value
                    setFilter(newFilter)
                }}
            />
        </AbstractFilterDiv>

        <AbstractFilterDiv mainTitle="Informações do Bezerro">
            <ComboBoxFilterDiv
                label="Sexo do Bezerro"
                items={SexValues}
            />
            <TextFilterDiv label="Pai de Bezerro:" />
        </AbstractFilterDiv>

        <DateFilterDiv mainTitle="Data de Parição:" />
        <DateFilterDiv mainTitle="Data de Início:" />
        <DateFilterDiv mainTitle="Data de Fim:" />
        <NumberFilterDiv mainTitle="Período de Produção" step=".5" />
        <NumberFilterDiv mainTitle="Produçao Total" step=".5" />
        <NumberFilterDiv mainTitle="Produção Média" step=".5" />
        <NumberFilterDiv mainTitle="Pico de Produção" step=".5" />
        <NumberFilterDiv mainTitle="I.S.R." step=".5" />
    </>
}
