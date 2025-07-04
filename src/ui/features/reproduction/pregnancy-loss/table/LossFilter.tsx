import { LossTypes } from "@/shared/entities/enums"
import { IFilters } from "@/shared/interfaces/Filter"
import { AbstractFilterDiv, OldComboBoxFilterDiv, OldDateFilterDiv, OldTextFilterDiv } from "@/ui/shared/filter-controls/CommonFilterDivs"
import { OldFilterModelProps } from "@/ui/shared/display/Display"

export const LossFilter = ({control}: OldFilterModelProps<IFilters>) => {
    return <>
        <AbstractFilterDiv mainTitle="Informações principais">
            <OldTextFilterDiv label="Brinco:" />
            <OldTextFilterDiv
                label="Nome:"
                onChange={() => {
                    console.log(control)
                }}
            />
            <OldComboBoxFilterDiv
                label="Tipo de Perda"
                items={LossTypes}
            />
        </AbstractFilterDiv>

        <OldDateFilterDiv mainTitle="Data de Perda" />
    </>
}
