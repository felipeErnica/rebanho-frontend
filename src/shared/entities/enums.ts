import { ComboBoxItem } from "@/ui/shared/common/ComboBox"

//Página contendo matrizes de valores constantes para a utilização na lógica de negócio
export const BrazilStates: ComboBoxItem[] = [
    { name: 'Acre' },
    { name: 'Alagoas' },
    { name: 'Amápa' },
    { name: 'Amazonas' },
    { name: 'Bahia' },
    { name: 'Ceará' },
    { name: 'Distrito Federal' },
    { name: 'Espirito Santo' },
    { name: 'Goiás' },
    { name: 'Maranhão' },
    { name: 'Mato Grosso' },
    { name: 'Mato Grosso do Sul' },
    { name: 'Minas Gerais' },
    { name: 'Pará' },
    { name: 'Paraíba' },
    { name: 'Paraná' },
    { name: 'Pernanbuco' },
    { name: 'Piauí' },
    { name: 'Rio de Janeiro' },
    { name: 'Rio Grande do Norte' },
    { name: 'Rio Grande do Sul' },
    { name: 'Rondônia' },
    { name: 'Roraima' },
    { name: 'Santa Catarina' },
    { name: 'São Paulo' },
    { name: 'Sergipe' },
    { name: 'Tocantins' }
]

export const AnimalTypes: ComboBoxItem[] = [
    { name: 'Animais de Corte', value: 'BEEF_CATTLE' },
    { name: 'Animais de Ordenha', value: 'DAIRY_CATTLE' },
    { name: 'Animais de Reprodução', value: 'REPRODUCTION_ANIMALS' },
    { name: 'Crias de Vaca', value: 'OFFSPRING' },
]

export function getAnimalTypesValue(name: string): string | undefined {
    const typeFound = AnimalTypes.find(value => value.name === name)
    return typeFound?.value
}

export const ReproductionStatuses: ComboBoxItem[] = [
    { name: 'Em desenvolvimento', value: 'ACTIVE' },
    { name: 'Finalizado - Parição', value: 'SUCCESS' },
    { name: 'Finalizado - Perda', value: 'LOSS' },
]

export const LossTypes: ComboBoxItem[] = [
    { name: 'Aborto', value: 'ABORTION' },
    { name: 'Natimorto', value: 'STILLBORN' },
]

export const SexValues: ComboBoxItem[] = [{ name: 'M' }, { name: 'F' }]
