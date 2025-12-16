import { Dispatch, RefObject, SetStateAction } from "react"

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
    menuAnchorEl: RefObject<HTMLButtonElement>
    closeMenu: () => void
    setReloadFlag: Dispatch<SetStateAction<number>>
}
