import { GraphContainer } from "@/ui/components/chart/GraphContainer"
import { useEffect, useState } from "react"
import { getGroupByAge, getGroupByYear, getTotalByType } from "../api/AnimalController"
import { BarChart } from "@mui/x-charts/BarChart"
import { AnimalDashboardFilter, AnimalsByAge, AnimalsByType, AnimalsByYear } from "../api/AnimalDashboard"
import { lightBlue, pink } from "@mui/material/colors"
import { PieChart } from "@mui/x-charts/PieChart"
import { PieValueType } from "@mui/x-charts"
import { getAnimalTypesValue } from "@/shared/entities/enums"

type AnimalChartsProps = {
    filter: AnimalDashboardFilter
    setFilter: (filter: AnimalDashboardFilter) => void
}

const AgeChart = ({ filter, setFilter }: AnimalChartsProps) => {

    const [dataset, setDataset] = useState<AnimalsByAge[]>([])

    useEffect(() => {
        getGroupByAge(filter)
            .then(response => setDataset(response.json))
    }, [filter])

    return <BarChart
        sx={{
            height: '100%',
            width: '100%'
        }}
        onAxisClick={(_, params) => {
            if (!params) return
            const ageCategory: AnimalsByAge = dataset[params.dataIndex]
            setFilter({ ...filter, maxBirthDate: ageCategory.maxBirthDate, minBirthDate: ageCategory.minBirthDate })
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
            { dataKey: "male", label: "Macho", color: lightBlue[600] },
            { dataKey: "female", label: "Fêmea", color: pink[600] },
        ]}
        layout="horizontal"
    />
}

const CattleGrowthGraph = ({ filter }: AnimalChartsProps) => {

    const [dataset, setDataset] = useState<AnimalsByYear[]>([])

    useEffect(() => {
        getGroupByYear(filter, 2022, 2025)
            .then(respose => setDataset(respose.json))
    }, [filter])

    return <BarChart
        sx={{
            height: '100%',
            width: '100%'
        }}
        localeText={{
            loading: "Carregando Dados...",
            noData: "Não há dados disponíveis"
        }}
        dataset={dataset}
        xAxis={[{ dataKey: 'year' }]}
        yAxis={[{
            width: 60,
            valueFormatter: (value: any) => {
                return value > 1000 ? `${value / 1000} mil` : value
            },
        }]}
        series={[{ dataKey: 'totalAnimals' }]}
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
            innerRadius: 40,
            highlightScope: { fade: 'global', highlight: 'item' },
            data: dataset
        }]}
    />

}

export const AnimalCharts = ({ filter, setFilter }: AnimalChartsProps) => {

    const CHART_HEIGHT = 150

    return <>
        <GraphContainer
            title="Evolução do Rebanho"
            height={CHART_HEIGHT}
        >
            <CattleGrowthGraph {...{ filter, setFilter }} />
        </GraphContainer>
        <GraphContainer
            title="Animais por Idade"
            className="row-span-2 col-span-2"
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
