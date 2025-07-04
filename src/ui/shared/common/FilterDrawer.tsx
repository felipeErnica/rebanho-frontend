import { ReactNode } from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import AppBar from "@mui/material/AppBar";
import { Button } from "@mui/material";
import Refresh from "@mui/icons-material/Refresh";
import { IFilters } from "@/shared/interfaces/Filter";

interface AbstractDrawerProps {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
    childPanel: ReactNode | ReactNode[]
    setFilter?: (filter: IFilters) => void
}

export const FilterDrawer = ({
    isOpen,
    setOpen,
    childPanel,
    setFilter,
}: AbstractDrawerProps) => {
    return <div
        className={`h-full w-max flex flex-col transition-all duration-500 ease-in-out overflow-y-scroll
        ${isOpen ? 'max-w-96' : 'max-w-0'}`}
    >
        <AppBar className="sticky shadow-none bg-gray-700 top-0 flex flex-row gap-2 items-center p-4">
            <IconButton className="hover:bg-gray-600" onClick={() => setOpen(false)}>
                <Close className="text-white" />
            </IconButton>
            <Typography
                variant="h5"
                className="grow overflow-clip whitespace-nowrap text-white"
            >
                CONTROLES DE FILTRO
            </Typography>
        </AppBar>
        <div className="p-4 flex flex-col gap-12">
            <Button
                className="items-start"
                variant="text"
                startIcon={<Refresh />}
                onClick={() => setFilter && setFilter({ isFiltered: false })}
            >
                Recarregar Informações
            </Button>
            {childPanel}
        </div>
    </div>
}
