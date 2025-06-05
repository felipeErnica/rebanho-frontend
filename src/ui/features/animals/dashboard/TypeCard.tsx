import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import { PieChart } from "@mui/x-charts/PieChart"
import { useEffect, useState } from "react"
import { getTotalByType } from "../api/AnimalController"
import { AnimalsByType } from "../api/AnimalDashboard"

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
        series={[{
            innerRadius: 80,
            paddingAngle: 5,
            highlightScope: { fade: 'global', highlight: 'item' },
            data: [
                { label: "Animais de Corte", value: dataset.beefCattle },
                { label: "Animais de Ordenha", value: dataset.dairyCattle },
                { label: "Animais de Reprodução", value: dataset.reproductionAnimals },
                { label: "Animais Não Desmamados", value: dataset.offspring },
            ]
        }]}
        height={350}
    />

}


export const TypeCard = () => {
    return <Card variant="outlined">
        <CardHeader title="Tipo de Animais" />
        <CardContent>
            <TypeGraph />
        </CardContent>
    </Card>
}
