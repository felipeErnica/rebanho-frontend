import { AgeCard } from "./AgeCard"
import { TotalCard } from "./TotalCard"
import { TypeCard } from "./TypeCard"

export const AnimalsDashboard = () => {
    return <div className="h-full overflow-auto flex flex-col gap-5">
        <TotalCard />
        <div className="grow flex flex-row gap-5">
            <AgeCard />
            <TypeCard />
        </div>
    </div>
}
