import { Sex as SexOptions } from "@/types/enums"
import { AbstractFilterDiv, ComboBoxFilterDiv, DateFilterDiv, TextFilterDiv } from "@/ui/components/common/CommonFilterDivs"
import { FilterModelProps } from "@/ui/components/display/Display"
import { activateFilter } from "@/util/Filter"

export const SlaughterFilter = ({ filter, setFilter }: FilterModelProps) => {
    return <>
        <AbstractFilterDiv mainTitle="Informações principais">
            <TextFilterDiv label="Brinco:" />
            <TextFilterDiv
                label="Nome do Animal:"
                onChange={(event) => {
                    const newFilter = activateFilter(filter)
                    newFilter['name'] = event.currentTarget.value
                    setFilter(newFilter)
                }}
            />
            <TextFilterDiv
                label="Nome do Frigorífico:"
                onChange={(event) => {
                    const newFilter = activateFilter(filter)
                    newFilter['name'] = event.currentTarget.value
                    setFilter(newFilter)
                }}
            />
            <ComboBoxFilterDiv
                label="Sexo:"
                items={SexOptions}
            />
        </AbstractFilterDiv>

        <DateFilterDiv mainTitle="Data de Abate" />
    </>
}
