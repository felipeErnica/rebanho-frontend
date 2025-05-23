import { SexValues as SexValues } from "@/types/enums"
import { AbstractFilterDiv, ComboBoxFilterDiv, DateFilterDiv, NumberFilterDiv, TextFilterDiv } from "@/ui/components/common/CommonFilterDivs"
import { FilterModelProps } from "@/ui/components/display/Display"
import { JSX } from "react"

export const BirthFilter = ({ filter, setFilter }: FilterModelProps): JSX.Element => {
    return <>
        <AbstractFilterDiv mainTitle="Informações principais">
            <TextFilterDiv
                label="Brinco:"
                onChange={() => {
                    console.log(filter)
                    setFilter({ isFiltered: false })
                }}
            />
            <TextFilterDiv label="Nome da Mãe:" />
            <TextFilterDiv label="Nome do Pai:" />
            <ComboBoxFilterDiv
                label="Sexo:"
                items={SexValues}
            />
        </AbstractFilterDiv>

        <DateFilterDiv mainTitle="Data de Nascimento" />
        <NumberFilterDiv mainTitle="Peso de Nascimento" step=".5" />
    </>
}
