import { ReproductionStatuses } from "@/shared/entities/enums"
import { IFilters } from "@/shared/interfaces/Filter"
import { AbstractFilterDiv, OldComboBoxFilterDiv, OldDateFilterDiv, OldTextFilterDiv } from "@/ui/shared/filter-controls/CommonFilterDivs"
import { OldFilterModelProps } from "@/ui/shared/display/Display"
import { JSX } from "react"

export const EmbryoTransferFilter = ({ control }: OldFilterModelProps<IFilters>): JSX.Element => {
    return <>
        <AbstractFilterDiv mainTitle="Informações principais">
            <OldTextFilterDiv
                label="Brinco da Receptora:"
                onChange={() => {
                    console.log(control)
                }}
            />
            <OldTextFilterDiv label="Nome da Receptora:" />
            <OldTextFilterDiv label="Nome da Doadora:" />
            <OldTextFilterDiv label="Nome do Touro:" />
            <OldComboBoxFilterDiv
                label="Staus:"
                items={ReproductionStatuses}
            />
        </AbstractFilterDiv>

        <OldDateFilterDiv mainTitle="Data de Transferência" />
    </>
}
