import { BrazilStates } from "@/types/enums"
import { AbstractFilterDiv, ComboBoxFilterDiv, TextFilterDiv } from "@/ui/components/common/CommonFilterDivs"
import { FilterModelProps } from "@/ui/components/display/Display"
import { activateFilter } from "@/util/Filter"

export const SlaughterhouseFilter = ({ filter, setFilter }: FilterModelProps) => {
    return <>
        <AbstractFilterDiv mainTitle="Informações principais">
            <TextFilterDiv
                label="Nome do Frigorífico:"
                onChange={(event) => {
                    const newFilter = activateFilter(filter)
                    newFilter['name'] = event.currentTarget.value
                    setFilter(newFilter)
                }}
            />
            <TextFilterDiv
                label="Cidade:"
                onChange={(event) => {
                    const newFilter = activateFilter(filter)
                    newFilter['name'] = event.currentTarget.value
                    setFilter(newFilter)
                }}
            />
            <ComboBoxFilterDiv
                label="Estado:"
                items={BrazilStates}
            />
        </AbstractFilterDiv>
    </>
}
