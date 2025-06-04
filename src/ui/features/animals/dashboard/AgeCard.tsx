import { BarChart } from "@mui/x-charts/BarChart"
import { useEffect, useState } from "react"
import { getGroupByAge } from "../api/AnimalController"
import { AnimalsByAgeAndFarm } from "../api/AnimalDashboard"
import { lightBlue, pink } from "@mui/material/colors"
import { Card, CardContent, CardHeader } from "@mui/material"

const AgeChart = () => {

    const [dataset, setDataset] = useState<AnimalsByAgeAndFarm[]>([])

    useEffect(() => {
        getGroupByAge({ isFiltered: false })
            .then(response => setDataset(response.json))
    })


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
        layout="horizontal"
        height={350}
    />
}

export const AgeCard = () => {
    return <Card>
        <CardHeader title="Animais por Idade" />
        <CardContent>
            <AgeChart />
        </CardContent>
    </Card>
}
