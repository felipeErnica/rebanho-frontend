import { AgeCard } from "./AgeCard"
import { TotalCard } from "./TotalCard"

export const AnimalsDashboard = () => {
    return <div className="h-full overflow-auto flex flex-col gap-5">
        <TotalCard />
        <div className="grow flex flex-row gap-5">
            <AgeCard />
        </div>
    </div>
}
