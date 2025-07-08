import { FormSearchBox, SearchBoxItem } from "@/ui/shared/form-controls/FormSearchBox"
import { ColumnProps } from "@/ui/shared/table/TableCustom"
import { useState } from "react"
import { searchFarm, searchFather, searchMother, searchPasture } from "../../shared/AnimalController"
import { SexValues } from "@/shared/entities/enums"

export type Animal = {
    id: string
    name?: string
    ringNumber?: string
    animalOrder: number
    weightBirth: number
    sex: string
    weaningDate?: Date
    fatherName?: string
    fatherId?: string
    motherName?: string
    motherId?: string
    birthDate?: Date
    deathDate?: Date
    pastureName?: string
    pastureId?: string
    farmId?: string
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

export const useColumnsAnimals = (): ColumnProps[] => {

    const [farmId, setFarmId] = useState<string>('')

    const handlePastureSearch = (input: string) => {
        return searchPasture(input, [farmId])
    }

    return [
        {
            title: "Brinco",
            name: "ringNumber",
            type: 'text',
            isEditable: true,
        },
        {
            title: "Nome",
            name: "name",
            type: 'text',
            isEditable: true,
        },
        {
            title: "Sexo",
            name: "sex",
            align: 'center',
            type: 'combobox',
            items: SexValues,
            isEditable: true,
        },
        {
            title: "Pai",
            name: "fatherName",
            isEditable: true,
            editComponent: (control, setValue) => {
                return <FormSearchBox
                    fetchOptions={searchFather}
                    variant="standard"
                    onChange={(value) => setValue('fatherName', value?.label)}
                    formProps={{
                        control,
                        name: 'fatherId'
                    }}
                />
            }
        },
        {
            title: "Mãe",
            name: "motherName",
            isEditable: true,
            editComponent: (control, setValue) => {
                return <FormSearchBox
                    fetchOptions={searchMother}
                    variant="standard"
                    onChange={(value) => setValue('motherName', value?.label)}
                    formProps={{
                        control,
                        name: 'motherId'
                    }}
                />
            }
        },
        {
            title: "Data de Desmame",
            name: "weaningDate",
            align: 'center',
            format: dateTransform,
            type: 'date',
            isEditable: true,
        },
        {
            title: "Data de Nascimento",
            name: "birthDate",
            align: 'center',
            format: dateTransform,
            type: 'date',
            isEditable: true,
        },
        {
            title: "Data de Morte",
            name: "deathDate",
            align: 'center',
            format: dateTransform,
            type: 'date',
            isEditable: true,
        },
        {
            title: "Fazenda",
            name: "farmName",
            isEditable: true,
            editComponent: (control, setValue) => {
                return <FormSearchBox
                    variant="standard"
                    onChange={(value) => {
                        setValue('farmName', value?.label)
                        if (value) setFarmId(value?.id)
                    }}
                    fetchOptions={searchFarm}
                    formProps={{
                        control,
                        name: 'farmId'
                    }}
                />

            }
        },
        {
            title: "Pasto",
            name: "pastureName",
            isEditable: true,
            editComponent: (control, setValue) => {
                return <FormSearchBox
                    variant="standard"
                    onChange={(value) => setValue('pastureName', value?.label)}
                    fetchOptions={handlePastureSearch}
                    formProps={{
                        control,
                        name: 'pastureId'
                    }}
                />
            }
        },
        {
            title: "Intervalo de Parição Médio",
            name: "averageBirthInterval",
            align: 'center',
            format: decimalTransform,
        },
        {
            title: "Intervalo de Prod. Médio",
            name: "averageProdInterval",
            align: 'center',
            format: decimalTransform
        },
        {
            title: "Produção Média",
            name: "averageProd",
            align: 'center',
            format: decimalTransform
        },
        {
            title: "Pico Médio",
            name: "averagePeak",
            align: 'center',
            format: decimalTransform
        },
        {
            title: "ISR Médio",
            name: "isr",
            align: 'center',
            format: decimalTransform
        },
    ]
}
