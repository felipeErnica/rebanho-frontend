import { GraphContainer } from "@/ui/shared/dashboard/DashboardComponents"
import { useEffect, useState } from "react"
import { BarChart } from "@mui/x-charts/BarChart"
import { AnimalDashboardFilter, AnimalsByAge, AnimalsByType } from "./api/DashboardEntities"
import { lightBlue, pink } from "@mui/material/colors"
import { PieChart } from "@mui/x-charts/PieChart"
import { PieValueType } from "@mui/x-charts"
import { getGroupByAge, getTotalByType } from "./api/DashboardController"
import { AnimalType } from "../Entities"

type AnimalChartsProps = {
    filter: AnimalDashboardFilter
    setFilter: (filter: AnimalDashboardFilter) => void
}

const AgeChart = ({ filter, setFilter }: AnimalChartsProps) => {

    const [dataset, setDataset] = useState<AnimalsByAge[]>([])
    const [sex, setSex] = useState<string>()

    useEffect(() => {
        getGroupByAge(filter)
            .then(response => setDataset(response.json))
    }, [filter])

    return <BarChart
        sx={{
            height: '100%',
            width: '100%'
        }}
        onHighlightChange={(item) => {
            if (!item) {
                setSex(undefined)
                return
            }
            const sex = item.seriesId === 'male' ? 'M' : 'F'
            setSex(sex)
        }}
        onAxisClick={(_, params) => {
            if (!params) return
            const ageCategory: AnimalsByAge = dataset[params.dataIndex]
            const maxBirthDate = ageCategory.maxBirthDate
            const minBirthDate = ageCategory.minBirthDate
            setFilter({ ...filter, maxBirthDate, minBirthDate, sex })
        }}
        hideLegend
        dataset={dataset}
        margin={{
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
        }}
        slotProps={{
            legend: { direction: 'vertical' },
        }}
        yAxis={[{ dataKey: "ageCategory", width: 85 }]}
        series={[
            { id: "male", dataKey: "male", label: "Macho", color: lightBlue[600], highlightScope: { highlight: 'item', fade: 'global' } },
            { id: "female", dataKey: "female", label: "Fêmea", color: pink[600], highlightScope: { highlight: 'item', fade: 'global' } },
        ]}
        layout="horizontal"
    />
}

const TypeGraph = ({ filter, setFilter }: AnimalChartsProps) => {

    const [dataset, setDataset] = useState<PieValueType[]>([])

    useEffect(() => {
        getTotalByType(filter)
            .then(response => {
                const typeData: AnimalsByType = response.json
                const newDataset: PieValueType[] = [
                    { label: "Animais de Corte", value: typeData.beefCattle },
                    { label: "Animais de Ordenha", value: typeData.dairyCattle },
                    { label: "Animais de Reprodução", value: typeData.reproductionAnimals },
                    { label: "Crias de Vaca", value: typeData.offspring },
                ]
                setDataset(newDataset)
            })
    }, [filter])

    function getAnimalTypesValue(label: string): string | undefined {
        switch (label) {
        case "Animais de Corte": return AnimalType.BEEF_ANIMAL
        case "Animais de Ordenha": return AnimalType.DAIRY_ANIMAL
        case "Animais de Reprodução": return AnimalType.REPRODUCTION_ANIMAL
        case "Crias de Vaca": return AnimalType.OFFSPRING
        default: return undefined
    }
}

return <PieChart
    sx={{
        height: '100%',
        width: '100%'
    }}
    onItemClick={(_, highlightItem) => {
        const itemName = dataset[highlightItem.dataIndex].label
        if (!itemName) return
        const type = getAnimalTypesValue(itemName.toString())
        setFilter({ ...filter, isFiltered: true, animalType: type })
    }}
    series={[{
        innerRadius: 90,
        highlightScope: { fade: 'global', highlight: 'item' },
        data: dataset
    }]}
/>

}

export const AnimalCharts = ({ filter, setFilter }: AnimalChartsProps) => {

    const CHART_HEIGHT = 180

    return <>
        <GraphContainer
            title="Animais por Idade"
            className="col-span-2"
            height={CHART_HEIGHT * 2}
        >
            <AgeChart {...{ filter, setFilter }} />
        </GraphContainer>
        <GraphContainer
            title="Tipo de Animais"
            height={CHART_HEIGHT}
        >
            <TypeGraph {...{ filter, setFilter }} />
        </GraphContainer>
    </>
}
