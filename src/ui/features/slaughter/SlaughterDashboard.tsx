import { 
    CardChartContent, 
    DashboardCard, 
    DashboardContainer, 
    DashboardInfoContainer, 
    DashboardTopContainer 
} from "@/ui/shared/dashboard/DashboardComponents"
import { useCallback, useEffect, useState } from "react"
import { DashboardInformationProps, DashboardTopBarProps } from "@/ui/shared/dashboard/Entities"
import { ReloadButton } from "@/ui/shared/table/TableTopBarComponents"
import { PerformanceRateCard, AverageWeightCard as WeightCardEntry } from "./Entities"
import { getLastAverageWeight, getLastPerformance } from "./Controller"
import { decimalTransform, percentageTransform } from "@/util/Transformations"
import { SparkLineChart } from "@mui/x-charts"

export const SlaughterDashboard = () => {

    const [activeRequests, setActiveRequests] = useState(0)
    const [reloadFlag, setReloadFlag] = useState(0)

    const startLoading = useCallback(() => setActiveRequests(prev => prev + 1), [])
    const stopLoading = useCallback(() => setActiveRequests(prev => Math.max(prev - 1, 0)), [])

    return <DashboardContainer>
        <DashboardToolbar {...{ setReloadFlag, activeRequests }} />
        <DashboardInfo {...{ startLoading, stopLoading, reloadFlag }} />
    </DashboardContainer>
}

const DashboardToolbar = ({ setReloadFlag, activeRequests }: DashboardTopBarProps) => {

    return <DashboardTopContainer>
        <ReloadButton
            onReload={() => setReloadFlag(prev => prev + 1)}
            loading={activeRequests > 0}
        />
    </DashboardTopContainer>
}

const DashboardInfo = ({ reloadFlag, stopLoading, startLoading }: DashboardInformationProps) => {
    return <DashboardInfoContainer>
        <div className="flex flex-row gap-4">
            <WeightCard {...{ reloadFlag, startLoading, stopLoading }} />
            <PerformanceCard {...{ stopLoading, startLoading, reloadFlag }} />
        </div>
    </DashboardInfoContainer>
}

const WeightCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultValues: WeightCardEntry = {
        trend: 0,
        current: 0,
        hist: []
    }

    const [data, setData] = useState<WeightCardEntry>(defaultValues)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getLastAverageWeight()
            .then(results => setData(results.json))
            .catch(() => setData(defaultValues))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag])

    return <DashboardCard>
        <CardChartContent
            title="Peso Vivo Médio"
            loading={loading}
            data={`${decimalTransform(data.current)} (${decimalTransform(data.current / 15)}@)`}
            trendProps={{ trend: data.trend }}
            chart={(
                <SparkLineChart
                    data={data.hist.map(item => item.averageWeight)}
                    valueFormatter={value => `${decimalTransform(value || 0)} (${decimalTransform((value || 0) / 15)}@)`}
                    showTooltip
                    height={50}
                    xAxis={{
                        data: data.hist.map(item => new Date(item.entryDate)),
                        scaleType: 'time',
                        valueFormatter: (value: Date) => value.toLocaleDateString("pt-BR", { dateStyle: 'short' })
                    }}
                />
            )}
        />
    </DashboardCard>
}

const PerformanceCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultValues: PerformanceRateCard = {
        trend: 0,
        current: 0,
        hist: []
    }

    const [data, setData] = useState<PerformanceRateCard>(defaultValues)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getLastPerformance()
            .then(results => setData(results.json))
            .catch(() => setData(defaultValues))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [reloadFlag])

    return <DashboardCard>
        <CardChartContent
            title="Rendimento Médio"
            loading={loading}
            data={percentageTransform(data.current)}
            trendProps={{ trend: data.trend }}
            chart={(
                <SparkLineChart
                    data={data.hist.map(item => item.performanceRate)}
                    valueFormatter={value => `${decimalTransform(value || 0)} (${decimalTransform((value || 0) / 15)}@)`}
                    showTooltip
                    height={50}
                    xAxis={{
                        data: data.hist.map(item => new Date(item.entryDate)),
                        scaleType: 'time',
                        valueFormatter: (value: Date) => value.toLocaleDateString("pt-BR", { dateStyle: 'short' })
                    }}
                />
            )}
        />
    </DashboardCard>
}
