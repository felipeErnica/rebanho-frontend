import { ComboBoxItem } from "@shared/common/ComboBox"

//Página contendo matrizes de valores constantes para a utilização na lógica de negócio
export const BrazilStates: ComboBoxItem[] = [
    { name: 'Acre', value: 'Acre' },
    { name: 'Alagoas', value: 'Alagoas' },
    { name: 'Amápa', value: 'Amápa' },
    { name: 'Amazonas', value: 'Amazonas' },
    { name: 'Bahia', value: 'Bahia' },
    { name: 'Ceará', value: 'Ceara' },
    { name: 'Distrito Federal', value: 'Distrito Federal' },
    { name: 'Espírito Santo', value: 'Espirito Santo' },
    { name: 'Goiás', value: 'Goias' },
    { name: 'Maranhão', value: 'Maranhao' },
    { name: 'Mato Grosso', value: 'Mato Grosso' },
    { name: 'Mato Grosso do Sul', value: 'Mato Grosso do Sul' },
    { name: 'Minas Gerais', value: 'Minas Gerais' },
    { name: 'Pará', value: 'Para' },
    { name: 'Paraíba', value: 'Paraiba' },
    { name: 'Paraná', value: 'Parana' },
    { name: 'Pernanbuco', value: 'Pernanbuco' },
    { name: 'Piauí', value: 'Piaui' },
    { name: 'Rio de Janeiro', value: 'Rio de Janeiro' },
    { name: 'Rio Grande do Norte', value: 'Rio Grande do Norte' },
    { name: 'Rio Grande do Sul', value: 'Rio Grande do Sul' },
    { name: 'Rondônia', value: 'Rondonia' },
    { name: 'Roraima', value: 'Roraima' },
    { name: 'Santa Catarina', value: 'Santa Catarina' },
    { name: 'São Paulo', value: 'Sao Paulo' },
    { name: 'Sergipe', value: 'Sergipe' },
    { name: 'Tocantins', value: 'Tocantins' }
]

export const ReproductionStatuses: ComboBoxItem[] = [
    { name: 'Em desenvolvimento', value: 'ACTIVE' },
    { name: 'Finalizado - Parição', value: 'SUCCESS' },
    { name: 'Finalizado - Perda', value: 'LOSS' },
]

export const LossTypes: ComboBoxItem[] = [
    { name: 'Aborto', value: 'ABORTION' },
    { name: 'Natimorto', value: 'STILLBORN' },
]

export const SexValues: ComboBoxItem[] = [{ name: 'M', value: 'M' }, { name: 'F', value: 'F' }]
