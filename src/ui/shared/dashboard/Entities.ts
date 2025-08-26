import { Dispatch, SetStateAction } from "react"

export type DashboardInformationProps = {
    startLoading: () => void
    stopLoading: () => void
    reloadFlag: number
}

export type DashboardTopBarProps = {
    setReloadFlag: Dispatch<SetStateAction<number>>
    activeRequests: number
}

