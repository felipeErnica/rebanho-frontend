import { LossTypes } from "@/types/enums/LossType"
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
                items={LossTypes.map(type => { return {name: type} })}
            />
        </AbstractFilterDiv>

        <DateFilterDiv mainTitle="Data de Perda" />
    </>
}
