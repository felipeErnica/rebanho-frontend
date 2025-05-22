import { AbstractFilterDiv, ComboBoxFilterDiv, DateFilterDiv, TextFilterDiv } from "@/ui/components/common/CommonFilterDivs"
import { FilterModelProps } from "@/ui/components/display/Display"
import { activateFilter } from "@/util/Filter"

export const InseminationFilter = ({ filter, setFilter }: FilterModelProps) => {
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
            <TextFilterDiv
                label="Nome do Touro:"
                onChange={(event) => {
                    const newFilter = activateFilter(filter)
                    newFilter['name'] = event.currentTarget.value
                    setFilter(newFilter)
                }}
            />
            <ComboBoxFilterDiv
                label="Status:"
                items={[{ name: 'Ativa' }, { name: 'Sucesso' }, { name: 'Perda' }]}
            />
        </AbstractFilterDiv>

        <DateFilterDiv mainTitle="Data de Inseminação" />
    </>
}
