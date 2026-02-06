import { IFilters } from "@utils/Filter"
import Refresh from "@mui/icons-material/Refresh"
import { Button, Popover, Typography } from "@mui/material"
import { Dispatch, ReactNode, RefObject, SetStateAction } from "react"

export type FilterPopoverProps = {
    filterOpen: boolean
    setFilterOpen: (isOpen: boolean) => void
    anchorEl: RefObject<HTMLButtonElement | null>
    setFilter: Dispatch<SetStateAction<IFilters>>
    filter: IFilters
}

type InternalFilterPopoverProps = {
    filterOpen: boolean
    setFilterOpen: (isOpen: boolean) => void
    anchorEl: RefObject<HTMLButtonElement | null>
    children?: ReactNode | ReactNode[]
    setFilter: Dispatch<SetStateAction<IFilters>>
}

export const FilterPopover = ({
    filterOpen,
    setFilterOpen,
    anchorEl,
    children,
    setFilter,
}: InternalFilterPopoverProps) => {
    return <Popover
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        anchorEl={anchorEl.current}
        disableEnforceFocus
    >
        <div className="max-h-[450px] max-w-[550px] overflow-hidden flex flex-col">
            <Typography
                variant="h5"
                className="p-4"
            >
                Controles de Filtro
            </Typography>
            <form className="grow overflow-auto flex flex-col p-4 gap-12" >
                {children}
            </form>
            <div className="p-4">
                <Button
                    variant="text"
                    startIcon={<Refresh />}
                    onClick={() => setFilter({ isFiltered: false })}
                >
                    Recarregar Informações
                </Button>
            </div>
        </div>
    </Popover >
}
