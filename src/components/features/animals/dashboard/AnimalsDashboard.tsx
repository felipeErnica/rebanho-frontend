import { useState } from "react"
import { AnimalDashboardFilter } from "./api/DashboardEntities"
import { AnimalCharts } from "./AnimalsCharts"
import { AnimalsInfoTable as AnimalsInfoTable } from "./AnimalsInfoTable"

export const AnimalsDashboard = () => {

    const [filter, setFilter] = useState<AnimalDashboardFilter>({ isFiltered: false })

    return <div className="h-full w-full overflow-auto bg-gray-100 grid grid-cols-3 auto-rows-max gap-5">
        <AnimalsInfoTable {...{ filter, setFilter }} />
        <AnimalCharts {...{ filter, setFilter }} />
    </div>
}
