import { ReproductionStatuses } from "@/shared/entities/enums"
import { AbstractFilterDiv, ComboBoxFilterDiv, DateFilterDiv, TextFilterDiv } from "@/ui/shared/common/CommonFilterDivs"
import { FilterModelProps } from "@/ui/shared/display/Display"
import { JSX } from "react"

export const BirthTestFilter = ({ filter, setFilter }: FilterModelProps): JSX.Element => {
    return <>
        <AbstractFilterDiv mainTitle="Informações principais">
            <TextFilterDiv
                label="Brinco:"
                onChange={() => {
                    console.log(filter)
                    setFilter({ isFiltered: false })
                }}
            />
            <TextFilterDiv label="Nome da Vaca:" />
            <TextFilterDiv label="Nome do Pai:" />
            <ComboBoxFilterDiv
                label="Status:"
                items={ReproductionStatuses}
            />
        </AbstractFilterDiv>

        <DateFilterDiv mainTitle="Data do Toque" />
        <DateFilterDiv mainTitle="Data Prevista do Parto" />
    </>
}
