import { SexValues as SexValues } from "@/shared/entities/enums"
import { IFilters } from "@/shared/interfaces/Filter"
import { AbstractFilterDiv, OldComboBoxFilterDiv, OldDateFilterDiv, OldNumberFilterDiv, OldTextFilterDiv } from "@/ui/shared/filter-controls/CommonFilterDivs"
import { OldFilterModelProps } from "@/ui/shared/display/Display"
import { JSX } from "react"

export const BirthFilter = ({ control }: OldFilterModelProps<IFilters>): JSX.Element => {
    return <>
        <AbstractFilterDiv mainTitle="Informações principais">
            <OldTextFilterDiv
                label="Brinco:"
                onChange={() => {
                    console.log(control)
                }}
            />
            <OldTextFilterDiv label="Nome da Mãe:" />
            <OldTextFilterDiv label="Nome do Pai:" />
            <OldComboBoxFilterDiv
                label="Sexo:"
                items={SexValues}
            />
        </AbstractFilterDiv>

        <OldDateFilterDiv mainTitle="Data de Nascimento" />
        <OldNumberFilterDiv mainTitle="Peso de Nascimento" step=".5" />
    </>
}
