import { useState } from "react"
import { AnimalDashboardFilter } from "../api/AnimalDashboard"
import { AnimalCharts } from "./AnimalsCharts"
import { AnimalsInfoTable as AnimalsInfoTable } from "./AnimalsInfoTable"

export const AnimalsDashboard = () => {

    const [filter, setFilter] = useState<AnimalDashboardFilter>({ isFiltered: false })

    return <div className="h-full w-full overflow-auto grid grid-cols-3 auto-rows-max gap-5">
        <AnimalsInfoTable {...{ filter, setFilter }} />
        <AnimalCharts {...{ filter, setFilter }} />
    </div>
}
