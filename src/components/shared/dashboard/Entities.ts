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

export type OptionMenuProps = {
    openMenu: boolean
    menuAnchorEl: Element | PopoverVirtualElement | (() => Element | PopoverVirtualElement | null) | null | undefined
    closeMenu: () => void
    setReloadFlag: Dispatch<SetStateAction<number>>
}
