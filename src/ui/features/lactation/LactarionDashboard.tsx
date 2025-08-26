import { DashboardContainer } from "@/ui/shared/dashboard/DashboardComponents"
import { DashboardInformationProps, DashboardTopBarProps } from "@/ui/shared/dashboard/Entities"
import { useState } from "react"

export const LactationDashboard = () => {

    const [activerRequests, setActiveRequests] = useState(0)
    const [reloadFlag, setReloadFlag] = useState(0)

    return <DashboardContainer>
    </DashboardContainer>
}

const DashboardTopBar = ({ setReloadFlag, activeRequests }: DashboardTopBarProps) => {

}

const LactationInfo = ({}: DashboardInformationProps) => {
    return <div className="grid grid-flow-row">
        <MilkProductionCard />
    </div>
}
