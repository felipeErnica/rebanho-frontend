import { BarChart } from "@mui/x-charts/BarChart"
import { getGroupByAge } from "../api/AnimalController"
import { AnimalsByAgeAndFarm } from "../api/AnimalDashboard"
import { lightBlue, pink } from "@mui/material/colors"
import { useEffect, useState } from "react"
import { ChartProps, GraphContainer } from "@/ui/components/chart/ChartContainer"

const AgeChart = ({ height }: ChartProps) => {

    const [dataset, setDataset] = useState<AnimalsByAgeAndFarm[]>([])

    useEffect(() => {
        getGroupByAge({ isFiltered: false })
            .then(response => setDataset(response.json))
    }, [height])

    return <BarChart
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
        height={height}
        layout="horizontal"
    />
}

export const AgeCard = () => {
    return <GraphContainer 
        graph={AgeChart}
        className="grow"
        title="Animais por Idade"
    />
}
