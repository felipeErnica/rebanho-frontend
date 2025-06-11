import { AnimalCharts } from "./AnimalsCharts"
import { AnimalsInfoCards as AnimalsInfoTable } from "./AnimalsInfoTable"

export const AnimalsDashboard = () => {
    return <div className="h-full w-full overflow-auto grid grid-cols-3 auto-rows-min gap-5">
        <AnimalsInfoTable />
        <AnimalCharts />
    </div>
}
