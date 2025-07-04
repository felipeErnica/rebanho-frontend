import { SearchBoxItem } from "@/ui/shared/form-controls/FormSearchBox"
import { ColumnProps } from "@/ui/shared/table/TableCustom"

export type Animal = {
    name?: string
    ringNumber?: string
    animalOrder: number
    weightBirth: number
    sex: string
    weaningDate?: Date
    fatherName?: string
    motherName?: string
    birthDate?: Date
    deathDate?: Date
    pastureName?: string
    farmName?: string
    animalType: string
    isr?: number
    averageProd?: number
    averageProdInterval?: number
    averageBirthInterval?: number
    averagePeak?: number
}

const decimalTransform = (value: number) => {
    if (!value) return value
    const formatter = new Intl.NumberFormat("pt-BR", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    })
    return formatter.format(value)
}

const dateTransform = (value: string) => {
    if (!value) return value
    const date = new Date(value)
    return date.toLocaleDateString("pt-BR", { dateStyle: 'short' })
}

export type AnimalFilter = {
    isFiltered: boolean,
    name?: string,
    ringNumber?: string,
    sex?: string,
    minWeaningDate?: Date,
    maxWeaningDate?: Date,
    fathers?: string[],
    fathersItem?: SearchBoxItem[],
    mothers?: string[],
    mothersItem?: SearchBoxItem[],
    minBirthDate?: Date,
    maxBirthDate?: Date,
    minDeathDate?: Date,
    maxDeathDate?: Date,
    pastures?: string[],
    pasturesItem?: SearchBoxItem[],
    farms?: string[],
    farmsItem?: SearchBoxItem[],
    status?: string[],
    minIsr?: number,
    maxIsr?: number,
    minAverageProd?: number,
    maxAverageProd?: number,
    minAverageBirthInterval?: number,
    maxAverageBirthInterval?: number,
    minAveragePeak?: number,
    maxAveragePeak?: number,
    minChildrenQuantity?: number,
    maxChildrenQuantity?: number
}

export const columns: ColumnProps[] = [
    {
        title: "Brinco",
        name: "ringNumber",
        type: 'text',
    },
    {
        title: "Nome",
        name: "name",
        type: 'text',
        isEditable: true
    },
    {
        title: "Sexo",
        name: "sex",
        type: 'text',
        isEditable: true,
        align: 'center'
    },
    {
        title: "Pai",
        name: "fatherName",
        type: 'text',
        isEditable: true,
    },
    {
        title: "Mãe",
        name: "motherName",
        type: 'text',
        isEditable: true,
    },
    {
        title: "Data de Desmame",
        name: "weaningDate",
        type: 'date',
        align: 'center',
        isEditable: true,
        format: dateTransform
    },
    {
        title: "Data de Nascimento",
        name: "birthDate",
        type: 'date',
        align: 'center',
        isEditable: true,
        format: dateTransform
    },
    {
        title: "Data de Morte",
        name: "deathDate",
        type: 'date',
        align: 'center',
        isEditable: true,
        format: dateTransform
    },
    {
        title: "Pasto",
        name: "pastureName",
        type: 'text',
        isEditable: true,
    },
    {
        title: "Fazenda",
        name: "farmName",
        type: 'text',
        isEditable: true,
    },
    {
        title: "Intervalo de Parição Médio",
        name: "averageBirthInterval",
        type: 'number',
        isEditable: false,
        align: 'center',
        format: decimalTransform
    },
    {
        title: "Intervalo de Prod. Médio",
        name: "averageProdInterval",
        type: 'number',
        isEditable: false,
        align: 'center',
        format: decimalTransform
    },
    {
        title: "Produção Média",
        name: "averageProd",
        type: 'number',
        isEditable: false,
        align: 'center',
        format: decimalTransform
    },
    {
        title: "Pico Médio",
        name: "averagePeak",
        type: 'number',
        isEditable: false,
        align: 'center',
        format: decimalTransform
    },
    {
        title: "ISR Médio",
        name: "isr",
        type: 'number',
        isEditable: false,
        align: 'center',
        format: decimalTransform
    },
]
