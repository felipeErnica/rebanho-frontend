import { GraphContainer } from "@/ui/components/chart/GraphContainer"
import { useEffect, useState } from "react"
import { getGroupByAge, getGroupByYear, getTotalByType } from "../api/AnimalController"
import { BarChart } from "@mui/x-charts/BarChart"
import { AnimalsByAgeAndFarm, AnimalsByType, AnimalsByYear } from "../api/AnimalDashboard"
import { lightBlue, pink } from "@mui/material/colors"
import { PieChart } from "@mui/x-charts/PieChart"

const AgeChart = () => {

    const [dataset, setDataset] = useState<AnimalsByAgeAndFarm[]>([])

    useEffect(() => {
        getGroupByAge({ isFiltered: false })
            .then(response => setDataset(response.json))
    }, [])

    return <BarChart
        sx={{
            height: '100%',
            width: '100%'
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

const CattleGrowthGraph = () => {

    const [dataset, setDataset] = useState<AnimalsByYear[]>([])

    useEffect(() => {
        getGroupByYear({ isFiltered: false }, 2022, 2025)
            .then(respose => setDataset(respose.json))
    }, [])

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
        series={[{ dataKey: 'totalAnimals', highlightScope: {highlight: 'item', fade: 'global'} }]}
    />
}

const TypeGraph = () => {

    const init: AnimalsByType = { beefCattle: 0, dairyCattle: 0, offspring: 0, reproductionAnimals: 0 }
    const [dataset, setDataset] = useState<AnimalsByType>(init)

    useEffect(() => {
        getTotalByType({ isFiltered: false })
            .then(response => {
                console.log(response.json)
                setDataset(response.json)
            })
    }, [])

    return <PieChart
        sx={{
            height: '100%',
            width: '100%'
        }}
        series={[{
            innerRadius: 40,
            highlightScope: { fade: 'global', highlight: 'item' },
            data: [
                { label: "Animais de Corte", value: dataset.beefCattle },
                { label: "Animais de Ordenha", value: dataset.dairyCattle },
                { label: "Animais de Reprodução", value: dataset.reproductionAnimals },
                { label: "Animais Não Desmamados", value: dataset.offspring },
            ]
        }]}
    />

}

export const AnimalCharts = () => {

    const CHART_HEIGHT = 150

    return <>
        <GraphContainer
            title="Evolução do Rebanho"
            height={CHART_HEIGHT}
        >
            <CattleGrowthGraph />
        </GraphContainer>
        <GraphContainer
            title="Animais por Idade"
            className="row-span-2 col-span-2"
            height={CHART_HEIGHT*2}
        >
            <AgeChart />
        </GraphContainer>
        <GraphContainer
            title="Tipo de Animais"
            height={CHART_HEIGHT}
        >
            <TypeGraph />
        </GraphContainer>
    </>
}
