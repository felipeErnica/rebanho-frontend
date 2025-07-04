import { BrazilStates } from "@/shared/entities/enums"
import { IFilters } from "@/shared/interfaces/Filter"
import { AbstractFilterDiv, OldComboBoxFilterDiv, OldTextFilterDiv } from "@/ui/shared/filter-controls/CommonFilterDivs"
import { OldFilterModelProps } from "@/ui/shared/display/Display"

export const SlaughterhouseFilter = ({control}: OldFilterModelProps<IFilters>) => {
    return <>
        <AbstractFilterDiv mainTitle="Informações principais">
            <OldTextFilterDiv
                label="Nome do Frigorífico:"
                onChange={() => {
                    console.log(control)
                }}
            />
            <OldTextFilterDiv
                label="Cidade:"
            />
            <OldComboBoxFilterDiv
                label="Estado:"
                items={BrazilStates}
            />
        </AbstractFilterDiv>
    </>
}
