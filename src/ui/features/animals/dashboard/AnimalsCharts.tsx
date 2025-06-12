import { GraphContainer } from "@/ui/components/chart/GraphContainer"
import { useEffect, useState } from "react"
import { getGroupByAge, getGroupByYear, getTotalByType } from "../api/AnimalController"
import { BarChart } from "@mui/x-charts/BarChart"
import { AnimalDashboardFilter, AnimalsByAgeAndFarm, AnimalsByType, AnimalsByYear } from "../api/AnimalDashboard"
import { lightBlue, pink } from "@mui/material/colors"
import { PieChart } from "@mui/x-charts/PieChart"
import { PieValueType } from "@mui/x-charts"
import { getAnimalTypesValue } from "@/types/enums"

type AnimalChartsProps = {
    filter: AnimalDashboardFilter
    setFilter: (filter: AnimalDashboardFilter) => void
}

const AgeChart = ({ filter, setFilter }: AnimalChartsProps) => {

    const [dataset, setDataset] = useState<AnimalsByAgeAndFarm[]>([])

    useEffect(() => {
        const ageFilter: AnimalDashboardFilter = { ...filter, minBirthDate: undefined, maxBirthDate: undefined }
        getGroupByAge(ageFilter)
            .then(response => setDataset(response.json))
    }, [filter])

    const setNewFilterValue = (ageCategory: string) => {
        const newFilter: AnimalDashboardFilter = { ...filter, isFiltered: true }
        switch (ageCategory) {
            case '0-2 meses': {
                const currentDate = new Date()
                currentDate.setMonth(currentDate.getMonth() - 2)
                setFilter({ ...newFilter, minBirthDate: currentDate, maxBirthDate: undefined })
                break
            }
            case '3-8 meses': {
                const minDate = new Date()
                const maxDate = new Date()
                maxDate.setMonth(maxDate.getMonth() - 3)
                minDate.setMonth(minDate.getMonth() - 8)
                setFilter({ ...newFilter, minBirthDate: minDate, maxBirthDate: maxDate })
                break
            }
            case '9-12 meses': {
                const minDate = new Date()
                const maxDate = new Date()
                maxDate.setMonth(maxDate.getMonth() - 9)
                minDate.setMonth(minDate.getMonth() - 12)
                setFilter({ ...newFilter, minBirthDate: minDate, maxBirthDate: maxDate })
                break
            }
            case '13-24 meses': {
                const minDate = new Date()
                const maxDate = new Date()
                maxDate.setMonth(maxDate.getMonth() - 13)
                minDate.setMonth(minDate.getMonth() - 24)
                setFilter({ ...newFilter, minBirthDate: minDate, maxBirthDate: maxDate })
                break
            }
            case '25-36 meses': {
                const minDate = new Date()
                const maxDate = new Date()
                maxDate.setMonth(maxDate.getMonth() - 25)
                minDate.setMonth(minDate.getMonth() - 36)
                setFilter({ ...newFilter, minBirthDate: minDate, maxBirthDate: maxDate })
                break
            }
            case '+36 meses': {
                const maxDate = new Date()
                maxDate.setMonth(maxDate.getMonth() - 36)
                setFilter({ ...newFilter, minBirthDate: undefined, maxBirthDate: maxDate })
                break
            }
        }
    }

    return <BarChart
        sx={{
            height: '100%',
            width: '100%'
        }}
        onAxisClick={(_, params) => {
            if (!params) return
            setNewFilterValue(params.axisValue.toString())
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
        const typeFilter: AnimalDashboardFilter = { ...filter, animalType: undefined }
        getTotalByType(typeFilter)
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
