import { LossTypes } from "@/shared/entities/enums"
import { AbstractFilterDiv, ComboBoxFilterDiv, DateFilterDiv, TextFilterDiv } from "@/ui/components/common/CommonFilterDivs"
import { FilterModelProps } from "@/ui/components/display/Display"
import { activateFilter } from "@/util/Filter"

export const LossFilter = ({ filter, setFilter }: FilterModelProps) => {
    return <>
        <AbstractFilterDiv mainTitle="Informações principais">
            <TextFilterDiv label="Brinco:" />
            <TextFilterDiv
                label="Nome:"
                onChange={(event) => {
                    const newFilter = activateFilter(filter)
                    newFilter['name'] = event.currentTarget.value
                    setFilter(newFilter)
                }}
            />
            <ComboBoxFilterDiv
                label="Tipo de Perda"
                items={LossTypes}
            />
        </AbstractFilterDiv>

        <DateFilterDiv mainTitle="Data de Perda" />
    </>
}
