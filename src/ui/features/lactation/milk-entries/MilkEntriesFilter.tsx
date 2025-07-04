import { IFilters } from "@/shared/interfaces/Filter"
import { AbstractFilterDiv, OldDateFilterDiv, OldNumberFilterDiv, OldTextFilterDiv } from "@/ui/shared/filter-controls/CommonFilterDivs"
import { OldFilterModelProps } from "@/ui/shared/display/Display"

export const MilkEntriesFilter = ({control}: OldFilterModelProps<IFilters>) => {
    return <>
        <AbstractFilterDiv mainTitle="Informações principais">
            <OldTextFilterDiv
                label="Brinco"
                onChange={() => {
                    console.log(control)
                }}
            />
            <OldTextFilterDiv
                label="Nome da Vaca:"
            />
            <OldTextFilterDiv
                label="Pasto:"
            />
        </AbstractFilterDiv>

        <OldDateFilterDiv mainTitle="Data de Marcação:" />
        <OldNumberFilterDiv mainTitle="Marcação de Leite:" />
    </>
}
