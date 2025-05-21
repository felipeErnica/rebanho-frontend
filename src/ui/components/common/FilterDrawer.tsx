import { JSX, ReactNode } from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import AppBar from "@mui/material/AppBar";

interface AbstractDrawerProps {
    title: string;
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
    childPanel: ReactNode | ReactNode[]
}

interface DrawerProps {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
    childPanel: ReactNode | ReactNode[]
}

const Drawer = (props: AbstractDrawerProps): JSX.Element => {
    return <div
        className={`h-full w-max grid grid-rows-[auto_1fr] transition-all duration-500 ease-in-out overflow-y-auto
        ${props.isOpen ? 'max-w-96' : 'max-w-0'}`}
    >
        <AppBar className="sticky shadow-none bg-gray-700 top-0 grid grid-cols-[auto_1fr] gap-2 items-center p-4">
            <IconButton className="hover:bg-gray-600" onClick={() => props.setOpen(false)}>
                <Close className="text-white" />
            </IconButton>
            <Typography
                variant="h5"
                className="overflow-clip whitespace-nowrap text-white"
            >
                {props.title}
            </Typography>
        </AppBar>
        <div className="p-4 flex flex-col gap-12">
            {props.childPanel}
        </div>
    </div>
}

export const FilterDrawer = (props: DrawerProps) => {
    return <Drawer
        title="CONTROLES DE FILTRO"
        childPanel={props.childPanel}
        isOpen={props.isOpen}
        setOpen={props.setOpen}
    />
}
