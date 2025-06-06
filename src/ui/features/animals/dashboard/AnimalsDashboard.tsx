import { useState } from "react"
import { AgeCard } from "./AgeCard"
import { TotalCard } from "./TotalCard"
import { TypeCard } from "./TypeCard"
import { CattleGrowthCard } from "./CattleGrowthCard"

export const AnimalsDashboard = () => {

    const [isTotalOpen, setTotalOpen] = useState(false)

    return <div className="h-full overflow-auto flex flex-col gap-5">
        <div className={`flex flex-row ${isTotalOpen ? 'grow' : 'grow-0'}`}>
            <TotalCard {...{isTotalOpen, setTotalOpen}} />
            <CattleGrowthCard />
        </div>
        <div className="grow flex flex-row gap-5">
            <AgeCard />
            <TypeCard />
        </div>
    </div>
}
