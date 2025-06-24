import { AbstractFilterDiv, DateFilterDiv, NumberFilterDiv, TextFilterDiv } from "@/ui/shared/common/CommonFilterDivs"
import { FilterModelProps } from "@/ui/shared/display/Display"
import { activateFilter } from "@/util/Filter"

export const MilkEntriesFilter = ({ filter, setFilter }: FilterModelProps) => {
    return <>
        <AbstractFilterDiv mainTitle="Informações principais">
            <TextFilterDiv
                label="Brinco"
                onChange={(event) => {
                    const newFilter = activateFilter(filter)
                    newFilter['name'] = event.currentTarget.value
                    setFilter(newFilter)
                }}
            />
            <TextFilterDiv
                label="Nome da Vaca:"
                onChange={(event) => {
                    const newFilter = activateFilter(filter)
                    newFilter['name'] = event.currentTarget.value
                    setFilter(newFilter)
                }}
            />
            <TextFilterDiv
                label="Pasto:"
                onChange={(event) => {
                    const newFilter = activateFilter(filter)
                    newFilter['name'] = event.currentTarget.value
                    setFilter(newFilter)
                }}
            />
        </AbstractFilterDiv>

        <DateFilterDiv mainTitle="Data de Marcação:" />
        <NumberFilterDiv mainTitle="Marcação de Leite:" />
    </>
}
