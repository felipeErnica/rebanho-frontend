import { GraphContainer } from "@/ui/shared/chart/GraphContainer"
import { BarChart } from "@mui/x-charts"
import { useEffect, useState } from "react"
import { BirthBySex } from "./Entities"
import { getTotalBySex as getBirthsBySex } from "./Controller"
import { LOADING_MSG, NO_DATA_AVAILABLE } from "@/ui/shared/Globals"
import { lightBlue, pink } from "@mui/material/colors"
import { Card, CardContent, CardHeader, Typography } from "@mui/material"

export const BirthDashboard = () => {
    return <div className="w-full h-full bg-gray-100 p-4 flex flex-col gap-4">
        <CardInformations />
        <GraphContainer title="Nascimentos por Sexo">
            <BirthBySexGraph />
        </GraphContainer>
    </div>
}

const CardInformations = () => {
    return <div className="flex flex-row gap-4">
        <Card variant="outlined">
            <CardHeader title='Total de Nascimentos' />
            <CardContent>
                <Typography variant="body1" fontSize={24}>2000</Typography>
            </CardContent>
        </Card>
    </div>
}

const BirthBySexGraph = () => {

    const [dataset, setDataset] = useState<BirthBySex>()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        getBirthsBySex()
            .then(response => setDataset(response.json))
            .catch(() => setDataset(undefined))
            .finally(() => setLoading(false))
    }, [])

    return <BarChart
        height={300}
        loading={loading}
        localeText={{
            loading: LOADING_MSG,
            noData: NO_DATA_AVAILABLE
        }}
        xAxis={[{
            domainLimit: (min, max) => ({ min, max: 100 * Math.ceil(max / 100) })
        }]}
        yAxis={[{
            width: 60,
            data: ['Macho', 'Fêmea'],
            colorMap: {
                type: 'ordinal',
                colors: [lightBlue[600], pink[600]]
            }
        }]}
        series={[{ data: [dataset?.males ?? 0, dataset?.females ?? 0] }]}
        layout="horizontal"
    />
}
