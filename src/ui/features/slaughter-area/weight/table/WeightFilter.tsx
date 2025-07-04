import { SexValues } from "@/shared/entities/enums"
import { IFilters } from "@/shared/interfaces/Filter"
import { AbstractFilterDiv, OldComboBoxFilterDiv, OldDateFilterDiv, OldTextFilterDiv } from "@/ui/shared/filter-controls/CommonFilterDivs"
import { OldFilterModelProps } from "@/ui/shared/display/Display"

export const WeightFilter = ({control}: OldFilterModelProps<IFilters>) => {
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
                label="Sexo:"
                items={SexValues}
            />
        </AbstractFilterDiv>

        <OldDateFilterDiv mainTitle="Data de Pesagem:" />
    </>
}
