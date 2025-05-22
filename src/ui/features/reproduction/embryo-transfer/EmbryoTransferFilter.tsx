import { AbstractFilterDiv, ComboBoxFilterDiv, DateFilterDiv, TextFilterDiv } from "@/ui/components/common/CommonFilterDivs"
import { FilterModelProps } from "@/ui/components/display/Display"
import { JSX } from "react"

export const EmbryoTransferFilter = ({ filter, setFilter }: FilterModelProps): JSX.Element => {
    return <>
        <AbstractFilterDiv mainTitle="Informações principais">
            <TextFilterDiv
                label="Brinco da Receptora:"
                onChange={() => {
                    console.log(filter)
                    setFilter({ isFiltered: false })
                }}
            />
            <TextFilterDiv label="Nome da Receptora:" />
            <TextFilterDiv label="Nome da Doadora:" />
            <TextFilterDiv label="Nome do Touro:" />
            <ComboBoxFilterDiv
                label="Staus:"
                items={[{ name: 'Ativa' }, { name: 'Sucesso' }, { name: 'Perda'}]}
            />
        </AbstractFilterDiv>

        <DateFilterDiv mainTitle="Data de Transferência" />
    </>
}
