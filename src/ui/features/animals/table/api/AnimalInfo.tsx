import { ColumnProps } from "@/ui/shared/table/TableCustom"
import { useCallback, useState } from "react"
import { SexValues } from "@/shared/entities/enums"
import { searchFarm, searchFather, searchAllMothers, searchPastureByFarm } from "@/shared/GlobalApiCalls"
import { dateTransform, decimalTransform } from "@/util/Transformations"
import { FormSearchBox, SearchBoxItem } from "@/ui/shared/form-controls/FormSearchBox"

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

    const [farmId, setFarmId] = useState<string>()

    const handlePastureSearch = useCallback((input?: string) => searchPastureByFarm(input), [])

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
            editComponent: (control, _, setValue) => {
                return <FormSearchBox
                    searchOptions={searchFather}
                    variant="standard"
                    onChange={(_, label) => setValue('fatherName', label)}
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
            editComponent: (control, _, setValue) => {
                return <FormSearchBox
                    searchOptions={searchAllMothers}
                    variant="standard"
                    onChange={(_, label) => setValue('motherName', label)}
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
            editComponent: (control, _, setValue) => {
                return <FormSearchBox
                    variant="standard"
                    onChange={(id, label) => {
                        if (!id) {
                            setValue('pastureName', undefined)
                            setValue('pastureId', undefined)
                            setValue('farmName', undefined)
                            setFarmId(undefined)
                            return
                        }
                        setValue('farmName', label)
                        setFarmId(id)
                    }}
                    searchOptions={searchFarm}
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
            editComponent: (control, _, setValue) => {
                return <FormSearchBox
                    variant="standard"
                    onChange={(_, label) => setValue('pastureName', label)}
                    searchOptions={handlePastureSearch}
                    formProps={{
                        disabled: !farmId,
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
