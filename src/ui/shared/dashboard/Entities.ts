import { PopoverVirtualElement } from "@mui/material"
import { Dispatch, SetStateAction } from "react"

export type DashboardInformationProps = {
    startLoading: () => void
    stopLoading: () => void
    reloadFlag: number
    setReloadFlag?: Dispatch<SetStateAction<number>>
}

export type DashboardTopBarProps = {
    setReloadFlag: Dispatch<SetStateAction<number>>
    activeRequests: number
}

export type CommonMenuProps = {
    open: boolean
    anchorEl: Element | PopoverVirtualElement | null | undefined | (() => Element | PopoverVirtualElement | null )
    handleClose: () => void
    reloadFunction?: (changed?: boolean) => void
}
