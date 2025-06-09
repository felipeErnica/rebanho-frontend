import { BarChart } from "@mui/x-charts/BarChart"
import { useEffect, useState } from "react"
import { AnimalsByYear } from "../api/AnimalDashboard"
import { getGroupByYear } from "../api/AnimalController"
import { ChartProps, GraphContainer } from "@/ui/components/chart/ChartContainer"

const CattleGrowthGraph = ({ height }: ChartProps) => {

    const [dataset, setDataset] = useState<AnimalsByYear[]>([])

    useEffect(() => {
        getGroupByYear({ isFiltered: false }, 2022, 2025)
            .then(respose => setDataset(respose.json))
    }, [])

    return <BarChart
        dataset={dataset}
        xAxis={[{ dataKey: 'year' }]}
        yAxis={[{
            width: 85,
            valueFormatter: (value: any) => {
                return value > 1000 ? `${value/1000} mil` : value
            },
        }]}
        series={[{ dataKey: 'totalAnimals' }]}
        height={height}
    />
}

export const CattleGrowthCard = () => {
    return <GraphContainer
        className="grow"
        graph={CattleGrowthGraph}
        title="Evolução do Rebanho"
    />
}
