import { IFilters } from "@/shared/interfaces/Filter"
import Refresh from "@mui/icons-material/Refresh"
import { Button, Popover, Typography } from "@mui/material"
import { ReactNode, RefObject } from "react"

type PopoverProps = {
    isOpen: boolean
    setOpen: (isOpen: boolean) => void
    anchorEl: RefObject<HTMLButtonElement | null>
    childPanel: ReactNode | ReactNode[]
    setFilter?: (filter: IFilters) => void
}

export const FilterPopover = ({ isOpen, setOpen, anchorEl, childPanel, setFilter }: PopoverProps) => {
    return <Popover
        open={isOpen}
        onClose={() => setOpen(false)}
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
                {childPanel}
            </div>
            <div className="flex flex-row p-4">
                <Button
                    variant="text"
                    startIcon={<Refresh />}
                    onClick={() => setFilter && setFilter({ isFiltered: false })}
                >
                    Recarregar Informações
                </Button>
            </div>
        </div>
    </Popover >
}
