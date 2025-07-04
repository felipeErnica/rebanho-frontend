import { SexValues } from "@/shared/entities/enums"
import { IFilters } from "@/shared/interfaces/Filter"
import { AbstractFilterDiv, OldComboBoxFilterDiv, OldDateFilterDiv, OldNumberFilterDiv, OldTextFilterDiv } from "@/ui/shared/filter-controls/CommonFilterDivs"
import { OldFilterModelProps } from "@/ui/shared/display/Display"
import { FormTextField } from "@/ui/shared/form-controls/FormTextField"

export const LactationFilter = ({ control }: OldFilterModelProps<IFilters>) => {
    return <>
        <AbstractFilterDiv mainTitle="Informações principais">
            <FormTextField
                label="Brinco"
                formProps={{
                    control,
                    name: 'name'
                }}
            />
            <OldTextFilterDiv
                label="Nome da Vaca:"
            />
            <OldTextFilterDiv
                label="Pasto:"
            />
        </AbstractFilterDiv>

        <AbstractFilterDiv mainTitle="Informações do Bezerro">
            <OldComboBoxFilterDiv
                label="Sexo do Bezerro"
                items={SexValues}
            />
            <OldTextFilterDiv label="Pai de Bezerro:" />
        </AbstractFilterDiv>

        <OldDateFilterDiv mainTitle="Data de Parição:" />
        <OldDateFilterDiv mainTitle="Data de Início:" />
        <OldDateFilterDiv mainTitle="Data de Fim:" />
        <OldNumberFilterDiv mainTitle="Período de Produção" step=".5" />
        <OldNumberFilterDiv mainTitle="Produçao Total" step=".5" />
        <OldNumberFilterDiv mainTitle="Produção Média" step=".5" />
        <OldNumberFilterDiv mainTitle="Pico de Produção" step=".5" />
        <OldNumberFilterDiv mainTitle="I.S.R." step=".5" />
    </>
}
