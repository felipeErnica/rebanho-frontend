import { IFilters } from "@/shared/interfaces/Filter"
import Refresh from "@mui/icons-material/Refresh"
import { Button, Popover, Typography } from "@mui/material"
import { ReactNode, RefObject } from "react"

export type FilterPopoverProps = {
    filterOpen: boolean
    setFilterOpen: (isOpen: boolean) => void
    anchorEl: RefObject<HTMLButtonElement | null>
    setFilter: (filter: IFilters) => void
    filter: IFilters
}


type InternalFilterPopoverProps = {
    filterOpen: boolean
    setFilterOpen: (isOpen: boolean) => void
    anchorEl: RefObject<HTMLButtonElement | null>
    children?: ReactNode | ReactNode[]
    setFilter: (filter: IFilters) => void
}

export const FilterPopover = ({
    filterOpen,
    setFilterOpen,
    anchorEl,
    children,
    setFilter
}: InternalFilterPopoverProps) => {
    return <Popover
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        anchorEl={anchorEl.current}
    >
        <div className="max-h-[450px] max-w-[550px] overflow-hidden flex flex-col">
            <Typography
                variant="h5"
                className="p-4"
            >
                Controles de Filtro
            </Typography>
            <div className="grow overflow-auto flex flex-col p-4 gap-12">
                {children}
            </div>
            {setFilter &&
                <div className="p-4">
                    <Button
                        variant="text"
                        startIcon={<Refresh />}
                        onClick={() => setFilter({ isFiltered: false })}
                    >
                        Recarregar Informações
                    </Button>
                </div>
            }
        </div>
    </Popover >
}
