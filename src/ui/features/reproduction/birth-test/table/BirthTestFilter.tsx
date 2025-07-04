import { ReproductionStatuses } from "@/shared/entities/enums"
import { IFilters } from "@/shared/interfaces/Filter"
import { AbstractFilterDiv, OldComboBoxFilterDiv, OldDateFilterDiv, OldTextFilterDiv } from "@/ui/shared/filter-controls/CommonFilterDivs"
import { OldFilterModelProps } from "@/ui/shared/display/Display"
import { JSX } from "react"

export const BirthTestFilter = ({ control }: OldFilterModelProps<IFilters>): JSX.Element => {
    return <>
        <AbstractFilterDiv mainTitle="Informações principais">
            <OldTextFilterDiv
                label="Brinco:"
                onChange={() => {
                    console.log(control)
                }}
            />
            <OldTextFilterDiv label="Nome da Vaca:" />
            <OldTextFilterDiv label="Nome do Pai:" />
            <OldComboBoxFilterDiv
                label="Status:"
                items={ReproductionStatuses}
            />
        </AbstractFilterDiv>

        <OldDateFilterDiv mainTitle="Data do Toque" />
        <OldDateFilterDiv mainTitle="Data Prevista do Parto" />
    </>
}
