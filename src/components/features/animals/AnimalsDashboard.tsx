import {
    CardChartContent,
    CardDefaultTitle,
    DashboardCard,
    DashboardContainer,
    DashboardInfoContainer,
    DashboardTopContainer
} from "@/components/shared/dashboard/DashboardComponents"
import { useCallback, useEffect, useMemo, useState } from "react"
import { DashboardInformationProps, DashboardTopBarProps } from "@/components/shared/dashboard/Entities"
import { CardEntry } from "@/utils/Entities"
import { ReloadButton } from "@/components/shared/table/TableTopBarComponents"
import { AnimalByType, AnimalsNumberHist } from "./Entities"
import { getAnimalByTypes, getBirthHist, getDairyHist, getDeathHist, getSlaughterHist } from "./Controller"
import { SparkLineChart } from "@mui/x-charts/SparkLineChart"
import { dateTransform, positiveTransform } from "@/utils/Transformations"
import { green, purple, red, yellow } from "@mui/material/colors"
import { PieChart } from "@mui/x-charts"
import { LOADING_MSG, NO_DATA_AVAILABLE } from "@/components/shared/Globals"

export const AnimalsDashboard = () => {

    const [reloadFlag, setReloadFlag] = useState(0)
    const [activeRequests, setActiveRequests] = useState(0)

    const startLoading = useCallback(() => setActiveRequests(prev => prev + 1), [])
    const stopLoading = useCallback(() => setActiveRequests(prev => Math.max(prev - 1)), [])

    return <DashboardContainer>
        <AnimalsTopBar  {...{ setReloadFlag, activeRequests }} />
        <AnimalsContent {...{ reloadFlag, startLoading, stopLoading }} />
    </DashboardContainer>
}

const AnimalsTopBar = ({ activeRequests, setReloadFlag }: DashboardTopBarProps) => {

    return <DashboardTopContainer>
        <ReloadButton
            onReload={() => setReloadFlag(prev => prev + 1)}
            loading={activeRequests > 0}
        />
    </DashboardTopContainer>
}

const AnimalsContent = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    return <DashboardInfoContainer className="flex flex-col gap-4">
        <div className="grid grid-cols-4 h-[180px] gap-4">
            <BirthsCard {...{ stopLoading, reloadFlag, startLoading }} />
            <DeathsCard {...{ stopLoading, reloadFlag, startLoading }} />
            <DairyCard {...{ stopLoading, reloadFlag, startLoading }} />
            <SlaughterCard {...{ stopLoading, reloadFlag, startLoading }} />
        </div>
        <div className="flex flex-row h-full">
            <TypesChart {...{ startLoading, reloadFlag, stopLoading }} />
        </div>
    </DashboardInfoContainer>
}

const BirthsCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultValue: CardEntry<AnimalsNumberHist> = useMemo(() => ({
        trend: 0,
        current: 0,
        hist: []
    }), [])

    const [stats, setStats] = useState<CardEntry<AnimalsNumberHist>>(defaultValue)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getBirthHist()
            .then(response => setStats(response))
            .catch(() => setStats(defaultValue))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [defaultValue, reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Nascimentos"
            loading={loading}
            data={stats.current}
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.animalsNumber)}
                    height={80}
                    showHighlight
                    showTooltip
                    xAxis={{
                        data: stats.hist.map(item => new Date(item.entryDate)),
                        valueFormatter: (value: Date) => dateTransform(value, { month: 'short', year: 'numeric' })
                    }}
                />
            )}
            trendProps={{ trend: stats.trend, text: positiveTransform(stats.trend) }}
        />
    </DashboardCard>
}

const DeathsCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultValue: CardEntry<AnimalsNumberHist> = useMemo(() => ({
        trend: 0,
        current: 0,
        hist: []
    }), [])

    const [stats, setStats] = useState<CardEntry<AnimalsNumberHist>>(defaultValue)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getDeathHist()
            .then(response => setStats(response))
            .catch(() => setStats(defaultValue))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [defaultValue, reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Mortes"
            loading={loading}
            data={stats.current}
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.animalsNumber)}
                    height={80}
                    showHighlight
                    showTooltip
                    color={red[600]}
                    xAxis={{
                        data: stats.hist.map(item => new Date(item.entryDate)),
                        valueFormatter: (value: Date) => dateTransform(value, { month: 'short', year: 'numeric' })
                    }}
                />
            )}
            trendProps={{ trend: stats.trend, text: positiveTransform(stats.trend) }}
        />
    </DashboardCard>
}

const DairyCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultValue: CardEntry<AnimalsNumberHist> = useMemo(() => ({
        trend: 0,
        current: 0,
        hist: []
    }), [])

    const [stats, setStats] = useState<CardEntry<AnimalsNumberHist>>(defaultValue)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getDairyHist()
            .then(response => setStats(response))
            .catch(() => setStats(defaultValue))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [defaultValue, reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Animais Lactando"
            loading={loading}
            data={stats.current}
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.animalsNumber)}
                    height={80}
                    color={yellow[600]}
                    showHighlight
                    showTooltip
                    xAxis={{
                        data: stats.hist.map(item => new Date(item.entryDate)),
                        valueFormatter: (value: Date) => dateTransform(value, { month: 'short', year: 'numeric' })
                    }}
                />
            )}
            trendProps={{ trend: stats.trend }}
        />
    </DashboardCard>
}

const SlaughterCard = ({ stopLoading, startLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultValue: CardEntry<AnimalsNumberHist> = useMemo(() => ({
        trend: 0,
        current: 0,
        hist: []
    }), [])

    const [stats, setStats] = useState<CardEntry<AnimalsNumberHist>>(defaultValue)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        startLoading()
        getSlaughterHist()
            .then(response => setStats(response))
            .catch(() => setStats(defaultValue))
            .finally(() => {
                setLoading(false)
                stopLoading()
            })
    }, [defaultValue, reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardChartContent
            title="Abates"
            loading={loading}
            data={stats.current}
            chart={(
                <SparkLineChart
                    data={stats.hist.map(item => item.animalsNumber)}
                    height={80}
                    color={purple[600]}
                    showHighlight
                    showTooltip
                    xAxis={{
                        data: stats.hist.map(item => new Date(item.entryDate)),
                        valueFormatter: (value: Date) => dateTransform(value)
                    }}
                />
            )}
            trendProps={{ trend: stats.trend }}
        />
    </DashboardCard>
}

const TypesChart = ({ startLoading, stopLoading, reloadFlag }: DashboardInformationProps) => {

    const defaultTypes: AnimalByType = useMemo(() => ({
        reproductionAnimals: 0,
        beefAnimals: 0,
        dairyAnimals: 0,
        offspring: 0
    }), [])

    const [dataset, setDataset] = useState<AnimalByType>(defaultTypes)

    useEffect(() => {
        startLoading()
        getAnimalByTypes()
            .then(results => setDataset(results))
            .catch(() => setDataset(defaultTypes))
            .finally(() => stopLoading())
    }, [defaultTypes, reloadFlag, startLoading, stopLoading])

    return <DashboardCard>
        <CardDefaultTitle text="Tipo de Animais" />
        <PieChart
            localeText={{
                loading: LOADING_MSG,
                noData: NO_DATA_AVAILABLE
            }}
            series={[{
                innerRadius: 100,
                outerRadius: 200,
                highlightScope: { fade: 'global', highlight: 'item' },
                data: [
                    { id: 0, label: 'Animais Jovens', value: dataset.offspring },
                    { id: 1, label: 'Vacas Leiteiras', value: dataset.dairyAnimals, color: yellow[600] },
                    { id: 2, label: 'Animais de Abate', value: dataset.beefAnimals, color: purple[600] },
                    { id: 3, label: 'Matrizes e Touros', value: dataset.reproductionAnimals, color: green[600] },
                ]
            }]}
        />
    </DashboardCard>
} 
