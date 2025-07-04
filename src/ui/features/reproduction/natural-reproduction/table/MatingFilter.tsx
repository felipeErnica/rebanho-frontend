import { ReproductionStatuses } from "@/shared/entities/enums"
import { IFilters } from "@/shared/interfaces/Filter"
import { AbstractFilterDiv, OldComboBoxFilterDiv, OldDateFilterDiv, OldTextFilterDiv } from "@/ui/shared/filter-controls/CommonFilterDivs"
import { OldFilterModelProps } from "@/ui/shared/display/Display"

export const MatingFilter = ({control }: OldFilterModelProps<IFilters>) => {
    return <>
        <AbstractFilterDiv mainTitle="Informações principais">
            <OldTextFilterDiv label="Brinco:" />
            <OldTextFilterDiv
                label="Nome:"
                onChange={() => {
                    console.log(control)
                }}
            />
            <OldTextFilterDiv
                label="Nome do Touro:"
            />
            <OldComboBoxFilterDiv
                label="Status:"
                items={ReproductionStatuses}
            />
        </AbstractFilterDiv>

        <OldDateFilterDiv mainTitle="Data de Monta" />
    </>
}
