import { SexValues as SexOptions } from "@/shared/entities/enums"
import { IFilters } from "@/shared/interfaces/Filter"
import { AbstractFilterDiv, OldComboBoxFilterDiv, OldDateFilterDiv, OldTextFilterDiv } from "@/ui/shared/filter-controls/CommonFilterDivs"
import { OldFilterModelProps } from "@/ui/shared/display/Display"

export const SlaughterFilter = ({control}: OldFilterModelProps<IFilters>) => {
    return <>
        <AbstractFilterDiv mainTitle="Informações principais">
            <OldTextFilterDiv label="Brinco:" />
            <OldTextFilterDiv
                label="Nome do Animal:"
                onChange={() => {
                    console.log(control)
                }}
            />
            <OldTextFilterDiv
                label="Nome do Frigorífico:"
            />
            <OldComboBoxFilterDiv
                label="Sexo:"
                items={SexOptions}
            />
        </AbstractFilterDiv>

        <OldDateFilterDiv mainTitle="Data de Abate" />
    </>
}
